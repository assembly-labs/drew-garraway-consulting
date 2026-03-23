/**
 * Spreads & Straddles Flashcard Data — thin wrapper around createFlashcardData factory
 */
const SpreadsStraddlesData = createFlashcardData({
    jsonPath: '../../assets/data/series-7-spreads-straddles-flashcards.json',
    label: 'Spreads & Straddles',
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpreadsStraddlesData;
}
