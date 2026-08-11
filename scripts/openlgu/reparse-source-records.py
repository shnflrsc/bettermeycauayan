#!/usr/bin/env python3
"""Reparse metadata from existing OCR text without reopening the PDFs."""

from __future__ import annotations

import argparse
import importlib.util
import json
from pathlib import Path


def load_parser():
    path = Path(__file__).with_name("collect-local-pdfs.py")
    spec = importlib.util.spec_from_file_location("collect_local_pdfs", path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Cannot load parser: {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--records", type=Path, default=Path("pipeline/openlgu/source-records.jsonl")
    )
    parser.add_argument(
        "--audit", type=Path, default=Path("pipeline/openlgu/local-pdf-audit.json")
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    parser = load_parser()
    records = [
        json.loads(line)
        for line in args.records.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]
    audit = json.loads(args.audit.read_text(encoding="utf-8"))
    audit_by_file = {item["file"]: item for item in audit["files"]}

    for record in records:
        payload = record["raw_payload_json"]
        filename = payload["source_filename"]
        text = record.get("raw_text", "")
        document_type, evidence = parser.classify(filename, text)
        number = parser.extract_number(document_type, filename, text)
        title = parser.extract_title(document_type, text)
        date_enacted = parser.extract_date(text)
        missing = [
            name
            for name, value in (
                ("type", document_type),
                ("number", number),
                ("title", title),
                ("date_enacted", date_enacted),
            )
            if not value
        ]
        payload.update(
            type=document_type,
            number=number,
            title=title,
            date_enacted=date_enacted,
            type_evidence=evidence,
        )
        record["source_key"] = parser.source_key(document_type)

        item = audit_by_file[filename]
        item.update(
            document_type=document_type,
            number=number or None,
            missing_fields=missing,
            status="needs_review" if missing else "parsed",
        )

    counts: dict[str, int] = {
        "files": len(audit["files"]),
        "unique_source_records": len(records),
        "duplicates": len(audit.get("duplicates", [])),
    }
    for item in audit["files"]:
        status = item["status"]
        counts[status] = counts.get(status, 0) + 1
    audit["counts"] = counts

    records_tmp = args.records.with_suffix(args.records.suffix + ".tmp")
    audit_tmp = args.audit.with_suffix(args.audit.suffix + ".tmp")
    records_tmp.write_text(
        "".join(json.dumps(record, ensure_ascii=False) + "\n" for record in records),
        encoding="utf-8",
    )
    audit_tmp.write_text(
        json.dumps(audit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    records_tmp.replace(args.records)
    audit_tmp.replace(args.audit)

    print(f"Reparsed {len(records)} records without rerunning OCR")
    print(f"Status counts: {json.dumps(counts, sort_keys=True)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
