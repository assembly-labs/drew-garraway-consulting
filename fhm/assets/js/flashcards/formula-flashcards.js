/**
 * Formula Flashcards Module
 * Self-contained flashcard system for SIE exam formulas
 * Features: tap to flip, swipe gestures, review pile, localStorage persistence
 */

const FormulaFlashcards = (function () {
    'use strict';

    // ============================================
    // Formula Data
    // ============================================
    const FORMULAS = [
        {
            id: 'sales-charge',
            name: 'Sales Charge Percentage',
            equation: '(POP - NAV) / POP',
            variables: ['POP = Public Offering Price', 'NAV = Net Asset Value'],
            warning: null,
            priority: 'MOST COMMON',
        },
        {
            id: 'current-yield',
            name: 'Current Yield',
            equation: 'Annual Interest / Current Market Price',
            variables: [],
            warning: null,
            priority: 'VERY COMMON',
        },
        {
            id: 'dividend-yield',
            name: 'Dividend Yield',
            equation: 'Annual Dividend / Stock Price',
            variables: [],
            warning: 'If quarterly dividend given, multiply by 4 first',
            priority: 'VERY COMMON',
        },
        {
            id: 'nav',
            name: 'NAV (Net Asset Value)',
            equation: '(Total Assets - Liabilities) / Outstanding Shares',
            variables: [],
            warning: null,
            priority: 'OCCASIONAL',
        },
        {
            id: 'call-breakeven',
            name: 'Call Option Breakeven',
            equation: 'Strike Price + Premium',
            variables: [],
            warning: null,
            priority: 'OCCASIONAL',
        },
        {
            id: 'put-breakeven',
            name: 'Put Option Breakeven',
            equation: 'Strike Price - Premium',
            variables: [],
            warning: null,
            priority: 'OCCASIONAL',
        },
    ];

    // ============================================
    // State
    // ============================================
    const STORAGE_KEY = 'sie-formula-flashcards';
    let container = null;
    let currentDeck = [];
    let reviewPile = [];
    let currentIndex = 0;
    let knowCount = 0;
    let reviewCount = 0;
    let isFlipped = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;

    // ============================================
    // Storage
    // ============================================
    function loadProgress() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load progress:', e);
        }
        return null;
    }

    function saveProgress() {
        try {
            const data = {
                knowCount,
                reviewCount,
                reviewPile: reviewPile.map(f => f.id),
                currentDeck: currentDeck.map(f => f.id),
                currentIndex,
                timestamp: Date.now(),
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save progress:', e);
        }
    }

    function clearProgress() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.error('Failed to clear progress:', e);
        }
    }

    // ============================================
    // Initialization
    // ============================================
    function init(containerId) {
        container = document.getElementById(containerId);
        if (!container) {
            console.error('Container not found:', containerId);
            return false;
        }

        const saved = loadProgress();
        if (saved && saved.currentDeck && saved.currentDeck.length > 0) {
            // Restore session
            currentDeck = saved.currentDeck
                .map(id => FORMULAS.find(f => f.id === id))
                .filter(Boolean);
            reviewPile = (saved.reviewPile || [])
                .map(id => FORMULAS.find(f => f.id === id))
                .filter(Boolean);
            currentIndex = Math.min(saved.currentIndex || 0, currentDeck.length - 1);
            knowCount = saved.knowCount || 0;
            reviewCount = saved.reviewCount || 0;

            if (currentDeck.length > 0) {
                renderSession();
                return true;
            }
        }

        renderStartScreen();
        return true;
    }

    // ============================================
    // Start Screen
    // ============================================
    function renderStartScreen() {
        const saved = loadProgress();
        const hasProgress = saved && (saved.knowCount > 0 || saved.reviewCount > 0);

        container.innerHTML = `
            <header class="formula-header">
                <h1 class="formula-title">Flash Formulas</h1>
                <span class="formula-progress">${FORMULAS.length} cards</span>
            </header>
            <div class="formula-start-screen">
                <div class="start-content">
                    <div class="start-icon">📐</div>
                    <h2 class="start-title">Formula Reference</h2>
                    <p class="start-description">
                        Master the ${FORMULAS.length} essential formulas for the SIE exam.
                        Tap to flip, swipe right if you know it, swipe left to review later.
                    </p>
                    <div class="start-stats">
                        <div class="stat">
                            <span class="stat__value">${FORMULAS.length}</span>
                            <span class="stat__label">Formulas</span>
                        </div>
                        <div class="stat">
                            <span class="stat__value">${hasProgress ? saved.knowCount : 0}</span>
                            <span class="stat__label">Mastered</span>
                        </div>
                    </div>
                    <button class="btn btn--primary btn--start" onclick="FormulaFlashcards.startSession()">
                        ${hasProgress ? 'Continue' : 'Start'}
                    </button>
                    ${
                        hasProgress
                            ? `
                        <button class="btn btn--secondary btn--start" style="margin-top: var(--fh-space-md);" onclick="FormulaFlashcards.resetAndStart()">
                            Start Fresh
                        </button>
                    `
                            : ''
                    }
                </div>
            </div>
        `;
    }

    // ============================================
    // Session
    // ============================================
    function startSession() {
        const saved = loadProgress();

        if (saved && saved.currentDeck && saved.currentDeck.length > 0) {
            // Resume existing session
            currentDeck = saved.currentDeck
                .map(id => FORMULAS.find(f => f.id === id))
                .filter(Boolean);
            reviewPile = (saved.reviewPile || [])
                .map(id => FORMULAS.find(f => f.id === id))
                .filter(Boolean);
            currentIndex = Math.min(saved.currentIndex || 0, currentDeck.length - 1);
            knowCount = saved.knowCount || 0;
            reviewCount = saved.reviewCount || 0;
        } else {
            // Start new session
            currentDeck = [...FORMULAS];
            reviewPile = [];
            currentIndex = 0;
            knowCount = 0;
            reviewCount = 0;
        }

        if (currentDeck.length === 0) {
            // All cards completed, check review pile
            if (reviewPile.length > 0) {
                startReviewRound();
            } else {
                renderSummary();
            }
            return;
        }

        renderSession();
    }

    function resetAndStart() {
        clearProgress();
        currentDeck = [...FORMULAS];
        reviewPile = [];
        currentIndex = 0;
        knowCount = 0;
        reviewCount = 0;
        renderSession();
    }

    function startReviewRound() {
        currentDeck = [...reviewPile];
        reviewPile = [];
        currentIndex = 0;
        reviewCount = 0;
        saveProgress();
        renderSession();
    }

    function renderSession() {
        const formula = currentDeck[currentIndex];
        if (!formula) {
            if (reviewPile.length > 0) {
                renderReviewPrompt();
            } else {
                renderSummary();
            }
            return;
        }

        const totalInRound = currentDeck.length;
        const progressPercent = (currentIndex / totalInRound) * 100;

        container.innerHTML = `
            <header class="formula-header">
                <h1 class="formula-title">Flash Formulas</h1>
                <span class="formula-progress">${currentIndex + 1} of ${totalInRound}</span>
            </header>
            ${
                reviewPile.length > 0
                    ? `
                <div class="review-banner review-banner--visible">
                    <span>Review pile:</span>
                    <span class="review-banner__count">${reviewPile.length}</span>
                </div>
            `
                    : ''
            }
            <div class="formula-session">
                <div class="session-progress">
                    <div class="progress-bar">
                        <div class="progress-bar__fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <span class="progress-text">${currentIndex}/${totalInRound}</span>
                </div>
                <div class="session-counters">
                    <div class="counter counter--know">
                        <span class="counter__value">${knowCount}</span>
                        <span class="counter__label">Know It</span>
                    </div>
                    <div class="counter counter--review">
                        <span class="counter__value">${reviewCount}</span>
                        <span class="counter__label">Review</span>
                    </div>
                </div>
                <div class="flashcard-container" id="flashcard-container">
                    ${renderCard(formula)}
                </div>
                <div class="action-buttons">
                    <button class="action-btn action-btn--review" onclick="FormulaFlashcards.markReview()">
                        <span class="action-btn__icon">←</span>
                        <span>Review</span>
                    </button>
                    <button class="action-btn action-btn--know" onclick="FormulaFlashcards.markKnow()">
                        <span>Know It</span>
                        <span class="action-btn__icon">→</span>
                    </button>
                </div>
            </div>
        `;

        isFlipped = false;
        setupTouchHandlers();
    }

    function renderCard(formula) {
        const priorityClass = formula.priority.toLowerCase().replace(/\s+/g, '-');

        return `
            <div class="flashcard" id="flashcard" tabindex="0" role="button" aria-label="Flashcard. Tap to flip.">
                <div class="flashcard__inner">
                    <div class="flashcard__front">
                        <span class="priority-badge priority-badge--${priorityClass}">${formula.priority}</span>
                        <h2 class="formula-name">${formula.name}</h2>
                        <span class="tap-hint">Tap to reveal formula</span>
                    </div>
                    <div class="flashcard__back">
                        <span class="priority-badge priority-badge--${priorityClass}">${formula.priority}</span>
                        <div class="formula-content">
                            <div class="formula-equation">${formula.equation}</div>
                            ${
                                formula.variables.length > 0
                                    ? `
                                <div class="formula-variables">
                                    ${formula.variables.map(v => `<p>${v}</p>`).join('')}
                                </div>
                            `
                                    : ''
                            }
                            ${
                                formula.warning
                                    ? `
                                <div class="formula-warning">⚠️ ${formula.warning}</div>
                            `
                                    : ''
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ============================================
    // Touch Handling
    // ============================================
    function setupTouchHandlers() {
        const cardContainer = document.getElementById('flashcard-container');
        const card = document.getElementById('flashcard');

        if (!cardContainer || !card) return;

        // Tap to flip
        card.addEventListener('click', handleTap);
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTap();
            }
        });

        // Touch swipe
        cardContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
        cardContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
        cardContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    function handleTap() {
        const card = document.getElementById('flashcard');
        if (!card || isSwiping) return;

        isFlipped = !isFlipped;
        card.classList.toggle('flashcard--flipped', isFlipped);
    }

    function handleTouchStart(e) {
        if (e.touches.length !== 1) return;

        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isSwiping = false;
    }

    function handleTouchMove(e) {
        if (e.touches.length !== 1) return;

        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;
        const card = document.getElementById('flashcard');

        // Detect if this is a horizontal swipe
        if (Math.abs(deltaX) > 20 && Math.abs(deltaX) > Math.abs(deltaY)) {
            isSwiping = true;
            e.preventDefault();

            if (card) {
                card.classList.remove('flashcard--swiping-left', 'flashcard--swiping-right');
                if (deltaX > 50) {
                    card.classList.add('flashcard--swiping-right');
                } else if (deltaX < -50) {
                    card.classList.add('flashcard--swiping-left');
                }
            }
        }
    }

    function handleTouchEnd(e) {
        const card = document.getElementById('flashcard');
        if (card) {
            card.classList.remove('flashcard--swiping-left', 'flashcard--swiping-right');
        }

        if (!isSwiping) return;

        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartX;

        // Swipe threshold
        if (deltaX > 80) {
            markKnow();
        } else if (deltaX < -80) {
            markReview();
        }

        isSwiping = false;
    }

    // ============================================
    // Card Actions
    // ============================================
    function markKnow() {
        knowCount++;
        nextCard();
    }

    function markReview() {
        const formula = currentDeck[currentIndex];
        if (formula && !reviewPile.find(f => f.id === formula.id)) {
            reviewPile.push(formula);
        }
        reviewCount++;
        nextCard();
    }

    function nextCard() {
        currentIndex++;
        saveProgress();

        if (currentIndex >= currentDeck.length) {
            if (reviewPile.length > 0) {
                renderReviewPrompt();
            } else {
                renderSummary();
            }
        } else {
            renderSession();
        }
    }

    // ============================================
    // Review Prompt
    // ============================================
    function renderReviewPrompt() {
        container.innerHTML = `
            <header class="formula-header">
                <h1 class="formula-title">Flash Formulas</h1>
                <span class="formula-progress">Round Complete</span>
            </header>
            <div class="formula-summary">
                <div class="summary-content">
                    <div class="summary-icon">🔄</div>
                    <h2 class="summary-title">Review Time</h2>
                    <p class="summary-message">
                        You have ${reviewPile.length} formula${reviewPile.length === 1 ? '' : 's'} in your review pile.
                        Ready to go through them again?
                    </p>
                    <div class="summary-stats">
                        <div class="summary-stat summary-stat--know">
                            <span class="summary-stat__value">${knowCount}</span>
                            <span class="summary-stat__label">Mastered</span>
                        </div>
                        <div class="summary-stat summary-stat--review">
                            <span class="summary-stat__value">${reviewPile.length}</span>
                            <span class="summary-stat__label">To Review</span>
                        </div>
                    </div>
                    <div class="summary-actions">
                        <button class="btn btn--primary btn--start" onclick="FormulaFlashcards.startReviewRound()">
                            Review Now
                        </button>
                        <button class="btn btn--secondary btn--start" onclick="FormulaFlashcards.finishSession()">
                            Finish
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // ============================================
    // Summary
    // ============================================
    function renderSummary() {
        clearProgress();

        const total = FORMULAS.length;
        const masteryPercent = Math.round((knowCount / total) * 100);

        let message = '';
        let icon = '🎉';

        if (masteryPercent === 100) {
            message = "Perfect! You've mastered all the formulas.";
            icon = '🏆';
        } else if (masteryPercent >= 80) {
            message = "Great job! You're almost there.";
            icon = '🎉';
        } else if (masteryPercent >= 50) {
            message = 'Good progress! Keep practicing.';
            icon = '💪';
        } else {
            message = 'Keep at it! Practice makes perfect.';
            icon = '📚';
        }

        container.innerHTML = `
            <header class="formula-header">
                <h1 class="formula-title">Flash Formulas</h1>
                <span class="formula-progress">Complete</span>
            </header>
            <div class="formula-summary">
                <div class="summary-content">
                    <div class="summary-icon">${icon}</div>
                    <h2 class="summary-title">Session Complete</h2>
                    <p class="summary-message">${message}</p>
                    <div class="summary-stats">
                        <div class="summary-stat summary-stat--know">
                            <span class="summary-stat__value">${knowCount}</span>
                            <span class="summary-stat__label">Mastered</span>
                        </div>
                        <div class="summary-stat summary-stat--review">
                            <span class="summary-stat__value">${total - knowCount}</span>
                            <span class="summary-stat__label">Need Work</span>
                        </div>
                    </div>
                    <div class="summary-actions">
                        <button class="btn btn--primary btn--start" onclick="FormulaFlashcards.resetAndStart()">
                            Practice Again
                        </button>
                        <a href="sie-study-materials.html" class="btn btn--secondary btn--start">
                            Back to Study Materials
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    function finishSession() {
        renderSummary();
    }

    // ============================================
    // Public API
    // ============================================
    return {
        init,
        startSession,
        resetAndStart,
        startReviewRound,
        markKnow,
        markReview,
        finishSession,
    };
})();
