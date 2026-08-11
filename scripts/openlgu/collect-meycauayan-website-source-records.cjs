#!/usr/bin/env node

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const cheerio = require('cheerio');

const CONFIG_PATH = path.resolve('pipeline/meycauayan/config.json');
const DEFAULT_PAGE_URL = 'https://meycauayan.gov.ph/local-regulations/';
const DEFAULT_OUTPUT_ROOT = 'pipeline/openlgu';
const DEFAULT_DOWNLOAD_ROOT = 'pipeline/meycauayan/raw/pdfs';
const COLLECTOR_VERSION = 'meycauayan-local-regulations-v1';
const DOCUMENT_TYPES = new Set(['ordinance', 'resolution', 'executive_order']);

function parseArgs(argv) {
  const args = {
    pageUrl: DEFAULT_PAGE_URL,
    htmlFile: null,
    saveHtml: null,
    outputRoot: DEFAULT_OUTPUT_ROOT,
    downloadPdfs: false,
    downloadRoot: DEFAULT_DOWNLOAD_ROOT,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === '--page-url' && next) {
      args.pageUrl = next;
      i += 1;
    } else if (arg === '--html-file' && next) {
      args.htmlFile = next;
      i += 1;
    } else if (arg === '--save-html' && next) {
      args.saveHtml = next;
      i += 1;
    } else if (arg === '--output-root' && next) {
      args.outputRoot = next;
      i += 1;
    } else if (arg === '--download-root' && next) {
      args.downloadRoot = next;
      i += 1;
    } else if (arg === '--download-pdfs') {
      args.downloadPdfs = true;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function printHelp() {
  console.log(`Usage: node scripts/openlgu/collect-meycauayan-website-source-records.cjs [options]

Collects official PDF links from the City of Meycauayan Local Regulations page
and emits OpenLGU source-record JSONL. It never writes canonical D1 data.

Options:
  --page-url <url>       Source page. Default: ${DEFAULT_PAGE_URL}
  --html-file <path>     Parse a saved HTML page instead of fetching live
  --save-html <path>     Save successfully fetched HTML for reproducible parsing
  --output-root <path>   OpenLGU output root. Default: ${DEFAULT_OUTPUT_ROOT}
  --download-pdfs        Download and hash valid PDF files
  --download-root <path> PDF destination. Default: ${DEFAULT_DOWNLOAD_ROOT}
`);
}

function readConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(
      `Meycauayan pipeline configuration not found: ${CONFIG_PATH}`
    );
  }
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  if (
    config.jurisdiction !== 'City of Meycauayan' ||
    config.officialBaseUrl !== 'https://meycauayan.gov.ph'
  ) {
    throw new Error('Invalid Meycauayan pipeline jurisdiction configuration.');
  }
  return config;
}

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeUrl(value) {
  const url = new URL(value);
  url.hash = '';
  return url.href;
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function timestampSlug() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isCloudflareChallenge(html) {
  return (
    /<title>\s*just a moment\.\.\.\s*<\/title>/i.test(html) ||
    /performing security verification/i.test(html) ||
    /\/cdn-cgi\/challenge-platform\//i.test(html)
  );
}

async function fetchPage(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const response = await fetch(url, {
        signal: controller.signal,
        redirect: 'follow',
        headers: {
          accept: 'text/html,application/xhtml+xml',
          'user-agent':
            'BetterMeycauayan-OpenLGU/1.0 (+https://meycauayan.gov.ph)',
        },
      });
      clearTimeout(timeout);
      const html = await response.text();
      if (isCloudflareChallenge(html)) {
        const error = new Error(
          'Cloudflare bot verification blocked the live collector. Save the rendered Local Regulations page and rerun with --html-file, or ask the City website administrator to exempt this read-only collector.'
        );
        error.type = 'cloudflare_challenge';
        throw error;
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }
      return html;
    } catch (error) {
      lastError = error;
      if (error.type === 'cloudflare_challenge') throw error;
      if (attempt < attempts) await delay(1000 * 2 ** attempt);
    }
  }
  throw lastError;
}

function nearestHeadingText($, anchor) {
  const heading = anchor
    .parents()
    .addBack()
    .prevAll('h1,h2,h3,h4,h5,h6')
    .first();
  if (heading.length) return normalizeText(heading.text());

  let cursor = anchor;
  for (let depth = 0; depth < 6 && cursor.length; depth += 1) {
    const siblingHeading = cursor.prevAll().find('h1,h2,h3,h4,h5,h6').last();
    if (siblingHeading.length) return normalizeText(siblingHeading.text());
    cursor = cursor.parent();
  }
  return '';
}

function surroundingText($, anchor) {
  const container = anchor.closest(
    'tr,li,article,.elementor-widget-container,.wp-block-group'
  );
  if (container.length) return normalizeText(container.text());
  const parent = anchor.parent();
  if (parent.is('body,html')) return '';
  return normalizeText(parent.text());
}

function classifyDocument(haystack) {
  const text = normalizeText(haystack).toLowerCase();
  if (/executive\s*order|(?:^|[^a-z])e\.?o\.?\s*(?:no|\d)/i.test(text)) {
    return 'executive_order';
  }
  if (/ordinance|(?:^|[^a-z])ord(?:\.|-|_)/i.test(text)) return 'ordinance';
  if (/resolution|(?:^|[^a-z])res(?:\.|-|_)/i.test(text)) return 'resolution';
  return '';
}

function extractNumber(type, text) {
  const normalized = normalizeText(text);
  const prefixes = {
    ordinance: '(?:city\\s+)?ordinance',
    resolution: '(?:city\\s+)?resolution',
    executive_order: 'executive\\s+order|e\\.?o\\.?',
  };
  const prefix = prefixes[type];
  if (!prefix) return '';
  const explicit = normalized.match(
    new RegExp(
      `(?:${prefix})\\b\\s*(?:no\\.?|number)?\\s*([0-9][a-z0-9-]*(?:\\s*\\(of\\s+\\d{4}\\))?)`,
      'i'
    )
  );
  if (explicit) return normalizeText(explicit[1]);

  const yearNumber = normalized.match(/\b(20\d{2}\s*[-–]\s*[a-z0-9-]+)\b/i);
  if (yearNumber) return normalizeText(yearNumber[1]).replace(/\s+/g, '');

  const shortPrefixes = {
    ordinance: 'ord(?:inance)?',
    resolution: 'res(?:olution)?',
    executive_order: 'e[._-]?o|executive[._-]?order',
  };
  const filenameNumber = normalized.match(
    new RegExp(
      `(?:${shortPrefixes[type]})[._\\s-]*(?:no[._\\s-]*)?([a-z0-9-]+)`,
      'i'
    )
  );
  return filenameNumber ? filenameNumber[1] : '';
}

function extractDate(text) {
  const value = normalizeText(text);
  const iso = value.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const slash = value.match(/\b(\d{1,2})\/(\d{1,2})\/(20\d{2})\b/);
  if (slash) {
    return `${slash[3]}-${slash[1].padStart(2, '0')}-${slash[2].padStart(2, '0')}`;
  }
  return '';
}

function usableTitle(anchorText, contextText, filename) {
  const ignored =
    /^(view|download|open|pdf|view pdf|download pdf|click here)$/i;
  if (anchorText && !ignored.test(anchorText)) return anchorText;
  if (contextText && !ignored.test(contextText)) {
    return contextText
      .replace(/\s+(?:view|download|open)(?:\s+pdf)?\s*$/i, '')
      .trim();
  }
  return filename.replace(/\.pdf$/i, '').replace(/[-_]+/g, ' ');
}

function parseRegulationsPage(html, pageUrl) {
  if (isCloudflareChallenge(html)) {
    const error = new Error('Refusing to parse Cloudflare challenge HTML.');
    error.type = 'cloudflare_challenge';
    throw error;
  }

  const $ = cheerio.load(html);
  const candidates = [];
  $('a[href]').each((_index, element) => {
    const anchor = $(element);
    const rawHref = anchor.attr('href') || '';
    let pdfUrl;
    try {
      pdfUrl = normalizeUrl(new URL(rawHref, pageUrl).href);
    } catch {
      return;
    }
    if (!/\.pdf(?:$|[?#])/i.test(pdfUrl)) return;
    if (new URL(pdfUrl).hostname !== 'meycauayan.gov.ph') return;

    const anchorText = normalizeText(anchor.text());
    const contextText = surroundingText($, anchor);
    const headingText = nearestHeadingText($, anchor);
    const filename = decodeURIComponent(
      new URL(pdfUrl).pathname.split('/').pop()
    );
    const evidence = [
      headingText,
      contextText,
      anchorText,
      filename,
      pdfUrl,
    ].join(' ');
    const type = classifyDocument(evidence);
    if (!DOCUMENT_TYPES.has(type)) return;

    candidates.push({
      type,
      number: extractNumber(type, evidence),
      title: usableTitle(anchorText, contextText, filename),
      date_enacted: extractDate(evidence),
      pdf_url: pdfUrl,
      source_heading: headingText,
      source_context: contextText,
      source_anchor_text: anchorText,
      source_filename: filename,
    });
  });

  const byUrl = new Map();
  for (const candidate of candidates) {
    const existing = byUrl.get(candidate.pdf_url);
    if (
      !existing ||
      JSON.stringify(candidate).length > JSON.stringify(existing).length
    ) {
      byUrl.set(candidate.pdf_url, candidate);
    }
  }
  return [...byUrl.values()];
}

async function downloadPdf(record, root) {
  const response = await fetch(record.pdf_url, {
    redirect: 'follow',
    headers: {
      accept: 'application/pdf',
      'user-agent': 'BetterMeycauayan-OpenLGU/1.0',
    },
  });
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  if (isCloudflareChallenge(bytes.toString('utf8', 0, 3000))) {
    throw new Error('Cloudflare challenge');
  }
  if (bytes.subarray(0, 5).toString() !== '%PDF-') {
    throw new Error('Response is not a PDF');
  }

  const hash = sha256(bytes);
  const safeName = record.source_filename.replace(/[^a-z0-9._-]+/gi, '_');
  const destination = path.join(
    root,
    record.type,
    `${hash.slice(0, 12)}-${safeName}`
  );
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, bytes);
  return { hash: `sha256:${hash}`, path: destination, bytes: bytes.length };
}

function toSourceRecord(row, pageUrl, runId) {
  const now = new Date().toISOString();
  const payload = { ...row };
  const contentHash = `sha256:${sha256(JSON.stringify(payload))}`;
  return {
    id: `src_meycauayan_${row.type}_${sha256(row.pdf_url).slice(0, 20)}`,
    source_kind: 'official_webpage_pdf_link',
    source_key:
      row.type === 'executive_order' ? 'executive_orders' : `${row.type}s`,
    source_url: pageUrl,
    content_hash: contentHash,
    collector_version: COLLECTOR_VERSION,
    raw_payload_json: payload,
    pdf_url: row.pdf_url,
    pdf_reachability: row.pdf_reachability || null,
    pdf_redirect_url: row.pdf_redirect_url || null,
    pdf_checked_at: row.pdf_checked_at || null,
    run_id: runId,
    first_seen_at: now,
    last_seen_at: now,
  };
}

function writeJsonl(filePath, records) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    records.length
      ? `${records.map(row => JSON.stringify(row)).join('\n')}\n`
      : ''
  );
}

function writeManifest(outputRoot, manifest) {
  const runDir = path.join(outputRoot, 'runs', manifest.run_id);
  fs.mkdirSync(runDir, { recursive: true });
  fs.writeFileSync(
    path.join(runDir, 'run.json'),
    `${JSON.stringify(manifest, null, 2)}\n`
  );
  return runDir;
}

async function main() {
  readConfig();
  const args = parseArgs(process.argv);
  const runId = `meycauayan_${timestampSlug()}`;
  const startedAt = new Date().toISOString();
  let html;

  try {
    html = args.htmlFile
      ? fs.readFileSync(path.resolve(args.htmlFile), 'utf8')
      : await fetchPage(args.pageUrl);

    if (args.saveHtml) {
      fs.mkdirSync(path.dirname(path.resolve(args.saveHtml)), {
        recursive: true,
      });
      fs.writeFileSync(path.resolve(args.saveHtml), html);
    }

    const rows = parseRegulationsPage(html, args.pageUrl);
    if (!rows.length) {
      throw new Error(
        'No official regulation PDF links were found; page markup may have changed.'
      );
    }

    if (args.downloadPdfs) {
      for (let i = 0; i < rows.length; i += 1) {
        const row = rows[i];
        try {
          const result = await downloadPdf(row, args.downloadRoot);
          row.pdf_sha256 = result.hash;
          row.local_pdf_path = result.path;
          row.pdf_bytes = result.bytes;
          row.pdf_reachability = 'reachable';
        } catch (error) {
          row.pdf_reachability = 'error';
          row.pdf_error = error.message;
        }
        row.pdf_checked_at = new Date().toISOString();
        if (i < rows.length - 1) await delay(500);
      }
    }

    const records = rows.map(row => toSourceRecord(row, args.pageUrl, runId));
    const runDir = writeManifest(args.outputRoot, {
      run_id: runId,
      jurisdiction: 'City of Meycauayan',
      source_url: args.pageUrl,
      collector_version: COLLECTOR_VERSION,
      status: 'success',
      started_at: startedAt,
      finished_at: new Date().toISOString(),
      input_mode: args.htmlFile ? 'saved_html' : 'live',
      counts: {
        source_records: records.length,
        ordinances: rows.filter(row => row.type === 'ordinance').length,
        resolutions: rows.filter(row => row.type === 'resolution').length,
        executive_orders: rows.filter(row => row.type === 'executive_order')
          .length,
      },
    });
    writeJsonl(path.join(runDir, 'source-records.jsonl'), records);

    const latestDir = path.join(args.outputRoot, 'latest');
    fs.mkdirSync(latestDir, { recursive: true });
    fs.copyFileSync(
      path.join(runDir, 'run.json'),
      path.join(latestDir, 'run.json')
    );
    writeJsonl(path.join(latestDir, 'source-records.jsonl'), records);
    writeJsonl(path.join(args.outputRoot, 'source-records.jsonl'), records);

    console.log(`Collected ${records.length} official document link(s).`);
    console.log(`Wrote ${path.join(args.outputRoot, 'source-records.jsonl')}`);
  } catch (error) {
    writeManifest(args.outputRoot, {
      run_id: runId,
      jurisdiction: 'City of Meycauayan',
      source_url: args.pageUrl,
      collector_version: COLLECTOR_VERSION,
      status: 'failed',
      started_at: startedAt,
      finished_at: new Date().toISOString(),
      input_mode: args.htmlFile ? 'saved_html' : 'live',
      error: { type: error.type || 'collection_error', message: error.message },
    });
    throw error;
  }
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
