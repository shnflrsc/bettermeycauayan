import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "src/data/citizens-charter/citizens-charter.json"
staff = ["Licensing Officer II", "Licensing Officer III", "License Inspector II", "City Business Permit and Licensing Officer"]
rep = [
    {"requirement": "Authorization Letter (original and 1 photocopy), if represented", "where_to_secure": "Operator or owner"},
    {"requirement": "Representative's valid ID (original and 1 photocopy), if represented", "where_to_secure": "Government issuing agency"},
    {"requirement": "Owner's valid ID with three wet signatures (2 photocopies), if represented", "where_to_secure": "Government issuing agency and owner"},
]

updates = {
    "Endorsement Letter Issuance": {
        "plain_language_name": "Tricycle Endorsement Letter for Valenzuela Routes", "classification": "Simple", "type_of_transaction": "G2C - Government to Citizen", "who_may_avail": "Meycauayan residents who own private or for-hire tricycles operating a regular route in Valenzuela",
        "requirements": [{"requirement": "Valid MTOP (original and 1 photocopy)", "where_to_secure": "CBPLO"}] + rep,
        "client_steps": [{"step": 1, "action": "Submit the requirements for verification, encoding, private-unit inspection if applicable, preparation, signature, recording, and release of the endorsement letter.", "processing_time": "1 hour and 35 minutes"}],
        "fees": {"amount": "None", "description": "No fee"}, "processing_time": "1 hour and 35 minutes", "person_responsible": staff,
    },
    "Supervision Permit Issuance": {
        "classification": "Simple", "type_of_transaction": "G2C - Government to Citizen", "who_may_avail": "Tricycle operators with an endorsement from another local government, or their authorized representatives",
        "requirements": [
            {"requirement": "Valid Barangay Clearance (original and 1 photocopy)", "where_to_secure": "Barangay serving as an entry point to Meycauayan"},
            {"requirement": "Endorsement Letter from the other LGU transport office (original and 1 photocopy)", "where_to_secure": "Other LGU transport office"},
            {"requirement": "Tricycle OR/CR showing sidecar registration (original and 1 photocopy)", "where_to_secure": "Dealer, seller, or LTO"},
            {"requirement": "Voter's ID or Voter's Certification (original and 1 photocopy)", "where_to_secure": "COMELEC"},
            {"requirement": "Franchise Certificate from the other LGU for for-hire units (original and 1 photocopy)", "where_to_secure": "Other city or municipal hall"},
            {"requirement": "Valid Professional Driver's License for for-hire units (original and 1 photocopy)", "where_to_secure": "LTO"},
            {"requirement": "Current Community Tax Certificate (original and 1 photocopy)", "where_to_secure": "Barangay Hall where the operator resides"},
            {"requirement": "Roadworthy tricycle unit", "where_to_secure": "Operator"},
        ] + rep,
        "client_steps": [
            {"step": 1, "action": "Submit the documents and tricycle for verification and roadworthiness inspection, then receive the Order of Payment.", "processing_time": "1 hour"},
            {"step": 2, "action": "Pay the fee, secure the Official Receipt, and wait for preparation and approval of the permit.", "processing_time": "2 days and 55 minutes"},
            {"step": 3, "action": "Present the Official Receipt, sign the logbook, have the sticker installed, and receive the permit.", "processing_time": "40 minutes"},
        ],
        "fees": {"amount": "₱400-₱500", "description": "₱400 for a private unit or ₱500 for a for-hire unit."}, "fee_schedule": [{"name": "Private unit", "amount": "₱400"}, {"name": "For-hire unit", "amount": "₱500"}],
        "processing_time": "2 days, 2 hours, and 40 minutes", "person_responsible": staff + ["City Mayor"],
    },
    "Tricycle Franchise Application Processing (New and Renewal)": {
        "plain_language_name": "Tricycle Franchise Application - New or Renewal", "classification": "Complex", "type_of_transaction": "G2C - Government to Citizen", "who_may_avail": "Qualified tricycle owners or operators who are bona fide Meycauayan residents",
        "requirements": [
            {"requirement": "Barangay Clearance (original and 1 photocopy)", "where_to_secure": "Barangay Hall where the operator resides"},
            {"requirement": "Tricycle OR/CR classified for hire and registered to the applicant (original and 1 photocopy)", "where_to_secure": "LTO"},
            {"requirement": "Federation TODA Certification (original and 1 photocopy)", "where_to_secure": "FMTODA"},
            {"requirement": "Voter's ID or Voter's Certification (original and 1 photocopy)", "where_to_secure": "COMELEC"},
            {"requirement": "Valid Professional Driver's License (original and 1 photocopy)", "where_to_secure": "LTO"},
            {"requirement": "2x2 photograph with white background (1 piece)", "where_to_secure": "Applicant"},
            {"requirement": "Long folder (1 piece)", "where_to_secure": "Applicant"},
            {"requirement": "Roadworthy tricycle unit", "where_to_secure": "Operator"},
            {"requirement": "Valid Franchise Certificate for renewal (original and 1 photocopy)", "where_to_secure": "Office of the Secretary to the Sangguniang Panlungsod"},
        ] + rep,
        "client_steps": [
            {"step": 1, "action": "Submit all documents and the unit for inspection, encoding, and issuance of the Order of Payment.", "processing_time": "1 hour"},
            {"step": 2, "action": "Pay the fee, sign the application, submit an OR copy to the Sanggunian, and wait while the folder is forwarded for franchise action.", "processing_time": "1 hour and 30 minutes"},
        ],
        "fees": {"amount": "₱800", "description": "₱800 application fee, plus ₱150 per delinquent year when applicable."}, "fee_schedule": [{"name": "Application", "amount": "₱800"}, {"name": "Delinquency surcharge", "amount": "₱150 per year"}],
        "processing_time": "2 hours and 30 minutes, excluding Sangguniang Panlungsod franchise approval", "turnaround_time": "Approved franchises are valid for 3 years.", "person_responsible": staff + ["Office of the City Treasurer", "Sangguniang Panlungsod"],
    },
    "Order of Dropping Certificate Issuance": {
        "plain_language_name": "Termination of Tricycle Franchise", "classification": "Simple", "type_of_transaction": "G2C - Government to Citizen", "who_may_avail": "Owners of tricycles with a franchise issued by the City who intend to terminate it",
        "requirements": [{"requirement": "Tricycle OR/CR (original and 1 photocopy)", "where_to_secure": "Motorcycle dealer, seller, or LTO"}],
        "client_steps": [
            {"step": 1, "action": "Submit the OR/CR for verification and receive the Order of Payment.", "processing_time": "10 minutes"},
            {"step": 2, "action": "Pay the fee and wait for preparation, CBPLO signature, and City Vice Mayor approval.", "processing_time": "2 days, 1 hour, and 35 minutes"},
            {"step": 3, "action": "Present the Official Receipt, sign the logbook, and receive the certificate.", "processing_time": "20 minutes"},
        ],
        "fees": {"amount": "₱200", "description": "Order of Dropping Certificate fee"}, "processing_time": "2 days, 2 hours, and 5 minutes", "person_responsible": staff + ["City Vice Mayor"],
    },
    "Special Mayor’s Permit Issuance": {
        "plain_language_name": "Special Event and Advertising Permit", "classification": "Simple", "type_of_transaction": "G2C/G2B/G2G - Government to Client, Business, or Government", "who_may_avail": "Individuals, businesses, alliances, societies, and government offices conducting covered events or advertising",
        "requirements": [
            {"requirement": "Approved request letter and design for banner, tarpaulin, or advertisement", "where_to_secure": "Office of the City Mayor or City Administrator; design provided by applicant"},
            {"requirement": "Approved request with PNP, CMO-TTM, and Barangay clearances plus notarized Affidavit of Undertaking for parades, motorcades, or special events", "where_to_secure": "Relevant city offices, PNP, Barangay, and Notary Public"},
            {"requirement": "Approved request and BFP Clearance for fireworks", "where_to_secure": "Office of the City Mayor or City Administrator and BFP"},
            {"requirement": "Approved request with CEEMO clearance for a booth", "where_to_secure": "Office of the City Mayor or City Administrator and CEEMO"},
            {"requirement": "Approved request, Engineering Clearance, and Barangay Clearance for a peryahan", "where_to_secure": "City Mayor or Administrator, City Engineer, and Barangay Hall"},
        ],
        "client_steps": [
            {"step": 1, "action": "Submit the request and wait for notice of approval, requirements, and applicable fees.", "processing_time": "40 minutes"},
            {"step": 2, "action": "Proceed to CBPLO, confirm identity, and verify the unsigned permit.", "processing_time": "25 minutes"},
            {"step": 3, "action": "Pay the applicable fee, sign the logbook, and receive the signed permit.", "processing_time": "1 hour and 5 minutes"},
        ],
        "fees": {"amount": "Varies", "description": "Fees vary by activity."}, "fee_schedule": [{"name": "Motorcade or parade", "amount": "₱500"}, {"name": "Banner or tarpaulin", "amount": "₱1,000"}, {"name": "Booth", "amount": "₱300 per day plus ₱1,200 garbage fee"}, {"name": "Peryahan", "amount": "₱4,000 plus ₱3,000 garbage fee"}],
        "processing_time": "2 hours and 10 minutes", "person_responsible": staff + ["Office of the City Treasurer"],
    },
    "Gaffler/Peddler Permit Issuance": {
        "plain_language_name": "Peddler Permit", "classification": "Simple", "type_of_transaction": "G2C - Government to Citizen", "who_may_avail": "Anyone applying to practice the covered occupation",
        "requirements": [{"requirement": "Previous Permit for renewal (original)", "where_to_secure": "Client file or CBPLO"}, {"requirement": "Current Barangay Clearance (original)", "where_to_secure": "Barangay Hall where the applicant resides"}, {"requirement": "Valid Community Tax Certificate (original)", "where_to_secure": "Barangay Hall or City Treasurer's Office"}],
        "client_steps": [{"step": 1, "action": "Submit the documents for review, encoding, and printing of the unsigned permit.", "processing_time": "20 minutes"}, {"step": 2, "action": "Pay the fee, sign the logbook, and receive the signed permit.", "processing_time": "42 minutes"}],
        "fees": {"amount": "₱400", "description": "Permit fee"}, "processing_time": "1 hour and 2 minutes", "person_responsible": staff + ["Office of the City Treasurer"],
    },
    "Certifications Issuance": {
        "plain_language_name": "Business Record Certification", "classification": "Simple", "type_of_transaction": "G2C/G2B/G2G - Government to Client, Business, or Government", "who_may_avail": "Business owners, representatives, government agencies, or persons requesting verification of a city business record",
        "requirements": [{"requirement": "Approved request letter (original)", "where_to_secure": "Office of the City Mayor or City Administrator"}, {"requirement": "Business owner's Consent Letter when required", "where_to_secure": "Business owner"}, {"requirement": "Requesting party's valid ID (original and 1 photocopy)", "where_to_secure": "Government issuing agency"}],
        "client_steps": [{"step": 1, "action": "Submit the request and wait for notification of approval and fees.", "processing_time": "40 minutes"}, {"step": 2, "action": "Proceed to CBPLO, confirm identity, and verify the unsigned certification.", "processing_time": "35 minutes"}, {"step": 3, "action": "Pay the fee, sign the logbook, and receive the certification.", "processing_time": "50 minutes"}],
        "fees": {"amount": "₱50", "description": "Business certification fee"}, "processing_time": "2 hours and 5 minutes", "person_responsible": staff + ["Office of the City Treasurer"],
    },
    "Amendment on Business Permit Processing": {
        "plain_language_name": "Amend a Business Permit", "classification": "Simple", "type_of_transaction": "G2C/G2B/G2G - Government to Citizen, Business, or Government", "who_may_avail": "Owners of a valid Meycauayan business permit or their authorized representatives",
        "requirements": [{"requirement": "Affidavit for a sole proprietorship or Board Resolution for a corporation (original and 2 photocopies)", "where_to_secure": "Notary Public or corporation"}, {"requirement": "Updated Locational Clearance (original and 2 photocopies)", "where_to_secure": "City Planning and Development Office"}, {"requirement": "Application form approved by the City Engineer and Planning Office", "where_to_secure": "Client, City Engineer, and Planning Office"}] + rep,
        "client_steps": [{"step": 1, "action": "Submit the application and documents and receive the Order of Payment.", "processing_time": "15 minutes"}, {"step": 2, "action": "Pay the amendment fee and secure the Official Receipt.", "processing_time": "15 minutes"}, {"step": 3, "action": "Submit the receipt and documents while records and the permit are updated and approved.", "processing_time": "2 days and 1 hour and 2 minutes"}, {"step": 4, "action": "Sign the logbook and receive the amended permit.", "processing_time": "15 minutes"}],
        "fees": {"amount": "₱50", "description": "Business-permit amendment fee"}, "processing_time": "2 days, 1 hour, and 42 minutes", "person_responsible": staff + ["City Mayor", "Office of the City Treasurer"],
    },
}

data = json.loads(PATH.read_text(encoding="utf-8")); found = set()
for service in data["services"]:
    if service["service_name"] in updates:
        service.update(updates[service["service_name"]]); found.add(service["service_name"])
special_name = "Special Mayor’s Permit Issuance"
if special_name not in found:
    special = {
        "service_number": "CC-64",
        "service_name": special_name,
        "office_division": "Office of the City Business Permit and Licensing Officer",
        "category_override": "business-trade-investment",
        "charter_page": 64,
        "pdf_page": 65,
    }
    special.update(updates[special_name])
    data["services"].append(special)
    found.add(special_name)
missing = set(updates) - found
if missing: raise SystemExit(f"Services not found: {sorted(missing)}")
PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Transcribed {len(found)} CBPLO services")
