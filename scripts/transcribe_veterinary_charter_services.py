import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "src/data/citizens-charter/citizens-charter.json"
OFFICE = "Office of the City Veterinarian"
VETS = ["City Veterinarian", "Veterinarian I", OFFICE]


def req(requirement, source):
    return {"requirement": requirement, "where_to_secure": source}


def step(number, action, agency_action, fee, time, people=None):
    return {"step": number, "action": action, "agency_action": agency_action, "fees": fee, "processing_time": time, "person_responsible": people or VETS}


updates = {
    "Butcher and Meat Handler’s License Issuance": {
        "plain_language_name": "Butcher and Meat Handler License",
        "classification": "Simple",
        "type_of_transaction": "G2C - Government to Client",
        "requirements": [
            req("Drug-free report (original; butchers only)", "Authorized drug-testing institution"),
            req("National Police Clearance (original and 1 photocopy; butchers only)", "Philippine National Police"),
            req("Health Card (original and 1 photocopy)", "Office of the City Health Officer"),
            req("Application Form", OFFICE),
            req("One 1x1 ID picture", "Applicant"),
            req("For renewal: seminar attendance certificate (1 photocopy) and expired license", OFFICE),
        ],
        "client_steps": [
            step(1, "Complete the application form and submit all requirements.", "Review the submission, mark it complete or incomplete, issue an order of payment when complete, or return it with the reason for incompleteness.", "None", "40 minutes"),
            step(2, "Pay at the City Treasurer's cashier and secure the official receipt.", "Receive payment and issue the official receipt.", "PHP 300", "15 minutes", ["Senior Administrative Assistant I", "Administrative Assistant V", "Administrative Aide I", "Office of the City Treasurer"]),
            step(3, "Present the official receipt.", "Prepare the license for signature and record its details in the logbook.", "None", "20 minutes"),
            step(4, "Sign the logbook and receive the license.", "Release the Butcher or Meat Handler License.", "None", "5 minutes"),
        ],
        "fees": {"amount": "PHP 300", "description": "Butcher or Meat Handler License fee under the Meycauayan City Veterinary Code and Revised Revenue Code."},
        "processing_time": "1 hour and 20 minutes",
        "person_responsible": VETS,
    },
    "Veterinary Health Certificate Issuance for Travel": {
        "plain_language_name": "Veterinary Health Certificate for Pet Travel",
        "classification": "Simple",
        "type_of_transaction": "G2C - Government to Client",
        "requirements": [
            req("Updated Vaccination Card or E-Health Card", "Office of the City Veterinarian or licensed veterinarian/clinic"),
            req("Pet owner's valid ID", "Government issuing agency"),
            req("Smartphone with a valid SIM card", "Provided by the client"),
            req("Dog or cat to be examined", "Pet owner"),
        ],
        "client_steps": [
            step(1, "Present the valid ID and vaccination or E-Health Card, then complete the Client and Pet Data Slip.", "Verify the records, ask for the travel date and destination, and provide the data slip.", "None", "10 minutes"),
            step(2, "Properly restrain the pet for examination.", "Assess the pet using the Pet Health Checklist. Only an apparently healthy pet, including one with a minor non-infectious infirmity, is recommended for certification.", "None", "30 minutes"),
            step(3, "Pay at the City Treasurer's cashier and secure the official receipt.", "Receive payment and issue the official receipt.", "PHP 50", "15 minutes", ["Senior Administrative Assistant I", "Administrative Assistant V", "Administrative Aide I", "Office of the City Treasurer"]),
            step(4, "Present the official receipt.", "Prepare the Veterinary Health Certificate in duplicate and affix the dry seal.", "None", "10 minutes"),
            step(5, "Sign the duplicate copy and receive the certificate.", "Release the Veterinary Health Certificate.", "None", "5 minutes"),
        ],
        "fees": {"amount": "PHP 50", "description": "Veterinary Health Certificate fee."},
        "processing_time": "1 hour and 10 minutes",
        "person_responsible": VETS,
    },
    "Microchip Implantation for Dogs": {
        "plain_language_name": "Dog Microchip Implantation",
        "classification": "Simple",
        "type_of_transaction": "G2C - Government to Client",
        "requirements": [
            req("Dog owner's valid ID", "Government issuing agency"),
            req("Smartphone with a valid SIM card and the owner's online account", "Provided by the client; City Veterinarian staff can help create the account"),
            req("Dog and its Vaccination Card or E-Health Card", "Dog owner and Office of the City Veterinarian"),
        ],
        "client_steps": [
            step(1, "Present the owner's ID and online account together with the dog's vaccination or E-Health Card.", "Verify the owner's ID and account and the dog's vaccination status and age; assist with account creation when needed.", "None", "10 minutes"),
            step(2, "Properly restrain the dog for examination.", "Assess the dog using the Pet Health Checklist. Sick dogs, dogs without anti-rabies vaccination, and dogs under 6 months are deferred.", "None", "30 minutes"),
            step(3, "Properly restrain the eligible dog for microchipping.", "Implant and scan the microchip, scan its QR code using the owner's phone, and provide post-implantation instructions.", "None", "20 minutes"),
        ],
        "fees": {"amount": "None", "description": "No fee"},
        "processing_time": "60 minutes",
        "person_responsible": VETS,
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
print(f"Transcribed {len(found)} City Veterinarian services")
