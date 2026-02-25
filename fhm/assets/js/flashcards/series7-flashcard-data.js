/**
 * Series 7 Flashcard Data — thin wrapper around createFlashcardData factory
 */
const Series7FlashcardData = createFlashcardData({
    jsonPath: '../../assets/data/series-7-flashcards.json',
    label: 'Series 7',
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Series7FlashcardData;
}
