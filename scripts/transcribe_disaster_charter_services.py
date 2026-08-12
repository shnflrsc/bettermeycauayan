import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "src/data/citizens-charter/citizens-charter.json"
OFFICE = "Office of the Local Disaster Risk Reduction and Management Officer"
STAFF = ["LDRRMO Head Officer", "Administrative Officer I", "Management Officer I", OFFICE]


def req(requirement, source):
    return {"requirement": requirement, "where_to_secure": source}


def step(number, action, agency_action, time, people=None):
    return {"step": number, "action": action, "agency_action": agency_action, "fees": "None", "processing_time": time, "person_responsible": people or STAFF}


def record(name, requirements, steps, total, people=None):
    return {"plain_language_name": name, "requirements": requirements, "client_steps": steps, "fees": {"amount": "None", "description": "No fee"}, "processing_time": total, "person_responsible": people or STAFF, "classification": "Simple", "type_of_transaction": "G2C / G2B / G2G - Government to Client, Business, or Government"}


request_letter = req("Written request addressed to the City Mayor through the LDRRMO Head Officer", "Requesting party")
updates = {
    "Training Development & Capacity Skills Program": record(
        "Disaster Preparedness and Emergency Response Training",
        [request_letter],
        [
            step(1, "Inquire by phone, email, or walk-in.", "Explain available courses, requirements, and schedules. Courses include Basic Life Support-CPR, Community First Aid, Standard First Aid, DRRM 101, Disaster Preparedness, and Basic Water Safety.", "30 minutes"),
            step(2, "Submit or email the formal request letter.", "Route the request through the LDRRMO Head Officer to the City Mayor and notify the client after approval.", "1 day"),
            step(3, "Confirm the training schedule.", "Prepare materials, equipment, facilities, and instructors; conduct and facilitate the training.", "3 days"),
            step(4, "Complete the written and practical examinations and training evaluation.", "Evaluate the training output and print certificates.", "4 hours"),
            step(5, "Participate in the awarding of certificates.", "Award certificates and submit the Post-Activity Report.", "1 hour"),
        ],
        "4 days, 5 hours, and 30 minutes",
    ),
    "Report & Certifications Request": record(
        "LDRRMO Incident Reports and Certifications",
        [request_letter, req("Valid ID of the requesting party", "Government issuing agency"), req("Authorization letter when requesting for another person", "Requesting party"), req("Proof of claim or necessity, when applicable", "Insurance company, legal counsel, employer, or requesting party")],
        [
            step(1, "Submit the request letter and complete requirements.", "Receive and verify the documents.", "10 minutes"),
            step(2, "Wait while the document is processed.", "Review and verify the report or certification.", "4 days"),
            step(3, "Wait for approval by the Office of the City Mayor.", "Receive the approved document back from the Mayor's Office.", "2 days"),
            step(4, "Claim the document and sign the release log.", "Release the requested document.", "5 minutes"),
        ],
        "6 days and 15 minutes",
    ),
    "Technical Assistant Request": {
        **record(
            "LDRRMO Technical Assistance and Disaster Planning Support",
            [
                request_letter,
                req("Valid ID and email address; at least 5 GB USB or external drive for electronic records", "Requesting party"),
                req("For Barangay DRRM Fund Investment Plan review: Oplan Listo BDRRM Plan, utilization and accomplishment reports, resources, training list, resolutions, situation reports, and related records", "Barangay"),
                req("For Contingency Plan review: DRRM Plan, accomplishment report, resources, training list, and other requested records", "Requesting party"),
                req("For workshop assistance: memorandum or invitation containing activity details", "Requesting party"),
            ],
            [
                step(1, "Request publicly accessible DRRM plans, hazard maps, contingency plans, or related files and provide a valid ID and storage device or email.", "Route the request for approval and provide the requested electronic files.", "3 working days and 10 minutes"),
                step(2, "Submit the Barangay DRRM Fund Investment Plan and supporting records, then receive the signed plan.", "Monitor compliance, review the plan, obtain final approval, and release it.", "1 week and 10 minutes"),
                step(3, "Submit a Contingency Plan and supporting records, then receive the review certificate.", "Review the plan for correctness and template compliance, secure final review, and release certification.", "2 weeks"),
                step(4, "Submit a request or invitation for technical assistance during a DRRM workshop and provide the activity details.", "Confirm availability and provide lectures or technical assistance as scheduled.", "5 minutes or upon schedule"),
                step(5, "Submit a request for drill evaluators and conduct the scheduled drill.", "Confirm evaluators, observe the drill, and issue an evaluation report and certificate.", "3 working days or upon schedule"),
            ],
            "Varies by request: 3 working days and 10 minutes to 2 weeks, or upon schedule",
        ),
        "classification": "Complex",
    },
    "Disaster Response Services Request": record(
        "Emergency Rescue and Patient Transport",
        [
            req("Call the LDRRMO hotlines: (044) 815-0404, (044) 321-6345, 0898-111-6392, or 0953-119-0320; provide caller, incident, location, and patient information", "Requesting party"),
            req("For non-urgent patient transport: coordination/request letter and confirmation from the receiving facility", "Requesting party and receiving hospital"),
            req("For facility-to-home transport: discharge clearance or gate pass and applicable HAMA, DAMA, THOC, or DNR waiver", "Hospital and patient or representative"),
            req("For facility-to-facility transport: confirmed coordination between hospitals and an accompanying physician or nurse when required", "Endorsing and receiving facilities"),
        ],
        [
            step(1, "Call or personally coordinate with LDRRMO and provide the required incident and patient information.", "Obtain the information needed for assessment and dispatch.", "2 minutes", ["LDRRMO Team Leader", "Team on Duty", "Call Operator", "Nursing Attendant II", OFFICE]),
            step(2, "Wait for verification and dispatch; accompany the ambulance when necessary.", "Verify and review the information and transport requirements.", "2 minutes", ["LDRRMO Team Leader", "Team on Duty", "Call Operator", "Operations and Warning Division", OFFICE]),
            step(3, "Expect the rescue team and coordinate with responders upon arrival.", "Dispatch the ambulance based on the patient's location.", "Up to 10 minutes", ["Operations and Warning Division Chief", "Team on Duty", "Nursing Attendant II", OFFICE]),
        ],
        "14 minutes for dispatch",
        ["LDRRMO Team Leader", "Team on Duty", "Call Operator", "Operations and Warning Division", OFFICE],
    ),
    "Stand-by Medic Request": record(
        "Ambulance and Medical Standby for Events",
        [req("Approved request letter from the Office of the City Mayor, submitted at least 5 working days before the event", "Office of the City Mayor"), req("Event name/type, date and time, exact location, requesting party, estimated attendance, and coordinator's name and contact number", "Requesting party")],
        [
            step(1, "Submit the formal request to the City Mayor and coordinate with LDRRMO at least 5 working days before the event.", "Inform the appropriate LDRRMO unit upon receipt.", "2-3 days"),
            step(2, "Proceed to LDRRMO for final approval and scheduling.", "Approve the request based on availability and coordinate with the requesting party.", "1 day"),
            step(3, "Receive the approved request.", "Endorse the request to Operations and Warning and schedule the deployment team.", "1 day"),
            step(4, "Provide an event guide/coordinator and a suitable standby location.", "Deploy medical personnel and the ambulance on the approved schedule.", "Upon schedule"),
        ],
        "4 days, then deployment upon schedule",
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
print(f"Transcribed {len(found)} disaster risk reduction services")
