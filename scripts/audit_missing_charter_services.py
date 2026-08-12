import json
import re
from difflib import SequenceMatcher
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PAGES_PATH = ROOT / "tmp/pdfs/meycauayan-charter-2026-pages.json"
SERVICES_PATH = ROOT / "src/data/services/services.json"
REPORT_PATH = ROOT / "tmp/pdfs/missing-charter-services.json"


OFFICES = {
    "OFFICE OF THE CITY MAYOR (CMO) – EXTERNAL SERVICES": ("Office of the City Mayor", "social-services-assistance"),
    "OFFICE OF THE CITY ASSESSOR (CAsO)": ("Office of the City Assessor", "taxation-payments"),
    "OFFICE OF THE CITY BUSINESS PERMIT AND LICENSING OFFICER (CBPLO)": ("Office of the City Business Permit and Licensing Officer", "business-trade-investment"),
    "OFFICE OF THE CITY ENGINEER (CEO)": ("Office of the City Engineer", "infrastructure-public-works"),
    "OFFICE OF THE CITY PLANNING AND DEVELOPMENT COORDINATOR (CPDO)": ("Office of the City Planning and Development Coordinator", "infrastructure-public-works"),
    "OFFICE OF THE CITY TREASURER (CTO)": ("Office of the City Treasurer", "taxation-payments"),
    "OFFICE OF THE CITY CIVIL REGISTRAR (CCRO)": ("Office of the City Civil Registrar", "certificates-vital-records"),
    "OFFICE OF THE CITY HEALTH OFFICER (CHO)": ("Office of the City Health Officer", "health-wellness"),
    "OSPITAL NG MEYCAUAYAN (OSMEYC)": ("Ospital ng Meycauayan", "health-wellness"),
    "OFFICE OF THE CITY SOCIAL WELFARE AND DEVELOPMENT OFFICER (CSWDO)": ("Office of the City Social Welfare and Development Officer", "social-services-assistance"),
    "OFFICE OF THE CITY ENVIRONMENT AND NATURAL RESOURCES OFFICER (CENRO)": ("Office of the City Environment and Natural Resources Officer", "environment-natural-resources"),
    "OFFICE OF THE CITY POPULATION OFFICER (CPO)": ("Office of the City Population Officer", "social-services-assistance"),
    "ECONOMIC ENTERPRISE MGMT. DIVISION - OFFICE OF THE CITY ADMINISTRATOR (CAdO-EEM)": ("Economic Enterprise Management Division - Office of the City Administrator", "taxation-payments"),
    "OFFICE OF THE CITY COOPERATIVES DEVELOPMENT OFFICER (CCDO)": ("Office of the City Cooperatives Development Officer", "business-trade-investment"),
    "OFFICE OF THE CITY PUBLIC EMPLOYMENT SERVICE OFFICER (CPESO)": ("Office of the City Public Employment Service Officer", "education-scholarship"),
    "OFFICE OF THE LOCAL DISASTER RISK REDUCTION AND MANAGEMENT OFFICER (LDRRMO)": ("Local Disaster Risk Reduction and Management Office", "public-safety-security"),
    "OFFICE OF THE CITY VETERINARIAN (CVO)": ("Office of the City Veterinarian", "health-wellness"),
    "OFFICE OF THE CITY AGRICULTURIST (CAgO)": ("Office of the City Agriculturist", "agriculture-economic-development"),
    "OFFICE OF THE CITY HUMAN RESOURCE MANAGEMENT OFFICER (CHRMO) - EXTERNAL": ("Office of the City Human Resource Management Officer", "education-scholarship"),
    "OFFICE OF THE SECRETARY TO THE SANGGUNIANG PANLUNGSOD (SSPO)": ("Office of the Secretary to the Sangguniang Panlungsod", "certificates-vital-records"),
    "OFFICE OF THE CITY VICE MAYOR (CVMO), SANGGUNIANG PANLUNGSOD (SPO), AND": ("Sangguniang Panlungsod", "business-trade-investment"),
    "POLYTECHNIC COLLEGE OF THE CITY OF MEYCAUAYAN (PCCM)": ("Polytechnic College of the City of Meycauayan", "education-scholarship"),
    "OFFICE OF THE CITY ADMINISTRATOR (CAdO)": ("Office of the City Administrator", "public-safety-security"),
    "OFFICE OF THE CITY INFORMATION OFFICER (CIO) - EXTERNAL (Tourism Division)": ("Office of the City Information Officer - Tourism Division", "education-scholarship"),
    "OFFICE OF THE CITY LEGAL OFFICER (CLO)": ("Office of the City Legal Officer", "social-services-assistance"),
}


EXCLUDE_OFFICES = {
    "OFFICE OF THE CITY MAYOR (CMO) – INTERNAL SERVICES",
    "OFFICE OF THE CITY HUMAN RESOURCE MANAGEMENT OFFICER (CHRMO) - INTERNAL",
    "OFFICE OF THE CITY ACCOUNTANT (CAcO) - INTERNAL",
    "OFFICE OF THE CITY INFORMATION OFFICER (CIO) - INTERNAL",
    "OFFICE OF THE CITY BUDGET OFFICER (CBO)",
    "OFFICE OF THE CITY GENERAL SERVICES OFFICER (CGSO)",
}


def normalize(value):
    return re.sub(r"[^a-z0-9]+", " ", value.casefold()).strip()


def similar(left, right):
    a, b = normalize(left), normalize(right)
    return a in b or b in a or SequenceMatcher(None, a, b).ratio() >= 0.72


pages = json.loads(PAGES_PATH.read_text(encoding="utf-8"))
existing = json.loads(SERVICES_PATH.read_text(encoding="utf-8"))
existing_names = [item["service"] for item in existing]

# The official list of services occupies PDF pages 5-12. Join wrapped lines,
# retaining only numbered rows that finish with a charter page number.
lines = []
for page in pages[4:12]:
    lines.extend(line.strip() for line in page["text"].splitlines() if line.strip())

records = []
office = None
category = None
pending = ""
for line in lines:
    if line in EXCLUDE_OFFICES:
        office = None
        category = None
        pending = ""
        continue
    if line in OFFICES:
        office, category = OFFICES[line]
        pending = ""
        continue
    if line.startswith("OFFICE OF THE CITY ACCOUNTANT (CAcO) - EXTERNAL"):
        office, category = "Office of the City Accountant", "taxation-payments"
        pending = ""
        continue
    if line.startswith("SANGGUNIANG PANLUNGSOD (SSPO)") and office == "Sangguniang Panlungsod":
        continue
    if not office or line in {"LIST OF SERVICES", "PAGE", "NUMBER"}:
        continue
    match = re.match(r"^(?:\d+\.\s*)?(.*?)(?:\s+)(\d{2,3})$", line)
    if match:
        title = f"{pending} {match.group(1)}".strip()
        title = re.sub(r"^\d+\.\s*", "", title)
        title = re.sub(r"\s+", " ", title)
        if title and len(title) > 3:
            records.append({"service": title, "officeDivision": office, "category": category, "charterPage": int(match.group(2))})
        pending = ""
    elif re.match(r"^\d+\.\s+", line) or pending:
        pending = f"{pending} {line}".strip()

missing = []
for record in records:
    if not any(similar(record["service"], name) for name in existing_names):
        missing.append(record)

REPORT_PATH.write_text(json.dumps(missing, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Indexed {len(records)} external service rows")
print(f"Existing matches: {len(records) - len(missing)}")
print(f"Missing public-facing services: {len(missing)}")
print(f"Report: {REPORT_PATH}")
