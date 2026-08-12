import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "src/data/citizens-charter/citizens-charter.json"
OFFICE = "Office of the City Human Resource Management Officer"


def req(requirement, source):
    return {"requirement": requirement, "where_to_secure": source}


def step(number, action, agency_action, time, people):
    return {"step": number, "action": action, "agency_action": agency_action, "fees": "None", "processing_time": time, "person_responsible": people}


updates = {
    "Student Interns Admission (Work Immersion / On-the-Job Trainings)": {
        "plain_language_name": "Student Work Immersion and On-the-Job Training Admission",
        "classification": "Complex",
        "type_of_transaction": "G2C / G2G / G2B - Government to Citizen, Government, or Business",
        "requirements": [
            req("For work immersion: request letter stating each student's full name, strand, and required training hours (1 original)", "School"),
            req("For work immersion: training schedule and period (1 original)", "School"),
            req("For OJT: request letter stating the student's name, course, and required training hours (1 original)", "School"),
            req("For OJT: student resume (1 original)", "Student"),
            req("For OJT: training schedule and period (1 original)", "School"),
            req("Memorandum of Agreement signed by the school and CHRMO, when applicable (2 originals)", "School"),
        ],
        "client_steps": [
            step(1, "Submit all required documents.", "Review the documents, match the student's credentials to an office assignment, secure the department head's approval, approve the assignment and tasks, notify the school of approval and orientation, and prepare the OJT Acceptance Certificate.", "5 working days and 30 minutes", ["HR Coordinator", "Concerned Department Head", "Senior Administrative Assistant II", "City Human Resource Management Officer", OFFICE]),
            step(2, "Receive the OJT Acceptance Certificate and sign the logbook.", "Release the certificate, record the transaction, and file the documents.", "1 working day", ["HR Coordinator", OFFICE]),
        ],
        "fees": {"amount": "None", "description": "No fee"},
        "processing_time": "6 working days and 30 minutes",
        "person_responsible": ["HR Coordinator", "City Human Resource Management Officer", "Concerned Department Head", OFFICE],
    },
    "Teachers’ Professionalization Program Applicants Admission": {
        "plain_language_name": "Teachers' Professionalization Program Application",
        "classification": "Highly Technical",
        "type_of_transaction": "G2C / G2G - Government to Citizen or Government",
        "requirements": [
            req("Notarized application form (1 original and 6 photocopies) with passport-size labeled ID photo", OFFICE),
            req("Originally signed letter of intent addressed to the City Mayor (1 original and 6 photocopies)", "Applicant"),
            req("Recommendation from the Faculty President or School Head (1 original and 6 photocopies)", "Applicant's school"),
            req("Birth Certificate (1 certified/authenticated copy and 6 photocopies)", "Local Civil Registrar or PSA"),
            req("Residence Certificate showing at least 2 years of residency (1 sealed original and 6 photocopies)", "Barangay Hall"),
            req("Service Record (1 original and 6 photocopies)", "Applicant's school"),
            req("Bachelor's Degree Transcript of Records (1 certified true copy and 6 photocopies)", "College or university attended"),
            req("Performance ratings for the two rating periods before application (1 certified true copy and 6 photocopies)", "Applicant's school"),
            req("Seven copies each of applicable undergraduate thesis cover, publications, training/speakership certificates, and awards or recognition", "Applicant"),
        ],
        "client_steps": [
            step(1, "Submit all requirements to CHRMO on the 5th floor and wait for the application-status notice.", "Review completeness, screen applicants against the criteria, forward shortlisted records for review, and notify applicants of the initial result.", "22 working days and 30 minutes", ["Administrative Aide I", "Administrative Assistant II", "City Human Resource Management Officer", OFFICE]),
            step(2, "Attend the interview and evaluation.", "Conduct the interview, prepare the minutes and evaluation matrix, deliberate, and recommend qualified applicants to the City Mayor.", "3 working days", ["Administrative Aide I", "Administrative Assistant II", "Human Resource Development Committee", OFFICE]),
            step(3, "Wait for the final application result.", "Prepare and approve the final list, notify all applicants, and record and file the documents.", "4 working days", ["Human Resource Development Committee", "City Mayor", "Administrative Aide I", "Administrative Assistant II", OFFICE]),
        ],
        "fees": {"amount": "None", "description": "No fee"},
        "processing_time": "29 working days and 30 minutes",
        "person_responsible": ["City Human Resource Management Officer", "Human Resource Development Committee", "City Mayor", OFFICE],
    },
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
print(f"Transcribed {len(found)} HR and education services")
