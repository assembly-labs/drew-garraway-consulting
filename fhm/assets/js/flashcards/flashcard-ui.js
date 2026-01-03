/**
 * Flashcard UI Module
 *
 * Handles the flashcard user interface including:
 * - Card rendering and flip animation
 * - Touch/swipe gesture detection
 * - Session flow and summary display
 */

const FlashcardUI = (function () {
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

        // Load flashcard data
        await FlashcardData.load();

        // Render initial UI
        render();

        // Auto-start session immediately
        startSession();

        return true;
    }

    /**
     * Render the main flashcard UI and auto-start session
     */
    function render() {
        const stats = FlashcardProgress.getOverallStats(FlashcardData.getAll());

        container.innerHTML = `
            <div class="flashcard-app">
                <header class="flashcard-header">
                    <h1 class="flashcard-title">SIE Flashcards</h1>
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
                                    <p class="flashcard__text"></p>
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
                            <button class="btn btn--primary" onclick="FlashcardUI.startSession()">
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
     * Start a new study session (cycles through all cards)
     */
    function startSession() {
        const allCards = FlashcardData.getAll();
        const success = FlashcardSession.start(allCards, allCards.length);

        if (!success) {
            alert('No flashcards available. Please generate cards first.');
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

        // Show requeued count if there are cards to retry
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

        frontText.textContent = card.front;
        backText.textContent = card.back;

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

        // Action button handlers (mobile-friendly alternative to swipe)
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

    /**
     * Handle touch start
     */
    function handleTouchStart(e) {
        if (e.touches.length !== 1) return;

        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTime = Date.now();
        isDragging = true;
    }

    /**
     * Handle touch move
     */
    function handleTouchMove(e) {
        if (!isDragging || !cardElement) return;

        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;

        // Apply transform for visual feedback
        const rotation = deltaX * 0.05;
        cardElement.style.transform = `translateX(${deltaX}px) translateY(${Math.min(0, deltaY)}px) rotate(${rotation}deg)`;

        // Show color hint based on direction
        if (Math.abs(deltaX) > SWIPE_THRESHOLD_X) {
            cardElement.classList.add('flashcard--swiping-horizontal');
        } else if (deltaY < -SWIPE_THRESHOLD_Y) {
            cardElement.classList.add('flashcard--swiping-up');
        } else {
            cardElement.classList.remove('flashcard--swiping-horizontal', 'flashcard--swiping-up');
        }

        // Prevent page scroll when swiping card
        if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
            e.preventDefault();
        }
    }

    /**
     * Handle touch end
     */
    function handleTouchEnd(e) {
        if (!isDragging || !cardElement) return;

        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        const elapsed = Date.now() - touchStartTime;

        isDragging = false;

        // Remove visual hints
        cardElement.classList.remove('flashcard--swiping-horizontal', 'flashcard--swiping-up');

        // Determine action based on gesture
        if (Math.abs(deltaX) > SWIPE_THRESHOLD_X || Math.abs(deltaY) > SWIPE_THRESHOLD_Y) {
            if (deltaY < -SWIPE_THRESHOLD_Y && Math.abs(deltaY) > Math.abs(deltaX)) {
                // Swipe up - Got it!
                animateCardOut('up', () => {
                    FlashcardSession.markCurrentProficient();
                    showCurrentCard();
                });
            } else if (Math.abs(deltaX) > SWIPE_THRESHOLD_X) {
                // Swipe left or right - Still learning
                const direction = deltaX > 0 ? 'right' : 'left';
                animateCardOut(direction, () => {
                    FlashcardSession.markCurrentLearning();
                    showCurrentCard();
                });
            } else {
                // Reset position
                cardElement.style.transform = '';
            }
        } else if (elapsed < 300 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
            // Quick tap - flip card
            flipCard();
            cardElement.style.transform = '';
        } else {
            // Reset position
            cardElement.style.transform = '';
        }
    }

    /**
     * Handle click (for desktop)
     */
    function handleClick(e) {
        // Only handle if not a touch device (touch events already handled)
        if ('ontouchstart' in window) return;

        flipCard();
    }

    /**
     * Handle keyboard navigation
     */
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

    /**
     * Animate card leaving the screen
     */
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

    /**
     * Show the session summary
     */
    function showSummary() {
        FlashcardSession.end();

        const stats = FlashcardSession.getStats();

        const sessionView = container.querySelector('.flashcard-session');
        sessionView.style.display = 'none';
        summaryElement.style.display = 'flex';

        document.getElementById('summary-seen').textContent = stats.seen;
        document.getElementById('summary-proficient').textContent = stats.markedProficient;
        document.getElementById('summary-learning').textContent = stats.markedLearning;

        // Remove keyboard listener
        document.removeEventListener('keydown', handleKeydown);
    }

    /**
     * Show the start screen
     */
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
    module.exports = FlashcardUI;
}
