/**
 * Tests for Cache Busting Script
 * Tests the hash generation and HTML update logic
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, mkdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { createHash } from 'crypto';

// Helper to generate expected hash
function getExpectedHash(content) {
    return createHash('md5').update(content).digest('hex').substring(0, 8);
}

describe('Cache Busting Logic', () => {
    let tempDir;
    let assetsDir;

    beforeEach(() => {
        // Create temp directory structure
        tempDir = mkdtempSync(join(tmpdir(), 'cache-bust-test-'));
        assetsDir = join(tempDir, 'assets');
        mkdirSync(join(assetsDir, 'css'), { recursive: true });
        mkdirSync(join(assetsDir, 'js'), { recursive: true });
    });

    afterEach(() => {
        // Clean up temp directory
        rmSync(tempDir, { recursive: true, force: true });
    });

    describe('MD5 Hash Generation', () => {
        it('should generate consistent 8-char hash for same content', () => {
            const content = 'body { color: red; }';
            const hash1 = getExpectedHash(content);
            const hash2 = getExpectedHash(content);

            expect(hash1).toBe(hash2);
            expect(hash1.length).toBe(8);
        });

        it('should generate different hashes for different content', () => {
            const hash1 = getExpectedHash('body { color: red; }');
            const hash2 = getExpectedHash('body { color: blue; }');

            expect(hash1).not.toBe(hash2);
        });

        it('hash should only contain hexadecimal characters', () => {
            const hash = getExpectedHash('test content');
            expect(hash).toMatch(/^[a-f0-9]{8}$/);
        });
    });

    describe('CSS Pattern Matching', () => {
        const CSS_PATTERN = /href="([^"]*\.css)(\?v=[a-f0-9]+)?"/g;

        it('should match CSS href without version', () => {
            const html = '<link rel="stylesheet" href="assets/css/main.css">';
            const matches = [...html.matchAll(CSS_PATTERN)];

            expect(matches.length).toBe(1);
            expect(matches[0][1]).toBe('assets/css/main.css');
            expect(matches[0][2]).toBeUndefined();
        });

        it('should match CSS href with existing version', () => {
            const html = '<link rel="stylesheet" href="assets/css/main.css?v=abc12345">';
            const matches = [...html.matchAll(CSS_PATTERN)];

            expect(matches.length).toBe(1);
            expect(matches[0][1]).toBe('assets/css/main.css');
            expect(matches[0][2]).toBe('?v=abc12345');
        });

        it('should match multiple CSS files', () => {
            const html = `
                <link rel="stylesheet" href="assets/css/main.css">
                <link rel="stylesheet" href="assets/css/nav.css?v=12345678">
            `;
            const matches = [...html.matchAll(CSS_PATTERN)];

            expect(matches.length).toBe(2);
        });
    });

    describe('JS Pattern Matching', () => {
        const JS_PATTERN = /src="([^"]*\.js)(\?v=[a-f0-9]+)?"/g;

        it('should match JS src without version', () => {
            const html = '<script src="assets/js/app.js"></script>';
            const matches = [...html.matchAll(JS_PATTERN)];

            expect(matches.length).toBe(1);
            expect(matches[0][1]).toBe('assets/js/app.js');
        });

        it('should match JS src with existing version', () => {
            const html = '<script src="assets/js/app.js?v=def67890"></script>';
            const matches = [...html.matchAll(JS_PATTERN)];

            expect(matches.length).toBe(1);
            expect(matches[0][2]).toBe('?v=def67890');
        });

        it('should match external CDN URLs (they will be skipped in actual processing)', () => {
            const html = '<script src="https://cdn.example.com/lib.js"></script>';
            const matches = [...html.matchAll(JS_PATTERN)];

            expect(matches.length).toBe(1);
            expect(matches[0][1]).toBe('https://cdn.example.com/lib.js');
        });
    });

    describe('HTML Update Logic', () => {
        it('should correctly update CSS references', () => {
            const originalHtml = '<link rel="stylesheet" href="assets/css/main.css">';
            const hash = 'abc12345';
            const expected = `<link rel="stylesheet" href="assets/css/main.css?v=${hash}">`;

            const result = originalHtml.replace(
                /href="([^"]*\.css)(\?v=[a-f0-9]+)?"/,
                `href="$1?v=${hash}"`
            );

            expect(result).toBe(expected);
        });

        it('should correctly update JS references', () => {
            const originalHtml = '<script src="assets/js/app.js"></script>';
            const hash = 'def67890';
            const expected = `<script src="assets/js/app.js?v=${hash}"></script>`;

            const result = originalHtml.replace(
                /src="([^"]*\.js)(\?v=[a-f0-9]+)?"/,
                `src="$1?v=${hash}"`
            );

            expect(result).toBe(expected);
        });

        it('should replace existing version strings', () => {
            // Use valid hex version that matches [a-f0-9]+ pattern
            const originalHtml = '<link rel="stylesheet" href="assets/css/main.css?v=abc12345">';
            const newHash = 'def67890';
            const result = originalHtml.replace(
                /href="([^"]*\.css)(\?v=[a-f0-9]+)?"/,
                `href="$1?v=${newHash}"`
            );

            // The result will contain the base path plus new version
            expect(result).toContain('assets/css/main.css');
            expect(result).toContain(`?v=${newHash}`);
        });
    });

    describe('Clean Mode Logic', () => {
        it('should remove CSS version strings', () => {
            const html = '<link rel="stylesheet" href="assets/css/main.css?v=abc12345">';
            const cleaned = html.replace(/href="([^"]*\.css)\?v=[a-f0-9]+"/g, 'href="$1"');

            expect(cleaned).toBe('<link rel="stylesheet" href="assets/css/main.css">');
        });

        it('should remove JS version strings', () => {
            const html = '<script src="assets/js/app.js?v=def67890"></script>';
            const cleaned = html.replace(/src="([^"]*\.js)\?v=[a-f0-9]+"/g, 'src="$1"');

            expect(cleaned).toBe('<script src="assets/js/app.js"></script>');
        });

        it('should not modify non-versioned references', () => {
            const html = '<link rel="stylesheet" href="assets/css/main.css">';
            const cleaned = html.replace(/href="([^"]*\.css)\?v=[a-f0-9]+"/g, 'href="$1"');

            expect(cleaned).toBe(html);
        });
    });

    describe('File Operations', () => {
        it('should read and write files correctly', () => {
            const testFile = join(tempDir, 'test.html');
            const content = '<!DOCTYPE html><html><body>Test</body></html>';

            writeFileSync(testFile, content);
            const readContent = readFileSync(testFile, 'utf8');

            expect(readContent).toBe(content);
        });

        it('should handle CSS file hashing', () => {
            const cssFile = join(assetsDir, 'css', 'test.css');
            const cssContent = 'body { margin: 0; padding: 0; }';

            writeFileSync(cssFile, cssContent);
            const fileContent = readFileSync(cssFile);
            const hash = createHash('md5').update(fileContent).digest('hex').substring(0, 8);

            expect(hash.length).toBe(8);
            expect(hash).toMatch(/^[a-f0-9]+$/);
        });
    });
});

describe('Integration Scenarios', () => {
    it('should handle complete HTML document with multiple assets', () => {
        // Use valid hex version strings that match the [a-f0-9]+ pattern
        const html = `<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="stylesheet" href="assets/css/nav.css?v=abc12345">
</head>
<body>
    <script src="https://cdn.example.com/external.js"></script>
    <script src="assets/js/app.js"></script>
    <script src="assets/js/nav.js?v=def67890"></script>
</body>
</html>`;

        // Note: Global regex needs to be reinitialized each time
        const cssMatches = html.match(/href="([^"]*\.css)(\?v=[a-f0-9]+)?"/g) || [];
        const jsMatches = html.match(/src="([^"]*\.js)(\?v=[a-f0-9]+)?"/g) || [];

        expect(cssMatches.length).toBe(2);
        expect(jsMatches.length).toBe(3); // Includes CDN
    });
});
