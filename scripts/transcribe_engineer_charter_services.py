import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "src/data/citizens-charter/citizens-charter.json"
staff = ["Acting City Engineer", "Building Inspector I", "Engineering Assistant", "Administrative Aide IV", "Engineering Staff", "Office of the City Treasurer"]

def req(name, source): return {"requirement": name, "where_to_secure": source}
def standard_steps(review="10 minutes", assessment="20 minutes", release="23 minutes"):
    return [
        {"step": 1, "action": "Submit the filled-out application and complete requirements for review.", "processing_time": review},
        {"step": 2, "action": "Assist during the scheduled ocular inspection.", "processing_time": "1 day (as scheduled)"},
        {"step": 3, "action": "Wait for the Order of Payment, pay at the City Treasurer, and secure the Official Receipt.", "processing_time": assessment},
        {"step": 4, "action": "Present the Official Receipt and receive the prepared and approved permit or certificate.", "processing_time": release},
    ]

updates = {
"Certificate of Final Electrical Inspection Issuance": {
 "plain_language_name":"Certificate of Final Electrical Inspection","classification":"Simple","type_of_transaction":"G2C/G2B/G2G – Government to Citizen / Government to Business / Government to Government","who_may_avail":"All",
 "requirements":[req("MERALCO Yellow Card","MERALCO"),req("Certificate of Occupancy (1 photocopy)","Owner's copy or Office of the City Engineer"),req("Electrical Permit (original)","Owner's copy or Office of the City Engineer")],
 "client_steps":standard_steps("10 minutes","26 minutes","20 minutes"),"fees":{"amount":"₱30-₱150","description":"₱30 residential, ₱60 commercial, or ₱150 industrial."},"fee_schedule":[{"name":"Residential","amount":"₱30"},{"name":"Commercial","amount":"₱60"},{"name":"Industrial","amount":"₱150"}],"processing_time":"56 minutes, plus 1 day for inspection","person_responsible":staff},
"Mechanical Permit Issuance": {
 "plain_language_name":"Mechanical Permit","classification":"Simple","type_of_transaction":"G2C/G2B – Government to Citizen / Government to Business","who_may_avail":"Commercial and industrial establishments",
 "requirements":[req("Mechanical Permit forms","Office of the City Engineer"),req("Mechanical plan, signed and sealed (5 original copies)","Professional Mechanical Engineer"),req("Barangay Clearance (original and 1 photocopy)","Barangay Hall where the machinery is located"),req("Occupancy Permit (photocopy)","Owner"),req("Building Permit (photocopy)","Owner"),req("Community Tax Certificate (1 photocopy)","Barangay Hall or City Treasurer"),req("Latest Real Property Tax Receipt (1 photocopy)","Owner or City Treasurer")],
 "client_steps":standard_steps("10 minutes","36 minutes","23 minutes"),"fees":{"amount":"Varies","description":"Machinery capacity in kW × ₱60, based on the Order of Payment."},"processing_time":"1 hour and 9 minutes, plus 1 day for inspection","person_responsible":staff},
"Annual Mechanical Permit Issuance": {
 "plain_language_name":"Annual Mechanical Permit","classification":"Simple","type_of_transaction":"G2C/G2B – Government to Citizen / Government to Business","who_may_avail":"Commercial and industrial establishments",
 "requirements":[req("Annual Mechanical Permit form (2 copies)","Office of the City Engineer"),req("Mechanical layout, signed and sealed (3 original copies)","Professional Mechanical Engineer"),req("Latest Real Property Tax Receipt (1 photocopy)","Owner or City Treasurer"),req("Community Tax Certificate (1 photocopy)","Barangay Hall or City Treasurer"),req("Previously approved Mechanical Permit","Owner")],
 "client_steps":standard_steps("3 minutes","26 minutes","23 minutes"),"fees":{"amount":"Varies","description":"Same assessment as the Mechanical Permit fee."},"processing_time":"52 minutes, plus 1 day for inspection","person_responsible":staff},
"Annual Building Permit Issuance": {
 "plain_language_name":"Annual Building Permit","classification":"Simple","type_of_transaction":"G2C/G2B – Government to Citizen / Government to Business","who_may_avail":"Commercial and industrial establishments",
 "requirements":[req("Building Permit (1 photocopy)","Owner"),req("Occupancy Permit (1 photocopy)","Owner"),req("Community Tax Certificate (1 photocopy)","Barangay Hall or City Treasurer"),req("Latest Real Property Tax Receipt (1 photocopy)","Owner or City Treasurer")],
 "client_steps":standard_steps("3 minutes","26 minutes","23 minutes"),"fees":{"amount":"Varies","description":"Based on the Annual Building Permit Assessment Specification Table."},"fee_schedule":[{"name":"Requested inspection for single detached dwelling or duplex","amount":"₱120 per service"},{"name":"Commercial/industrial/institutional, up to 100 m²","amount":"₱120"},{"name":"Above 100–200 m²","amount":"₱240"},{"name":"Above 200–350 m²","amount":"₱480"},{"name":"Above 350–500 m²","amount":"₱720"},{"name":"Above 500–750 m²","amount":"₱960"},{"name":"Above 750–1,000 m²","amount":"₱1,200"}],"processing_time":"52 minutes, plus 1 day for inspection","person_responsible":staff},
"Demolition Permit Issuance": {
 "plain_language_name":"Demolition Permit","classification":"Simple","type_of_transaction":"G2C/G2B/G2G – Government to Citizen / Government to Business / Government to Government","who_may_avail":"All",
 "requirements":[req("Photograph of the structure","Owner"),req("Vicinity Map (original and 2 photocopies)","Owner"),req("Floor plan (3 sets)","Licensed Civil Engineer or Architect"),req("Notarized Demolition Permit form, signed and sealed","Office of the City Engineer"),req("Barangay Clearance (original and 1 photocopy)","Barangay Hall where the demolition is located"),req("Community Tax Certificate","Barangay Hall or City Treasurer"),req("Title and Tax Declaration","Owner"),req("DOLE Construction Safety and Health Program (original and 1 photocopy)","DOLE Malolos")],
 "client_steps":standard_steps("10 minutes","46 minutes","23 minutes"),"fees":{"amount":"Varies","description":"Floor area × ₱7 up to 10 meters in height, with the Charter-listed additional height assessment."},"processing_time":"1 hour and 9 minutes, plus 1 day for inspection","person_responsible":staff},
"Certificate of Change of Use Issuance": {
 "plain_language_name":"Certificate of Change of Building Use","classification":"Simple / Complex / Highly Technical","type_of_transaction":"G2C/G2B – Government to Citizen / Government to Business","who_may_avail":"Commercial and industrial establishments",
 "requirements":[req("Application form (2 copies)","Office of the City Engineer"),req("As-built plans, signed and sealed","Licensed Civil Engineer or Architect"),req("Contract of lease, certified true copy, when leased","Lessor"),req("Tax Declaration or Real Property record (2 photocopies)","City Assessor"),req("Building photographs","Owner"),req("Locational/Zoning Clearance for business","City Planning and Development Office"),req("Fire Safety Inspection Certificate","Bureau of Fire Protection"),req("Barangay Clearance","Barangay Hall"),req("SEC or DTI registration","SEC or DTI"),req("Certificate of Occupancy","Lessor or owner"),req("Environmental Compliance Certificate, when applicable","DENR/ECC Malolos")],
 "client_steps":standard_steps("30 minutes","36 minutes","50 minutes"),"fees":{"amount":"Varies","description":"Based on the assessment and Order of Payment."},"processing_time":"Simple: 3 hours 56 minutes; Complex: 1 day 2 hours 56 minutes; Highly Technical: 4 days 56 minutes; plus 1 inspection day","person_responsible":staff},
"Annual Electrical Permit Issuance": {
 "plain_language_name":"Annual Electrical Permit","classification":"Simple","type_of_transaction":"G2C/G2B – Government to Citizen / Government to Business","who_may_avail":"Industrial establishments",
 "requirements":[req("DOLE Order of Payment","DOLE Malolos or Pampanga")],"client_steps":[{"step":1,"action":"Present the DOLE Order of Payment for review.","processing_time":"3 minutes"},{"step":2,"action":"Receive the city Order of Payment, pay at the City Treasurer, and secure the Official Receipt.","processing_time":"16 minutes"},{"step":3,"action":"Receive the Annual Electrical Permit.","processing_time":"3 minutes"}],"fees":{"amount":"Varies","description":"Based on the DOLE Order of Payment."},"processing_time":"22 minutes","person_responsible":staff},
"Excavation and Ground Preparation Permit Issuance": {
 "plain_language_name":"Excavation and Ground Preparation Permit","classification":"Simple","type_of_transaction":"G2C/G2B – Government to Citizen / Government to Business","who_may_avail":"All",
 "requirements":[req("Excavation and Ground Preparation form (2 copies)","Office of the City Engineer"),req("TCT or Deed of Sale (1 photocopy)","Registry of Deeds or owner"),req("Barangay Clearance for excavation (original and 1 photocopy)","Barangay Hall where excavation is located"),req("Architectural and foundation plans with Bill of Materials, signed and sealed","Licensed Civil Engineer or Architect"),req("DOLE Construction Safety and Health Program (original and 1 photocopy)","DOLE Malolos"),req("Approved Letter of Intent","Office of the City Mayor")],
 "client_steps":standard_steps("3 minutes","26 minutes","23 minutes"),"fees":{"amount":"Varies","description":"Excavation volume in cubic meters × ₱3, plus ₱200 inspection and verification fees."},"processing_time":"52 minutes, plus 1 day for inspection","person_responsible":staff},
"Electronics Permit Issuance": {
 "plain_language_name":"Electronics Permit","classification":"Simple","type_of_transaction":"G2C/G2B – Government to Citizen / Government to Business","who_may_avail":"All",
 "requirements":[req("Electronics Permit form, plans, specifications, and Bill of Materials (5 copies)","Office of the City Engineer and licensed Electronics and Communications Engineer"),req("Barangay Clearance (original and 1 photocopy)","Barangay Hall where the building is located"),req("DOLE Construction Safety and Health Program (original and 1 photocopy)","DOLE Malolos"),req("Approved Letter of Intent","Office of the City Mayor")],
 "client_steps":standard_steps("3 minutes","26 minutes","13 minutes"),"fees":{"amount":"Varies","description":"₱1,000 per location plus ₱10 per fixture."},"processing_time":"42 minutes, plus 1 day for inspection","person_responsible":staff},
"Sign Permit/Billboard Issuance": {
 "plain_language_name":"Sign or Billboard Permit","classification":"Simple","type_of_transaction":"G2C/G2B – Government to Citizen / Government to Business","who_may_avail":"Commercial establishments",
 "requirements":[req("Sign Permit form (2 copies)","Office of the City Engineer"),req("Layout, signed and sealed (3 plan sets)","Licensed Civil Engineer or Architect"),req("Barangay Clearance (original and 1 photocopy)","Barangay Hall where the sign will be installed"),req("NGCP Clearance for structures along power lines","NGCP San Jose del Monte"),req("DPWH Clearance (original and 1 photocopy)","DPWH Bulacan 2nd District Engineering Office"),req("DOLE Construction Safety and Health Program (original and 1 photocopy)","DOLE Malolos")],
 "client_steps":standard_steps("3 minutes","26 minutes","13 minutes"),"fees":{"amount":"Varies","description":"Based on the Sign Permit Assessment Specification Table."},"processing_time":"42 minutes, plus 1 day for inspection","person_responsible":staff},
"Barangay Clearance Issuance": {
 "plain_language_name":"Engineering Barangay Clearance","classification":"Simple","type_of_transaction":"G2C/G2B – Government to Citizen / Government to Business","who_may_avail":"All",
 "requirements":[req("Accomplished Application Form (2 copies)","Office of the City Engineer"),req("Valid ID of owner or corporate secretary (original and 2 copies)","Applicant"),req("Special Power of Attorney or Board Resolution (original and 2 copies), when represented","Applicant")],
 "client_steps":[{"step":1,"action":"Submit the documents for review and receive the Order of Payment.","processing_time":"10 minutes"},{"step":2,"action":"Pay at the City Treasurer and secure the Official Receipt.","processing_time":"5 minutes"},{"step":3,"action":"Present the receipt and receive the clearance.","processing_time":"10 minutes"}],"fees":{"amount":"₱1,000","description":"Engineering Barangay Clearance fee"},"processing_time":"25 minutes","person_responsible":staff},
"Development Permit Issuance": {
 "plain_language_name":"Land Development Permit","classification":"Highly Technical","type_of_transaction":"G2C/G2B – Government to Citizen / Government to Business","who_may_avail":"All",
 "requirements":[req("Application letter for land reclassification, Development Permit, or subdivision-plan approval; corporate authority when applicable","Owner or corporation"),req("Project proposal","Owner or corporation"),req("Certified True Copy of Title","Registry of Deeds or owner"),req("SEC/DTI registration and Mayor's Permit, when applicable","SEC, DTI, or CBPLO"),req("Site Development Plan and vicinity/location map","Licensed Civil Engineer or Architect"),req("Real Property Tax payment proof","Owner or City Treasurer"),req("Tax Declaration","City Assessor"),req("Application-fee receipt","City Treasurer"),req("Locational Clearance or Zoning Compliance certification","City Planning and Development Office"),req("Barangay Clearance","Barangay Hall"),req("Thirteen certified photocopy sets of the required papers for Sangguniang Panlungsod review","Applicant")],
 "client_steps":[{"step":1,"action":"Submit the notarized application, plans, and complete requirements for technical review and inspection scheduling.","processing_time":"3 days"},{"step":2,"action":"Assist during the scheduled site inspection and final evaluation.","processing_time":"1 day (as scheduled)"},{"step":3,"action":"Comply with assessment, payment, legislative review, and approval requirements, then receive the approved Development Permit.","processing_time":"Subject to technical and Sangguniang Panlungsod review"}],"fees":{"amount":"Varies","description":"Based on the applicable development, reclassification, or subdivision assessment."},"processing_time":"At least 4 days, excluding legislative review and applicant compliance","person_responsible":staff+["City Planning and Development Office","Sangguniang Panlungsod","City Mayor"]},
}

data=json.loads(PATH.read_text(encoding="utf-8")); found=set()
for service in data["services"]:
    name=service.get("service_name")
    if name in updates:
        service.update(updates[name]); found.add(name)
missing=set(updates)-found
if missing: raise SystemExit(f"Services not found: {sorted(missing)}")
PATH.write_text(json.dumps(data,indent=2,ensure_ascii=False),encoding="utf-8")
print(f"Transcribed {len(found)} City Engineer services")
