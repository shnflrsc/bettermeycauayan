import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "src/data/citizens-charter/citizens-charter.json"
POPULATION_STAFF = [
    "City Population Officer",
    "Population Program Worker I",
    "Administrative Aide I",
    "Office of the City Population Officer",
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
        "person_responsible": people or POPULATION_STAFF,
    }


updates = {
    "Pre-Marriage Orientation and Counseling (PMOC) Certification": {
        "plain_language_name": "Pre-Marriage Orientation and Counseling Certificate",
        "requirements": [
            req("Fully accomplished Marriage License Application with the original signature of the Civil Registrar Officer and supporting documents such as CENOMAR and birth certificates", "Office of the City Civil Registrar"),
            req("Family Planning Certificate (1 original copy)", "City Health Office"),
        ],
        "client_steps": [
            step(1, "Present the complete requirements.", "Evaluate the application and requirements; prepare CPD Form 1 and the logbook; distribute the Marriage Inventory Questionnaire.", "18 minutes per couple"),
            step(2, "Complete CPD Form 1 and the logbook. Each prospective spouse must answer the Marriage Inventory Questionnaire.", "Assist the couple, collect the forms and questionnaire, and analyze the answers.", "23 minutes per couple"),
            step(3, "Proceed to the counseling room.", "Prepare the counseling room and assist the couple.", "10 minutes"),
            step(4, "Attend the pre-marriage orientation and counseling session.", "Conduct the seminar for prospective couples.", "3 hours"),
            step(5, "Wait while the PMOC certificate is prepared.", "Prepare the PMOC certificate.", "5 minutes per couple"),
            step(6, "Receive the PMOC certificate.", "Release the PMOC certificate to the couple.", "3 minutes per couple"),
        ],
        "fees": {"amount": "None", "description": "No fee"},
        "processing_time": "3 hours and 59 minutes",
        "person_responsible": POPULATION_STAFF,
    },
    "Request for Data (Demographic Surveillance Data / Total Population / Others)": {
        "plain_language_name": "Request for Population and Demographic Data",
        "requirements": [
            req("Originally signed request letter on official letterhead, addressed to the City Mayor and attention to the City Population Office, stating the data needed and the scope and purpose of the research, and noted by the authorized signatories", "To be provided by the client"),
        ],
        "client_steps": [
            step(1, "Submit the request letter to the City Mayor's Office on the 4th floor.", "Record and forward the request for the City Mayor's approval, advise the release date, and notify the client by text message when the approved request is ready.", "2 days and 5 minutes", ["Security Officer I", "Daycare Worker I", "Administrative Aide I", "Office of the City Mayor"]),
            step(2, "Collect the approved request from the City Mayor's Office and present it to the City Population Office.", "Receive the approved request, interview the client, and prepare the requested data.", "53 minutes", POPULATION_STAFF),
            step(3, "Receive the requested data.", "Release the requested data.", "5 minutes", POPULATION_STAFF),
        ],
        "fees": {"amount": "None", "description": "No fee"},
        "processing_time": "2 days, 1 hour, and 3 minutes",
        "person_responsible": POPULATION_STAFF,
    },
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
print(f"Transcribed {len(found)} City Population Office services")
