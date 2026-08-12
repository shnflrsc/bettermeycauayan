import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "src/data/citizens-charter/citizens-charter.json"
SP = "Office of the Secretary to the Sangguniang Panlungsod"
SP_STAFF = ["Secretary to the Sangguniang Panlungsod", "Administrative Officer V", "Administrative Assistant III", SP]


def req(requirement, source):
    return {"requirement": requirement, "where_to_secure": source}


def step(number, action, agency_action, fee, time, people):
    return {"step": number, "action": action, "agency_action": agency_action, "fees": fee, "processing_time": time, "person_responsible": people}


updates = {
    "Tax Certificates for Suppliers Issuance": {
        "plain_language_name": "BIR Form 2307 Tax Certificate for Suppliers",
        "classification": "Simple",
        "type_of_transaction": "G2B - Government to Business",
        "requirements": [req("Verbal request for BIR Form 2307", "Office of the City Accountant")],
        "client_steps": [
            step(1, "Request issuance of BIR Form 2307.", "Prepare the form and obtain the City Accountant's approval and signature.", "None", "13 minutes", ["Administrative Assistant VI", "City Accountant", "Office of the City Accountant"]),
            step(2, "Receive the certificate and acknowledge it in the logbook.", "Issue the certificate and file the received copy in the supplier's folder.", "None", "6 minutes", ["Administrative Assistant VI", "Office of the City Accountant"]),
        ],
        "fees": {"amount": "None", "description": "No fee"},
        "processing_time": "19 minutes",
        "person_responsible": ["Administrative Assistant VI", "City Accountant", "Office of the City Accountant"],
    },
    "Certified True Copy Issuance of Resolutions and Ordinance": {
        "plain_language_name": "Certified Copies of City Resolutions and Ordinances",
        "classification": "Simple",
        "type_of_transaction": "G2C / G2B / G2G - Government to Citizen, Business, or Government",
        "requirements": [req("Request letter (1 original copy)", "Provided by the client"), req("Government-issued ID", "Government issuing agency")],
        "client_steps": [
            step(1, "Submit the request letter and present a government-issued ID.", "Receive and verify the request, confirm record availability, and issue an Order of Payment when applicable.", "None", "16 minutes", SP_STAFF),
            step(2, "Pay at the City Treasurer's cashier and secure the official receipt. Government offices requesting documents for official business are exempt.", "Receive payment and issue the official receipt.", "PHP 50 per page", "10 minutes", ["Senior Administrative Assistant I", "Administrative Assistant V", "Administrative Aide I", "Office of the City Treasurer"]),
            step(3, "Return to the SP Secretary's Office and present the receipt.", "Verify payment, prepare the requested copies, and certify them with the required signature.", "None", "17 minutes", SP_STAFF),
            step(4, "Sign the logbook and receive the certified copies.", "Record and release the certified resolutions or ordinances.", "None", "5 minutes", SP_STAFF),
        ],
        "fees": {"amount": "PHP 50 per page", "description": "No payment is required for official requests from city offices or other government agencies."},
        "processing_time": "48 minutes",
        "person_responsible": SP_STAFF,
    },
    "Certificate of No Pending Administrative Case Issuance": {
        "plain_language_name": "Certificate of No Pending Administrative Case for Barangay Officials",
        "classification": "Simple",
        "type_of_transaction": "G2G - Government to Government",
        "requirements": [req("Completed Request Slip (1 original)", SP), req("Government-issued ID (1 photocopy)", "Government issuing agency")],
        "client_steps": [
            step(1, "Submit the Request Slip and ID photocopy.", "Verify the submission and check official records. If no pending case exists, issue the Order of Payment; otherwise inform the applicant that certification cannot be issued.", "None", "16 minutes", ["Administrative Assistant VI", SP]),
            step(2, "Pay at the City Treasurer's cashier, secure the receipt, and make a photocopy.", "Receive payment and issue the official receipt.", "PHP 50", "10 minutes", ["Senior Administrative Assistant I", "Administrative Assistant V", "Administrative Aide I", "Office of the City Treasurer"]),
            step(3, "Return with the original and photocopied receipt.", "Verify and return the original receipt, attach the copy to the request, prepare the certificate, and obtain the required signature.", "None", "19 minutes", ["Administrative Assistant VI", "Secretary to the Sangguniang Panlungsod", "Administrative Officer V", SP]),
            step(4, "Sign the logbook and receive the certificate.", "Record and release the certificate.", "None", "5 minutes", ["Administrative Assistant VI", SP]),
        ],
        "fees": {"amount": "PHP 50", "description": "Certificate fee."},
        "processing_time": "50 minutes",
        "person_responsible": ["Administrative Assistant VI", "Secretary to the Sangguniang Panlungsod", SP],
    },
    "Tricycle Franchise Issuance": {
        "plain_language_name": "City Tricycle Franchise Certificate",
        "classification": "Highly Technical",
        "type_of_transaction": "G2C / G2G - Government to Citizen or Government",
        "requirements": [
            req("Endorsement Letter with reviewed and verified requirements", "Office of the City Business Permit and Licensing Officer"),
            req("Claim Slip", "Office of the City Business Permit and Licensing Officer"),
            req("Official Receipt", "Office of the City Treasurer"),
            req("Government-issued ID", "Government issuing agency"),
            req("For a representative: authorization letter and IDs of the principal and representative with the required specimen signatures", "Client and government issuing agencies"),
        ],
        "client_steps": [
            step(1, "Submit the endorsed and verified franchise application.", "Verify the documents; conduct the readings and committee hearing; enact and sign the ordinance; obtain provincial review; prepare and sign the franchise certificate; notify the applicant.", "None", "56 days and 36 minutes", ["City Vice Mayor", "City Councilors", "Secretary to the Sangguniang Panlungsod", "City Mayor", SP]),
            step(2, "Present the Claim Slip, official receipt, and ID, plus representative documents when applicable.", "Verify the claim documents.", "None", "2 minutes", SP_STAFF),
            step(3, "Sign the release logbook and receive the franchise certificate.", "Record and release the Certificate of Tricycle Franchise.", "None", "5 minutes", SP_STAFF),
        ],
        "fees": {"amount": "None", "description": "No additional fee is listed in this issuance stage; present the official receipt from the preceding permit process."},
        "processing_time": "56 days and 43 minutes",
        "person_responsible": ["City Vice Mayor", "City Councilors", "City Mayor", "Secretary to the Sangguniang Panlungsod", SP],
    },
    "Civil Society Organization Accreditation": {
        "plain_language_name": "Civil Society Organization Accreditation",
        "classification": "Highly Technical",
        "type_of_transaction": "G2C - Government to Citizen",
        "requirements": [
            req("Letter of Application, Annex D (1 original and 6 photocopies)", "Applicant"),
            req("Application for Accreditation, Annex C (1 original and 6 photocopies)", SP),
            req("Approved Board Resolution, registration/accreditation certificate, and current officers list, Annex F (1 original and 6 photocopies each)", "Applicant"),
            req("For organizations operating at least 1 year: annual-meeting minutes, accomplishment report, and financial statement (1 original and 6 photocopies each)", "Applicant"),
        ],
        "client_steps": [
            step(1, "Submit the application and complete documents.", "Verify the submission, include it in the first reading, refer it to committee, and send the hearing invitation.", "None", "7 days and 33 minutes", ["City Vice Mayor", "City Councilors", "Secretary to the Sangguniang Panlungsod", "Administrative Assistant V", SP]),
            step(2, "Organization officers attend the committee hearing.", "Conduct the hearing, prepare the committee report, complete final reading and resolution signatures, prepare the accreditation certificate, and notify the applicant.", "None", "10 days and 3 minutes", ["City Vice Mayor", "City Councilors", "Secretary to the Sangguniang Panlungsod", "City Mayor", SP]),
            step(3, "Present the received copy of the application, sign the receiving list, and receive the certificate and resolution.", "Verify the received copy, record the issuance, and release the accreditation documents.", "None", "7 minutes", ["Administrative Assistant V", "Administrative Assistant III", SP]),
        ],
        "fees": {"amount": "None", "description": "No fee"},
        "processing_time": "17 days and 43 minutes",
        "person_responsible": ["City Vice Mayor", "City Councilors", "Secretary to the Sangguniang Panlungsod", "City Mayor", SP],
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
print(f"Transcribed {len(found)} financial and legislative services")
