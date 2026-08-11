# Meycauayan pipeline workspace

For the complete operator guide, including prerequisites, OCR setup, review
gates, local testing, remote publication, and troubleshooting, see
[`OPENLGU_PIPELINE.md`](./OPENLGU_PIPELINE.md).

This is the only jurisdiction-specific input area for the BetterMeycauayan
OpenLGU workflow.

Expected generated flow:

1. Official Meycauayan source discovery and capture
2. PDF download, hashing, text extraction, and OCR fallback
3. Normalized source records in `pipeline/openlgu/source-records.jsonl`
4. Staged records in `pipeline/openlgu/staged-documents.jsonl`
5. Promote complete records with `npm run openlgu:promote-documents`
6. Local D1 load and workbench review
7. Explicitly confirmed remote load

Collect the official Local Regulations page with:

```sh
npm run openlgu:collect-website
```

The City website currently presents an interactive Cloudflare verification page
to server-side requests. If that remains enabled, save the fully rendered page
from a browser and run:

```sh
node scripts/openlgu/collect-meycauayan-website-source-records.cjs \
  --html-file path/to/local-regulations.html \
  --download-pdfs
```

The collector rejects Cloudflare challenge pages, non-Meycauayan PDF hosts, and
unclassified PDFs. It preserves the last successful output when a later run fails.

For PDFs downloaded manually through a verified browser session, run:

```sh
npm run openlgu:collect-local-pdfs
```

This validates each PDF, extracts embedded text, hashes and deduplicates files,
and writes `pipeline/openlgu/source-records.jsonl` plus
`pipeline/openlgu/local-pdf-audit.json`. Scanner-only documents are marked
`needs_ocr`; uncertain metadata remains `needs_review`.

The OCR dependencies live in the isolated `.venv-openlgu` environment. Process
all scanned pages with:

```sh
npm run openlgu:ocr-local-pdfs
```

For a quick first-file validation:

```sh
node scripts/run-python.cjs scripts/openlgu/collect-local-pdfs.py \
  --ocr --limit 1 --ocr-max-pages 1
```

For a temporary manual CSV import, create `import/documents.csv` beneath this
directory and run `npm run openlgu:collect-source-records`. The collector rejects
legacy Los Baños content and archive paths.

Remote loading requires an intentional jurisdiction confirmation:

```sh
node scripts/openlgu/load-pipeline-to-d1.mjs --remote --confirm-meycauayan
```
