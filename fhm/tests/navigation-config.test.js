/**
 * Tests for SIE Navigation Configuration
 * Verifies the course structure and helper functions work correctly
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the navigation config file and parse it
const configPath = join(__dirname, '../assets/js/sie-navigation-config.js');
const configCode = readFileSync(configPath, 'utf-8');

// Extract SIECourseStructure by wrapping the code and evaluating it
const wrappedCode = `
(function() {
    ${configCode}
    return SIECourseStructure;
})()
`;

const SIECourseStructure = eval(wrappedCode);

describe('SIECourseStructure', () => {
    describe('chapters array', () => {
        it('should have 16 chapters', () => {
            expect(SIECourseStructure.chapters).toHaveLength(16);
        });

        it('should have chapters numbered 1-16', () => {
            const chapterNumbers = SIECourseStructure.chapters.map(ch => ch.number);
            expect(chapterNumbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        });

        it('each chapter should have a title', () => {
            SIECourseStructure.chapters.forEach(chapter => {
                expect(chapter.title).toBeDefined();
                expect(typeof chapter.title).toBe('string');
                expect(chapter.title.length).toBeGreaterThan(0);
            });
        });

        it('each chapter should have at least one section', () => {
            SIECourseStructure.chapters.forEach(chapter => {
                expect(chapter.sections).toBeDefined();
                expect(Array.isArray(chapter.sections)).toBe(true);
                expect(chapter.sections.length).toBeGreaterThan(0);
            });
        });
    });

    describe('sections', () => {
        it('each section should have required properties', () => {
            const allSections = SIECourseStructure.getAllSections();
            allSections.forEach(section => {
                expect(section.id).toBeDefined();
                expect(section.title).toBeDefined();
                expect(section.file).toBeDefined();
                expect(typeof section.locked).toBe('boolean');
            });
        });

        it('section IDs should follow X.Y format', () => {
            const allSections = SIECourseStructure.getAllSections();
            const idPattern = /^\d+\.\d+$/;
            allSections.forEach(section => {
                expect(section.id).toMatch(idPattern);
            });
        });

        it('section files should have pages/sie path and .html extension', () => {
            const allSections = SIECourseStructure.getAllSections();
            allSections.forEach(section => {
                expect(section.file).toMatch(/^pages\/sie\/.*\.html$/);
            });
        });
    });

    describe('getAllSections()', () => {
        it('should return all sections as a flat array', () => {
            const sections = SIECourseStructure.getAllSections();
            expect(Array.isArray(sections)).toBe(true);
            expect(sections.length).toBeGreaterThan(0);
        });
    });

    describe('getTotalSections()', () => {
        it('should return the total number of sections', () => {
            const total = SIECourseStructure.getTotalSections();
            expect(typeof total).toBe('number');
            expect(total).toBeGreaterThan(0);
        });

        it('should match the length of getAllSections()', () => {
            expect(SIECourseStructure.getTotalSections()).toBe(
                SIECourseStructure.getAllSections().length
            );
        });
    });

    describe('getCurrentSection()', () => {
        it('should find a section by filename', () => {
            const section = SIECourseStructure.getCurrentSection(
                'pages/sie/sie-chapter-5-municipal.html'
            );
            expect(section).toBeDefined();
            expect(section.id).toBe('5.1');
        });

        it('should return undefined for non-existent file', () => {
            const section = SIECourseStructure.getCurrentSection('non-existent.html');
            expect(section).toBeUndefined();
        });
    });

    describe('getSectionIndex()', () => {
        it('should return correct index for a section', () => {
            const firstSection = SIECourseStructure.getAllSections()[0];
            expect(SIECourseStructure.getSectionIndex(firstSection.id)).toBe(0);
        });

        it('should return -1 for non-existent section', () => {
            expect(SIECourseStructure.getSectionIndex('99.99')).toBe(-1);
        });
    });

    describe('getPreviousSection()', () => {
        it('should return null for first section', () => {
            const firstSection = SIECourseStructure.getAllSections()[0];
            const prev = SIECourseStructure.getPreviousSection(firstSection.id);
            expect(prev).toBeNull();
        });

        it('should return previous section for non-first section', () => {
            const sections = SIECourseStructure.getAllSections();
            if (sections.length > 1) {
                const secondSection = sections[1];
                const prev = SIECourseStructure.getPreviousSection(secondSection.id);
                expect(prev).toEqual(sections[0]);
            }
        });
    });

    describe('getNextSection()', () => {
        it('should return null for last section', () => {
            const sections = SIECourseStructure.getAllSections();
            const lastSection = sections[sections.length - 1];
            const next = SIECourseStructure.getNextSection(lastSection.id);
            expect(next).toBeNull();
        });

        it('should return next section for non-last section', () => {
            const sections = SIECourseStructure.getAllSections();
            if (sections.length > 1) {
                const firstSection = sections[0];
                const next = SIECourseStructure.getNextSection(firstSection.id);
                expect(next).toEqual(sections[1]);
            }
        });
    });

    describe('getChapterForSection()', () => {
        it('should return correct chapter for a section', () => {
            const chapter = SIECourseStructure.getChapterForSection('5.1');
            expect(chapter).toBeDefined();
            expect(chapter.number).toBe(5);
            expect(chapter.title).toBe('Debt Securities');
        });

        it('should return undefined for non-existent section', () => {
            const chapter = SIECourseStructure.getChapterForSection('99.1');
            expect(chapter).toBeUndefined();
        });
    });

    describe('getProgressPercentage()', () => {
        it('should return correct progress for first section', () => {
            const firstSection = SIECourseStructure.getAllSections()[0];
            const progress = SIECourseStructure.getProgressPercentage(firstSection.id);
            const expected = (1 / SIECourseStructure.getTotalSections()) * 100;
            expect(progress).toBeCloseTo(expected);
        });

        it('should return 100 for last section', () => {
            const sections = SIECourseStructure.getAllSections();
            const lastSection = sections[sections.length - 1];
            const progress = SIECourseStructure.getProgressPercentage(lastSection.id);
            expect(progress).toBe(100);
        });

        it('should return values between 0 and 100', () => {
            const sections = SIECourseStructure.getAllSections();
            sections.forEach(section => {
                const progress = SIECourseStructure.getProgressPercentage(section.id);
                expect(progress).toBeGreaterThan(0);
                expect(progress).toBeLessThanOrEqual(100);
            });
        });
    });
});

describe('Unlocked sections', () => {
    it('should have chapters 5-8 unlocked', () => {
        const unlockedChapters = [5, 6, 7, 8];
        const allSections = SIECourseStructure.getAllSections();

        allSections.forEach(section => {
            const chapterNum = parseInt(section.id.split('.')[0]);
            if (unlockedChapters.includes(chapterNum)) {
                expect(section.locked).toBe(false);
            } else {
                expect(section.locked).toBe(true);
            }
        });
    });
});
