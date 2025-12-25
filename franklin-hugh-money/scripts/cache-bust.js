#!/usr/bin/env node
/**
 * Cache Busting System for Franklin Hugh Money
 *
 * Uses content-based MD5 hashes so versions only change when files actually change.
 * This prevents unnecessary cache invalidation while ensuring updates are always served.
 *
 * Usage:
 *   node scripts/cache-bust.js          # Apply cache busting
 *   node scripts/cache-bust.js --check  # Check what would change (dry run)
 *   node scripts/cache-bust.js --clean  # Remove version strings
 *
 * How it works:
 *   1. Scans all CSS/JS files in project
 *   2. Generates MD5 hash of each file's content (first 8 chars)
 *   3. Updates HTML files to reference assets with ?v=<hash>
 *   4. Writes a manifest file for tracking
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '..');
const MANIFEST_FILE = path.join(__dirname, '..', '.cache-manifest.json');

// Assets to track (relative to project root)
const TRACKED_ASSETS = [
    'assets/css/main.css',
    'assets/css/sie-chapter.css',
    'assets/css/sie-navigation.css',
    'assets/js/sie-navigation-config.js',
    'assets/js/sie-navigation-component.js'
];

// Patterns to match in HTML files
const CSS_PATTERN = /href="([^"]*\.css)(\?v=[a-f0-9]+)?"/g;
const JS_PATTERN = /src="([^"]*\.js)(\?v=[a-f0-9]+)?"/g;

/**
 * Generate MD5 hash of file content (first 8 characters)
 */
function getFileHash(filePath) {
    try {
        const content = fs.readFileSync(filePath);
        return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
    } catch (err) {
        console.error(`  Error hashing ${filePath}: ${err.message}`);
        return null;
    }
}

/**
 * Load existing manifest or create empty one
 */
function loadManifest() {
    try {
        return JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
    } catch {
        return { assets: {}, lastUpdated: null };
    }
}

/**
 * Save manifest to disk
 */
function saveManifest(manifest) {
    manifest.lastUpdated = new Date().toISOString();
    fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
}

/**
 * Build asset hash map
 */
function buildAssetHashes() {
    const hashes = {};

    for (const asset of TRACKED_ASSETS) {
        const filePath = path.join(PUBLIC_DIR, asset);
        if (fs.existsSync(filePath)) {
            hashes[asset] = getFileHash(filePath);
        } else {
            console.warn(`  Warning: Asset not found: ${asset}`);
        }
    }

    return hashes;
}

/**
 * Update HTML file with versioned asset references
 */
function updateHtmlFile(htmlPath, hashes, dryRun = false) {
    let content = fs.readFileSync(htmlPath, 'utf8');
    let changes = [];

    // Update CSS references
    content = content.replace(CSS_PATTERN, (match, filename, existingVersion) => {
        // Try to match by full path first, then by basename for backwards compatibility
        const matchedAsset = TRACKED_ASSETS.find(asset =>
            filename === asset || filename.endsWith(asset) || asset.endsWith(filename)
        );
        if (matchedAsset && hashes[matchedAsset]) {
            const newRef = `href="${filename}?v=${hashes[matchedAsset]}"`;
            if (match !== newRef) {
                changes.push({ type: 'css', file: filename, hash: hashes[matchedAsset] });
            }
            return newRef;
        }
        return match;
    });

    // Update JS references (exclude CDN/external)
    content = content.replace(JS_PATTERN, (match, filename, existingVersion) => {
        // Skip external URLs
        if (filename.startsWith('http') || filename.startsWith('//')) {
            return match;
        }

        // Try to match by full path first, then by basename for backwards compatibility
        const matchedAsset = TRACKED_ASSETS.find(asset =>
            filename === asset || filename.endsWith(asset) || asset.endsWith(filename)
        );
        if (matchedAsset && hashes[matchedAsset]) {
            const newRef = `src="${filename}?v=${hashes[matchedAsset]}"`;
            if (match !== newRef) {
                changes.push({ type: 'js', file: filename, hash: hashes[matchedAsset] });
            }
            return newRef;
        }
        return match;
    });

    if (!dryRun && changes.length > 0) {
        fs.writeFileSync(htmlPath, content);
    }

    return changes;
}

/**
 * Remove version strings from HTML file
 */
function cleanHtmlFile(htmlPath) {
    let content = fs.readFileSync(htmlPath, 'utf8');

    content = content.replace(/href="([^"]*\.css)\?v=[a-f0-9]+"/g, 'href="$1"');
    content = content.replace(/src="([^"]*\.js)\?v=[a-f0-9]+"/g, 'src="$1"');

    fs.writeFileSync(htmlPath, content);
}

/**
 * Get all HTML files recursively
 */
function getHtmlFiles(dir = PUBLIC_DIR) {
    let results = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Skip node_modules and hidden directories
            if (!item.startsWith('.') && item !== 'node_modules') {
                results = results.concat(getHtmlFiles(fullPath));
            }
        } else if (item.endsWith('.html')) {
            results.push(fullPath);
        }
    }

    return results;
}

/**
 * Main execution
 */
function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--check');
    const clean = args.includes('--clean');

    console.log('');
    console.log('========================================');
    console.log('  Franklin Hugh Money Cache Buster');
    console.log('========================================');
    console.log('');

    if (clean) {
        console.log('Mode: CLEAN (removing version strings)');
        console.log('');

        const htmlFiles = getHtmlFiles();
        for (const htmlFile of htmlFiles) {
            cleanHtmlFile(htmlFile);
            console.log(`  Cleaned: ${path.basename(htmlFile)}`);
        }

        // Remove manifest
        if (fs.existsSync(MANIFEST_FILE)) {
            fs.unlinkSync(MANIFEST_FILE);
            console.log('');
            console.log('  Removed: .cache-manifest.json');
        }

        console.log('');
        console.log('Done! All version strings removed.');
        return;
    }

    if (dryRun) {
        console.log('Mode: DRY RUN (no files will be modified)');
    } else {
        console.log('Mode: APPLY');
    }
    console.log('');

    // Build hashes
    console.log('Step 1: Generating content hashes...');
    const hashes = buildAssetHashes();

    for (const [asset, hash] of Object.entries(hashes)) {
        console.log(`  ${asset} => ${hash}`);
    }
    console.log('');

    // Load previous manifest to detect changes
    const oldManifest = loadManifest();
    const changedAssets = [];

    for (const [asset, hash] of Object.entries(hashes)) {
        if (oldManifest.assets[asset] !== hash) {
            changedAssets.push(asset);
        }
    }

    if (changedAssets.length > 0) {
        console.log('Changed assets detected:');
        for (const asset of changedAssets) {
            const oldHash = oldManifest.assets[asset] || '(new)';
            console.log(`  ${asset}: ${oldHash} => ${hashes[asset]}`);
        }
    } else {
        console.log('No asset changes detected.');
    }
    console.log('');

    // Update HTML files
    console.log('Step 2: Updating HTML files...');
    const htmlFiles = getHtmlFiles();
    let totalChanges = 0;

    for (const htmlFile of htmlFiles) {
        const changes = updateHtmlFile(htmlFile, hashes, dryRun);
        if (changes.length > 0) {
            console.log(`  ${path.basename(htmlFile)}: ${changes.length} reference(s) updated`);
            totalChanges += changes.length;
        }
    }

    if (totalChanges === 0) {
        console.log('  No changes needed - all references up to date.');
    }
    console.log('');

    // Save manifest
    if (!dryRun) {
        console.log('Step 3: Saving manifest...');
        saveManifest({ assets: hashes });
        console.log('  Saved: .cache-manifest.json');
        console.log('');
    }

    // Summary
    console.log('========================================');
    if (dryRun) {
        console.log(`  Would update ${totalChanges} reference(s)`);
        console.log('  Run without --check to apply changes');
    } else {
        console.log(`  Updated ${totalChanges} reference(s)`);
        console.log('  Cache busting complete!');
    }
    console.log('========================================');
    console.log('');
}

main();
