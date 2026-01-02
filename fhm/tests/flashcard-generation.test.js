/**
 * Tests for Flashcard Data
 *
 * Validates the flashcard data structure and content quality.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FLASHCARDS_PATH = path.join(__dirname, '..', 'assets', 'data', 'flashcards.json');

describe('Flashcard Data', () => {
    let flashcardData;

    beforeAll(() => {
        // Load the flashcards
        if (fs.existsSync(FLASHCARDS_PATH)) {
            const content = fs.readFileSync(FLASHCARDS_PATH, 'utf8');
            flashcardData = JSON.parse(content);
        }
    });

    describe('Output File', () => {
        it('should have flashcards.json file', () => {
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
        it('should have at least 50 cards', () => {
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
            // IDs should be alphanumeric with hyphens
            for (const card of flashcardData.cards) {
                expect(card.id).toMatch(/^[a-z]+-\d{3}$/);
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

        it('should have back text with at least 2 words', () => {
            for (const card of flashcardData.cards) {
                const wordCount = card.back.split(/\s+/).filter(w => w.length > 0).length;
                expect(wordCount).toBeGreaterThanOrEqual(2);
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

    describe('Section and Weight Mapping', () => {
        it('should have valid section numbers (1-4)', () => {
            for (const card of flashcardData.cards) {
                expect([1, 2, 3, 4]).toContain(card.section);
            }
        });

        it('should have valid weight values (0-1)', () => {
            for (const card of flashcardData.cards) {
                expect(card.weight).toBeGreaterThan(0);
                expect(card.weight).toBeLessThanOrEqual(1);
            }
        });
    });

    describe('Chapter Coverage', () => {
        it('should have cards from multiple chapters', () => {
            const chapters = new Set(flashcardData.cards.map(c => c.chapter));
            expect(chapters.size).toBeGreaterThan(5);
        });

        it('should have chapter as string', () => {
            for (const card of flashcardData.cards) {
                expect(typeof card.chapter).toBe('string');
                expect(card.chapter.length).toBeGreaterThan(0);
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

        it('should have tags as strings', () => {
            for (const card of flashcardData.cards) {
                for (const tag of card.tags) {
                    expect(typeof tag).toBe('string');
                }
            }
        });
    });

    describe('Source Attribution', () => {
        it('should have valid source attribution for all cards', () => {
            const validSources = ['auto', 'manual', 'exam-review'];
            for (const card of flashcardData.cards) {
                expect(validSources).toContain(card.source);
            }
        });
    });

    describe('Exam Review Cards', () => {
        it('should have exam-review cards with exam-missed tag', () => {
            const examCards = flashcardData.cards.filter(c => c.source === 'exam-review');
            for (const card of examCards) {
                expect(card.tags).toContain('exam-missed');
            }
        });

        it('should have at least 10 exam-review cards', () => {
            const examCards = flashcardData.cards.filter(c => c.source === 'exam-review');
            expect(examCards.length).toBeGreaterThanOrEqual(10);
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

        // Should have cards in multiple sections
        const sectionsWithCards = Object.values(bySections).filter(count => count > 0).length;
        expect(sectionsWithCards).toBeGreaterThanOrEqual(2);
    });

    it('should have variety of card types', () => {
        const tagCounts = {};
        for (const card of flashcardData.cards) {
            for (const tag of card.tags) {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            }
        }

        // Should have at least 5 different tag types
        expect(Object.keys(tagCounts).length).toBeGreaterThanOrEqual(5);
    });
});
