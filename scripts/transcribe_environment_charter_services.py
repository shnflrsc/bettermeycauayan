import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "src/data/citizens-charter/citizens-charter.json"

OFFICE = "Office of the City Environment and Natural Resources Officer"
STAFF = [
    "City Environment and Natural Resources Officer",
    "Environmental Management Specialist I",
    "Public Service Assistant",
    "Administrative Aide I",
    OFFICE,
]


def req(requirement, source):
    return {"requirement": requirement, "where_to_secure": source}


def step(number, action, agency_action, time, people=None):
    return {
        "step": number,
        "action": action,
        "agency_action": agency_action,
        "fees": "None",
        "processing_time": time,
        "person_responsible": people or STAFF,
    }


def service(name, requirements, steps, total):
    return {
        "plain_language_name": name,
        "requirements": requirements,
        "client_steps": steps,
        "fees": {"amount": "None", "description": "No fee"},
        "processing_time": total,
        "person_responsible": STAFF,
    }


letter = req("Originally signed letter request addressed to the City Mayor (1 copy)", "To be provided by the client")
photos = req("Actual photos of the request", "To be provided by the client")

updates = {
    "Tree Trimming / Grass Cutting / Fogging Operation": service(
        "Tree Trimming, Grass Cutting, or Fogging Operation",
        [letter, photos],
        [
            step(1, "Submit the letter request to the Office of the City Mayor.", "Receive the routed request, prepare the operation schedule, notify the client by text message, and file the documents.", "4 hours and 10 minutes"),
        ],
        "4 hours and 10 minutes",
    ),
    "Certification of Cutting of Trees": service(
        "Certification for Cutting of Trees",
        [letter, photos, req("Certification of No Objection", "Barangay Hall")],
        [
            step(1, "Submit the letter request to the Office of the City Mayor.", "Receive the routed request, prepare the inspection schedule, and notify the client by text message.", "1 hour and 20 minutes"),
            step(2, "Attend the scheduled site inspection.", "Conduct the site inspection and interview, advise the release date, and prepare the certification for signature.", "2 hours and 30 minutes"),
            step(3, "Receive the certification.", "Release the certification and file the documents.", "20 minutes"),
            step(4, "Submit the signed Certificate of No Objection to Community ENRO, Guiguinto.", "No city action is specified for this client submission.", "Client time"),
        ],
        "4 hours and 10 minutes",
    ),
    "Dredging": service(
        "Creek and Riverway Dredging",
        [letter, photos],
        [
            step(1, "Submit the letter request to the Office of the City Mayor.", "Receive the routed request, prepare the inspection schedule, and notify the client by text message.", "1 hour and 20 minutes"),
            step(2, "Attend the scheduled site inspection.", "Conduct the site inspection and interview, then inform the client of the dredging schedule.", "6 days and 1 hour (depending on equipment availability)"),
            step(3, "Wait for completion of documentation.", "File the documents.", "10 minutes"),
        ],
        "6 days, 2 hours, and 30 minutes",
    ),
    "Clean Up Operation": service(
        "Community Clean-Up Operation",
        [letter],
        [
            step(1, "Submit the letter request to the Office of the City Mayor.", "Receive the routed request, prepare the inspection schedule, and notify the client by text message.", "1 day, 1 hour, and 10 minutes"),
            step(2, "Attend the scheduled site inspection.", "Conduct the site inspection and interview, then inform the client of the clean-up schedule.", "20 minutes"),
            step(3, "Wait for completion of documentation.", "File the documents.", "10 minutes"),
        ],
        "1 day, 1 hour, and 40 minutes",
    ),
    "Environmental Management Clearance": service(
        "Environmental Management Clearance",
        [
            letter,
            req("Business Permit (1 photocopy)", "Business Permit and Licensing Office"),
            req("Official Receipt of Payment (1 photocopy)", "City Treasury Office"),
            req("Permit to Operate (1 photocopy)", "Department of Environment and Natural Resources (DENR)"),
            req("Environmental Compliance Certificate (1 photocopy; for environmentally critical projects only)", "Department of Environment and Natural Resources (DENR)"),
        ],
        [
            step(1, "Submit the application and requirements to CENRO.", "Receive the application, prepare the inspection schedule, and inform the client by text or message.", "1 hour and 40 minutes"),
            step(2, "Attend the scheduled site inspection.", "Conduct the inspection and interview, advise the release schedule, and prepare the clearance for signature.", "2 days and 15 minutes"),
            step(3, "Receive the Environmental Management Clearance.", "Release the clearance and file the documents.", "15 minutes"),
        ],
        "2 days, 2 hours, and 10 minutes",
    ),
    "Certificate of Non-Coverage": service(
        "Certificate of Non-Coverage",
        [
            req("Business Permit (1 photocopy)", "Business Permit and Licensing Office"),
            req("Official Receipt of Payment (1 photocopy)", "City Treasury Office"),
            req("Permit to Operate (1 photocopy)", "Department of Environment and Natural Resources (DENR)"),
        ],
        [
            step(1, "Submit the complete documents to the CENRO Office.", "Receive and verify the requirements, interview the client, and prepare and print the certificate.", "1 hour and 30 minutes"),
            step(2, "Receive the Certificate of Non-Coverage.", "Release the certificate and file the documents.", "20 minutes"),
        ],
        "1 hour and 50 minutes",
    ),
}

data = json.loads(PATH.read_text(encoding="utf-8"))
found = set()
for record in data["services"]:
    name = record.get("service_name")
    if name in updates:
        record.update(updates[name])
        found.add(name)

missing = set(updates) - found
if missing:
    raise SystemExit(f"Services not found: {sorted(missing)}")

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Transcribed {len(found)} environment and natural resources services")
