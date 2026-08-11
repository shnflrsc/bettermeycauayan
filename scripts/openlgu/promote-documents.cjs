#!/usr/bin/env node

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const INPUT = 'pipeline/openlgu/staged-documents.jsonl';
const OUTPUT = 'pipeline/openlgu/canonical-documents.jsonl';
const PREFERRED_COLLISION_FILES = new Set([
  'ORDINANCE-348-2.pdf',
  'ordinance-349.pdf',
]);

function readJsonl(filePath) {
  return fs
    .readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

function stableId(document) {
  const digest = crypto
    .createHash('sha256')
    .update(document.source_record_id)
    .digest('hex')
    .slice(0, 20);
  return `doc_meycauayan_${digest}`;
}

const staged = readJsonl(INPUT);
const complete = staged.filter(
  document =>
    document.staging_status === 'new' &&
    document.document_type &&
    document.number &&
    document.title &&
    document.date_enacted &&
    document.term_id &&
    document.pdf_url
);

const byMatchingKey = new Map();
for (const document of complete) {
  const group = byMatchingKey.get(document.matching_key) || [];
  group.push(document);
  byMatchingKey.set(document.matching_key, group);
}

const promotable = [];
let duplicateScans = 0;
for (const group of byMatchingKey.values()) {
  if (group.length === 1) {
    promotable.push(group[0]);
    continue;
  }
  const preferred = group.find(document => {
    return PREFERRED_COLLISION_FILES.has(document.source_filename);
  });
  promotable.push(
    preferred ||
      group.sort(
        (left, right) =>
          (right.confidence_score || 0) - (left.confidence_score || 0)
      )[0]
  );
  duplicateScans += group.length - 1;
}

const canonical = promotable.map(document => ({
  id: stableId(document),
  source_record_id: document.source_record_id,
  type: document.document_type,
  number: document.number,
  title: document.title,
  session_id: document.session_id || null,
  term_id: document.term_id,
  date_enacted: document.date_enacted,
  date_filed: null,
  pdf_url: document.pdf_url,
  source_type: 'ocr',
  publication_status: 'active',
  verification_state: 'partially_verified',
  source_confidence: null,
  canonical_notes:
    'Metadata extracted from an official City Government of Meycauayan PDF; OCR-derived text requires human verification.',
  created_at: document.created_at,
  updated_at: new Date().toISOString(),
}));

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(
  OUTPUT,
  canonical.map(document => JSON.stringify(document)).join('\n') + '\n'
);

console.log(`Promoted ${canonical.length}/${staged.length} staged documents`);
console.log(`Held for review: ${staged.length - complete.length}`);
console.log(`Duplicate scans omitted: ${duplicateScans}`);
console.log(`wrote ${OUTPUT}`);
