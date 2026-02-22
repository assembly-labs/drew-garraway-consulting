#!/usr/bin/env node
/**
 * Flashcard Generation Script for SIE Exam Preparation
 *
 * Parses markdown content files to generate flashcards for study.
 * Maps chapters to FINRA exam sections and applies quality filters.
 *
 * Usage:
 *   node scripts/generate-flashcards.js
 *
 * Output:
 *   assets/data/flashcards.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '..', 'content', 'sie-exam', 'chapters');
const OUTPUT_FILE = path.join(__dirname, '..', 'assets', 'data', 'flashcards.json');

/**
 * FINRA Section mapping based on content type
 * Section 1: Knowledge of Capital Markets (16%)
 * Section 2: Understanding Products and Their Risks (44%)
 * Section 3: Understanding Trading, Customer Accounts and Prohibited Activities (31%)
 * Section 4: Overview of the Regulatory Framework (9%)
 */
const CHAPTER_TO_SECTION = {
    1: { section: 1, weight: 0.16, name: 'Knowledge of Capital Markets' },
    2: { section: 1, weight: 0.16, name: 'Knowledge of Capital Markets' },
    3: { section: 2, weight: 0.44, name: 'Understanding Products and Their Risks' },
    4: { section: 2, weight: 0.44, name: 'Understanding Products and Their Risks' },
    5: { section: 2, weight: 0.44, name: 'Understanding Products and Their Risks' },
    6: { section: 2, weight: 0.44, name: 'Understanding Products and Their Risks' },
    7: { section: 1, weight: 0.16, name: 'Knowledge of Capital Markets' },
    8: { section: 3, weight: 0.31, name: 'Understanding Trading, Customer Accounts' },
    9: { section: 3, weight: 0.31, name: 'Understanding Trading, Customer Accounts' },
    10: { section: 3, weight: 0.31, name: 'Understanding Trading, Customer Accounts' },
    11: { section: 3, weight: 0.31, name: 'Understanding Trading, Customer Accounts' },
    12: { section: 3, weight: 0.31, name: 'Understanding Trading, Customer Accounts' },
    13: { section: 4, weight: 0.09, name: 'Overview of the Regulatory Framework' },
    14: { section: 4, weight: 0.09, name: 'Overview of the Regulatory Framework' },
    15: { section: 4, weight: 0.09, name: 'Overview of the Regulatory Framework' },
    16: { section: 4, weight: 0.09, name: 'Overview of the Regulatory Framework' },
};

let cardIdCounter = 0;

/**
 * Generate a unique card ID
 */
function generateCardId(chapter, sectionNum) {
    cardIdCounter++;
    return `ch${chapter}-s${sectionNum}-${String(cardIdCounter).padStart(3, '0')}`;
}

/**
 * Clean text by removing HTML tags, extra whitespace, and normalizing
 */
function cleanText(text) {
    if (!text) return '';
    return text
        .replace(/<[^>]+>/g, '') // Remove HTML tags
        .replace(/\*\*/g, '') // Remove bold markers
        .replace(/`([^`]+)`/g, '$1') // Remove inline code markers
        .replace(/<span[^>]*>([^<]*)<\/span>/g, '$1') // Remove span tags
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
}

/**
 * Check if text is too similar (front ≈ back)
 */
function isTooSimilar(front, back) {
    const frontClean = front.toLowerCase().replace(/[^a-z0-9]/g, '');
    const backClean = back.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (frontClean === backClean) return true;
    if (backClean.includes(frontClean) && frontClean.length > backClean.length * 0.8) return true;

    return false;
}

/**
 * Count words in text
 */
function wordCount(text) {
    return text.split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Parse YAML frontmatter from markdown content
 */
function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return {};

    const yaml = match[1];
    const result = {};

    yaml.split('\n').forEach(line => {
        const colonIdx = line.indexOf(':');
        if (colonIdx > 0) {
            const key = line.substring(0, colonIdx).trim();
            let value = line.substring(colonIdx + 1).trim();
            // Remove quotes
            value = value.replace(/^["']|["']$/g, '');
            result[key] = value;
        }
    });

    return result;
}

/**
 * Extract bold term definitions
 * Pattern: **term** followed by explanatory text
 */
function extractBoldDefinitions(content, chapter, sectionNum) {
    const cards = [];

    // Pattern 1: "A/An **term** is/are/refers to..."
    const definitionPattern =
        /(?:A|An|The)\s+\*\*([^*]+)\*\*\s+(?:is|are|refers to|means)\s+([^.]+(?:\.[^.]+)?)/gi;
    let match;

    while ((match = definitionPattern.exec(content)) !== null) {
        const term = cleanText(match[1]);
        const definition = cleanText(match[2]);

        if (term && definition && wordCount(definition) >= 5) {
            cards.push({
                id: generateCardId(chapter, sectionNum),
                front: `What is ${term.toLowerCase().startsWith('a ') ? '' : 'a '}${term}?`,
                back: definition.charAt(0).toUpperCase() + definition.slice(1),
                chapter: `chapter-${String(chapter).padStart(2, '0')}`,
                section: CHAPTER_TO_SECTION[chapter]?.section || 2,
                weight: CHAPTER_TO_SECTION[chapter]?.weight || 0.44,
                source: 'auto',
                tags: ['definition'],
            });
        }
    }

    // Pattern 2: **Term** - description or **Term**: description
    const dashPattern = /\*\*([^*]+)\*\*\s*[-:–]\s*([^.\n]+(?:\.[^.\n]+)?)/g;

    while ((match = dashPattern.exec(content)) !== null) {
        const term = cleanText(match[1]);
        const definition = cleanText(match[2]);

        if (term && definition && wordCount(definition) >= 5 && !isTooSimilar(term, definition)) {
            // Check for duplicates
            const exists = cards.some(c => c.front.toLowerCase().includes(term.toLowerCase()));
            if (!exists) {
                cards.push({
                    id: generateCardId(chapter, sectionNum),
                    front: `What is ${term}?`,
                    back: definition.charAt(0).toUpperCase() + definition.slice(1),
                    chapter: `chapter-${String(chapter).padStart(2, '0')}`,
                    section: CHAPTER_TO_SECTION[chapter]?.section || 2,
                    weight: CHAPTER_TO_SECTION[chapter]?.weight || 0.44,
                    source: 'auto',
                    tags: ['definition'],
                });
            }
        }
    }

    return cards;
}

/**
 * Extract comparison table cards
 */
function extractTableCards(content, chapter, sectionNum) {
    const cards = [];

    // Find markdown tables
    const tablePattern = /\|([^|]+\|)+\n\|[-:| ]+\|\n((?:\|[^|]+\|)+\n?)+/g;
    let match;

    while ((match = tablePattern.exec(content)) !== null) {
        const tableText = match[0];
        const lines = tableText.trim().split('\n');

        if (lines.length < 3) continue;

        // Parse headers
        const headers = lines[0]
            .split('|')
            .map(h => cleanText(h))
            .filter(h => h);

        if (headers.length < 2) continue;

        // Skip separator line (index 1) and parse data rows
        for (let i = 2; i < lines.length; i++) {
            const cells = lines[i]
                .split('|')
                .map(c => cleanText(c))
                .filter(c => c);

            if (cells.length >= 2) {
                // Create cards from table rows
                const feature = cells[0];

                for (let j = 1; j < cells.length && j < headers.length; j++) {
                    const value = cells[j];
                    const category = headers[j];

                    if (feature && value && category && wordCount(value) >= 2) {
                        cards.push({
                            id: generateCardId(chapter, sectionNum),
                            front: `${category}: What is the ${feature.toLowerCase()}?`,
                            back: value,
                            chapter: `chapter-${String(chapter).padStart(2, '0')}`,
                            section: CHAPTER_TO_SECTION[chapter]?.section || 2,
                            weight: CHAPTER_TO_SECTION[chapter]?.weight || 0.44,
                            source: 'auto',
                            tags: ['comparison'],
                        });
                    }
                }
            }
        }
    }

    return cards;
}

/**
 * Extract test tips and exam focus content
 */
function extractTestTips(content, chapter, sectionNum) {
    const cards = [];

    // Blockquote test tips
    const tipPattern = />\s*\*\*Test-Taking Tip\*\*:\s*([^\n]+(?:\n>[^\n]+)*)/gi;
    let match;

    while ((match = tipPattern.exec(content)) !== null) {
        const tip = cleanText(match[1].replace(/\n>/g, ' '));

        if (tip && wordCount(tip) >= 8) {
            cards.push({
                id: generateCardId(chapter, sectionNum),
                front: 'Test-Taking Tip: What should you remember?',
                back: tip,
                chapter: `chapter-${String(chapter).padStart(2, '0')}`,
                section: CHAPTER_TO_SECTION[chapter]?.section || 2,
                weight: CHAPTER_TO_SECTION[chapter]?.weight || 0.44,
                source: 'auto',
                tags: ['exam-tip'],
            });
        }
    }

    // HTML exam-focus divs
    const examFocusPattern =
        /<div class="exam-focus">[^<]*<[^>]*>[^<]*<\/[^>]*>\s*<p>([^<]+)<\/p>/gi;

    while ((match = examFocusPattern.exec(content)) !== null) {
        const focus = cleanText(match[1]);

        if (focus && wordCount(focus) >= 8) {
            cards.push({
                id: generateCardId(chapter, sectionNum),
                front: 'Exam Focus: What is important to know?',
                back: focus,
                chapter: `chapter-${String(chapter).padStart(2, '0')}`,
                section: CHAPTER_TO_SECTION[chapter]?.section || 2,
                weight: CHAPTER_TO_SECTION[chapter]?.weight || 0.44,
                source: 'auto',
                tags: ['exam-focus'],
            });
        }
    }

    return cards;
}

/**
 * Extract key terms from Quick Reference sections
 */
function extractKeyTerms(content, chapter, sectionNum) {
    const cards = [];

    // Look for Key Terms section
    const keyTermsMatch = content.match(/\*\*Key Terms:\*\*\n((?:- [^\n]+\n?)+)/i);

    if (keyTermsMatch) {
        const termsBlock = keyTermsMatch[1];
        const termPattern = /- \*\*([^*]+)\*\*:\s*([^\n]+)/g;
        let match;

        while ((match = termPattern.exec(termsBlock)) !== null) {
            const term = cleanText(match[1]);
            const definition = cleanText(match[2]);

            if (term && definition && wordCount(definition) >= 3) {
                cards.push({
                    id: generateCardId(chapter, sectionNum),
                    front: `Define: ${term}`,
                    back: definition,
                    chapter: `chapter-${String(chapter).padStart(2, '0')}`,
                    section: CHAPTER_TO_SECTION[chapter]?.section || 2,
                    weight: CHAPTER_TO_SECTION[chapter]?.weight || 0.44,
                    source: 'auto',
                    tags: ['key-term'],
                });
            }
        }
    }

    // Also extract span key-terms
    const spanPattern = /<span class="key-term">([^<]+)<\/span>/g;
    let match;
    const foundTerms = new Set();

    while ((match = spanPattern.exec(content)) !== null) {
        const term = cleanText(match[1]);
        if (term && !foundTerms.has(term.toLowerCase())) {
            foundTerms.add(term.toLowerCase());

            // Try to find a definition nearby
            const termIdx = content.indexOf(match[0]);
            const surroundingText = content.substring(termIdx, termIdx + 300);
            const defMatch = surroundingText.match(
                new RegExp(`${term}[^.]*(?:is|are|means|refers to)\\s+([^.]+)`, 'i')
            );

            if (defMatch) {
                const definition = cleanText(defMatch[1]);
                if (definition && wordCount(definition) >= 3) {
                    cards.push({
                        id: generateCardId(chapter, sectionNum),
                        front: `What is ${term}?`,
                        back: definition,
                        chapter: `chapter-${String(chapter).padStart(2, '0')}`,
                        section: CHAPTER_TO_SECTION[chapter]?.section || 2,
                        weight: CHAPTER_TO_SECTION[chapter]?.weight || 0.44,
                        source: 'auto',
                        tags: ['key-term'],
                    });
                }
            }
        }
    }

    return cards;
}

/**
 * Extract bullet list items under headers
 */
function extractListItems(content, chapter, sectionNum) {
    const cards = [];

    // Find headers followed by bullet lists about characteristics/features
    const listPattern =
        /###?\s*(?:Characteristics|Features|Key Points|Important Points)[^\n]*\n\n?((?:- [^\n]+\n?)+)/gi;
    let match;

    while ((match = listPattern.exec(content)) !== null) {
        const headerMatch = match[0].match(/###?\s*([^\n]+)/);
        const header = headerMatch ? cleanText(headerMatch[1]) : 'Key Points';
        const items = match[1]
            .split('\n')
            .map(line => line.replace(/^-\s*/, '').trim())
            .filter(line => line.length > 0);

        if (items.length >= 2) {
            cards.push({
                id: generateCardId(chapter, sectionNum),
                front: `What are the ${header.toLowerCase()}?`,
                back: items.map(item => `• ${cleanText(item)}`).join('\n'),
                chapter: `chapter-${String(chapter).padStart(2, '0')}`,
                section: CHAPTER_TO_SECTION[chapter]?.section || 2,
                weight: CHAPTER_TO_SECTION[chapter]?.weight || 0.44,
                source: 'auto',
                tags: ['list'],
            });
        }
    }

    return cards;
}

/**
 * Extract acronym definitions
 */
function extractAcronyms(content, chapter, sectionNum) {
    const cards = [];
    const foundAcronyms = new Set();

    // Pattern: **ACRONYM** = Full Name or (ACRONYM) pattern
    const acronymPattern = /\*\*([A-Z]{2,}[s]?)\*\*|(?:\(([A-Z]{2,}[s]?)\))/g;
    let match;

    while ((match = acronymPattern.exec(content)) !== null) {
        const acronym = match[1] || match[2];

        if (acronym && !foundAcronyms.has(acronym)) {
            foundAcronyms.add(acronym);

            // Look for the full name nearby
            const searchStart = Math.max(0, match.index - 200);
            const searchEnd = Math.min(content.length, match.index + 200);
            const surroundingText = content.substring(searchStart, searchEnd);

            // Common patterns for acronym definitions
            const patterns = [
                new RegExp(`([A-Z][a-z]+(?:\\s+[A-Za-z]+){1,5})\\s*\\(${acronym}\\)`, 'i'),
                new RegExp(
                    `\\*\\*${acronym}\\*\\*[^a-zA-Z]*([A-Z][a-z]+(?:\\s+[A-Za-z]+){1,5})`,
                    'i'
                ),
                new RegExp(`${acronym}\\s*[-–:]\\s*([A-Z][a-z]+(?:\\s+[A-Za-z]+){1,5})`, 'i'),
            ];

            for (const pattern of patterns) {
                const defMatch = surroundingText.match(pattern);
                if (defMatch) {
                    const fullName = cleanText(defMatch[1]);
                    if (fullName && fullName.length > acronym.length) {
                        cards.push({
                            id: generateCardId(chapter, sectionNum),
                            front: `What does ${acronym} stand for?`,
                            back: fullName,
                            chapter: `chapter-${String(chapter).padStart(2, '0')}`,
                            section: CHAPTER_TO_SECTION[chapter]?.section || 2,
                            weight: CHAPTER_TO_SECTION[chapter]?.weight || 0.44,
                            source: 'auto',
                            tags: ['acronym'],
                        });
                        break;
                    }
                }
            }
        }
    }

    return cards;
}

/**
 * Process a single markdown file
 */
function processMarkdownFile(filePath, chapter, sectionNum) {
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatter = parseFrontmatter(content);

    // Remove frontmatter for parsing
    const mainContent = content.replace(/^---\n[\s\S]*?\n---\n?/, '');

    const cards = [
        ...extractBoldDefinitions(mainContent, chapter, sectionNum),
        ...extractTableCards(mainContent, chapter, sectionNum),
        ...extractTestTips(mainContent, chapter, sectionNum),
        ...extractKeyTerms(mainContent, chapter, sectionNum),
        ...extractListItems(mainContent, chapter, sectionNum),
        ...extractAcronyms(mainContent, chapter, sectionNum),
    ];

    return cards;
}

/**
 * Apply quality filters to cards
 */
function filterCards(cards) {
    const seen = new Map();

    return cards.filter(card => {
        // Skip if front ≈ back
        if (isTooSimilar(card.front, card.back)) {
            return false;
        }

        // Skip if back is too short
        if (wordCount(card.back) < 5) {
            return false;
        }

        // Dedupe by front text (keep first/more complete)
        const frontKey = card.front.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (seen.has(frontKey)) {
            const existing = seen.get(frontKey);
            // Keep the one with longer back
            if (card.back.length > existing.back.length) {
                seen.set(frontKey, card);
            }
            return false;
        }

        seen.set(frontKey, card);
        return true;
    });
}

/**
 * Main function
 */
function main() {
    console.log('');
    console.log('========================================');
    console.log('  SIE Flashcard Generation');
    console.log('========================================');
    console.log('');

    if (!fs.existsSync(CONTENT_DIR)) {
        console.error(`Content directory not found: ${CONTENT_DIR}`);
        process.exit(1);
    }

    const allCards = [];
    const stats = {
        byChapter: {},
        bySection: { 1: 0, 2: 0, 3: 0, 4: 0 },
        byTag: {},
    };

    // Find all chapter directories
    const chapterDirs = fs
        .readdirSync(CONTENT_DIR)
        .filter(d => d.startsWith('chapter-'))
        .sort();

    console.log(`Found ${chapterDirs.length} chapter directories`);
    console.log('');

    for (const chapterDir of chapterDirs) {
        const chapterPath = path.join(CONTENT_DIR, chapterDir);
        const chapterMatch = chapterDir.match(/chapter-(\d+)/);

        if (!chapterMatch) continue;

        const chapterNum = parseInt(chapterMatch[1]);
        stats.byChapter[chapterNum] = 0;

        // Find all section markdown files
        const sectionFiles = fs
            .readdirSync(chapterPath)
            .filter(f => f.endsWith('.md') && f.startsWith('section-'))
            .sort();

        for (const sectionFile of sectionFiles) {
            const sectionPath = path.join(chapterPath, sectionFile);
            const sectionMatch = sectionFile.match(/section-(\d+)/);
            const sectionNum = sectionMatch ? parseInt(sectionMatch[1]) : 0;

            console.log(`Processing: ${chapterDir}/${sectionFile}`);

            const cards = processMarkdownFile(sectionPath, chapterNum, sectionNum);
            allCards.push(...cards);

            stats.byChapter[chapterNum] += cards.length;
        }
    }

    console.log('');
    console.log('Applying quality filters...');

    const filteredCards = filterCards(allCards);

    // Update stats
    for (const card of filteredCards) {
        stats.bySection[card.section]++;
        for (const tag of card.tags || []) {
            stats.byTag[tag] = (stats.byTag[tag] || 0) + 1;
        }
    }

    // Write output
    const output = {
        generated: new Date().toISOString(),
        totalCards: filteredCards.length,
        cards: filteredCards,
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

    console.log('');
    console.log('========================================');
    console.log('  Generation Complete');
    console.log('========================================');
    console.log('');
    console.log(`Total cards generated: ${filteredCards.length}`);
    console.log(`(Filtered from ${allCards.length} raw cards)`);
    console.log('');
    console.log('Cards by FINRA Section:');
    console.log(`  Section 1 (Capital Markets, 16%): ${stats.bySection[1]} cards`);
    console.log(`  Section 2 (Products/Risks, 44%): ${stats.bySection[2]} cards`);
    console.log(`  Section 3 (Trading/Accounts, 31%): ${stats.bySection[3]} cards`);
    console.log(`  Section 4 (Regulatory, 9%): ${stats.bySection[4]} cards`);
    console.log('');
    console.log('Cards by Chapter:');
    for (const [chapter, count] of Object.entries(stats.byChapter)) {
        if (count > 0) {
            console.log(`  Chapter ${chapter}: ${count} cards`);
        }
    }
    console.log('');
    console.log('Cards by Type:');
    for (const [tag, count] of Object.entries(stats.byTag)) {
        console.log(`  ${tag}: ${count} cards`);
    }
    console.log('');
    console.log(`Output written to: ${OUTPUT_FILE}`);
    console.log('');
}

main();
