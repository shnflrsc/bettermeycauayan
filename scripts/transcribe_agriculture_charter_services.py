import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "src/data/citizens-charter/citizens-charter.json"
OFFICE = "Office of the City Agriculturist"
STAFF = ["City Agricultural Officer", "Acting City Agriculturist", "Administrative Assistant II", OFFICE]


def req(requirement, source):
    return {"requirement": requirement, "where_to_secure": source}


def step(number, action, agency_action, time, people=None):
    return {"step": number, "action": action, "agency_action": agency_action, "fees": "None", "processing_time": time, "person_responsible": people or STAFF}


def record(name, requirements, steps, total, classification="Simple", people=None):
    return {"plain_language_name": name, "classification": classification, "type_of_transaction": "G2C - Government to Client", "requirements": requirements, "client_steps": steps, "fees": {"amount": "None", "description": "No fee"}, "processing_time": total, "person_responsible": people or STAFF}


updates = {
    "Vegetable Seeds and Fertilizer Distribution": record(
        "Vegetable Seeds and Fertilizer Assistance",
        [req("Completed Request Form for walk-in requests", OFFICE), req("For bulk requests: originally signed letter addressed to the City Mayor", "Provided by the client")],
        [
            step(1, "For a walk-in request, submit the completed Request Form to the City Agriculturist's Office.", "Receive, check, and process the request.", "10 minutes", ["Administrative Assistant II", OFFICE]),
            step(2, "For a bulk request, submit a letter to the Office of the City Mayor.", "Process the request for approval and issue a claim slip.", "2 working days", ["Administrative Aide III", "Office of the City Mayor"]),
            step(3, "Receive the approved request, or present the stamped letter on the scheduled claim date.", "Prepare and release the seeds and fertilizer.", "10 minutes", ["Administrative Assistant II", OFFICE]),
        ],
        "Walk-in: 10 minutes; bulk request: 2 working days and 20 minutes",
    ),
    "Vegetable Seedlings Distribution": record(
        "Vegetable Seedling Assistance",
        [req("Completed Request Form for walk-in requests", "Office of the City Agriculturist - Kariktan ng Meycauayan Eco-Park"), req("For bulk requests: originally signed letter addressed to the City Mayor", "Provided by the client")],
        [
            step(1, "Submit the completed Request Form, or submit a letter to the Office of the City Mayor for a bulk request.", "Receive and process a walk-in request, or forward the bulk request for approval.", "10 minutes for walk-in; 2 working days for bulk request", ["Farm Worker I", "Administrative Aide III", OFFICE]),
            step(2, "Receive the approved request, or present the stamped letter on the scheduled claim date.", "Prepare and release the seedlings.", "10 minutes", ["Farm Worker I", OFFICE]),
        ],
        "Walk-in: 20 minutes; bulk request: 2 working days and 20 minutes",
    ),
    "Seminar and Training for Urban Gardening and Other Topics Related to Agri – Aqua Production Implementation": record(
        "Urban Gardening and Agri-Aqua Production Training",
        [req("Letter request addressed to the City Mayor (2 original copies)", "Provided by the client")],
        [
            step(1, "Submit the request letter to the Office of the City Mayor on the 4th floor of City Hall-Saluysoy.", "Receive and forward the request for the City Mayor's approval.", "2 working days", ["Administrative Aide III", "Office of the City Mayor"]),
            step(2, "Wait for the approved training schedule.", "Assess the approved request and inform the client of the scheduled date.", "10 minutes", ["Acting City Agriculturist", OFFICE]),
        ],
        "2 working days and 10 minutes",
    ),
    "Issuance of Certificate for Land Reclassification": record(
        "Agricultural Land Reclassification Certificate",
        [
            req("Certified Tax Declaration", "Office of the City Assessor"),
            req("Tax Clearance", "Office of the City Treasurer"),
            req("Certified Land Title", "Registry of Deeds, Iba, City of Meycauayan, Bulacan"),
            req("Letter request addressed to the City Mayor (2 original copies)", "Provided by the client"),
            req("Site Zoning Certification", "Office of the City Urban Planning and Development Officer"),
            req("Location, vicinity, or Google map", "Provided by the client"),
        ],
        [
            step(1, "Submit the request letter and complete documents to the Office of the City Mayor.", "Route the request for approval, assess it, schedule the ocular inspection, and notify the client.", "4 working days", ["Administrative Aide III", "Office of the City Mayor", "City Agricultural Officer", OFFICE]),
            step(2, "Attend the scheduled ocular inspection.", "Conduct the inspection, advise the release date, and prepare the certificate for approval.", "2 working days, 3 hours, and 30 minutes", ["City Agricultural Officer", "Acting City Agriculturist", OFFICE]),
            step(3, "Receive the certificate and sign the logbook.", "Release the certificate.", "10 minutes", ["City Agricultural Officer", OFFICE]),
        ],
        "6 working days, 3 hours, and 40 minutes",
        "Complex",
    ),
}

data = json.loads(PATH.read_text(encoding="utf-8"))
found = set()
for item in data["services"]:
    name = item.get("service_name")
    if name in updates:
        item.update(updates[name]); found.add(name)
missing = set(updates) - found
if missing:
    raise SystemExit(f"Services not found: {sorted(missing)}")
PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Transcribed {len(found)} City Agriculturist services")
