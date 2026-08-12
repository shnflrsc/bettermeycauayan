import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "src/data/citizens-charter/citizens-charter.json"

SHORT_LABELS = {
    "CC-363": "Eligible DepEd Meycauayan teachers and PCCM faculty members",
    "CC-222": "Meycauayan residents referred by Ospital ng Meycauayan or a City Health Unit",
    "CC-227": "OPD, emergency, admitted, and City Health Unit patients",
    "CC-333": "Residents, organizations, agencies, researchers, and academic institutions",
    "CC-229": "OPD, emergency, admitted, and City Health Unit patients",
    "CC-234": "All Ospital ng Meycauayan patients",
    "CC-312": "Eligible students and out-of-school youth ages 15–30",
    "CC-321": "Eligible Meycauayan residents who are recent four-year college graduates",
    "CC-331": "Barangays, schools, organizations, companies, and community stakeholders",
    "CC-332": "Barangays, schools, organizations, companies, and community stakeholders",
    "CC-69": "People or organizations requesting verification of a city business record",
    "CC-64": "People or organizations conducting covered events or advertising",
    "CC-420": "Meycauayan-based people’s organizations, NGOs, and civil society organizations",
    "CC-56": "Eligible tricycle operators or their authorized representatives",
    "CC-337": "Meycauayan residents needing emergency medical assistance during disasters",
    "CC-341": "Meycauayan residents requesting standby medical assistance",
    "CC-127": "Professionals practicing in Meycauayan who are required to pay professional tax",
    "CC-355": "Residents, barangays, schools, businesses, and community organizations",
    "CC-356": "Residents, barangays, schools, businesses, and community organizations",
}

data = json.loads(PATH.read_text(encoding="utf-8"))
updated = 0

for service in data["services"]:
    service_number = service.get("service_number")
    if service_number not in SHORT_LABELS:
        continue

    original = service.get("who_may_avail", "").strip()
    concise = SHORT_LABELS[service_number]
    if original and original != concise:
        service["eligibility_details"] = original
    service["who_may_avail"] = concise
    updated += 1

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Normalized eligibility labels for {updated} services")
