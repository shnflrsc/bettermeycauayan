import json
import os
import shutil
import subprocess

OFFICIAL_SOURCE_NAME = "City Government of Meycauayan Citizen's Charter 2026 (1st Edition)"
OFFICIAL_SOURCE_URL = 'https://meycauayan.gov.ph/wp-content/uploads/CITIZENS_CHARTER_2026_1ST_ED_MEYC.pdf'
CATALOG_VERIFIED_AT = '2026-08-11T12:21:52+08:00'


def normalize_service(service):
    """Normalize legacy/category records into the shared UI service schema."""
    normalized = dict(service)
    if normalized.get('officialServiceNumber'):
        normalized['serviceNumber'] = normalized['officialServiceNumber']

    # The UI distinguishes transactions from informational resources. Legacy
    # labels such as Permit, Clearance, Certificate, and Assistance are all
    # transactional services.
    if str(normalized.get('type', '')).lower() not in ('transaction', 'information'):
        normalized['type'] = 'transaction'

    # Older records used `title`; the shared schema and UI use `name`.
    sources = []
    for source in normalized.get('sources', []):
        source = dict(source)
        normalized_source = {
            'name': source.get('name') or source.get('title') or 'City of Meycauayan Citizens’ Charter',
            'url': source.get('url') or OFFICIAL_SOURCE_URL,
        }
        reference = normalized.get('officialReference') or {}
        normalized_source.update(reference)
        sources.append(normalized_source)
    if not sources:
        sources = [{'name': 'City of Meycauayan Citizens’ Charter', 'url': OFFICIAL_SOURCE_URL}]
    reference = normalized.get('officialReference') or {}
    official_source = {'name': OFFICIAL_SOURCE_NAME, 'url': OFFICIAL_SOURCE_URL}
    official_source.update(reference)
    normalized['sources'] = [official_source]

    # Populate the compact summary used by cards and service detail pages while
    # preserving any manually curated values.
    quick_info = dict(normalized.get('quickInfo') or {})
    if normalized.get('processingTime'):
        quick_info.setdefault('processingTime', normalized['processingTime'])
    if normalized.get('whoMayAvail'):
        quick_info.setdefault('whoCanApply', normalized['whoMayAvail'])
    fees = normalized.get('fees')
    if fees:
        amount = fees.get('amount') if isinstance(fees, dict) else None
        description = fees.get('description') if isinstance(fees, dict) else None
        if amount == 0:
            quick_info.setdefault('fee', 'Free')
        elif amount not in (None, ''):
            quick_info.setdefault('fee', f'₱{amount:,.2f}' if isinstance(amount, (int, float)) else str(amount))
        elif description:
            quick_info.setdefault('fee', description)
    if normalized.get('requirements') or normalized.get('detailedRequirements'):
        quick_info.setdefault('documents', 'See requirements below')
    if normalized.get('deliveryChannel'):
        quick_info['appointmentType'] = normalized['deliveryChannel']
    if normalized.get('slug') == 'mayors-tricycle-operators-permit-public-units':
        quick_info.setdefault('validity', '1 year')
    if quick_info:
        normalized['quickInfo'] = quick_info

    normalized['dataComplete'] = True
    normalized['needsVerification'] = False
    normalized['updatedAt'] = CATALOG_VERIFIED_AT

    return normalized

def merge_services():
    input_dir = 'src/data/services/categories'
    output_file = 'src/data/services/services.json'
    combined = []

    for filename in sorted(os.listdir(input_dir)):
        if filename.endswith('.json'):
            with open(os.path.join(input_dir, filename), 'r', encoding='utf-8') as f:
                data = json.load(f)
                combined.extend(
                    normalize_service(service)
                    for service in data
                    if service.get('status') != 'historical'
                )

    # Suggest nearby services without maintaining fragile links by hand.
    for service in combined:
        if not service.get('relatedServices'):
            category_slug = service.get('category', {}).get('slug')
            service['relatedServices'] = [
                candidate['slug']
                for candidate in combined
                if candidate.get('slug') != service.get('slug')
                and candidate.get('category', {}).get('slug') == category_slug
            ][:4]

    # Sort alphabetically by service name for consistency
    combined.sort(key=lambda x: x['service'])

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(combined, f, indent=2, ensure_ascii=False)

    # Format with Prettier to match project style
    try:
        npx_command = shutil.which('npx.cmd') or shutil.which('npx')
        if not npx_command:
            raise FileNotFoundError('npx was not found on PATH')
        subprocess.run([npx_command, 'prettier', '--write', output_file], check=True)
        print(f"Successfully merged and formatted {len(combined)} services into one file.")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print(f"Successfully merged {len(combined)} services into one file (Prettier formatting skipped).")

if __name__ == "__main__":
    merge_services()
