#!/usr/bin/env node
/**
 * Search Index Generation Script for FHM Training Content
 *
 * Parses published HTML chapter pages (Series 7 + SIE) and extracts
 * searchable text, key terms, section headings, and metadata.
 * Produces a lightweight JSON index for client-side search.
 *
 * Usage:
 *   node scripts/generate-search-index.js
 *
 * Output:
 *   assets/data/search-index.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, '..', 'pages');
const OUTPUT_FILE = path.join(__dirname, '..', 'assets', 'data', 'search-index.json');

/**
 * Strip HTML tags and normalize whitespace
 */
function stripHtml(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '\u2014')
    .replace(/&ndash;/g, '\u2013')
    .replace(/&hellip;/g, '\u2026')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract the <title> text from HTML
 */
function extractTitle(html) {
  const match = html.match(/<title>([^<]+)<\/title>/i);
  if (!match) return '';
  return match[1].replace(/\s*\|.*$/, '').trim();
}

/**
 * Extract meta description
 */
function extractDescription(html) {
  const match = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  return match ? match[1].trim() : '';
}

/**
 * Extract key terms (<span class="key-term">) from HTML
 */
function extractKeyTerms(html) {
  const terms = new Set();
  const pattern = /<span\s+class="key-term">([^<]+)<\/span>/gi;
  let match;
  while ((match = pattern.exec(html)) !== null) {
    terms.add(match[1].trim());
  }
  return [...terms];
}

/**
 * Extract section headings (h2, h3) from main content
 */
function extractHeadings(html) {
  const headings = [];
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const content = mainMatch ? mainMatch[1] : html;

  const pattern = /<h([23])[^>]*>([^<]+)<\/h\1>/gi;
  let match;
  while ((match = pattern.exec(content)) !== null) {
    headings.push(stripHtml(match[2]).trim());
  }
  return headings;
}

/**
 * Extract the body text from <main> for full-text indexing.
 * Strips scripts/styles/nav and compresses whitespace.
 */
function extractBodyText(html) {
  let content = html;

  // Prefer <main> content if available
  const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    content = mainMatch[1];
  } else {
    // Fallback: strip header + footer
    content = content
      .replace(/<header[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '');
  }

  return stripHtml(content);
}

/**
 * Determine exam type and chapter number from filename
 */
function parseFileMeta(filename) {
  // Series 7 chapter pattern
  const s7Match = filename.match(/series-7-chapter-(\d+)/);
  if (s7Match) {
    return { exam: 'series-7', chapter: parseInt(s7Match[1]), type: 'chapter' };
  }

  // Series 63 chapter pattern
  const s63Match = filename.match(/series-63-chapter-(\d+)/);
  if (s63Match) {
    return { exam: 'series-63', chapter: parseInt(s63Match[1]), type: 'chapter' };
  }

  // SIE chapter pattern
  const sieMatch = filename.match(/sie-chapter-(\d+)/);
  if (sieMatch) {
    return { exam: 'sie', chapter: parseInt(sieMatch[1]), type: 'chapter' };
  }

  // Study tools (check series-63 before series-7 because 'series-7-' is not a substring of 'series-63-')
  if (filename.includes('series-63-')) {
    return { exam: 'series-63', chapter: null, type: 'tool' };
  }
  if (filename.includes('series-7-')) {
    return { exam: 'series-7', chapter: null, type: 'tool' };
  }
  if (filename.includes('sie-')) {
    return { exam: 'sie', chapter: null, type: 'tool' };
  }

  return { exam: null, chapter: null, type: 'page' };
}

/**
 * Build a single search document from an HTML file
 */
function buildDocument(filePath, relativePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath, '.html');
  const meta = parseFileMeta(filename);

  const title = extractTitle(html);
  const description = extractDescription(html);
  const keyTerms = extractKeyTerms(html);
  const headings = extractHeadings(html);
  const bodyText = extractBodyText(html);

  // Truncate body text to keep index size reasonable (~2000 chars per page)
  const truncatedBody = bodyText.length > 2000 ? bodyText.slice(0, 2000) : bodyText;

  return {
    id: filename,
    title,
    description,
    url: relativePath,
    exam: meta.exam,
    chapter: meta.chapter,
    type: meta.type,
    keyTerms,
    headings,
    body: truncatedBody,
  };
}

/**
 * Collect all indexable HTML files from pages directory
 */
function collectFiles() {
  const files = [];

  const examDirs = ['series-7', 'series-63', 'sie'];
  for (const dir of examDirs) {
    const dirPath = path.join(PAGES_DIR, dir);
    if (!fs.existsSync(dirPath)) continue;

    const htmlFiles = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));
    for (const file of htmlFiles) {
      files.push({
        path: path.join(dirPath, file),
        relative: `pages/${dir}/${file}`,
      });
    }
  }

  // Also index the training hub
  const trainingIndex = path.join(PAGES_DIR, 'training', 'index.html');
  if (fs.existsSync(trainingIndex)) {
    files.push({
      path: trainingIndex,
      relative: 'pages/training/index.html',
    });
  }

  return files;
}

/**
 * Main entry point
 */
function main() {
  console.log('');
  console.log('========================================');
  console.log('  FHM Search Index Generation');
  console.log('========================================');
  console.log('');

  const files = collectFiles();
  console.log(`Found ${files.length} HTML files to index`);
  console.log('');

  const documents = [];
  const stats = { 'series-7': 0, 'series-63': 0, sie: 0, other: 0 };

  for (const file of files) {
    console.log(`Indexing: ${file.relative}`);
    const doc = buildDocument(file.path, file.relative);
    documents.push(doc);

    if (doc.exam === 'series-7') stats['series-7']++;
    else if (doc.exam === 'series-63') stats['series-63']++;
    else if (doc.exam === 'sie') stats.sie++;
    else stats.other++;
  }

  const output = {
    generated: new Date().toISOString(),
    totalDocuments: documents.length,
    documents,
  };

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

  const fileSizeKb = (Buffer.byteLength(JSON.stringify(output)) / 1024).toFixed(1);

  console.log('');
  console.log('========================================');
  console.log('  Index Generation Complete');
  console.log('========================================');
  console.log('');
  console.log(`Total documents: ${documents.length}`);
  console.log(`  Series 7: ${stats['series-7']}`);
  console.log(`  Series 63: ${stats['series-63']}`);
  console.log(`  SIE: ${stats.sie}`);
  console.log(`  Other: ${stats.other}`);
  console.log('');
  console.log(`Index size: ${fileSizeKb} KB`);
  console.log(`Output: ${OUTPUT_FILE}`);
  console.log('');
}

main();
