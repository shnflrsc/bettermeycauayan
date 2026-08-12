import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "src/data/citizens-charter/citizens-charter.json"

updates = {
    "Marriage Solemnization": {
        "classification": "Simple",
        "type_of_transaction": "G2C - Government to Citizen",
        "who_may_avail": "Couples where at least one contracting party is a resident of the City of Meycauayan",
        "requirements": [{"requirement": "Marriage License (1 original copy)", "where_to_secure": "Office of the City Civil Registrar, 1st Floor, City Hall, Saluysoy"}],
        "client_steps": [
            {"step": 1, "action": "Present the marriage license for verification and issuance of an order of payment.", "processing_time": "5 minutes"},
            {"step": 2, "action": "Present the order of payment at the City Treasurer cashier, pay the fee, and secure the Official Receipt.", "processing_time": "5 minutes"},
            {"step": 3, "action": "Present the Official Receipt at the Office of the City Mayor and receive the marriage-ceremony schedule.", "processing_time": "5 minutes"},
            {"step": 4, "action": "Return on the scheduled date with two witnesses for the marriage solemnization and instructions on certificate release.", "processing_time": "35 minutes"},
            {"step": 5, "action": "Return on the scheduled release date and receive the Certificate of Marriage.", "processing_time": "5 minutes"},
        ],
        "fees": {"amount": "₱200.00", "description": "Marriage solemnization fee"},
        "processing_time": "55 minutes",
        "person_responsible": ["Administrative Aide I, Office of the City Mayor", "City Mayor", "City Treasurer cashier personnel"],
    },
    "Redemption of Impounded Vehicles": {
        "classification": "Simple",
        "type_of_transaction": "G2C - Government to Client",
        "who_may_avail": "Motorists and drivers",
        "requirements": [
            {"requirement": "Official Receipt for payment of fines and penalties (1 original and 1 photocopy)", "where_to_secure": "Office of the City Treasurer"},
            {"requirement": "Vehicle Official Receipt and Certificate of Registration", "where_to_secure": "Land Transportation Office or vehicle owner"},
            {"requirement": "One valid ID", "where_to_secure": "Motorist or vehicle owner"},
        ],
        "client_steps": [
            {"step": 1, "action": "Present the Official Receipt, vehicle OR/CR, and valid ID for verification of the records and impounded vehicle.", "processing_time": "15 minutes"},
            {"step": 2, "action": "Claim the vehicle after verification; personnel will record and release it.", "processing_time": "15 minutes"},
        ],
        "fees": {"amount": "Varies", "description": "Applicable traffic fines and penalties must be paid before release."},
        "processing_time": "30 minutes",
        "person_responsible": ["City Government Department Head I, CMO Transportation and Traffic Management Division"],
    },
    "Traffic Adjudication": {
        "classification": "Simple",
        "type_of_transaction": "G2C - Government to Client",
        "who_may_avail": "Motorists and drivers contesting a traffic apprehension or citation",
        "requirements": [
            {"requirement": "Traffic Violation Receipt or Apprehension Ticket", "where_to_secure": "Traffic Enforcer"},
            {"requirement": "Valid Driver's License", "where_to_secure": "Land Transportation Office"},
            {"requirement": "Vehicle Official Receipt and Certificate of Registration, if applicable", "where_to_secure": "Land Transportation Office"},
            {"requirement": "Letter of complaint or contest stating the reasons for contesting the citation", "where_to_secure": "Prepared by the motorist"},
            {"requirement": "Authorization Letter and representative's ID, if applicable", "where_to_secure": "Motorist or driver"},
        ],
        "client_steps": [
            {"step": 1, "action": "Submit the complaint or contest letter with all supporting documents for recording and review.", "processing_time": "1 hour"},
            {"step": 2, "action": "Wait for notification of the hearing schedule while the complaint is evaluated.", "processing_time": "1 working day"},
            {"step": 3, "action": "Attend the adjudication hearing for deliberation and resolution.", "processing_time": "2 working days"},
            {"step": 4, "action": "Receive the written decision or resolution.", "processing_time": "2 working days"},
        ],
        "fees": {"amount": "None", "description": "No fee"},
        "processing_time": "Up to 5 working days; complex concerns referred to the City Legal Officer and City Administrator may take 7-15 working days",
        "person_responsible": ["City Government Department Head I, CMO Transportation and Traffic Management Division", "City Legal Officer", "City Administrator"],
    },
    "Clamping and Unlocking of Illegal Parked Vehicles": {
        "classification": "Simple",
        "type_of_transaction": "G2C - Government to Client",
        "who_may_avail": "Meycauayan residents and vehicle owners",
        "requirements": [
            {"requirement": "Official Receipt for payment of the clamping fine", "where_to_secure": "Office of the City Treasurer or cashier"},
            {"requirement": "Valid ID or Driver's License", "where_to_secure": "Land Transportation Office or issuing agency"},
            {"requirement": "Vehicle Certificate of Registration and Official Receipt for verification", "where_to_secure": "Land Transportation Office"},
            {"requirement": "Violation Notice", "where_to_secure": "Clamping Enforcer"},
            {"requirement": "Authorization Letter and representative's ID, if the claimant is not the owner", "where_to_secure": "Vehicle owner"},
        ],
        "client_steps": [
            {"step": 1, "action": "Proceed to the clamped vehicle and ask the enforcer about the violation and required penalty.", "processing_time": "5 minutes"},
            {"step": 2, "action": "Secure the Violation Notice and pay the corresponding fine at the Office of the City Treasurer.", "processing_time": "15-30 minutes"},
            {"step": 3, "action": "Present the Official Receipt and supporting documents to CMO-MTTM personnel for verification.", "processing_time": "5 minutes"},
            {"step": 4, "action": "Wait for the wheel clamp to be removed.", "processing_time": "1 hour"},
            {"step": 5, "action": "Receive the acknowledgement or release slip, if applicable.", "processing_time": "5 minutes"},
        ],
        "fees": {"amount": "₱500-₱5,000", "description": "₱500 for two- or three-wheeled vehicles; ₱1,500 for four-wheeled vehicles; ₱5,000 for vehicles with six wheels or more."},
        "fee_schedule": [
            {"name": "Two- or three-wheeled vehicle", "amount": "₱500"},
            {"name": "Four-wheeled vehicle", "amount": "₱1,500"},
            {"name": "Six wheels or more", "amount": "₱5,000"},
        ],
        "processing_time": "1 hour and 45 minutes",
        "person_responsible": ["CMO-MTTM personnel", "Clamping Enforcer", "Office of the City Treasurer cashier"],
    },
    "Application for Traffic Management Clearance": {
        "classification": "Complex",
        "type_of_transaction": "G2G/G2B - Government to Government / Government to Business",
        "who_may_avail": "Business establishments",
        "requirements": [
            {"requirement": "Signed request letter describing the project, work schedule, and location, addressed to the City Mayor through the CMO-TTM Head", "where_to_secure": "Provided by the client"},
            {"requirement": "Project vicinity map (original or photocopy)", "where_to_secure": "Client or Office of the City Engineer"},
            {"requirement": "Excavation Permit (1 copy)", "where_to_secure": "Office of the City Engineer for local roads or Provincial Engineer's Office for provincial roads"},
            {"requirement": "Barangay Permit (1 copy)", "where_to_secure": "Barangay Hall where the project is located"},
        ],
        "client_steps": [
            {"step": 1, "action": "Submit complete documents for review and receive the interview and assessment schedule.", "processing_time": "1 day and 30 minutes"},
            {"step": 2, "action": "Attend the scheduled interview and assessment while the clearance is prepared for review and signature.", "processing_time": "3 hours"},
            {"step": 3, "action": "Sign the clearance and wait for engineering comments, City Administrator review, and City Mayor approval.", "processing_time": "9 days"},
            {"step": 4, "action": "Receive the approved Traffic Management Clearance.", "processing_time": "30 minutes"},
        ],
        "fees": {"amount": "None", "description": "No fee"},
        "processing_time": "10 days, 3 hours, and 30 minutes",
        "turnaround_time": "Long-term projects are subject to monthly renewal.",
        "person_responsible": ["City Government Department Head I, CMO Transportation and Traffic Management Division", "Office of the City Engineer", "City Administrator", "City Mayor"],
    },
    "Admission for Reformation Program": {
        "classification": "Highly Technical",
        "type_of_transaction": "G2C - Government to Citizen",
        "who_may_avail": "Pushers listed in the PNP-PDEA Certified Barangay Anti-Drug Abuse Council Watchlist",
        "requirements": [
            {"requirement": "Affidavit of Undertakings (3 original copies)", "where_to_secure": "Notary Public"},
            {"requirement": "Valid government-issued ID (1 photocopy with 3 specimen signatures)", "where_to_secure": "Government issuing agency"},
            {"requirement": "Certificate of Indigency (1 original copy)", "where_to_secure": "Barangay Hall where the client resides"},
            {"requirement": "Referral or Endorsement Letter (1 original copy)", "where_to_secure": "Barangay Captain or Barangay Hall where the client resides"},
            {"requirement": "Medical Certificate with laboratory results, if the client has a medical condition (1 original copy)", "where_to_secure": "City Health Unit physician or private physician"},
        ],
        "client_steps": [
            {"step": 1, "action": "Submit all requirements for watchlist verification, interview, intake, orientation, enrollment, and issuance of the Certificate of Enrollment.", "processing_time": "1 day, 2 hours, and 35 minutes"},
            {"step": 2, "action": "Receive the Certificate of Enrollment.", "processing_time": "Included above"},
            {"step": 3, "action": "Complete the three-phase reformation program: 31-day in-house formation, 31-day live-out livelihood training, and 31-day barangay community service. Drug testing is required after each phase.", "processing_time": "93 days plus 1 day for graduation preparation"},
            {"step": 4, "action": "Attend graduation and receive the Certificate of Completion.", "processing_time": "4 hours"},
        ],
        "fees": {"amount": "None", "description": "No fee"},
        "processing_time": "95 days, 6 hours, and 35 minutes",
        "person_responsible": ["Social Welfare Officer IV, Balay Silangan Reformation Center", "Balay Silangan support staff", "City Health Officer", "City Anti-Drug Abuse Council", "Philippine Drug Enforcement Agency"],
    },
    "Provision of Financial Assistance to Reformist": {
        "classification": "Simple",
        "type_of_transaction": "G2C - Government to Citizen",
        "who_may_avail": "Reformists of the Balay Silangan Reformation Center in Meycauayan",
        "requirements": [
            {"requirement": "Valid government-issued ID (1 photocopy with 3 specimen signatures)", "where_to_secure": "Government issuing agency"},
            {"requirement": "Certificate of Indigency (1 original copy)", "where_to_secure": "Barangay Hall where the reformist resides"},
            {"requirement": "Certificate of Enrollment", "where_to_secure": "City Mayor's Office - Balay Silangan Reformation Center"},
        ],
        "client_steps": [
            {"step": 1, "action": "Submit all requirements for review, interview, assessment, Social Case Study preparation, and processing of financial-assistance documents.", "processing_time": "1 day, 1 hour, and 10 minutes"},
            {"step": 2, "action": "Receive the financial assistance on the scheduled release date.", "processing_time": "1 hour"},
        ],
        "fees": {"amount": "None", "description": "No fee"},
        "processing_time": "1 day, 2 hours, and 30 minutes",
        "person_responsible": ["Social Welfare Officer IV, Balay Silangan Reformation Center", "Senior Administrative Assistant II, City Treasurer's Office"],
    },
}

data = json.loads(PATH.read_text(encoding="utf-8"))
found = set()
for service in data["services"]:
    update = updates.get(service["service_name"])
    if update:
        service.update(update)
        found.add(service["service_name"])

missing = set(updates) - found
if missing:
    raise SystemExit(f"Services not found: {sorted(missing)}")

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Transcribed {len(found)} Office of the City Mayor services")
