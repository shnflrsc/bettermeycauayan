import json
import re
import sys
from collections import Counter
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src/data/citizens-charter/citizens-charter.json"
MERGED = ROOT / "src/data/citizens-charter/merged-services.json"

source = json.loads(SOURCE.read_text(encoding="utf-8"))["services"]
merged = json.loads(MERGED.read_text(encoding="utf-8"))
issues = []

def issue(kind, ident, detail):
    issues.append((kind, ident, detail))

numbers = [str(s.get("service_number", "")).strip() for s in source]
for number, count in Counter(numbers).items():
    if not number:
        issue("missing-number", "(blank)", f"{count} record(s)")
    elif count > 1:
        issue("duplicate-number", number, str(count))
    if re.search(r"service\s*(?:no\.?|number)", number, re.I):
        issue("number-label", number, "contains a display label")
    if not re.fullmatch(r"CC-\d+(?:-[A-Z0-9]+)?", number):
        issue("number-format", number, "expected CC-<number>")

for service in source:
    ident = service.get("service_number", "(unknown)")
    for field in ("service_name", "plain_language_name", "office_division", "classification", "type_of_transaction", "who_may_avail"):
        value = service.get(field)
        if not isinstance(value, str) or not value.strip():
            issue("missing-field", ident, field)
        elif re.search(r"see (?:official )?(?:service page|document)|placeholder|to be (?:filled|updated)|tbd|n/?a$", value, re.I):
            issue("placeholder", ident, f"{field}: {value}")
    if len(service.get("who_may_avail", "")) > 150:
        issue("long-eligibility", ident, str(len(service["who_may_avail"])))
    requirements = service.get("requirements")
    steps = service.get("client_steps")
    if not isinstance(requirements, list):
        issue("bad-requirements", ident, type(requirements).__name__)
    if not isinstance(steps, list) or not steps:
        issue("bad-steps", ident, type(steps).__name__)
    for index, req in enumerate(requirements or [], 1):
        if not isinstance(req, dict) or not str(req.get("requirement", "")).strip():
            issue("bad-requirement", ident, str(index))
    for index, step in enumerate(steps or [], 1):
        if not isinstance(step, dict) or not str(step.get("action", "")).strip():
            issue("bad-step", ident, str(index))

slugs = [str(s.get("slug", "")).strip() for s in merged]
for slug, count in Counter(slugs).items():
    if not slug:
        issue("missing-slug", "(blank)", str(count))
    elif count > 1:
        issue("duplicate-slug", slug, str(count))

for service in merged:
    ident = service.get("serviceNumber") or service.get("slug") or "(unknown)"
    if not str(service.get("service", "")).strip():
        issue("merged-missing-name", ident, "service")
    category = service.get("category")
    if not isinstance(category, dict) or not category.get("name") or not category.get("slug"):
        issue("bad-category", ident, repr(category))
    if service.get("needsVerification") is True or service.get("dataComplete") is False:
        issue("not-verified", ident, "completion flag")

print(f"SOURCE={len(source)} MERGED={len(merged)} ISSUES={len(issues)}")
for row in issues:
    print("\t".join(row))
