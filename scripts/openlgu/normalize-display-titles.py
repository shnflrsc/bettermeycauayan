#!/usr/bin/env python3
"""Create concise, readable portal titles while retaining official OCR captions."""

from __future__ import annotations

import json
import re
from pathlib import Path

import wordninja


RECORDS = Path("pipeline/openlgu/source-records.jsonl")
REPORT = Path("pipeline/openlgu/title-review.json")


def repair_encoding(value: str) -> str:
    replacements = {
        "â€œ": '"',
        "â€": '"',
        "â€™": "'",
        "ï¼Œ": ",",
        "QF": "OF",
        "ANDIOR": "AND/OR",
    }
    for old, new in replacements.items():
        value = value.replace(old, new)
    return value


def split_compact_token(match: re.Match[str]) -> str:
    token = match.group(0)
    if len(token) < 12:
        return token
    return " ".join(wordninja.split(token))


def readable_caption(value: str) -> str:
    value = repair_encoding(value).replace("\n", " ")
    value = re.sub(r"[A-Z][A-Z0-9'/-]{11,}", split_compact_token, value)
    value = re.sub(r"\s+", " ", value).strip(' "')
    fixes = {
        r"\bmey\s+ca\s+u\s+ayan\b": "Meycauayan",
        r"\bmey\s+cauayan\b": "Meycauayan",
        r"\bordin\s+ance\b": "ordinance",
        r"\bfranch\s+ise\b": "franchise",
        r"\btricy\s+cle\b": "tricycle",
        r"\bcalendar\s+year\b": "calendar year",
        r"\bzoneone\b": "zone one",
        r"\bzonetwo\b": "zone two",
        r"\bPDL\s*S\b": "PDLs",
    }
    for pattern, replacement in fixes.items():
        value = re.sub(pattern, replacement, value, flags=re.I)
    return value


def ordinal_word(value: str) -> str:
    match = re.search(r"(\d+)(?:ST|ND|RD|TH)", value, re.I)
    if not match:
        return ""
    return match.group(1)


def concise_title(caption: str, document_type: str) -> str:
    compact = re.sub(r"[^A-Z0-9]", "", repair_encoding(caption).upper())
    subject_rules = (
        ("TOURISMDEVELOPMENTPLAN", "Meycauayan Tourism Development Plan (2023-2025)"),
        ("CULTURALDEVELOPMENTPLAN", "Meycauayan Cultural Development Plan (2023-2025)"),
        ("HUWARANGBARANGAY", "Huwarang Barangay - Gintong Kawayan Award Program"),
        ("SCHEDULEOFMARKETVALUES", "2024 Market Values for Real Property Assessment"),
        ("STATEOFCALAMITY", "Declaration of a State of Calamity in Meycauayan"),
        ("PROFESSIONALSQUATTING", "Penalties Against Professional Squatting"),
        ("SEWAGEANDSEPTAGE", "Modified Sewage and Septage Ordinance"),
        ("PHARMACEUTICALPRODUCTS", "Regulation of Pharmaceutical Product Sales"),
        ("ACADEMICEXCELLENCE", "Academic Excellence Incentive Ordinance"),
        ("SOLOPARENTS", "Monthly Restaurant Discount for Registered Solo Parents"),
        ("ANTIINDECENCY", "Anti-Indecency Ordinance"),
        ("GINTONGKAWAYANFESTIVAL", "Gintong Kawayan Festival as the Official Cityhood Celebration"),
        ("FLEXIBLEWORKARRANGEMENT", "Flexible Work and Energy Conservation Measures"),
        ("ALERTLEVEL1", "Implementation of COVID-19 Alert Level 1"),
        ("ALERTLEVEL3", "Implementation of COVID-19 Alert Level 3"),
        ("UNDASSEASON", "Undas Season Guidelines"),
        ("PUBLICDISTURBANCEANDUNNECESSARYNOISES", "School-Hours Noise and Public Disturbance Restrictions"),
        ("RENTALRATESFORTHECOMMERCIALSPACES", "Government Center Commercial Space Rental Rates"),
        ("KARIKTANNGMEYCAUAYANECOPARK", "Kariktan ng Meycauayan Eco Park Fees"),
        ("MEYCAUAYANSPORTSCOMPLEX", "Meycauayan Sports Complex Fees"),
        ("FAREMATRIX", "Standard Fare Matrix for Tri-Wheel Vehicles"),
        ("OVERHEADCABLES", "Underground Utility Cables and Removal of Overhead Poles"),
        ("ADMINISTRATIVECASES", "Rules for Administrative Cases Against Barangay Officials"),
        ("PLANTILLAPOSITIONS", "Transfer of City Health Positions to Ospital ng Meycauayan"),
        ("SPECIALNONWORKINGHOLIDAY", "Meycauayan Cityhood Day Special Non-Working Holiday"),
        ("MEYCAUAYANNATIONALHIGHSCHOOLANNEX", "Renaming of Meycauayan National High School Annex"),
        ("P60000000000MEYCAUAYANGOVERNMENTCENTER", "P600 Million Appropriation for the Meycauayan Government Center"),
        ("GENERALCOMMUNITYQUARANTINEWITHHEIGHTENEDRESTRICTIONS", "Implementation of General Community Quarantine with Restrictions"),
        ("MAXIMUMCAPACITY", "Amended Activity and Venue Capacity Limits"),
        ("CITYCEMETERY", "Amendment to City Cemetery Lot Rental Provisions"),
        ("GENDERANDDEVELOPMENTCODE", "Revised Gender and Development Code"),
        ("PEOPLESLAWENFORCEMENTBOARD", "Institutionalization of the People's Law Enforcement Board"),
        ("TRUCKBAN", "Modified Truck Ban Ordinance"),
        ("LANDBANKOFTHEPHILIPPINES", "LandBank Loan for the Meycauayan Government Center"),
        ("ORGANIZATIONALSTRUCTUREANDSTAFFING", "CSC Organizational Structure and Staffing Guidelines"),
        ("PIRATEDANDCOUNTERFEIT", "Prohibition of Pirated and Counterfeit Goods"),
        ("SUPPLEMENTALBUDGETNO1", "2023 Supplemental Budget No. 1"),
        ("CULTURALPRACTICES", "Recognition of Local Cultural Practices and Celebrations"),
        ("PANTAWIDPAMILYANGPILIPINO", "Local Support for the Pantawid Pamilyang Pilipino Program (4Ps)"),
        ("ORGANICAGRICULTURE", "Organic Agriculture Development Ordinance"),
        ("ABOLISHINGVACANT", "Abolition of Vacant City Government Positions"),
        ("MENTALHEALTHCARE", "Meycauayan Mental Health Care System"),
        ("IMMUNIZATIONPROGRAM", "Comprehensive Immunization Program"),
        ("THIRDTRANCHE", "Third Tranche of Updated Salary Schedule for Local Government Personnel"),
        ("FORMERPERSONSDEPRIVEDOFLIBERTY", "Protections and Reintegration Support for Former PDLs"),
        ("CONTRABAND", "Detention Facility Contraband Prohibition"),
        ("HEALTHCAREINSURANCE", "Healthcare Insurance Benefits for City Officials and Employees"),
    )
    for marker, label in subject_rules:
        if marker in compact:
            return label

    text = readable_caption(caption)
    text = re.sub(
        r"^(?:AN?\s+)?(?:CITY\s+)?(?:ORDINANCE|RESOLUTION|ORDER)\s+",
        "",
        text,
        flags=re.I,
    )
    normalized = text.lower()

    is_franchise = (
        ("franchise" in normalized or "franchse" in normalized)
        and ("tricycle" in normalized or "public utility" in normalized)
    ) or (
        ("FRANCHISE" in compact or "FRANCHSE" in compact)
        and ("TRICYCLE" in compact or "PUBLICUTILITY" in compact)
    )
    if is_franchise:
        batch = ordinal_word(text)
        year = re.search(r"\b(20\d{2})\b", text)
        renewal = "renewal" in normalized
        label = (
            "Public Utility Tricycle Franchise Renewal"
            if renewal
            else "Public Utility Tricycle Franchise"
        )
        if batch:
            label += f" - Batch {batch}"
        if year:
            label += f" ({year.group(1)})"
        return label

    amendment = re.search(
        r"AMENDING(?:\s+THE\s+TITLE\s+AND\s+CERTAIN\s+PROVISIONS\s+OF|\s+SECTIONS?[^,]*?\s+OF|\s+CERTAIN\s+PROVISIONS\s+OF)?\s+CITY\s+ORDINANCE\s+NO\.?\s*([A-Z0-9-]+)",
        text,
        re.I,
    )
    if amendment:
        return f"Amendment to City Ordinance No. {amendment.group(1)}"

    text = re.split(
        r",\s*(?:PROVIDING|AND\s+PROVIDING|PRESCRIBING\s+PENALTIES)|\s+AND\s+FOR\s+OTHER\s+PURPOSES",
        text,
        maxsplit=1,
        flags=re.I,
    )[0]
    text = re.sub(r"\s+", " ", text).strip(" ,.;:-\"")

    words = text.split()
    if len(words) > 12:
        text = " ".join(words[:12]).rstrip(" ,.;:-") + "..."
    if len(text) > 85:
        text = text[:82].rsplit(" ", 1)[0].rstrip(" ,.;:-") + "..."

    if text.isupper():
        text = text.title()
    return text or f"{document_type.replace('_', ' ').title()} Document"


def main() -> None:
    records = [
        json.loads(line)
        for line in RECORDS.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]
    report = []
    for record in records:
        payload = record["raw_payload_json"]
        official_title = payload.get("title", "")
        display_title = concise_title(official_title, payload.get("type", "document"))
        payload["official_title"] = official_title
        payload["display_title"] = display_title
        report.append(
            {
                "source_filename": payload.get("source_filename"),
                "type": payload.get("type"),
                "number": payload.get("number"),
                "display_title": display_title,
                "official_title": official_title,
            }
        )

    temp = RECORDS.with_suffix(RECORDS.suffix + ".tmp")
    temp.write_text(
        "".join(json.dumps(record, ensure_ascii=False) + "\n" for record in records),
        encoding="utf-8",
    )
    temp.replace(RECORDS)
    REPORT.write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Generated {len(report)} concise display titles")
    print(f"wrote {RECORDS}")
    print(f"wrote {REPORT}")


if __name__ == "__main__":
    main()
