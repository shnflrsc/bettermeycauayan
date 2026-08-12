import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "src/data/citizens-charter/citizens-charter.json"
PESO = "Office of the City Public Employment Service Manager"
PESO_STAFF = ["Labor and Employment Officer I", "PESO Manager", PESO]


def req(requirement, source):
    return {"requirement": requirement, "where_to_secure": source}


def step(number, action, agency_action, time, people=None):
    return {"step": number, "action": action, "agency_action": agency_action, "fees": "None", "processing_time": time, "person_responsible": people or PESO_STAFF}


def record(name, requirements, steps, total, people=None):
    return {"plain_language_name": name, "requirements": requirements, "client_steps": steps, "fees": {"amount": "None", "description": "No fee"}, "processing_time": total, "person_responsible": people or PESO_STAFF}


valid_ids = req("Required valid government-issued IDs (originals for verification and photocopies, as specified)", "PSA, SSS, GSIS, DFA, PRC, LTO, COMELEC, BIR, or PHLPost")
school_docs = req("Applicable school credentials such as Transcript of Records, Form 137/138, diploma, ALS certificate, or training certificate (original for verification and photocopy)", "School or training center last attended")

updates = {
    "Certificate of Endorsement Issuance for Securing Business Permit": record(
        "Cooperative Endorsement Certificate for Business Permits",
        [
            req("Certificate of Compliance (original for presentation and 1 photocopy)", "Cooperative Development Authority (CDA)"),
            req("Cooperative Annual Performance Report (1 photocopy)", "Cooperative Development Authority (CDA)"),
            req("Articles and By-laws for a new cooperative or branch (1 photocopy)", "Cooperative Development Authority (CDA)"),
            req("Certificate of Registration (original for presentation and 1 photocopy)", "Cooperative Development Authority (CDA)"),
            req("Certificate of Authority for branching out (original for presentation and 1 photocopy)", "Cooperative Development Authority (CDA)"),
        ],
        [
            step(1, "Submit the complete documents.", "Accept, review, and authenticate the documents; prepare and print the endorsement certificate for signature.", "15 minutes", ["Administrative Assistant III", "City Cooperative Officer", "Office of the City Cooperatives Development Officer"]),
            step(2, "Receive the certificate.", "Release the certificate.", "2 minutes", ["Administrative Assistant III", "Office of the City Cooperatives Development Officer"]),
        ],
        "17 minutes",
        ["Administrative Assistant III", "City Cooperative Officer", "Office of the City Cooperatives Development Officer"],
    ),
    "Job Referral Issuance": record(
        "PESO Job Referral",
        [req("Resume or biodata with latest picture (1 original copy)", "Applicant"), valid_ids, req("PESO Manager endorsement letter for non-Meycauayan residents (2 originals)", "PESO of the applicant's city or municipality"), school_docs, req("NSRP Form No. 1", PESO)],
        [
            step(1, "Submit the completed NSRP Form No. 1 and requirements.", "Receive and verify the documents; return incomplete submissions with instructions.", "5 minutes"),
            step(2, "Attend the interview and job-matching assessment.", "Assess qualifications and match them against vacancies; explain alternatives if no immediate match exists.", "25 minutes"),
            step(3, "Wait for preparation and approval of the Job Referral Letter.", "Prepare, review, and sign the referral letter.", "10 minutes"),
            step(4, "Receive the Job Referral Letter.", "Release the letter.", "1 minute"),
            step(5, "Sign the Job Referral Logbook.", "Record the referral and assist the applicant with the logbook.", "2 minutes"),
            step(6, "Complete and submit the Client Feedback Form.", "Provide the form and assist with submission to the drop box.", "6 minutes"),
            step(7, "Receive instructions from PESO.", "Instruct the applicant to proceed to the company or employer.", "1 minute"),
        ],
        "50 minutes (followed by internal encoding and reporting)",
    ),
    "Establishment Accreditation - New and Renewal": record(
        "PESO Establishment Accreditation (New or Renewal)",
        [
            req("Letter of intent to the City Mayor through the PESO Manager and company IDs/authorization for the signatory and representative", "Establishment or company"),
            req("Company profile, BIR registration or tax-exemption certificate, Certificate of No Pending Case, and Business Permit", "Company, BIR, DOLE, and Business Permit and Licensing Office"),
            req("Updated job-vacancy list or approved overseas job orders, PhilJobNet registration screenshot, PESO Application Slip, and NSRP Form No. 2", "Company, PhilJobNet, and PESO"),
            req("Applicable business-type accreditation: DTI/SEC registration, PEA license, CDA certification, DOLE 174-17 registration, PCAB license, or DMW license", "Relevant national regulatory agency"),
            req("For renewal: previous PESO Accreditation and updated supporting documents", "PESO and establishment"),
        ],
        [
            step(1, "Submit NSRP Form No. 2, the Application Slip, and complete requirements.", "Receive and verify the application; issue a Return Slip for incomplete submissions.", "20 minutes"),
            step(2, "Attend the PESO interview.", "Interview the representative about the recruitment process.", "15 minutes"),
            step(3, "Wait for approval.", "Review the application and approve or sign the accreditation.", "10 minutes"),
            step(4, "Receive the PESO Accreditation.", "Release the accreditation.", "1 minute"),
            step(5, "Sign the Establishment Logbook.", "Record the accreditation and assist the representative in signing.", "1 minute"),
            step(6, "Complete and submit the Client Feedback Form.", "Provide the form and assist with submission to the drop box.", "6 minutes"),
        ],
        "53 minutes (followed by internal encoding and reporting)",
    ),
    "Special Program for the Employment of Students and Out-of-School Youth": record(
        "Special Program for Employment of Students and Out-of-School Youth (SPES)",
        [
            req("Resume or biodata with recent picture and parents' or guardians' income details", "Applicant"),
            req("SPES Pre-qualification Form, NSRP Form No. 1, and later SPES Form No. 2", PESO),
            req("PSA Birth Certificate and latest school grades or report of grades", "PSA and school last attended"),
            req("Applicable proof of household income, indigency, employment, tax exemption, or out-of-school status", "Barangay Hall, BIR, or employer"),
            req("Applicable guardianship affidavit, school ID, school calendar, government ID of parent/guardian, and two 2x2 photos", "Notary Public, school, issuing agencies, and applicant"),
            req("For deployment: valid ID and Daily Time Record", "Issuing agency and PESO"),
            req("For payout: certified Daily Time Record, SPES Accomplishment Report, and proof of enrollment", "PESO, applicant, and school"),
        ],
        [
            step(1, "Submit the forms and requirements, complete PESO and employer interviews, and wait for selection notice.", "Verify eligibility, interview and match the applicant, coordinate the employer interview, approve the beneficiary list, complete SPES forms, and submit placement and insurance records to DOLE.", "3 business days, 3 hours, and 10 minutes"),
            step(2, "Attend orientation, sign the SPES documents, receive the endorsement, report to the employer, perform assigned work, and submit feedback.", "Orient and deploy the beneficiary, monitor work, certify the DTR, and collect the employer performance assessment.", "21 days, 2 hours, and 41 minutes for LGU placement; 31 days, 2 hours, and 41 minutes for private placement"),
            step(3, "Submit the certified DTR and accomplishment report, receive the employer's 60% share, submit proof of enrollment, then receive the DOLE 40% share and sign both payrolls.", "Verify documents, process the 60% payout, endorse the claim to DOLE, and release the final 40% share.", "21 business days and 15 minutes"),
        ],
        "Application: 3 business days, 3 hours, and 10 minutes; deployment: 21 or 31 days, 2 hours, and 41 minutes; payout: 21 business days and 15 minutes",
    ),
    "Government Internship Program (GIP) Application": record(
        "Government Internship Program Application",
        [req("Resume with latest picture (2 originals)", "Applicant"), req("GIP Application Form (2 originals) and NSRP Form No. 1", PESO), req("Transcript of Records, diploma, or Certificate of Graduation (original for verification and 2 photocopies)", "School last attended"), valid_ids, req("Two latest 2x2 photos with name tag and signature", "Applicant")],
        [
            step(1, "Submit NSRP Form No. 1 and complete requirements.", "Receive and verify the documents.", "10 minutes"),
            step(2, "Attend the eligibility assessment and complete the GIP Application Form.", "Assess qualifications, provide the form, and review the completed application.", "12 minutes"),
            step(3, "Wait for DOLE's phone interview and the approval notice.", "Coordinate the interview and notify the applicant of approval and orientation schedule.", "10 business days and 10 minutes"),
            step(4, "Attend DOLE orientation, sign the GIP contract, and report to the assigned office.", "Conduct orientation, assist with contract signing, and endorse the beneficiary to the assigned office.", "2 hours and 10 minutes", ["DOLE GIP Focal Person", "PESO Manager", "Labor and Employment Officer I", PESO]),
        ],
        "10 business days, 2 hours, and 42 minutes",
    ),
    "Livelihood Assistance Registration": record(
        "PESO Livelihood Assistance Registration",
        [req("DOLE Beneficiary Profile Form, DOLE Business Action Plan, and NSRP Form No. 1", PESO), req("Barangay Certificate of Indigency", "Barangay Hall where the applicant resides"), valid_ids, req("Two latest 2x2 photos", "Applicant")],
        [
            step(1, "Sign the Livelihood Program Logbook.", "Assist the applicant with the logbook.", "1 minute"),
            step(2, "Complete the beneficiary profile, business plan, and NSRP Form No. 1.", "Provide the forms and assist the applicant.", "46 minutes"),
            step(3, "Submit the completed forms and a photocopy of a valid ID.", "Receive the documents, advise that onsite validation will be scheduled, and add the applicant to the Master Beneficiary Roster.", "4 minutes"),
        ],
        "51 minutes",
    ),
    "Skills Training Program Registration": record(
        "PESO Skills Training Registration",
        [req("Resume or biodata with latest picture", "Applicant"), valid_ids, school_docs, req("NSRP Form No. 1", PESO)],
        [
            step(1, "Sign the Skills Training Program Logbook.", "Assist the applicant with the logbook.", "1 minute"),
            step(2, "Complete NSRP Form No. 1.", "Provide the form.", "25 minutes"),
            step(3, "Submit the form and requirements.", "Verify the completeness and validity of the submission.", "5 minutes"),
            step(4, "Attend the skills-needs assessment.", "Assess the appropriate training, advise the applicant that they will be contacted when it becomes available, and add the applicant to the Master Beneficiary Roster.", "15 minutes"),
        ],
        "46 minutes",
    ),
    "OFW/Migrant Desk Assistance": record(
        "OFW and Migrant Worker Desk Assistance",
        [req("OFW passport bio-page and employment contract (originals for verification and photocopies)", "DFA, applicant, or employer"), req("Proof of active OEC or OWWA membership", "DMW or OWWA"), req("Relevant case documents such as a medical certificate, police report, complaint, or termination notice", "Applicant, employer, or relevant agency"), req("For a family representative: valid ID and proof of relationship to the OFW", "Issuing agency and PSA"), req("NSRP Form No. 1, OWWA Intake Interview Sheet, and Salaysay", PESO)],
        [
            step(1, "Sign the Visitor's Logbook.", "Assist the client with the logbook.", "1 minute"),
            step(2, "Attend a private consultation and intake interview.", "Determine whether the concern involves welfare, labor, repatriation, or illegal recruitment.", "25 minutes"),
            step(3, "Complete NSRP Form No. 1, the OWWA intake sheet, and Salaysay.", "Provide instructions for completing the forms.", "25 minutes"),
            step(4, "Submit the forms and supporting documents.", "Receive and verify the documents; advise the client to complete any missing items.", "6 minutes"),
            step(5, "Receive the original documents and follow the referral instructions.", "Return originals, file copies, and instruct the client where to submit the case personally.", "3 minutes"),
        ],
        "60 minutes",
    ),
}

metadata = {
    "Certificate of Endorsement Issuance for Securing Business Permit": ("Simple", "G2B - Government to Business"),
    "Job Referral Issuance": ("Simple", "G2C - Government to Client"),
    "Establishment Accreditation - New and Renewal": ("Simple", "G2B - Government to Business"),
    "Special Program for the Employment of Students and Out-of-School Youth": ("Complex / Highly Technical", "G2C - Government to Client"),
    "Government Internship Program (GIP) Application": ("Complex", "G2C - Government to Client"),
    "Livelihood Assistance Registration": ("Simple", "G2C - Government to Client"),
    "Skills Training Program Registration": ("Simple", "G2C - Government to Client"),
    "OFW/Migrant Desk Assistance": ("Simple", "G2C - Government to Client"),
}

data = json.loads(PATH.read_text(encoding="utf-8"))
found = set()
for item in data["services"]:
    name = item.get("service_name")
    if name in updates:
        item.update(updates[name])
        item["classification"], item["type_of_transaction"] = metadata[name]
        found.add(name)
missing = set(updates) - found
if missing:
    raise SystemExit(f"Services not found: {sorted(missing)}")
PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Transcribed {len(found)} cooperative and employment services")
