import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "src/data/citizens-charter/citizens-charter.json"
OFFICE = "Economic Enterprise Management Division - Office of the City Administrator"
STAFF = ["OIC, CAdO-EEM", "Market Supervisor III", "Administrative Aide I", OFFICE]


def req(requirement, source):
    return {"requirement": requirement, "where_to_secure": source}


def step(number, action, agency_action, fee, time, people=None):
    return {
        "step": number,
        "action": action,
        "agency_action": agency_action,
        "fees": fee,
        "processing_time": time,
        "person_responsible": people or STAFF,
    }


updates = {
    "Public Utility Vehicle Registration": {
        "plain_language_name": "Meycauayan Common Transport Terminal PUV Registration",
        "requirements": [
            req("Accomplished registration form", "Economic Enterprise Management Division - Meycauayan Common Transport Terminal"),
            req("Business Permit of the transport organization (original and 1 photocopy)", "Transport organization"),
            req("Policy of Organization (original and 1 photocopy)", "Transport organization"),
            req("Proof of Consolidation (original and 1 photocopy)", "Land Transportation Franchising and Regulatory Board (LTFRB)"),
            req("Updated Franchise Verification (original and 1 photocopy)", "Land Transportation Franchising and Regulatory Board (LTFRB)"),
            req("Updated Official Receipt and Certificate of Registration (original and 1 photocopy)", "Land Transportation Office (LTO)"),
            req("Government-issued ID of the PUV operator (original and 1 photocopy)", "LTO, Post Office, PSA, SSS, GSIS, or Pag-IBIG"),
            req("Driver's license of the PUV driver (original and 1 photocopy)", "Land Transportation Office (LTO)"),
        ],
        "client_steps": [
            step(1, "Submit the accomplished registration form and complete requirements, then present the vehicle for inspection.", "Receive the application, review and validate the documents, inspect the vehicle, and approve the application.", "None", "30 minutes per application and vehicle", ["Administrative Aide I", "Special Operations Officer II", "OIC, CAdO-EEM", OFFICE]),
            step(2, "Pay the registration fee.", "Receive the payment and record the transaction in the logbook.", "UV Express van or minibus: PHP 1,000; traditional or modern jeepney: PHP 500", "10 minutes", ["Administrative Aide", "Special Operations Officer II", OFFICE]),
            step(3, "Receive the LGU official receipt and official sticker.", "Issue the official receipt and sticker, then report the registration collection.", "None", "15 minutes", ["Administrative Aide", "Special Operations Officer II", OFFICE]),
        ],
        "fees": {"amount": "PHP 500-PHP 1,000", "description": "UV Express van or minibus: PHP 1,000; traditional or modern jeepney: PHP 500."},
        "processing_time": "55 minutes",
        "person_responsible": ["Administrative Aide I", "Special Operations Officer II", "OIC, CAdO-EEM", OFFICE],
    },
    "Tanghalang Meycaueño Fee Payment": {
        "plain_language_name": "Tanghalang Meycaueño Reservation and Rental",
        "requirements": [],
        "client_steps": [
            step(1, "Verify the availability of the preferred date.", "Assist the client who wishes to rent or use Tanghalang Meycaueño.", "None", "5 minutes"),
            step(2, "Complete the Tanghalang Meycaueño Reservation Policies form.", "Process and sign the form, then release the client's copy.", "None", "5 working days"),
            step(3, "Pay the applicable reservation or rental fee and secure the official receipt.", "Receive payment and issue the official receipt.", "See the schedule of fees", "5 minutes"),
        ],
        "fees": {
            "amount": "See schedule",
            "description": "First 6 hours: PHP 20,000 for Meycauayan residents or PHP 30,000 for non-residents. Lights and sound system: PHP 5,000. Each succeeding hour: PHP 4,000 for residents or PHP 5,000 for non-residents.",
        },
        "processing_time": "5 working days and 10 minutes",
        "person_responsible": ["Ticket Checker", "Administrative Aide I", "Market Supervisor III", OFFICE],
    },
    "Meycauayan Sport Complex and Basketball Court Fee Payment": {
        "plain_language_name": "Meycauayan Sports Complex and Courts Reservation",
        "requirements": [],
        "client_steps": [
            step(1, "Verify the availability of the preferred date.", "Assist the client who wishes to rent or use the Meycauayan Sports Complex.", "None", "5 minutes"),
            step(2, "Complete the Meycauayan Sports Complex Reservation Policies form.", "Process and sign the form, then release the client's copy.", "None", "5 working days"),
            step(3, "Pay the applicable reservation or rental fee and secure the official receipt.", "Receive payment and issue the official receipt.", "See the schedule of fees", "5 minutes"),
        ],
        "fees": {
            "amount": "See schedule",
            "description": "Track and field oval for 6 hours: PHP 10,000 for residents or PHP 15,000 for non-residents; succeeding hour PHP 2,000. Basketball court: PHP 200-PHP 350 per hour depending on daytime/nighttime and timer use; free public use from 6:00-8:00 AM, first come first served. Multi-purpose hall: PHP 5,000 for the first 6 hours plus PHP 500 per succeeding hour. Tennis: PHP 60 per player for singles or PHP 30 per player for doubles. Electrical equipment: PHP 100-PHP 300 based on wattage.",
        },
        "processing_time": "5 working days and 15 minutes",
        "person_responsible": STAFF,
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
print(f"Transcribed {len(found)} Economic Enterprise Management services")
