import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "tmp/pdfs/missing-charter-services.json"
PAGES = ROOT / "tmp/pdfs/meycauayan-charter-2026-pages.json"
OUTPUT = ROOT / "src/data/citizens-charter/citizens-charter.json"


EXCLUDED = {
    "Checks, Payroll and Allowance Releasing",
    "Burial Niche and Crypt Fee Payment",
    "Cremation Services Fee Payment",
    "Medical and Dental Services",
    "Social Case Study Report Issuance",
    "Terminal Leave Benefits (TLB) Requests",
    "Travel Order Issuance",
    "Driver’s Trip Ticket Approval",
    "Fuel Allocation Request Form and Purchase Order Issuance",
    "Indorsement Slip Issuance",
    "Review and/or Drafting of Contracts, Ordinances, Legal Instruments and Legal Opinion",
    "Academic Division",
    "Student Services and Academic Support Division",
    "Administrative Division",
    "Physical Plant and Facilities Division",
    "FEEDBACK AND COMPLAINTS MECHANISM",
    "LIST OF OFFICES",
    "CERTIFICATE OF COMPLIANCE",
    "Distribution of Basic Unsterile/Sterile Hospital Items",
    "Sterilization of Medical and Surgical Supplies (Unsterile and Re-Sterile)",
    "Pharmacy Stock Issuance",
}


CATEGORY_OVERRIDES = {
    "Marriage Solemnization": "certificates-vital-records",
    "Redemption of Impounded Vehicles": "public-safety-security",
    "Traffic Adjudication": "public-safety-security",
    "Clamping and Unlocking of Illegal Parked Vehicles": "public-safety-security",
    "Application for Traffic Management Clearance": "public-safety-security",
    "Tricycle Franchise Issuance": "business-trade-investment",
    "Civil Society Organization Accreditation": "business-trade-investment",
}


REPLACEMENTS = {
    "Out of Town Registration of Birth Certificate (for Submission to Concerned City/Municipality) 171 11. Out of Town Registration of Birth Certificate (Received from Other City / Municipality to be Registered in Meycauayan) 174 Issuance of Marriage License": [
        ("Out-of-Town Registration of Birth Certificate for Submission to Another City or Municipality", 171),
        ("Out-of-Town Registration of Birth Certificate Received for Registration in Meycauayan", 174),
        ("Marriage License Issuance", 176),
    ],
    "Correction: Change of First Name (R.A. 9048) and Change of Month and Day of Birth, Change of Gender (R.A. 10172) 189 Migrant Petition of Correction": [
        ("Correction of First Name, Birth Date, or Gender under R.A. 9048 and R.A. 10172", 189),
        ("Migrant Petition for Correction", 193),
    ],
    "Issuance of Exhumation Permit / Transfer Permit (Dead Person) / Burial Permit (Dead Person) / Cremation Permit (Dead Person) 205 7 Issuance of Pre-Marriage Counselling Certificate (PMC) for Family Planning": [
        ("Burial, Cremation, Exhumation, and Transfer Permit Issuance", 205),
        ("Pre-Marriage Counseling Certificate for Family Planning", 206),
    ],
    "Job Referral Issuance 302 2. Establishment Accreditation (New and Renewal) 306 3. Special Program for the Employment of Students and Out-Of-School Youth (SPES) Implementation": [
        ("Job Referral Issuance", 302),
        ("Establishment Accreditation - New and Renewal", 306),
        ("Special Program for the Employment of Students and Out-of-School Youth", 312),
    ],
}


# Fuzzy title matching in the audit can hide related permits. These are distinct
# transactions in the official charter and must be present independently.
ADDITIONAL = [
    ("Excavation Permit Issuance", "Office of the City Engineer", "infrastructure-public-works", 86),
    ("Fencing Permit Issuance", "Office of the City Engineer", "infrastructure-public-works", 87),
    ("Mechanical Permit Issuance", "Office of the City Engineer", "infrastructure-public-works", 89),
    ("Annual Mechanical Permit Issuance", "Office of the City Engineer", "infrastructure-public-works", 91),
    ("Demolition Permit Issuance", "Office of the City Engineer", "infrastructure-public-works", 94),
    ("Certificate of Change of Use Issuance", "Office of the City Engineer", "infrastructure-public-works", 96),
    ("Annual Electrical Permit Issuance", "Office of the City Engineer", "infrastructure-public-works", 98),
    ("Electronics Permit Issuance", "Office of the City Engineer", "infrastructure-public-works", 100),
    ("Development Permit Issuance", "Office of the City Engineer", "infrastructure-public-works", 105),
    ("Locational Clearance for Business Permit", "Office of the City Planning and Development Coordinator", "infrastructure-public-works", 112),
    ("Real Property Transfer Tax Payment", "Office of the City Treasurer", "taxation-payments", 133),
    ("Certificate of Guardianship Issuance", "Office of the City Social Welfare and Development Officer", "social-services-assistance", 247),
]


CATEGORY_NAMES = {
    "business-trade-investment": "Business, Trade & Investment",
    "taxation-payments": "Taxation & Payments",
    "infrastructure-public-works": "Infrastructure & Public Works",
    "certificates-vital-records": "Certificates & Vital Records",
    "agriculture-economic-development": "Agriculture & Economic Development",
    "public-safety-security": "Public Safety & Security",
    "education-scholarship": "Education & Scholarship",
    "health-wellness": "Health & Wellness",
    "social-services-assistance": "Social Services & Assistance",
    "environment-natural-resources": "Environment & Natural Resources",
}


def extract_header(text, label, next_labels):
    stop = "|".join(re.escape(item) for item in next_labels)
    match = re.search(rf"{re.escape(label)}\s*:\s*(.*?)(?=\n(?:{stop})\s*:|\nCHECKLIST|$)", text, re.I | re.S)
    return re.sub(r"\s+", " ", match.group(1)).strip() if match else None


def slugify(value):
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", value.casefold())).strip("-")


report = json.loads(REPORT.read_text(encoding="utf-8"))
pages = {item["page"]: item["text"] for item in json.loads(PAGES.read_text(encoding="utf-8"))}

cleaned = []
for item in report:
    title = item["service"]
    if title in EXCLUDED:
        continue
    if title in REPLACEMENTS:
        for replacement, page in REPLACEMENTS[title]:
            cleaned.append({**item, "service": replacement, "charterPage": page})
        continue
    cleaned.append(item)

for title, office, category, page in ADDITIONAL:
    cleaned.append({"service": title, "officeDivision": office, "category": category, "charterPage": page})

seen = set()
services = []
for index, item in enumerate(cleaned, start=1):
    title = re.sub(r"\s+", " ", item["service"]).strip()
    key = title.casefold()
    if key in seen:
        continue
    seen.add(key)
    item["category"] = CATEGORY_OVERRIDES.get(title, item["category"])
    charter_page = item["charterPage"]
    # Printed charter pages are one behind the physical PDF page number.
    page_text = pages.get(charter_page + 1, "")
    classification = extract_header(page_text, "Classification", ["Type of Transaction", "Type of\nTransaction", "Who may avail"])
    transaction = extract_header(page_text, "Type of Transaction", ["Who may avail"])
    eligible = extract_header(page_text, "Who may avail", [])
    services.append({
        "service_number": f"CC-{charter_page}",
        "service_name": title,
        "plain_language_name": title.replace(" Issuance", "").replace(" Processing", ""),
        "office_division": item["officeDivision"],
        "classification": classification or "See official service page",
        "type_of_transaction": transaction or "See official service page",
        "who_may_avail": eligible or "See official service page",
        "category_override": item["category"],
        "charter_page": charter_page,
        "pdf_page": charter_page + 1,
        "requirements": [],
        "client_steps": [],
        "fees": {"amount": None, "description": "See the official service page for the applicable fee."},
        "processing_time": "See the official service page",
    })

OUTPUT.write_text(json.dumps({"services": services}, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Imported {len(services)} missing external-service catalog records to {OUTPUT}")
