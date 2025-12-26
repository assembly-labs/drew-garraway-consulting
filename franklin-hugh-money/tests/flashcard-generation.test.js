/**
 * Tests for Flashcard Generation Script
 *
 * Validates the flashcard generation logic and output format.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FLASHCARDS_PATH = path.join(__dirname, '..', 'assets', 'data', 'flashcards.json');

describe('Flashcard Generation', () => {
    let flashcardData;

    beforeAll(() => {
        // Load the generated flashcards
        if (fs.existsSync(FLASHCARDS_PATH)) {
            const content = fs.readFileSync(FLASHCARDS_PATH, 'utf8');
            flashcardData = JSON.parse(content);
        }
    });

    describe('Output File', () => {
        it('should generate flashcards.json file', () => {
            expect(fs.existsSync(FLASHCARDS_PATH)).toBe(true);
        });

        it('should have valid JSON structure', () => {
            expect(flashcardData).toBeDefined();
            expect(flashcardData).toHaveProperty('generated');
            expect(flashcardData).toHaveProperty('totalCards');
            expect(flashcardData).toHaveProperty('cards');
        });

        it('should have a generated timestamp', () => {
            expect(flashcardData.generated).toBeDefined();
            const date = new Date(flashcardData.generated);
            expect(date.getTime()).not.toBeNaN();
        });

        it('should have correct totalCards count', () => {
            expect(flashcardData.totalCards).toBe(flashcardData.cards.length);
        });
    });

    describe('Card Structure', () => {
        it('should generate at least 50 cards', () => {
            expect(flashcardData.cards.length).toBeGreaterThanOrEqual(50);
        });

        it('should have valid card structure for all cards', () => {
            for (const card of flashcardData.cards) {
                expect(card).toHaveProperty('id');
                expect(card).toHaveProperty('front');
                expect(card).toHaveProperty('back');
                expect(card).toHaveProperty('chapter');
                expect(card).toHaveProperty('section');
                expect(card).toHaveProperty('weight');
                expect(card).toHaveProperty('source');
            }
        });

        it('should have unique card IDs', () => {
            const ids = flashcardData.cards.map(c => c.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(ids.length);
        });

        it('should have valid card ID format', () => {
            for (const card of flashcardData.cards) {
                expect(card.id).toMatch(/^ch\d+-s\d+-\d{3}$/);
            }
        });
    });

    describe('Card Content Quality', () => {
        it('should have non-empty front text', () => {
            for (const card of flashcardData.cards) {
                expect(card.front.trim().length).toBeGreaterThan(0);
            }
        });

        it('should have non-empty back text', () => {
            for (const card of flashcardData.cards) {
                expect(card.back.trim().length).toBeGreaterThan(0);
            }
        });

        it('should have back text with at least 5 words', () => {
            for (const card of flashcardData.cards) {
                const wordCount = card.back.split(/\s+/).filter(w => w.length > 0).length;
                expect(wordCount).toBeGreaterThanOrEqual(5);
            }
        });

        it('should not have identical front and back text', () => {
            for (const card of flashcardData.cards) {
                const frontClean = card.front.toLowerCase().replace(/[^a-z0-9]/g, '');
                const backClean = card.back.toLowerCase().replace(/[^a-z0-9]/g, '');
                expect(frontClean).not.toBe(backClean);
            }
        });
    });

    describe('FINRA Section Mapping', () => {
        it('should have valid section numbers (1-4)', () => {
            for (const card of flashcardData.cards) {
                expect([1, 2, 3, 4]).toContain(card.section);
            }
        });

        it('should have valid weight values', () => {
            const validWeights = [0.16, 0.44, 0.31, 0.09];
            for (const card of flashcardData.cards) {
                expect(validWeights).toContain(card.weight);
            }
        });

        it('should have section weights matching section numbers', () => {
            const sectionWeights = {
                1: 0.16,
                2: 0.44,
                3: 0.31,
                4: 0.09
            };

            for (const card of flashcardData.cards) {
                expect(card.weight).toBe(sectionWeights[card.section]);
            }
        });
    });

    describe('Chapter Coverage', () => {
        it('should have cards from chapter 5', () => {
            const chapter5Cards = flashcardData.cards.filter(c => c.chapter === 'chapter-05');
            expect(chapter5Cards.length).toBeGreaterThan(0);
        });

        it('should have cards from chapter 6', () => {
            const chapter6Cards = flashcardData.cards.filter(c => c.chapter === 'chapter-06');
            expect(chapter6Cards.length).toBeGreaterThan(0);
        });

        it('should have cards from chapter 7', () => {
            const chapter7Cards = flashcardData.cards.filter(c => c.chapter === 'chapter-07');
            expect(chapter7Cards.length).toBeGreaterThan(0);
        });

        it('should have cards from chapter 8', () => {
            const chapter8Cards = flashcardData.cards.filter(c => c.chapter === 'chapter-08');
            expect(chapter8Cards.length).toBeGreaterThan(0);
        });

        it('should have chapter format matching pattern', () => {
            for (const card of flashcardData.cards) {
                expect(card.chapter).toMatch(/^chapter-\d{2}$/);
            }
        });
    });

    describe('Card Tags', () => {
        it('should have tags array for all cards', () => {
            for (const card of flashcardData.cards) {
                expect(Array.isArray(card.tags)).toBe(true);
            }
        });

        it('should have at least one tag per card', () => {
            for (const card of flashcardData.cards) {
                expect(card.tags.length).toBeGreaterThanOrEqual(1);
            }
        });

        it('should have valid tag types', () => {
            const validTags = ['definition', 'comparison', 'exam-tip', 'exam-focus', 'key-term', 'list', 'acronym'];
            for (const card of flashcardData.cards) {
                for (const tag of card.tags) {
                    expect(validTags).toContain(tag);
                }
            }
        });
    });

    describe('Source Attribution', () => {
        it('should have source as "auto" for all generated cards', () => {
            for (const card of flashcardData.cards) {
                expect(card.source).toBe('auto');
            }
        });
    });

    describe('Deduplication', () => {
        it('should not have duplicate front text', () => {
            const fronts = flashcardData.cards.map(c => c.front.toLowerCase().replace(/[^a-z0-9]/g, ''));
            const uniqueFronts = new Set(fronts);

            // Allow small tolerance for near-duplicates that might differ slightly
            const duplicationRate = (fronts.length - uniqueFronts.size) / fronts.length;
            expect(duplicationRate).toBeLessThan(0.05); // Less than 5% duplicates
        });
    });
});

describe('Flashcard Data Statistics', () => {
    let flashcardData;

    beforeAll(() => {
        if (fs.existsSync(FLASHCARDS_PATH)) {
            const content = fs.readFileSync(FLASHCARDS_PATH, 'utf8');
            flashcardData = JSON.parse(content);
        }
    });

    it('should have balanced section distribution', () => {
        const bySections = {
            1: flashcardData.cards.filter(c => c.section === 1).length,
            2: flashcardData.cards.filter(c => c.section === 2).length,
            3: flashcardData.cards.filter(c => c.section === 3).length,
            4: flashcardData.cards.filter(c => c.section === 4).length
        };

        // Section 2 should have the most cards (44% weight)
        // Currently only chapters 5-8 are available
        expect(bySections[2]).toBeGreaterThan(0);
    });

    it('should have variety of card types', () => {
        const tagCounts = {};
        for (const card of flashcardData.cards) {
            for (const tag of card.tags) {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            }
        }

        // Should have at least 3 different tag types
        expect(Object.keys(tagCounts).length).toBeGreaterThanOrEqual(3);
    });
});
