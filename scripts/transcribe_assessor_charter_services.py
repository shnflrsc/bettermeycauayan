import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "src/data/citizens-charter/citizens-charter.json"

staff = ["Assessment Clerk I", "Administrative Assistant III", "Draftsman I", "Administrative Aide IV", "Acting City Assessor", "Assistant City Assessor"]

updates = {
    "Tax Declaration Issuance": {
        "classification": "Simple", "type_of_transaction": "G2C/G2B/G2G - Government to Citizen, Business, or Government", "who_may_avail": "Property owners or authorized representatives",
        "requirements": [
            {"requirement": "Land Title (1 certified true copy, or photocopy with original for verification)", "where_to_secure": "Owner's file or Registry of Deeds"},
            {"requirement": "Applicable Deed of Conveyance (1 photocopy)", "where_to_secure": "Owner's file or Registry of Deeds"},
            {"requirement": "BIR Certificate Authorizing Registration (1 photocopy)", "where_to_secure": "Bureau of Internal Revenue"},
            {"requirement": "Transfer Tax Receipt (1 photocopy)", "where_to_secure": "City Treasurer's Office"},
            {"requirement": "Latest Real Property Tax Receipt or Tax Clearance (1 photocopy)", "where_to_secure": "City Treasurer's Office"},
            {"requirement": "Valid government-issued ID", "where_to_secure": "Government issuing agency"},
            {"requirement": "SPA or Authorization Letter if filed by a representative", "where_to_secure": "Property owner"},
            {"requirement": "Affidavit of Publication for extrajudicial settlement", "where_to_secure": "Client"},
            {"requirement": "Approved Subdivision Plan for partition or subdivision", "where_to_secure": "Client or approving authority"},
            {"requirement": "Registry of Deeds certification if records for correction are unavailable", "where_to_secure": "Registry of Deeds"},
            {"requirement": "Building or Occupancy Permit for a new assessment", "where_to_secure": "Office of the City Engineer"},
            {"requirement": "Machinery Official Receipt and company certification for newly installed machinery", "where_to_secure": "Machine supplier or company"},
            {"requirement": "Secretary's Certificate if the applicant is a corporation", "where_to_secure": "Corporation"},
        ],
        "client_steps": [
            {"step": 1, "action": "Submit the application and complete documents for recording and authenticity checking.", "processing_time": "5 minutes"},
            {"step": 2, "action": "Wait while ownership, tax-map, and RPAS records are verified.", "processing_time": "10 minutes"},
            {"step": 3, "action": "If required, await and assist in the ocular inspection.", "processing_time": "Depends on property location"},
            {"step": 4, "action": "Pay the applicable fee and present proof of payment.", "processing_time": "5 minutes"},
            {"step": 5, "action": "Wait while the Tax Declaration, FAAS, Notice of Assessment, or certified copy is prepared.", "processing_time": "10 minutes per Tax Declaration"},
            {"step": 6, "action": "Wait for review and approval.", "processing_time": "15 minutes"},
            {"step": 7, "action": "Present a valid ID or SPA and claim the sealed document.", "processing_time": "5 minutes"},
        ],
        "fees": {"amount": "₱50-₱100", "description": "₱100 for transfer, correction, partition/subdivision, new assessment, reassessment, or reclassification; ₱50 for a Certified True Copy of Tax Declaration."},
        "fee_schedule": [{"name": "Tax Declaration transaction", "amount": "₱100"}, {"name": "Certified True Copy of Tax Declaration", "amount": "₱50"}],
        "processing_time": "50 minutes, excluding any required ocular inspection", "person_responsible": staff,
    },
    "Different Certifications Issuance": {
        "plain_language_name": "Property Certifications", "classification": "Highly Technical", "type_of_transaction": "G2C/G2B/G2G - Government to Client, Business, or Government", "who_may_avail": "Property owners or authorized representatives",
        "requirements": [
            {"requirement": "Land Title (1 certified true copy, or photocopy with original for verification)", "where_to_secure": "Registry of Deeds or property owner"},
            {"requirement": "Written Request (1 original copy)", "where_to_secure": "Client or representative"},
            {"requirement": "Owner's Authorization Letter if filed by another person (1 original copy)", "where_to_secure": "Property owner"},
            {"requirement": "Latest Real Property Tax Receipt for the land (original or photocopy)", "where_to_secure": "City Treasurer's Office or client"},
            {"requirement": "Secretary's Certificate if the applicant is a corporation", "where_to_secure": "Corporation"},
        ],
        "client_steps": [
            {"step": 1, "action": "Submit the application and documents for recording and validation.", "processing_time": "15 minutes"},
            {"step": 2, "action": "Receive the Order of Payment and pay the certification fee.", "processing_time": "5 minutes"},
            {"step": 3, "action": "If required, await an ocular inspection for improvement or actual-use certification.", "processing_time": "Depends on property location"},
            {"step": 4, "action": "Wait while the certification is prepared.", "processing_time": "15 minutes"},
            {"step": 5, "action": "Wait for review and approval.", "processing_time": "5 minutes"},
            {"step": 6, "action": "Present a valid ID or SPA and claim the signed, stamped, and sealed certification.", "processing_time": "5 minutes"},
        ],
        "fees": {"amount": "₱50", "description": "Certification fee under City Ordinance No. 1, Series of 2006, Section 352(d)."},
        "processing_time": "45 minutes, excluding any required ocular inspection", "person_responsible": staff,
    },
    "Notice of Cancellation (Building/Machinery) Issuance": {
        "plain_language_name": "Building or Machinery Assessment Cancellation", "classification": "Simple", "type_of_transaction": "G2C/G2B/G2G - Government to Citizen, Business, or Government", "who_may_avail": "Property owners or authorized representatives",
        "requirements": [
            {"requirement": "Written Request (1 original copy)", "where_to_secure": "Client"},
            {"requirement": "Latest Real Property Tax Receipt (1 photocopy)", "where_to_secure": "Client or City Treasurer's Office"},
            {"requirement": "Picture of the property (1 photocopy)", "where_to_secure": "Client"},
            {"requirement": "Secretary's Certificate if the applicant is a corporation", "where_to_secure": "Corporation"},
        ],
        "client_steps": [
            {"step": 1, "action": "Present the complete requirements for records verification, ocular inspection, cancellation, review, and signature.", "processing_time": "15 minutes plus inspection time based on property location"},
            {"step": 2, "action": "Receive the signed Notice of Cancellation after assignment of a control number and annotation of the Field Appraisal Assessment Sheet.", "processing_time": "5 minutes"},
        ],
        "fees": {"amount": "None", "description": "No fee"}, "processing_time": "20 minutes, excluding travel for ocular inspection", "person_responsible": staff,
    },
    "Notice of Assessment Issuance": {
        "classification": "Simple", "type_of_transaction": "G2C/G2B/G2G - Government to Client, Business, or Government", "who_may_avail": "Property owners or authorized representatives",
        "requirements": [
            {"requirement": "Latest Real Property Tax Receipt (original or photocopy)", "where_to_secure": "Client or City Treasurer's Office"},
            {"requirement": "Transfer Certificate of Title (1 certified true copy, or photocopy with original for verification)", "where_to_secure": "Registry of Deeds or client"},
            {"requirement": "Documents concerning the property (1 original copy)", "where_to_secure": "Client"},
            {"requirement": "SPA or owner Authorization Letter if filed by a representative", "where_to_secure": "Property owner"},
            {"requirement": "Valid government-issued IDs of the owner and authorized representative (1 photocopy each)", "where_to_secure": "Government issuing agency"},
            {"requirement": "Secretary's Certificate if the applicant is a corporation", "where_to_secure": "Corporation"},
        ],
        "client_steps": [{"step": 1, "action": "Submit all documents for verification and issuance of the Notice of Assessment.", "processing_time": "10 minutes"}],
        "fees": {"amount": "None", "description": "No fee"}, "processing_time": "10 minutes", "person_responsible": staff[:4],
    },
}

data = json.loads(PATH.read_text(encoding="utf-8"))
found = set()
for service in data["services"]:
    if service["service_name"] in updates:
        service.update(updates[service["service_name"]])
        found.add(service["service_name"])
missing = set(updates) - found
if missing:
    raise SystemExit(f"Services not found: {sorted(missing)}")
PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Transcribed {len(found)} Office of the City Assessor services")
