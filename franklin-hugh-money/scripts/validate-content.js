#!/usr/bin/env node
/**
 * Content Validation Script for Franklin Hugh Money
 *
 * Validates that SIE exam content is properly synced across all files:
 * - Chapter HTML files exist for all chapters in navigation config
 * - Study materials page has cards for all available chapters
 * - Progress badge matches actual available chapter count
 * - Navigation config matches actual files
 *
 * Usage:
 *   node scripts/validate-content.js          # Run validation
 *   node scripts/validate-content.js --fix    # Show suggested fixes
 *
 * Exit codes:
 *   0 = All validations passed
 *   1 = Validation errors found
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..');
const CONTENT_DIR = path.join(__dirname, '..', 'content', 'sie-exam', 'chapters');

let errors = [];
let warnings = [];

/**
 * Get all SIE chapter HTML files in public/
 */
function getChapterFiles() {
    const files = fs.readdirSync(PUBLIC_DIR)
        .filter(f => f.match(/^sie-chapter-\d+.*\.html$/))
        .sort();
    return files;
}

/**
 * Parse navigation config to get chapter structure
 */
function parseNavigationConfig() {
    const configPath = path.join(PUBLIC_DIR, 'assets', 'js', 'sie-navigation-config.js');
    const content = fs.readFileSync(configPath, 'utf8');

    // Extract chapters array using regex (simple parser)
    const chapters = [];
    const chapterRegex = /number:\s*(\d+),\s*\n\s*title:\s*"([^"]+)"/g;
    let match;

    while ((match = chapterRegex.exec(content)) !== null) {
        chapters.push({
            number: parseInt(match[1]),
            title: match[2]
        });
    }

    // Extract sections for each chapter
    const sectionRegex = /id:\s*"(\d+\.\d+)"[^}]*file:\s*"([^"]+)"[^}]*locked:\s*(true|false)/g;
    const sections = [];

    while ((match = sectionRegex.exec(content)) !== null) {
        sections.push({
            id: match[1],
            file: match[2],
            locked: match[3] === 'true'
        });
    }

    return { chapters, sections };
}

/**
 * Parse study materials page to get chapter cards
 */
function parseStudyMaterials() {
    const htmlPath = path.join(PUBLIC_DIR, 'sie-study-materials.html');
    const content = fs.readFileSync(htmlPath, 'utf8');

    // Count available chapters (with chapter-card--available class)
    const availableMatches = content.match(/chapter-card--available/g) || [];
    const availableCount = availableMatches.length;

    // Extract progress badge number
    const badgeMatch = content.match(/(\d+)\s+of\s+(\d+)\s+Chapters?\s+Available/i);
    const badgeCount = badgeMatch ? parseInt(badgeMatch[1]) : 0;
    const totalChapters = badgeMatch ? parseInt(badgeMatch[2]) : 0;

    // Get chapter links
    const linkRegex = /href="(sie-chapter-\d+[^"]*\.html)"/g;
    const links = [];
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
        links.push(match[1]);
    }

    return { availableCount, badgeCount, totalChapters, links };
}

/**
 * Get chapter meta files
 */
function getChapterMeta() {
    const chapters = [];

    if (!fs.existsSync(CONTENT_DIR)) {
        return chapters;
    }

    const dirs = fs.readdirSync(CONTENT_DIR).filter(d =>
        fs.statSync(path.join(CONTENT_DIR, d)).isDirectory()
    );

    for (const dir of dirs) {
        const metaPath = path.join(CONTENT_DIR, dir, 'chapter-meta.json');
        if (fs.existsSync(metaPath)) {
            try {
                const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
                chapters.push({
                    dir,
                    ...meta
                });
            } catch (e) {
                warnings.push(`Could not parse ${metaPath}: ${e.message}`);
            }
        }
    }

    return chapters;
}

/**
 * Main validation
 */
function validate() {
    console.log('');
    console.log('========================================');
    console.log('  SIE Content Validation');
    console.log('========================================');
    console.log('');

    // 1. Get all data sources
    console.log('Scanning content...');
    const chapterFiles = getChapterFiles();
    const navConfig = parseNavigationConfig();
    const studyMaterials = parseStudyMaterials();
    const chapterMeta = getChapterMeta();

    console.log(`  Found ${chapterFiles.length} chapter HTML files`);
    console.log(`  Found ${navConfig.sections.length} sections in navigation config`);
    console.log(`  Found ${studyMaterials.links.length} chapter links in study materials`);
    console.log(`  Found ${chapterMeta.length} chapter meta files`);
    console.log('');

    // 2. Validate navigation config files exist
    console.log('Checking navigation config...');
    const unlockedSections = navConfig.sections.filter(s => !s.locked);

    for (const section of unlockedSections) {
        const filePath = path.join(PUBLIC_DIR, section.file);
        if (!fs.existsSync(filePath)) {
            errors.push(`Navigation config references missing file: ${section.file}`);
        }
    }

    if (errors.length === 0) {
        console.log(`  ✓ All ${unlockedSections.length} unlocked section files exist`);
    }

    // 3. Validate study materials links
    console.log('Checking study materials page...');
    for (const link of studyMaterials.links) {
        const filePath = path.join(PUBLIC_DIR, link);
        if (!fs.existsSync(filePath)) {
            errors.push(`Study materials links to missing file: ${link}`);
        }
    }

    // 4. Validate progress badge
    // Count unique chapters that are available (not just sections)
    const availableChapterNumbers = new Set();
    for (const section of unlockedSections) {
        const chapterNum = section.id.split('.')[0];
        availableChapterNumbers.add(chapterNum);
    }
    const actualAvailableChapters = availableChapterNumbers.size;

    if (studyMaterials.badgeCount !== actualAvailableChapters) {
        errors.push(
            `Progress badge says "${studyMaterials.badgeCount} of ${studyMaterials.totalChapters}" ` +
            `but ${actualAvailableChapters} chapters have unlocked content in navigation config`
        );
    } else {
        console.log(`  ✓ Progress badge correct: ${studyMaterials.badgeCount} chapters available`);
    }

    // 5. Check for chapter files not in study materials
    const linkedFiles = new Set(studyMaterials.links);
    const firstSectionPerChapter = {};

    for (const section of unlockedSections) {
        const chapterNum = section.id.split('.')[0];
        if (!firstSectionPerChapter[chapterNum]) {
            firstSectionPerChapter[chapterNum] = section.file;
        }
    }

    for (const [chapterNum, file] of Object.entries(firstSectionPerChapter)) {
        if (!linkedFiles.has(file)) {
            // Check if ANY file from this chapter is linked
            const chapterLinked = studyMaterials.links.some(l => l.includes(`chapter-${chapterNum}`));
            if (!chapterLinked) {
                errors.push(
                    `Chapter ${chapterNum} has unlocked content but no link in study materials page. ` +
                    `Add a card linking to: ${file}`
                );
            }
        }
    }

    // 6. Check for duplicate meta tags (common error)
    const studyMaterialsContent = fs.readFileSync(
        path.join(PUBLIC_DIR, 'sie-study-materials.html'),
        'utf8'
    );
    const cacheControlCount = (studyMaterialsContent.match(/Cache-Control/g) || []).length;
    if (cacheControlCount > 1) {
        warnings.push(`study-materials.html has ${cacheControlCount} Cache-Control meta tags (should be 0-1)`);
    }

    // Results
    console.log('');
    console.log('========================================');

    if (warnings.length > 0) {
        console.log('');
        console.log('⚠️  Warnings:');
        for (const warning of warnings) {
            console.log(`   • ${warning}`);
        }
    }

    if (errors.length > 0) {
        console.log('');
        console.log('❌ Errors found:');
        for (const error of errors) {
            console.log(`   • ${error}`);
        }
        console.log('');
        console.log('========================================');
        console.log(`  ${errors.length} error(s), ${warnings.length} warning(s)`);
        console.log('========================================');
        console.log('');
        return 1;
    }

    console.log('');
    console.log('✅ All validations passed!');
    console.log('========================================');
    console.log('');
    return 0;
}

// Run validation
const exitCode = validate();
process.exit(exitCode);
