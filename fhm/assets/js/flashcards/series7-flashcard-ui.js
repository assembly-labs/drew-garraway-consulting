/**
 * Series 7 Flashcard UI Module
 *
 * Handles the Series 7 flashcard user interface.
 * Adapts the base FlashcardUI for Series 7 specific data and branding.
 */

const Series7FlashcardUI = (function () {
    // Configuration
    const SWIPE_THRESHOLD_X = 50;
    const SWIPE_THRESHOLD_Y = 80;

    // DOM element references
    let container = null;
    let cardElement = null;
    let progressElement = null;
    let summaryElement = null;

    // Touch tracking state
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let isDragging = false;
    let isFlipped = false;

    /**
     * Initialize the UI
     * @param {string} containerId - ID of the container element
     */
    async function init(containerId) {
        container = document.getElementById(containerId);
        if (!container) {
            console.error('Flashcard container not found:', containerId);
            return false;
        }

        // Load Series 7 flashcard data
        await Series7FlashcardData.load();

        // Render initial UI
        render();

        // Auto-start session immediately
        startSession();

        return true;
    }

    /**
     * Render the main flashcard UI
     */
    function render() {
        const stats = FlashcardProgress.getOverallStats(Series7FlashcardData.getAll());
        const meta = Series7FlashcardData.getMeta();

        container.innerHTML = `
            <div class="flashcard-app">
                <header class="flashcard-header">
                    <h1 class="flashcard-title">Series 7 Flashcards</h1>
                    <div class="flashcard-stats">
                        <span class="stat">${stats.mastered} mastered</span>
                        <span class="stat-divider">•</span>
                        <span class="stat">${stats.total} total</span>
                    </div>
                </header>

                <div class="flashcard-start-screen" style="display: none;"></div>

                <div class="flashcard-session" style="display: none;">
                    <div class="session-progress" id="session-progress">
                        <div class="progress-bar">
                            <div class="progress-bar__fill" style="width: 0%"></div>
                        </div>
                        <span class="progress-text">0 / 0</span>
                    </div>

                    <div class="session-counter" id="session-counter">
                        <span class="counter counter--got-it">
                            <span class="counter__value" id="counter-got-it">0</span>
                            <span class="counter__label">Got It</span>
                        </span>
                        <span class="counter counter--dont-know">
                            <span class="counter__value" id="counter-dont-know">0</span>
                            <span class="counter__label">Don't Know</span>
                        </span>
                    </div>

                    <div class="flashcard-container" id="flashcard-container">
                        <div class="flashcard" id="flashcard">
                            <div class="flashcard__inner">
                                <div class="flashcard__front">
                                    <p class="flashcard__text"></p>
                                </div>
                                <div class="flashcard__back">
                                    <div class="flashcard__back-content">
                                        <p class="flashcard__text"></p>
                                        <p class="flashcard__memory-aid" id="memory-aid"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="action-buttons" id="action-buttons">
                        <button class="action-btn action-btn--dont-know" id="btn-dont-know" type="button">
                            <span class="action-btn__icon">&#x2190;</span>
                            <span>Don't Know</span>
                        </button>
                        <button class="action-btn action-btn--got-it" id="btn-got-it" type="button">
                            <span class="action-btn__icon">&#x2191;</span>
                            <span>Got It</span>
                        </button>
                    </div>
                </div>

                <div class="flashcard-summary" id="flashcard-summary" style="display: none;">
                    <div class="summary-content">
                        <h2 class="summary-title">Session Complete!</h2>
                        <div class="summary-stats">
                            <div class="summary-stat">
                                <span class="summary-stat__value" id="summary-seen">0</span>
                                <span class="summary-stat__label">Cards Reviewed</span>
                            </div>
                            <div class="summary-stat summary-stat--proficient">
                                <span class="summary-stat__value" id="summary-proficient">0</span>
                                <span class="summary-stat__label">Got It</span>
                            </div>
                            <div class="summary-stat summary-stat--learning">
                                <span class="summary-stat__value" id="summary-learning">0</span>
                                <span class="summary-stat__label">Don't Know</span>
                            </div>
                        </div>
                        <div class="summary-actions">
                            <button class="btn btn--primary" onclick="Series7FlashcardUI.startSession()">
                                Study Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Cache element references
        cardElement = document.getElementById('flashcard');
        progressElement = document.getElementById('session-progress');
        summaryElement = document.getElementById('flashcard-summary');
    }

    /**
     * Start a new study session
     */
    function startSession() {
        const allCards = Series7FlashcardData.getAll();
        const success = FlashcardSession.start(allCards, allCards.length);

        if (!success) {
            alert('No flashcards available.');
            return;
        }

        // Show session view
        const startScreen = container.querySelector('.flashcard-start-screen');
        const sessionView = container.querySelector('.flashcard-session');

        startScreen.style.display = 'none';
        sessionView.style.display = 'flex';
        summaryElement.style.display = 'none';

        // Reset state
        isFlipped = false;

        // Setup touch handlers
        setupTouchHandlers();

        // Show first card
        showCurrentCard();
    }

    /**
     * Update the session counter display
     */
    function updateCounter() {
        const stats = FlashcardSession.getStats();
        const gotItEl = document.getElementById('counter-got-it');
        const dontKnowEl = document.getElementById('counter-dont-know');

        if (gotItEl) gotItEl.textContent = stats.markedProficient;
        if (dontKnowEl) dontKnowEl.textContent = stats.markedLearning;
    }

    /**
     * Show the current card
     */
    function showCurrentCard() {
        const card = FlashcardSession.getCurrentCard();

        if (!card) {
            showSummary();
            return;
        }

        // Update progress
        const progress = FlashcardSession.getProgress();
        const progressBar = progressElement.querySelector('.progress-bar__fill');
        const progressText = progressElement.querySelector('.progress-text');

        progressBar.style.width = `${progress.percentage}%`;

        if (progress.cardsRequeued > 0) {
            progressText.textContent = `${progress.current} / ${progress.total} (${progress.cardsRequeued} to retry)`;
        } else {
            progressText.textContent = `${progress.current} / ${progress.total}`;
        }

        // Update counter
        updateCounter();

        // Update card content
        const frontText = cardElement.querySelector('.flashcard__front .flashcard__text');
        const backText = cardElement.querySelector('.flashcard__back .flashcard__text');
        const memoryAidEl = document.getElementById('memory-aid');

        frontText.textContent = card.front;
        backText.textContent = card.back;

        // Show memory aid if available
        if (memoryAidEl) {
            if (card.memoryAid) {
                memoryAidEl.textContent = card.memoryAid;
                memoryAidEl.style.display = 'block';
            } else {
                memoryAidEl.style.display = 'none';
            }
        }

        // Reset flip state
        isFlipped = false;
        cardElement.classList.remove('flashcard--flipped');
        cardElement.style.transform = '';
        cardElement.style.opacity = '1';
    }

    /**
     * Flip the current card
     */
    function flipCard() {
        if (!cardElement) return;

        isFlipped = !isFlipped;
        cardElement.classList.toggle('flashcard--flipped', isFlipped);
    }

    /**
     * Setup touch event handlers
     */
    function setupTouchHandlers() {
        const cardContainer = document.getElementById('flashcard-container');
        if (!cardContainer) return;

        // Remove existing listeners
        cardContainer.removeEventListener('touchstart', handleTouchStart);
        cardContainer.removeEventListener('touchmove', handleTouchMove);
        cardContainer.removeEventListener('touchend', handleTouchEnd);
        cardContainer.removeEventListener('click', handleClick);

        // Add listeners
        cardContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
        cardContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
        cardContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
        cardContainer.addEventListener('click', handleClick);

        // Keyboard support
        document.addEventListener('keydown', handleKeydown);

        // Action button handlers
        const btnGotIt = document.getElementById('btn-got-it');
        const btnDontKnow = document.getElementById('btn-dont-know');

        if (btnGotIt) {
            btnGotIt.onclick = function() {
                animateCardOut('up', () => {
                    FlashcardSession.markCurrentProficient();
                    showCurrentCard();
                });
            };
        }

        if (btnDontKnow) {
            btnDontKnow.onclick = function() {
                animateCardOut('left', () => {
                    FlashcardSession.markCurrentLearning();
                    showCurrentCard();
                });
            };
        }
    }

    function handleTouchStart(e) {
        if (e.touches.length !== 1) return;

        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTime = Date.now();
        isDragging = true;
    }

    function handleTouchMove(e) {
        if (!isDragging || !cardElement) return;

        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;

        const rotation = deltaX * 0.05;
        cardElement.style.transform = `translateX(${deltaX}px) translateY(${Math.min(0, deltaY)}px) rotate(${rotation}deg)`;

        if (Math.abs(deltaX) > SWIPE_THRESHOLD_X) {
            cardElement.classList.add('flashcard--swiping-horizontal');
        } else if (deltaY < -SWIPE_THRESHOLD_Y) {
            cardElement.classList.add('flashcard--swiping-up');
        } else {
            cardElement.classList.remove('flashcard--swiping-horizontal', 'flashcard--swiping-up');
        }

        if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
            e.preventDefault();
        }
    }

    function handleTouchEnd(e) {
        if (!isDragging || !cardElement) return;

        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        const elapsed = Date.now() - touchStartTime;

        isDragging = false;
        cardElement.classList.remove('flashcard--swiping-horizontal', 'flashcard--swiping-up');

        if (Math.abs(deltaX) > SWIPE_THRESHOLD_X || Math.abs(deltaY) > SWIPE_THRESHOLD_Y) {
            if (deltaY < -SWIPE_THRESHOLD_Y && Math.abs(deltaY) > Math.abs(deltaX)) {
                animateCardOut('up', () => {
                    FlashcardSession.markCurrentProficient();
                    showCurrentCard();
                });
            } else if (Math.abs(deltaX) > SWIPE_THRESHOLD_X) {
                const direction = deltaX > 0 ? 'right' : 'left';
                animateCardOut(direction, () => {
                    FlashcardSession.markCurrentLearning();
                    showCurrentCard();
                });
            } else {
                cardElement.style.transform = '';
            }
        } else if (elapsed < 300 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
            flipCard();
            cardElement.style.transform = '';
        } else {
            cardElement.style.transform = '';
        }
    }

    function handleClick(e) {
        if ('ontouchstart' in window) return;
        flipCard();
    }

    function handleKeydown(e) {
        if (!FlashcardSession.isActive()) return;

        switch (e.key) {
            case ' ':
            case 'Enter':
                e.preventDefault();
                flipCard();
                break;
            case 'ArrowUp':
                e.preventDefault();
                animateCardOut('up', () => {
                    FlashcardSession.markCurrentProficient();
                    showCurrentCard();
                });
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
                e.preventDefault();
                animateCardOut(e.key === 'ArrowLeft' ? 'left' : 'right', () => {
                    FlashcardSession.markCurrentLearning();
                    showCurrentCard();
                });
                break;
            case 'Escape':
                showSummary();
                break;
        }
    }

    function animateCardOut(direction, callback) {
        if (!cardElement) return;

        let transform = '';
        switch (direction) {
            case 'up':
                transform = 'translateY(-150%) rotate(-5deg)';
                break;
            case 'left':
                transform = 'translateX(-150%) rotate(-20deg)';
                break;
            case 'right':
                transform = 'translateX(150%) rotate(20deg)';
                break;
        }

        cardElement.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        cardElement.style.transform = transform;
        cardElement.style.opacity = '0';

        setTimeout(() => {
            cardElement.style.transition = '';
            callback();
        }, 300);
    }

    function showSummary() {
        FlashcardSession.end();

        const stats = FlashcardSession.getStats();

        const sessionView = container.querySelector('.flashcard-session');
        sessionView.style.display = 'none';
        summaryElement.style.display = 'flex';

        document.getElementById('summary-seen').textContent = stats.seen;
        document.getElementById('summary-proficient').textContent = stats.markedProficient;
        document.getElementById('summary-learning').textContent = stats.markedLearning;

        document.removeEventListener('keydown', handleKeydown);
    }

    function showStart() {
        render();
    }

    return {
        init,
        startSession,
        showStart,
        flipCard
    };
})();

// Export for ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Series7FlashcardUI;
}
