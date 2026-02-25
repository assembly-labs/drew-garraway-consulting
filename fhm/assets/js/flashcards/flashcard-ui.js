/**
 * SIE Flashcard UI — thin wrapper around createFlashcardUI factory
 */
const FlashcardUI = createFlashcardUI({
    globalName: 'FlashcardUI',
    title: 'SIE Flashcards',
    dataModule: FlashcardData,
    hasMemoryAid: false,
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlashcardUI;
}
