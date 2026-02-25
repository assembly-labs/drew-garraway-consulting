/**
 * Series 7 Flashcard UI — thin wrapper around createFlashcardUI factory
 */
const Series7FlashcardUI = createFlashcardUI({
    globalName: 'Series7FlashcardUI',
    title: 'Series 7 Flashcards',
    dataModule: Series7FlashcardData,
    hasMemoryAid: true,
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Series7FlashcardUI;
}
