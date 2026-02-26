/**
 * Spreads & Straddles Flashcard UI — thin wrapper around createFlashcardUI factory
 */
const SpreadsStraddlesUI = createFlashcardUI({
    title: 'Spreads & Straddles',
    dataModule: SpreadsStraddlesData,
    hasMemoryAid: true,
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpreadsStraddlesUI;
}
