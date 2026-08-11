#!/usr/bin/env python3
"""Collect manually downloaded Meycauayan legislative PDFs into OpenLGU JSONL."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote

try:
    from pypdf import PdfReader
except ImportError:
    try:
        from PyPDF2 import PdfReader
    except ImportError as error:
        raise SystemExit(
            "PDF support is missing. Install it with: python -m pip install pypdf"
        ) from error


DEFAULT_INPUT = Path("pipeline/meycauayan/raw/pdfs")
DEFAULT_OUTPUT = Path("pipeline/openlgu/source-records.jsonl")
DEFAULT_REPORT = Path("pipeline/openlgu/local-pdf-audit.json")
SOURCE_PAGE = "https://meycauayan.gov.ph/local-regulations/"
UPLOADS_BASE = "https://meycauayan.gov.ph/wp-content/uploads/"
COLLECTOR_VERSION = "meycauayan-local-pdf-collector-v1"
FORBIDDEN = re.compile(
    r"los\s*ba(?:ñ|n)os|losbanos\.gov\.ph|sangguniang\s+bayan", re.I
)

TYPE_PATTERNS = (
    (
        "executive_order",
        re.compile(r"\b(?:executive\s+order|e\.?\s*o\.?)\b", re.I),
    ),
    (
        "ordinance",
        re.compile(
            r"\b(?:city\s+)?ordinance\b|\bcity\s*ord\b|\bco\s*no\b|\bkp\s*\d",
            re.I,
        ),
    ),
    ("resolution", re.compile(r"\b(?:city\s+)?resolution\b", re.I)),
)

MONTHS = {
    name.lower(): number
    for number, name in enumerate(
        (
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ),
        1,
    )
}
MONTHS.update(
    {
        "enero": 1,
        "pebrero": 2,
        "marso": 3,
        "abril": 4,
        "mayo": 5,
        "hunyo": 6,
        "hulyo": 7,
        "agosto": 8,
        "setyembre": 9,
        "oktubre": 10,
        "nobyembre": 11,
        "disyembre": 12,
    }
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Validate, hash, and collect local Meycauayan regulation PDFs."
    )
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--report", type=Path, default=DEFAULT_REPORT)
    parser.add_argument(
        "--max-text-chars",
        type=int,
        default=250_000,
        help="Maximum extracted text retained per document (default: 250000)",
    )
    parser.add_argument("--ocr", action="store_true", help="OCR image-only pages")
    parser.add_argument(
        "--ocr-max-pages",
        type=int,
        default=0,
        help="Maximum pages OCRed per PDF; 0 means all pages",
    )
    parser.add_argument(
        "--limit", type=int, default=0, help="Process only the first N PDFs"
    )
    return parser.parse_args()


def sha256_file(path: Path) -> tuple[str, bytes]:
    digest = hashlib.sha256()
    first_bytes = b""
    with path.open("rb") as stream:
        while chunk := stream.read(1024 * 1024):
            if not first_bytes:
                first_bytes = chunk[:8]
            digest.update(chunk)
    return digest.hexdigest(), first_bytes


def normalize_text(value: str) -> str:
    value = value.replace("\x00", " ")
    value = re.sub(r"[ \t]+", " ", value)
    value = re.sub(r"\n{3,}", "\n\n", value)
    return value.strip()


def ocr_pdf_pages(
    path: Path, engine, max_pages: int, max_chars: int
) -> tuple[str, int, float | None]:
    import numpy as np
    import pypdfium2 as pdfium

    document = pdfium.PdfDocument(str(path))
    page_count = len(document) if max_pages <= 0 else min(len(document), max_pages)
    text_parts: list[str] = []
    scores: list[float] = []

    for page_index in range(page_count):
        page = document[page_index]
        image = page.render(scale=2.0).to_pil().convert("RGB")
        result, _elapsed = engine(np.asarray(image))
        if result:
            for line in result:
                if len(line) < 3:
                    continue
                text_parts.append(str(line[1]))
                try:
                    scores.append(float(line[2]))
                except (TypeError, ValueError):
                    pass
        page.close()
        if sum(len(part) for part in text_parts) >= max_chars:
            break

    document.close()
    text = normalize_text("\n".join(text_parts))[:max_chars]
    confidence = sum(scores) / len(scores) if scores else None
    return text, page_count, confidence


def extract_pdf(
    path: Path, max_chars: int, ocr_engine=None, ocr_max_pages: int = 0
) -> tuple[int, str, bool, int, float | None]:
    reader = PdfReader(str(path), strict=False)
    if reader.is_encrypted and reader.decrypt("") == 0:
        return len(reader.pages), "", True, 0, None

    parts: list[str] = []
    size = 0
    for page in reader.pages:
        try:
            text = page.extract_text() or ""
        except Exception:
            text = ""
        if not text:
            continue
        remaining = max_chars - size
        if remaining <= 0:
            break
        parts.append(text[:remaining])
        size += min(len(text), remaining)
    text = normalize_text("\n".join(parts))
    ocr_pages = 0
    ocr_confidence = None
    if len(text) < 100 and ocr_engine is not None:
        text, ocr_pages, ocr_confidence = ocr_pdf_pages(
            path, ocr_engine, ocr_max_pages, max_chars
        )
    return len(reader.pages), text, False, ocr_pages, ocr_confidence


def classify(filename: str, text: str) -> tuple[str, str]:
    normalized_filename = re.sub(r"[._-]+", " ", filename)
    filename_patterns = (
        ("executive_order", r"\b(?:executive\s+order|eo(?=\s*\d)|eo\b)"),
        ("ordinance", r"\b(?:city\s+ord(?:inance)?|ordinance|co\s+no|kp)\b"),
        ("resolution", r"\bres(?:olution)?\b"),
    )
    for document_type, pattern in filename_patterns:
        if re.search(pattern, normalized_filename, re.I):
            return document_type, "filename"

    compact_text = re.sub(r"[^a-z0-9]", "", text[:12_000].lower())
    if "cityordinance" in compact_text or "ordinanceno" in compact_text:
        return "ordinance", "text"
    if "cityresolution" in compact_text or "resolutionno" in compact_text:
        return "resolution", "text"

    if "kautusangpanlungsodblg" in compact_text:
        return "ordinance", "text"
    if "executiveorder" in compact_text:
        return "executive_order", "text"

    samples = (("text", text[:12_000]),)
    for evidence_kind, sample in samples:
        for document_type, pattern in TYPE_PATTERNS:
            if pattern.search(sample):
                return document_type, evidence_kind
    return "", ""


def extract_number(document_type: str, filename: str, text: str) -> str:
    prefixes = {
        "ordinance": r"(?:city\s+)?ordinance",
        "resolution": r"(?:city\s+)?resolution",
        "executive_order": r"(?:executive\s+order|e\.?\s*o\.?)",
    }
    prefix = prefixes.get(document_type)
    if not prefix:
        return ""

    for sample in (text[:15_000],):
        match = re.search(
            rf"{prefix}\s*(?:no\.?|number)?\s*[:#-]?\s*"
        r"((?:20\d{2}\s*[-–]\s*)?[0-9OI]+(?:[-–][0-9A-Z]+)?)",
            sample,
            re.I,
        )
        if match:
            return (
                re.sub(r"\s+", "", match.group(1))
                .replace("–", "-")
                .upper()
                .replace("O", "0")
                .replace("I", "1")
            )

    compact = re.sub(r"[^A-Z0-9-]", "", text[:15_000].upper())
    compact_prefixes = {
        "ordinance": r"(?:(?:CITY)?ORDINANCE[N0]O|KAUTUSANGPANLUNGSODBLG)",
        "resolution": r"(?:CITY)?RESOLUTIONNO",
        "executive_order": r"EXECUTIVEORDER[N0]O",
    }
    compact_match = re.search(
        compact_prefixes[document_type]
        + r"((?:2[0O]\d{2}-)?[0-9OI]+(?:-[0-9A-Z]+)?)(?=OF|NG|SERIES|S\d|$)",
        compact,
    )
    if compact_match:
        return compact_match.group(1).replace("O", "0").replace("I", "1")

    filename_patterns = {
        "ordinance": (
            r"(?:city[._ -]*ord(?:inance)?|co[._ -]*no|ord(?:inance)?|kp)"
            r"[._ -]*(?:no[._ -]*)?(\d+[A-Z]?)"
        ),
        "resolution": (
            r"res(?:olution)?[._ -]*(?:no[._ -]*)?"
            r"((?:20\d{2}[._-])?\d+(?:[._-][A-Z0-9]+)*)"
        ),
        "executive_order": (
            r"(?:eo|executive[._ -]*order)[._ -]*(?:no[._ -]*)?(\d+[A-Z]?)"
        ),
    }
    match = re.search(filename_patterns[document_type], filename, re.I)
    if not match:
        return ""
    return match.group(1).replace("_", "-").upper()


def extract_date(text: str) -> str:
    header = text[:20_000]
    iso = re.search(r"\b(20\d{2})-(\d{2})-(\d{2})\b", header)
    if iso:
        return iso.group(0)

    month_names = "|".join(MONTHS)
    match = re.search(
        rf"({month_names})\s*(\d{{1,2}}),?\s*(2[0O]\d{{2}})\b", header, re.I
    )
    if match:
        month = MONTHS[match.group(1).lower()]
        year = match.group(3).upper().replace("O", "0")
        return f"{year}-{month:02d}-{int(match.group(2)):02d}"

    tagalog = re.search(
        rf"(?:IKA[- ]?)?(\d{{1,2}})\s*(?:NG)?\s*({month_names}),?\s*(2[0O]\d{{2}})\b",
        header,
        re.I,
    )
    if tagalog:
        month = MONTHS[tagalog.group(2).lower()]
        year = tagalog.group(3).upper().replace("O", "0")
        return f"{year}-{month:02d}-{int(tagalog.group(1)):02d}"
    return ""


def extract_title(document_type: str, text: str) -> str:
    if not text:
        return ""
    compact_lines = [re.sub(r"\s+", "", line) for line in text.splitlines()]
    header_markers = {
        "ordinance": (
            "CITYORDINANCENO",
            "CITYORDINANCEN0",
            "KAUTUSANGPANLUNGSODBLG",
        ),
        "resolution": ("CITYRESOLUTIONNO",),
        "executive_order": ("EXECUTIVEORDERNO",),
    }
    markers = header_markers.get(document_type, ())
    header_index = next(
        (
            index
            for index, line in enumerate(compact_lines)
            if any(marker in line.upper() for marker in markers)
        ),
        -1,
    )
    if header_index >= 0:
        title_lines: list[str] = []
        for line in compact_lines[header_index + 1 : header_index + 10]:
            upper = line.upper()
            if upper.startswith(("WHEREAS", "SAPAGKA'T", "SAPAGKAT")):
                break
            if upper.startswith("SERIESOF") and not title_lines:
                continue
            if line:
                title_lines.append(line)
        if title_lines:
            return " ".join(title_lines)[:1_000]

    header = re.sub(r"\s+", " ", text[:30_000])
    starts = {
        "ordinance": r"\b(?:(?:AN\s+)?ORDINANCE|ISANG\s+KAUTUSAN)\b",
        "resolution": r"\b(?:A\s+)?RESOLUTION\b",
        "executive_order": r"\b(?:AN\s+)?(?:EXECUTIVE\s+ORDER|ORDER)\b",
    }
    start_pattern = starts.get(document_type)
    if not start_pattern:
        return ""
    matches = list(re.finditer(start_pattern, header, re.I))
    if not matches:
        compact_markers = {
            "ordinance": "ORDINANCE",
            "resolution": "RESOLUTION",
            "executive_order": "EXECUTIVEORDER",
        }
        marker = compact_markers[document_type]
        start_index = next(
            (
                index
                for index, line in enumerate(compact_lines)
                if marker in line.upper()
                or (document_type == "ordinance" and "KAUTUSANGPANLUNGSODBLG" in line.upper())
            ),
            -1,
        )
        if start_index >= 0:
            title_lines: list[str] = []
            for line in compact_lines[start_index + 1 : start_index + 8]:
                if line.upper().startswith("WHEREAS"):
                    break
                if line:
                    title_lines.append(line)
            return " ".join(title_lines)[:1_000]
        return ""
    start = matches[-1].start()
    candidate = header[start : start + 1_500]
    candidate = re.split(r"\bWHEREAS\b|\bNOW,?\s+THEREFORE\b", candidate, 1, flags=re.I)[0]
    candidate = re.sub(
        r"^(?:AN?\s+)?(?:CITY\s+)?(?:ORDINANCE|RESOLUTION|EXECUTIVE\s+ORDER|ORDER)"
        r"\s*(?:NO\.?)?\s*[A-Z0-9() ._-]*",
        "",
        candidate,
        flags=re.I,
    ).strip(" :-–")
    return candidate[:1_000].strip()


def source_key(document_type: str) -> str:
    return "executive_orders" if document_type == "executive_order" else f"{document_type}s"


def build_record(
    path: Path,
    root: Path,
    max_chars: int,
    ocr_engine=None,
    ocr_max_pages: int = 0,
) -> tuple[dict | None, dict]:
    relative = path.relative_to(root).as_posix()
    info: dict = {"file": relative, "bytes": path.stat().st_size}
    try:
        digest, first_bytes = sha256_file(path)
        info["sha256"] = digest
        if not first_bytes.startswith(b"%PDF-"):
            raise ValueError("missing PDF signature")

        pages, text, encrypted, ocr_pages, ocr_confidence = extract_pdf(
            path, max_chars, ocr_engine, ocr_max_pages
        )
        info.update(
            pages=pages,
            encrypted=encrypted,
            extracted_text_chars=len(text),
            needs_ocr=len(text) < 100,
            ocr_applied=ocr_pages > 0,
            ocr_pages=ocr_pages,
            ocr_confidence=ocr_confidence,
        )
        if FORBIDDEN.search(text):
            raise ValueError("contains isolated Los Baños legislative content")

        document_type, type_evidence = classify(path.name, text)
        number = extract_number(document_type, path.name, text)
        title = extract_title(document_type, text)
        date_enacted = extract_date(text)
        missing = [
            field
            for field, value in (
                ("type", document_type),
                ("number", number),
                ("title", title),
                ("date_enacted", date_enacted),
            )
            if not value
        ]
        info.update(
            document_type=document_type or None,
            number=number or None,
            missing_fields=missing,
            status="needs_review" if missing or info["needs_ocr"] else "parsed",
        )

        official_pdf_url = UPLOADS_BASE + quote(path.name)
        payload = {
            "type": document_type,
            "number": number,
            "title": title,
            "date_enacted": date_enacted,
            "pdf_url": official_pdf_url,
            "source_filename": path.name,
            "local_pdf_path": path.as_posix(),
            "pdf_sha256": f"sha256:{digest}",
            "pdf_pages": pages,
            "type_evidence": type_evidence,
            "needs_ocr": info["needs_ocr"],
            "ocr_applied": info["ocr_applied"],
            "ocr_pages": ocr_pages,
            "ocr_confidence": ocr_confidence,
        }
        now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        record = {
            "id": f"src_meycauayan_local_pdf_{digest[:20]}",
            "source_kind": "manual_browser_download",
            "source_key": source_key(document_type) if document_type else "unclassified",
            "source_url": SOURCE_PAGE,
            "content_hash": f"sha256:{digest}",
            "collector_version": COLLECTOR_VERSION,
            "raw_payload_json": payload,
            "raw_text": text,
            "pdf_url": official_pdf_url,
            "pdf_reachability": "downloaded",
            "pdf_redirect_url": None,
            "pdf_checked_at": now,
            "run_id": None,
            "first_seen_at": now,
            "last_seen_at": now,
        }
        return record, info
    except Exception as error:
        info.update(status="invalid", error=str(error))
        return None, info


def main() -> int:
    args = parse_args()
    root = args.input.resolve()
    if not root.is_dir():
        print(f"Input directory not found: {root}", file=sys.stderr)
        return 1

    files = sorted(root.rglob("*.pdf"), key=lambda item: item.as_posix().lower())
    if args.limit > 0:
        files = files[: args.limit]

    ocr_engine = None
    if args.ocr:
        try:
            from rapidocr_onnxruntime import RapidOCR
        except ImportError:
            print("RapidOCR is missing from .venv-openlgu.", file=sys.stderr)
            return 1
        print("Loading RapidOCR models...")
        ocr_engine = RapidOCR()
    records: list[dict] = []
    inventory: list[dict] = []
    first_by_hash: dict[str, str] = {}
    duplicates: list[dict] = []

    for index, pdf_path in enumerate(files, 1):
        print(f"[{index}/{len(files)}] {pdf_path.name}")
        record, info = build_record(
            pdf_path,
            root,
            args.max_text_chars,
            ocr_engine,
            args.ocr_max_pages,
        )
        digest = info.get("sha256")
        if digest and digest in first_by_hash:
            info["status"] = "duplicate"
            info["duplicate_of"] = first_by_hash[digest]
            duplicates.append(
                {"file": info["file"], "duplicate_of": first_by_hash[digest], "sha256": digest}
            )
            record = None
        elif digest:
            first_by_hash[digest] = info["file"]

        inventory.append(info)
        if record:
            records.append(record)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        "".join(json.dumps(record, ensure_ascii=False) + "\n" for record in records),
        encoding="utf-8",
    )

    status_counts: dict[str, int] = {}
    for item in inventory:
        status = item["status"]
        status_counts[status] = status_counts.get(status, 0) + 1
    report = {
        "schema_version": "meycauayan-local-pdf-audit-v1",
        "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "input_directory": root.as_posix(),
        "source_page": SOURCE_PAGE,
        "counts": {
            "files": len(files),
            "unique_source_records": len(records),
            "duplicates": len(duplicates),
            **status_counts,
        },
        "duplicates": duplicates,
        "files": inventory,
    }
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    print(f"Wrote {len(records)} source record(s) to {args.output}")
    print(f"Wrote audit report to {args.report}")
    print(f"Status counts: {json.dumps(status_counts, sort_keys=True)}")
    print(
        "Needs OCR: "
        f"{sum(1 for item in inventory if item.get('needs_ocr'))}/{len(inventory)}"
    )
    print(
        "Classified from filename/text: "
        f"{sum(1 for item in inventory if item.get('document_type'))}/{len(inventory)}"
    )
    return 0 if not status_counts.get("invalid") else 2


if __name__ == "__main__":
    raise SystemExit(main())
