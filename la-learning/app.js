/**
 * DISCOVER LA - Main Application
 * Interactive Learning Program for Kids
 * Phase 2: Enhanced with sentence-level TTS highlighting
 */

// ============================================
// APP STATE
// ============================================
const AppState = {
    currentView: 'home', // 'home' or 'session'
    currentSessionIndex: null,
    completedSessions: [],
    sessionScores: {},
    lastSessionPosition: {}, // Track reading position per session
    tts: {
        isPlaying: false,
        isPaused: false,
        currentSentenceIndex: 0,
        speed: 1,
        sentences: [] // Flattened array of all sentences
    },
    quiz: {
        currentAnswers: {},
        submitted: false
    }
};

// ============================================
// LOCAL STORAGE
// ============================================
const Storage = {
    KEY: 'discover-la-progress',

    save() {
        const data = {
            completedSessions: AppState.completedSessions,
            sessionScores: AppState.sessionScores,
            lastSessionPosition: AppState.lastSessionPosition
        };
        localStorage.setItem(this.KEY, JSON.stringify(data));
    },

    load() {
        try {
            const data = localStorage.getItem(this.KEY);
            if (data) {
                const parsed = JSON.parse(data);
                AppState.completedSessions = parsed.completedSessions || [];
                AppState.sessionScores = parsed.sessionScores || {};
                AppState.lastSessionPosition = parsed.lastSessionPosition || {};
            }
        } catch (e) {
            console.error('Error loading progress:', e);
        }
    },

    clear() {
        localStorage.removeItem(this.KEY);
        AppState.completedSessions = [];
        AppState.sessionScores = {};
        AppState.lastSessionPosition = {};
    },

    savePosition(sessionIndex, sentenceIndex) {
        AppState.lastSessionPosition[sessionIndex] = sentenceIndex;
        this.save();
    }
};

// ============================================
// UTILITIES
// ============================================
const Utils = {
    /**
     * Split text into sentences, handling common edge cases
     */
    splitIntoSentences(text) {
        // Split on sentence-ending punctuation, but keep the punctuation
        // Handle abbreviations like "U.S." and "Dr." by not splitting after single letters
        const sentences = text.match(/[^.!?]+[.!?]+[\s]*/g) || [text];

        return sentences
            .map(s => s.trim())
            .filter(s => s.length > 0);
    },

    /**
     * Debounce function for performance
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Generate unique ID
     */
    generateId() {
        return 'id-' + Math.random().toString(36).substr(2, 9);
    }
};

// ============================================
// DOM ELEMENTS
// ============================================
const Elements = {
    // Views
    homeView: document.getElementById('home-view'),
    sessionView: document.getElementById('session-view'),
    mapView: document.getElementById('map-view'),

    // Map
    mapToggleBtn: document.getElementById('map-toggle-btn'),
    leafletMap: document.getElementById('leaflet-map'),
    mapLegend: document.getElementById('legend-items'),
    mapUnlockCount: document.getElementById('map-unlock-count'),
    mapTotalCount: document.getElementById('map-total-count'),

    // Header
    backBtn: document.getElementById('back-btn'),
    appTitle: document.getElementById('app-title'),
    progressText: document.getElementById('progress-text'),
    progressRingFill: document.getElementById('progress-ring-fill'),

    // Home
    overallProgressBar: document.getElementById('overall-progress-bar'),
    overallProgressLabel: document.getElementById('overall-progress-label'),
    sessionsGrid: document.getElementById('sessions-grid'),
    continueLearning: document.getElementById('continue-learning'),
    continueCard: document.getElementById('continue-card'),

    // Session
    sessionHeader: document.getElementById('session-header'),
    sessionBadge: document.getElementById('session-badge'),
    sessionTitle: document.getElementById('session-title'),
    sessionSubtitle: document.getElementById('session-subtitle'),
    sessionContent: document.getElementById('session-content'),

    // TTS
    ttsPlayBtn: document.getElementById('tts-play-btn'),
    ttsSpeed: document.getElementById('tts-speed'),
    ttsStatus: document.getElementById('tts-status'),

    // Quiz
    quizContainer: document.getElementById('quiz-container'),
    quizResults: document.getElementById('quiz-results'),
    resultsScore: document.getElementById('results-score'),
    resultsMessage: document.getElementById('results-message'),

    // Session Footer
    completeSessionBtn: document.getElementById('complete-session-btn'),
    reviewSessionBtn: document.getElementById('review-session-btn'),

    // Celebration
    celebrationOverlay: document.getElementById('celebration-overlay'),
    celebrationScore: document.getElementById('celebration-score'),
    celebrationProgress: document.getElementById('celebration-progress'),
    celebrationMessage: document.getElementById('celebration-message'),
    confettiContainer: document.getElementById('confetti-container'),
    nextSessionBtn: document.getElementById('next-session-btn'),
    backHomeBtn: document.getElementById('back-home-btn')
};

// ============================================
// NAVIGATION
// ============================================
const Navigation = {
    showHome() {
        AppState.currentView = 'home';
        AppState.currentSessionIndex = null;

        // Stop TTS if playing
        TTS.stop();

        // Update UI
        Elements.homeView.classList.add('active');
        Elements.sessionView.classList.remove('active');
        Elements.mapView.classList.remove('active');
        Elements.backBtn.classList.add('hidden');

        // Refresh home content
        UI.renderSessionCards();
        UI.renderMapTeaser();
        UI.updateProgress();

        // Announce for screen readers
        this.announce('Returned to session list');
    },

    showMap() {
        AppState.currentView = 'map';
        AppState.currentSessionIndex = null;

        // Stop TTS if playing
        TTS.stop();

        // Update UI
        Elements.homeView.classList.remove('active');
        Elements.sessionView.classList.remove('active');
        Elements.mapView.classList.add('active');
        Elements.backBtn.classList.remove('hidden');

        // Initialize/update map
        ExploreMap.init();

        // Announce for screen readers
        this.announce('Opened explore map');
    },

    showSession(index) {
        const session = SESSIONS_DATA[index];
        if (!session) return;

        // Check if session is unlocked
        if (!this.isSessionUnlocked(index)) {
            this.announce('This session is locked. Complete the previous session first.');
            return;
        }

        AppState.currentView = 'session';
        AppState.currentSessionIndex = index;

        // Reset quiz state
        AppState.quiz.currentAnswers = {};
        AppState.quiz.submitted = false;

        // Reset TTS state but check for saved position
        const savedPosition = AppState.lastSessionPosition[index] || 0;
        AppState.tts.currentSentenceIndex = savedPosition;
        AppState.tts.isPlaying = false;
        AppState.tts.isPaused = false;
        AppState.tts.sentences = [];

        // Update UI
        Elements.homeView.classList.remove('active');
        Elements.sessionView.classList.add('active');
        Elements.mapView.classList.remove('active');
        Elements.backBtn.classList.remove('hidden');

        // Render session content
        UI.renderSession(session);
        UI.updateProgress();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Announce for screen readers
        this.announce(`Starting Session ${session.number}: ${session.title}`);
    },

    isSessionUnlocked(index) {
        // All sessions are always unlocked - users can access any lesson
        return true;
    },

    getSessionStatus(index) {
        if (AppState.completedSessions.includes(index)) {
            return 'completed';
        }
        // All sessions are available (no locked state)
        return 'current';
    },

    // Screen reader announcements
    announce(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }
};

// ============================================
// UI RENDERING
// ============================================
const UI = {
    renderSessionCards() {
        Elements.sessionsGrid.innerHTML = '';

        SESSIONS_DATA.forEach((session, index) => {
            const status = Navigation.getSessionStatus(index);
            const card = this.createSessionCard(session, index, status);
            Elements.sessionsGrid.appendChild(card);
        });

        // Render continue learning section
        this.renderContinueLearning();

        // Render map teaser
        this.renderMapTeaser();
    },

    renderMapTeaser() {
        // Check if teaser already exists
        let teaser = document.getElementById('map-teaser');
        if (!teaser) {
            teaser = document.createElement('div');
            teaser.id = 'map-teaser';
            teaser.className = 'map-teaser';
            teaser.setAttribute('role', 'button');
            teaser.setAttribute('tabindex', '0');
            teaser.onclick = () => Navigation.showMap();
            teaser.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    Navigation.showMap();
                }
            };

            // Insert after welcome banner
            const welcomeBanner = document.querySelector('.welcome-banner');
            if (welcomeBanner && welcomeBanner.nextSibling) {
                welcomeBanner.parentNode.insertBefore(teaser, welcomeBanner.nextSibling);
            }
        }

        const mapCounts = ExploreMap.getUnlockedCount();

        teaser.innerHTML = `
            <div class="map-teaser-icon">🗺️</div>
            <div class="map-teaser-content">
                <h3>Explore the Map</h3>
                <p>Discover California and LA locations as you learn!</p>
                <div class="map-teaser-stats">
                    <span class="map-teaser-stat">
                        <strong>${mapCounts.unlocked}</strong> of ${mapCounts.total} places unlocked
                    </span>
                    <span class="map-teaser-stat">
                        <strong>${AppState.completedSessions.length}</strong> of ${SESSIONS_DATA.length} sessions completed
                    </span>
                </div>
            </div>
            <div class="map-teaser-cta">
                Open Map
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </div>
        `;
    },

    renderContinueLearning() {
        // Find the first incomplete session (or one with saved progress)
        let continueIndex = -1;
        let hasProgress = false;

        // First, check if there's a session with saved reading progress
        for (let i = 0; i < SESSIONS_DATA.length; i++) {
            if (!AppState.completedSessions.includes(i) && AppState.lastSessionPosition[i] > 0) {
                continueIndex = i;
                hasProgress = true;
                break;
            }
        }

        // If no saved progress, find first incomplete session
        if (continueIndex === -1) {
            for (let i = 0; i < SESSIONS_DATA.length; i++) {
                if (!AppState.completedSessions.includes(i)) {
                    continueIndex = i;
                    break;
                }
            }
        }

        // Hide section if all sessions complete or no sessions exist
        if (continueIndex === -1) {
            Elements.continueLearning.classList.add('hidden');
            return;
        }

        // Show continue learning section
        Elements.continueLearning.classList.remove('hidden');
        const session = SESSIONS_DATA[continueIndex];
        const statusText = hasProgress ? 'Continue reading...' : `Session ${session.number} of ${SESSIONS_DATA.length}`;
        const ctaText = hasProgress ? 'Continue' : 'Start';

        Elements.continueCard.innerHTML = `
            <div class="session-icon">${session.icon || session.number}</div>
            <div class="continue-info">
                <div class="continue-title">${session.title}</div>
                <div class="continue-subtitle">${session.subtitle}</div>
                <div class="continue-status">${statusText}</div>
            </div>
            <div class="continue-cta">
                ${ctaText}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </div>
        `;

        Elements.continueCard.onclick = () => Navigation.showSession(continueIndex);
    },

    createSessionCard(session, index, status) {
        const card = document.createElement('article');
        card.className = `session-card ${status}`;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Session ${session.number}: ${session.title}. Status: ${status === 'completed' ? 'Completed' : 'Available'}. Duration: ${session.duration} minutes.`);

        // Check if there's a saved position for this session
        const hasProgress = AppState.lastSessionPosition[index] > 0 && !AppState.completedSessions.includes(index);
        const ctaText = status === 'completed' ? 'Review' : hasProgress ? 'Continue' : 'Start';

        const ctaIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

        // Get quiz score for completed sessions
        const score = AppState.sessionScores[index];
        const scoreDisplay = status === 'completed' && score
            ? `<span class="card-score"><span class="score-icon">✓</span><span class="score-value">${score.correct}/${score.total}</span></span>`
            : '';

        card.innerHTML = `
            <div class="card-status">
                ${status === 'completed' ? `
                    <span class="status-icon completed" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <path d="M5 13l4 4L19 7"/>
                        </svg>
                    </span>
                ` : ''}
            </div>
            <div class="card-header">
                <div class="session-number" aria-hidden="true">${session.icon || session.number}</div>
                <div class="card-title-area">
                    <h4 class="card-title">${session.title}</h4>
                    <p class="card-subtitle">${session.subtitle}</p>
                </div>
            </div>
            <div class="card-footer">
                <span class="card-time">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                    </svg>
                    <span>${session.duration} min</span>
                </span>
                ${scoreDisplay}
                <span class="card-cta">
                    ${ctaText}
                    ${ctaIcon}
                </span>
            </div>
        `;

        card.addEventListener('click', () => Navigation.showSession(index));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                Navigation.showSession(index);
            }
        });

        return card;
    },

    renderSession(session) {
        // Update header
        Elements.sessionBadge.textContent = session.number;
        Elements.sessionTitle.textContent = session.title;
        Elements.sessionSubtitle.textContent = session.subtitle;

        // Build sentences array for TTS
        AppState.tts.sentences = [];
        let globalSentenceIndex = 0;

        // Render content sections
        Elements.sessionContent.innerHTML = '';

        session.sections.forEach((section, sectionIndex) => {
            const sectionEl = document.createElement('div');
            sectionEl.className = 'content-section';

            // Section heading
            const heading = document.createElement('h3');
            heading.className = 'section-heading';
            heading.id = `section-${sectionIndex}`;
            heading.innerHTML = `<span class="icon" aria-hidden="true">${section.icon || ''}</span> ${section.heading}`;
            sectionEl.appendChild(heading);

            // Paragraphs with sentence-level markup
            section.paragraphs.forEach((para, paraIndex) => {
                const p = document.createElement('p');
                p.className = 'content-paragraph';
                p.setAttribute('data-section', sectionIndex);
                p.setAttribute('data-paragraph', paraIndex);

                // Split paragraph into sentences and wrap each
                const sentences = Utils.splitIntoSentences(para);
                sentences.forEach((sentence, sentenceIndex) => {
                    const span = document.createElement('span');
                    span.className = 'sentence';
                    span.setAttribute('data-sentence-index', globalSentenceIndex);
                    span.textContent = sentence + ' ';
                    p.appendChild(span);

                    // Add to TTS sentences array
                    AppState.tts.sentences.push({
                        text: sentence,
                        element: span,
                        sectionIndex,
                        paraIndex,
                        localIndex: sentenceIndex,
                        globalIndex: globalSentenceIndex
                    });

                    globalSentenceIndex++;
                });

                sectionEl.appendChild(p);
            });

            // Add images after first section
            if (sectionIndex === 0 && session.images && session.images.length > 0) {
                const gallery = this.createImageGallery(session.images.slice(0, 2));
                sectionEl.appendChild(gallery);
            }

            // Add a fact box after second section
            if (sectionIndex === 1 && session.facts && session.facts.length > 0) {
                const factBox = this.createFactBox(session.facts[0]);
                sectionEl.appendChild(factBox);
            }

            Elements.sessionContent.appendChild(sectionEl);
        });

        // Add remaining images
        if (session.images && session.images.length > 2) {
            const gallery = this.createImageGallery(session.images.slice(2));
            Elements.sessionContent.appendChild(gallery);
        }

        // Add remaining facts
        if (session.facts && session.facts.length > 1) {
            session.facts.slice(1).forEach(fact => {
                const factBox = this.createFactBox(fact);
                Elements.sessionContent.appendChild(factBox);
            });
        }

        // Add video section
        const videoSectionHtml = VideoPlayer.renderVideoSection(AppState.currentSessionIndex);
        if (videoSectionHtml) {
            const videoContainer = document.createElement('div');
            videoContainer.innerHTML = videoSectionHtml;
            Elements.sessionContent.appendChild(videoContainer.firstElementChild);
        }

        // Render quiz
        this.renderQuiz(session.quiz);

        // Update footer buttons
        const isCompleted = AppState.completedSessions.includes(AppState.currentSessionIndex);
        Elements.completeSessionBtn.classList.toggle('hidden', isCompleted);
        Elements.reviewSessionBtn.textContent = isCompleted ? 'Review Content' : 'Scroll to Top';

        // Reset quiz results
        Elements.quizResults.classList.add('hidden');

        // Update TTS status
        const savedPosition = AppState.lastSessionPosition[AppState.currentSessionIndex] || 0;
        if (savedPosition > 0 && savedPosition < AppState.tts.sentences.length) {
            Elements.ttsStatus.textContent = `Resume from sentence ${savedPosition + 1}`;
        } else {
            Elements.ttsStatus.textContent = 'Click play to listen';
        }
        this.updateTTSButton(false);
    },

    createImageGallery(images) {
        const gallery = document.createElement('div');
        gallery.className = 'image-gallery';
        gallery.setAttribute('role', 'group');
        gallery.setAttribute('aria-label', 'Image gallery');

        images.forEach((img, index) => {
            const item = document.createElement('figure');
            item.className = 'gallery-item';

            // Create skeleton placeholder
            const skeleton = document.createElement('div');
            skeleton.className = 'image-skeleton';
            skeleton.setAttribute('aria-hidden', 'true');
            item.appendChild(skeleton);

            const imgEl = document.createElement('img');
            imgEl.src = img.src;
            imgEl.alt = img.alt;
            imgEl.loading = 'lazy';
            imgEl.style.opacity = '0';
            imgEl.style.transition = 'opacity 0.3s ease';

            imgEl.onload = () => {
                skeleton.style.display = 'none';
                imgEl.style.opacity = '1';
            };

            imgEl.onerror = () => {
                skeleton.style.display = 'none';
                imgEl.style.opacity = '1';
                imgEl.src = 'data:image/svg+xml,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
                        <rect fill="#e9ecef" width="400" height="300"/>
                        <text fill="#6c757d" font-family="sans-serif" font-size="14" x="50%" y="45%" text-anchor="middle">Image unavailable</text>
                        <text fill="#adb5bd" font-family="sans-serif" font-size="12" x="50%" y="55%" text-anchor="middle">${img.caption || 'Photo'}</text>
                    </svg>
                `);
                imgEl.alt = 'Image could not be loaded: ' + img.alt;
            };

            item.appendChild(imgEl);

            if (img.caption) {
                const caption = document.createElement('figcaption');
                caption.className = 'gallery-caption';
                caption.textContent = img.caption;
                item.appendChild(caption);
            }

            gallery.appendChild(item);
        });

        return gallery;
    },

    createFactBox(fact) {
        const box = document.createElement('div');
        box.className = 'fact-box';
        box.setAttribute('role', 'button');
        box.setAttribute('tabindex', '0');
        box.setAttribute('aria-expanded', 'false');
        box.setAttribute('aria-label', `${fact.title} - Click to expand`);

        const factId = Utils.generateId();

        box.innerHTML = `
            <div class="fact-header">
                <span class="icon" aria-hidden="true">💡</span>
                <span>${fact.title}</span>
                <svg class="fact-toggle" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M6 9l6 6 6-6"/>
                </svg>
            </div>
            <div class="fact-content" id="${factId}" role="region">
                <p>${fact.content}</p>
            </div>
        `;

        const toggle = () => {
            const isExpanded = box.classList.contains('expanded');
            box.classList.toggle('expanded');
            box.setAttribute('aria-expanded', !isExpanded);
            box.setAttribute('aria-label', `${fact.title} - Click to ${isExpanded ? 'expand' : 'collapse'}`);
        };

        box.addEventListener('click', toggle);
        box.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });

        return box;
    },

    renderQuiz(questions) {
        Elements.quizContainer.innerHTML = '';

        questions.forEach((q, index) => {
            const questionEl = document.createElement('div');
            questionEl.className = 'quiz-question';
            questionEl.setAttribute('data-question-index', index);
            questionEl.setAttribute('role', 'group');
            questionEl.setAttribute('aria-labelledby', `question-${index}-text`);

            const letters = ['A', 'B', 'C', 'D'];

            questionEl.innerHTML = `
                <span class="question-number" aria-hidden="true">Question ${index + 1}</span>
                <p class="question-text" id="question-${index}-text">${q.question}</p>
                <div class="answer-options" role="radiogroup" aria-labelledby="question-${index}-text">
                    ${q.options.map((opt, optIndex) => `
                        <button class="answer-option"
                                data-question="${index}"
                                data-option="${optIndex}"
                                role="radio"
                                aria-checked="false"
                                aria-label="Option ${letters[optIndex]}: ${opt}">
                            <span class="option-letter" aria-hidden="true">${letters[optIndex]}</span>
                            <span class="option-text">${opt}</span>
                        </button>
                    `).join('')}
                </div>
                <div class="answer-feedback" data-question="${index}" role="alert" aria-live="polite"></div>
            `;

            Elements.quizContainer.appendChild(questionEl);
        });

        // Add click handlers
        Elements.quizContainer.querySelectorAll('.answer-option').forEach(btn => {
            btn.addEventListener('click', () => Quiz.selectAnswer(btn));
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    Quiz.selectAnswer(btn);
                }
            });
        });
    },

    updateProgress() {
        const completed = AppState.completedSessions.length;
        const total = SESSIONS_DATA.length;
        const percentage = Math.round((completed / total) * 100);

        // Header progress
        Elements.progressText.textContent = `${completed}/${total}`;

        // Progress ring (circumference = 2 * PI * 16 = 100.53)
        const circumference = 100.53;
        const offset = circumference - (completed / total) * circumference;
        Elements.progressRingFill.style.strokeDashoffset = offset;

        // Overall progress bar
        Elements.overallProgressBar.style.width = `${percentage}%`;
        Elements.overallProgressLabel.textContent = `${percentage}% Complete`;
    },

    updateTTSButton(isPlaying) {
        const playIcon = Elements.ttsPlayBtn.querySelector('.play-icon');
        const pauseIcon = Elements.ttsPlayBtn.querySelector('.pause-icon');

        if (isPlaying) {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
            Elements.ttsPlayBtn.setAttribute('aria-label', 'Pause reading');
        } else {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            Elements.ttsPlayBtn.setAttribute('aria-label', 'Play reading');
        }
    },

    showCelebration(score, total) {
        const completed = AppState.completedSessions.length;
        const percentage = Math.round((completed / SESSIONS_DATA.length) * 100);

        Elements.celebrationScore.textContent = `${score}/${total}`;
        Elements.celebrationProgress.textContent = `${percentage}%`;

        // Set message based on score
        const scorePercent = (score / total) * 100;
        let message;
        if (scorePercent === 100) {
            message = "Perfect score! You're amazing!";
        } else if (scorePercent >= 80) {
            message = "Great job! You're doing fantastic!";
        } else if (scorePercent >= 60) {
            message = "Nice work! Keep learning!";
        } else {
            message = "Good effort! Review and try again!";
        }
        Elements.celebrationMessage.textContent = message;

        // Show/hide next session button
        const hasNextSession = AppState.currentSessionIndex < SESSIONS_DATA.length - 1;
        Elements.nextSessionBtn.classList.toggle('hidden', !hasNextSession);

        // Create confetti
        this.createConfetti();

        // Show overlay
        Elements.celebrationOverlay.classList.remove('hidden');

        // Focus management for accessibility
        Elements.nextSessionBtn.focus();

        // Announce for screen readers
        Navigation.announce(`Session complete! ${message} Quiz score: ${score} out of ${total}. Overall progress: ${percentage} percent.`);
    },

    hideCelebration() {
        Elements.celebrationOverlay.classList.add('hidden');
        Elements.confettiContainer.innerHTML = '';
    },

    createConfetti() {
        Elements.confettiContainer.innerHTML = '';
        const colors = ['#FFB703', '#FB8500', '#00B4D8', '#90E0EF', '#74C69D', '#E63946'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
            confetti.setAttribute('aria-hidden', 'true');
            Elements.confettiContainer.appendChild(confetti);
        }
    },

    highlightSentence(sentenceIndex) {
        // Remove all highlights
        document.querySelectorAll('.sentence.highlight').forEach(s => {
            s.classList.remove('highlight');
        });

        // Add highlight to current sentence
        const sentence = AppState.tts.sentences[sentenceIndex];
        if (sentence && sentence.element) {
            sentence.element.classList.add('highlight');
            sentence.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    },

    clearHighlights() {
        document.querySelectorAll('.sentence.highlight').forEach(s => {
            s.classList.remove('highlight');
        });
    }
};

// ============================================
// TEXT-TO-SPEECH (Enhanced with sentence highlighting)
// ============================================
const TTS = {
    // Audio mode: 'google' (pre-generated) or 'browser' (Web Speech API)
    mode: 'browser',
    audioManifest: null,
    currentAudio: null,

    // Web Speech API fallback
    synth: window.speechSynthesis,
    utterance: null,
    voicesLoaded: false,
    preferredVoice: null,

    async init() {
        // Try to load Google Cloud pre-generated audio first
        await this.loadAudioManifest();

        // Initialize Web Speech API as fallback
        if (this.synth) {
            this.loadVoices();
            if (speechSynthesis.onvoiceschanged !== undefined) {
                speechSynthesis.onvoiceschanged = () => this.loadVoices();
            }
        }

        // Update status based on available mode
        if (this.mode === 'google') {
            console.log('TTS: Using Google Cloud pre-generated audio');
        } else if (this.synth) {
            console.log('TTS: Using Web Speech API (browser)');
        } else {
            Elements.ttsPlayBtn.disabled = true;
            Elements.ttsStatus.textContent = 'Text-to-speech not supported';
        }
    },

    async loadAudioManifest() {
        try {
            const response = await fetch('audio/manifest.json');
            if (response.ok) {
                this.audioManifest = await response.json();
                this.mode = 'google';
                console.log('TTS: Audio manifest loaded successfully');
            }
        } catch (e) {
            // No pre-generated audio available, use browser TTS
            console.log('TTS: No pre-generated audio found, using browser TTS');
            this.mode = 'browser';
        }
    },

    getSessionManifest(sessionIndex) {
        if (!this.audioManifest) return null;

        const sessionDir = `session-${sessionIndex + 1}`;
        const sessionInfo = this.audioManifest.sessions?.find(s => s.directory === sessionDir);

        if (!sessionInfo) return null;

        // Load session-specific manifest
        return fetch(`audio/${sessionDir}/manifest.json`)
            .then(r => r.ok ? r.json() : null)
            .catch(() => null);
    },

    loadVoices() {
        const voices = this.synth.getVoices();
        if (voices.length > 0) {
            this.voicesLoaded = true;
            // Prefer natural-sounding voices
            this.preferredVoice = voices.find(v =>
                v.lang.startsWith('en') &&
                (v.name.includes('Samantha') ||
                 v.name.includes('Karen') ||
                 v.name.includes('Google') ||
                 v.name.includes('Natural'))
            ) || voices.find(v => v.lang.startsWith('en-US'))
              || voices.find(v => v.lang.startsWith('en'));
        }
    },

    async play() {
        // If paused, resume
        if (AppState.tts.isPaused) {
            if (this.mode === 'google' && this.currentAudio) {
                this.currentAudio.play();
                AppState.tts.isPaused = false;
                AppState.tts.isPlaying = true;
                UI.updateTTSButton(true);
                Elements.ttsStatus.textContent = 'Reading...';
            } else if (this.synth) {
                this.synth.resume();
                AppState.tts.isPaused = false;
                AppState.tts.isPlaying = true;
                UI.updateTTSButton(true);
                Elements.ttsStatus.textContent = 'Reading...';
            }
            return;
        }

        // Check if we have sentences
        if (AppState.tts.sentences.length === 0) {
            Elements.ttsStatus.textContent = 'No content to read';
            return;
        }

        AppState.tts.isPlaying = true;
        UI.updateTTSButton(true);

        // Try Google Cloud audio first
        if (this.mode === 'google') {
            const played = await this.playGoogleAudio(AppState.tts.currentSentenceIndex);
            if (played) return;
            // Fall back to browser TTS if Google audio fails
            console.log('TTS: Falling back to browser TTS');
        }

        // Use Web Speech API
        this.speakSentenceBrowser(AppState.tts.currentSentenceIndex);
    },

    pause() {
        if (this.mode === 'google' && this.currentAudio) {
            this.currentAudio.pause();
            AppState.tts.isPaused = true;
            AppState.tts.isPlaying = false;
            UI.updateTTSButton(false);
            Elements.ttsStatus.textContent = 'Paused';
        } else if (this.synth) {
            this.synth.pause();
            AppState.tts.isPaused = true;
            AppState.tts.isPlaying = false;
            UI.updateTTSButton(false);
            Elements.ttsStatus.textContent = 'Paused';
        }

        // Save position
        Storage.savePosition(AppState.currentSessionIndex, AppState.tts.currentSentenceIndex);
    },

    stop() {
        // Stop Google audio
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }

        // Stop Web Speech
        if (this.synth) {
            this.synth.cancel();
        }

        AppState.tts.isPlaying = false;
        AppState.tts.isPaused = false;
        UI.updateTTSButton(false);
        UI.clearHighlights();
    },

    toggle() {
        if (AppState.tts.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    },

    // Google Cloud pre-generated audio playback
    async playGoogleAudio(sentenceIndex) {
        if (sentenceIndex >= AppState.tts.sentences.length) {
            this.handleFinished();
            return true;
        }

        const sentenceData = AppState.tts.sentences[sentenceIndex];
        AppState.tts.currentSentenceIndex = sentenceIndex;

        // Highlight current sentence
        UI.highlightSentence(sentenceIndex);

        // Try to find matching audio file
        const sessionDir = `session-${AppState.currentSessionIndex + 1}`;
        const audioId = this.getSentenceAudioId(sentenceData, sentenceIndex);
        const audioPath = `audio/${sessionDir}/${audioId}.mp3`;

        try {
            // Check if audio file exists
            const response = await fetch(audioPath, { method: 'HEAD' });
            if (!response.ok) {
                return false; // Fall back to browser TTS
            }

            // Create and play audio
            this.currentAudio = new Audio(audioPath);

            // Adjust playback rate
            this.currentAudio.playbackRate = AppState.tts.speed;

            const totalSentences = AppState.tts.sentences.length;
            Elements.ttsStatus.textContent = `Reading sentence ${sentenceIndex + 1} of ${totalSentences}`;

            this.currentAudio.onended = () => {
                if (AppState.tts.isPlaying && !AppState.tts.isPaused) {
                    // Small pause between sentences
                    setTimeout(() => {
                        this.playGoogleAudio(sentenceIndex + 1);
                    }, 150);
                }
            };

            this.currentAudio.onerror = () => {
                console.log('TTS: Audio file error, trying next or falling back');
                if (AppState.tts.isPlaying) {
                    setTimeout(() => {
                        this.playGoogleAudio(sentenceIndex + 1);
                    }, 100);
                }
            };

            await this.currentAudio.play();
            return true;

        } catch (e) {
            console.log('TTS: Could not play Google audio:', e);
            return false;
        }
    },

    getSentenceAudioId(sentenceData, globalIndex) {
        // Map sentence to audio file ID based on its position
        // This matches the structure created by generate-audio.js
        const sectionIndex = sentenceData.sectionIndex || 0;
        const paraIndex = sentenceData.paragraphIndex || 0;
        const sentIndex = sentenceData.sentenceIndex || globalIndex;

        return `section-${sectionIndex}-para-${paraIndex}-sent-${sentIndex}`;
    },

    handleFinished() {
        this.stop();
        AppState.tts.currentSentenceIndex = 0;
        Elements.ttsStatus.textContent = 'Finished! Click play to start again.';
        Storage.savePosition(AppState.currentSessionIndex, 0);
    },

    // Web Speech API (browser) TTS
    speakSentenceBrowser(index) {
        if (!this.synth) return;

        if (index >= AppState.tts.sentences.length) {
            this.handleFinished();
            return;
        }

        const sentenceData = AppState.tts.sentences[index];
        AppState.tts.currentSentenceIndex = index;

        // Highlight current sentence
        UI.highlightSentence(index);

        // Create utterance
        this.utterance = new SpeechSynthesisUtterance(sentenceData.text);
        this.utterance.rate = AppState.tts.speed;
        this.utterance.pitch = 1;

        if (this.preferredVoice) {
            this.utterance.voice = this.preferredVoice;
        }

        const totalSentences = AppState.tts.sentences.length;
        Elements.ttsStatus.textContent = `Reading sentence ${index + 1} of ${totalSentences}`;

        this.utterance.onend = () => {
            if (AppState.tts.isPlaying && !AppState.tts.isPaused) {
                // Small pause between sentences for natural flow
                setTimeout(() => {
                    this.speakSentenceBrowser(index + 1);
                }, 200);
            }
        };

        this.utterance.onerror = (event) => {
            // Ignore 'interrupted' errors (happens on stop/cancel)
            if (event.error === 'interrupted') return;

            console.error('TTS Error:', event);
            Elements.ttsStatus.textContent = 'Error reading text. Trying next sentence...';

            // Try to continue with next sentence
            setTimeout(() => {
                if (AppState.tts.isPlaying) {
                    this.speakSentenceBrowser(index + 1);
                }
            }, 500);
        };

        this.synth.speak(this.utterance);
    },

    setSpeed(speed) {
        AppState.tts.speed = parseFloat(speed);

        // If using Google audio, update playback rate
        if (this.currentAudio) {
            this.currentAudio.playbackRate = AppState.tts.speed;
        }

        // If using browser TTS and currently playing, restart from current sentence
        if (this.mode === 'browser' && AppState.tts.isPlaying && !AppState.tts.isPaused) {
            this.synth.cancel();
            setTimeout(() => {
                this.speakSentenceBrowser(AppState.tts.currentSentenceIndex);
            }, 100);
        }
    },

    // Skip to specific sentence
    skipTo(sentenceIndex) {
        if (sentenceIndex < 0 || sentenceIndex >= AppState.tts.sentences.length) return;

        // Stop current playback
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }
        if (this.synth) {
            this.synth.cancel();
        }

        AppState.tts.currentSentenceIndex = sentenceIndex;

        if (AppState.tts.isPlaying) {
            setTimeout(() => {
                this.play();
            }, 100);
        } else {
            UI.highlightSentence(sentenceIndex);
        }
    },

    // Get current TTS mode for display
    getMode() {
        return this.mode === 'google' ? 'High Quality' : 'Standard';
    }
};

// ============================================
// QUIZ
// ============================================
const Quiz = {
    selectAnswer(btn) {
        const questionIndex = parseInt(btn.dataset.question);
        const optionIndex = parseInt(btn.dataset.option);
        const session = SESSIONS_DATA[AppState.currentSessionIndex];
        const question = session.quiz[questionIndex];

        // If already answered this question, ignore
        if (AppState.quiz.currentAnswers.hasOwnProperty(questionIndex)) {
            return;
        }

        // Record answer
        AppState.quiz.currentAnswers[questionIndex] = optionIndex;

        // Mark selected
        btn.classList.add('selected');
        btn.setAttribute('aria-checked', 'true');

        // Check if correct
        const isCorrect = optionIndex === question.correctIndex;

        // Show feedback with slight delay for visual effect
        setTimeout(() => {
            // Update button styles
            if (isCorrect) {
                btn.classList.remove('selected');
                btn.classList.add('correct');
            } else {
                btn.classList.remove('selected');
                btn.classList.add('incorrect');

                // Highlight correct answer
                const correctBtn = document.querySelector(
                    `.answer-option[data-question="${questionIndex}"][data-option="${question.correctIndex}"]`
                );
                if (correctBtn) {
                    correctBtn.classList.add('correct');
                }
            }

            // Show feedback text
            const feedbackEl = document.querySelector(`.answer-feedback[data-question="${questionIndex}"]`);
            if (feedbackEl) {
                feedbackEl.className = `answer-feedback show ${isCorrect ? 'correct' : 'incorrect'}`;
                feedbackEl.innerHTML = isCorrect
                    ? `<strong>Great job!</strong> ${question.explanation}`
                    : `<strong>Not quite.</strong> ${question.explanation}`;
            }

            // Disable all options for this question
            document.querySelectorAll(`.answer-option[data-question="${questionIndex}"]`).forEach(b => {
                b.setAttribute('aria-disabled', 'true');
                b.style.pointerEvents = 'none';
            });

            // Check if quiz is complete
            this.checkQuizComplete();
        }, 300);
    },

    checkQuizComplete() {
        const session = SESSIONS_DATA[AppState.currentSessionIndex];
        const totalQuestions = session.quiz.length;
        const answeredQuestions = Object.keys(AppState.quiz.currentAnswers).length;

        if (answeredQuestions === totalQuestions) {
            // Calculate score
            let correct = 0;
            Object.entries(AppState.quiz.currentAnswers).forEach(([qIndex, answer]) => {
                if (answer === session.quiz[parseInt(qIndex)].correctIndex) {
                    correct++;
                }
            });

            // Show results
            Elements.resultsScore.textContent = `${correct}/${totalQuestions}`;

            const percentage = (correct / totalQuestions) * 100;
            let message;
            if (percentage === 100) {
                message = "Perfect score! Amazing work!";
            } else if (percentage >= 80) {
                message = "Great job! You really know your stuff!";
            } else if (percentage >= 60) {
                message = "Nice work! Keep learning!";
            } else {
                message = "Good effort! Review the content and try again!";
            }
            Elements.resultsMessage.textContent = message;

            Elements.quizResults.classList.remove('hidden');

            // Show complete button (if not already completed)
            const isCompleted = AppState.completedSessions.includes(AppState.currentSessionIndex);
            if (!isCompleted) {
                Elements.completeSessionBtn.classList.remove('hidden');

                // Scroll to button
                setTimeout(() => {
                    Elements.completeSessionBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 500);
            }

            // Save score
            AppState.sessionScores[AppState.currentSessionIndex] = {
                correct,
                total: totalQuestions
            };
            Storage.save();
        }
    },

    getScore() {
        const session = SESSIONS_DATA[AppState.currentSessionIndex];
        let correct = 0;

        Object.entries(AppState.quiz.currentAnswers).forEach(([qIndex, answer]) => {
            if (answer === session.quiz[parseInt(qIndex)].correctIndex) {
                correct++;
            }
        });

        return {
            correct,
            total: session.quiz.length
        };
    }
};

// ============================================
// EXPLORE MAP
// ============================================
const ExploreMap = {
    map: null,
    markers: [],
    initialized: false,

    init() {
        if (this.initialized && this.map) {
            // Just update the map if already initialized
            this.updateMarkers();
            this.updateLegend();
            this.updateCounts();
            return;
        }

        // Initialize Leaflet map
        this.map = L.map('leaflet-map', {
            center: [34.0522, -118.2437], // LA center
            zoom: 9,
            scrollWheelZoom: true,
            zoomControl: true
        });

        // Use CartoDB Voyager tiles (clean, colorful, kid-friendly)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(this.map);

        this.updateMarkers();
        this.updateLegend();
        this.updateCounts();
        this.initialized = true;
    },

    isLocationUnlocked(location) {
        // A location is unlocked if:
        // 1. Session 0 locations are always unlocked (intro to California)
        // 2. Other locations unlock when their session is completed OR started
        if (location.session === 0) return true;
        return AppState.completedSessions.includes(location.session) ||
               AppState.completedSessions.includes(location.session - 1) ||
               location.session <= AppState.completedSessions.length;
    },

    updateMarkers() {
        // Clear existing markers
        this.markers.forEach(marker => marker.remove());
        this.markers = [];

        if (typeof MAP_LOCATIONS === 'undefined') return;

        MAP_LOCATIONS.forEach(location => {
            const isUnlocked = this.isLocationUnlocked(location);
            const categoryStyle = CATEGORY_STYLES[location.category] || { color: '#666', icon: '📍' };

            // Create custom icon
            const iconHtml = `
                <div class="custom-marker ${isUnlocked ? '' : 'locked'}"
                     style="background: ${isUnlocked ? categoryStyle.color : '#9ca3af'};">
                    ${isUnlocked ? location.icon : '🔒'}
                </div>
            `;

            const icon = L.divIcon({
                html: iconHtml,
                className: 'custom-marker-container',
                iconSize: [36, 36],
                iconAnchor: [18, 18],
                popupAnchor: [0, -20]
            });

            const marker = L.marker(location.coords, { icon });

            // Create popup content
            const popupContent = isUnlocked
                ? this.createUnlockedPopup(location)
                : this.createLockedPopup(location);

            marker.bindPopup(popupContent, {
                className: 'custom-popup',
                maxWidth: 280,
                minWidth: 260
            });

            marker.addTo(this.map);
            this.markers.push(marker);
        });
    },

    createUnlockedPopup(location) {
        const sessionName = SESSION_NAMES[location.session] || `Session ${location.session + 1}`;
        return `
            <div class="popup-content">
                ${location.image ? `<img src="${location.image}" alt="${location.name}" class="popup-image" loading="lazy">` : ''}
                <div class="popup-body">
                    <div class="popup-header">
                        <span class="popup-icon">${location.icon}</span>
                        <h4 class="popup-name">${location.name}</h4>
                    </div>
                    <p class="popup-description">${location.description}</p>
                    <span class="popup-session-badge">
                        <span>📖</span>
                        ${sessionName}
                    </span>
                </div>
            </div>
        `;
    },

    createLockedPopup(location) {
        const sessionName = SESSION_NAMES[location.session] || `Session ${location.session + 1}`;
        return `
            <div class="popup-content">
                <div class="popup-locked">
                    <div class="popup-locked-icon">🔒</div>
                    <p class="popup-locked-text">
                        Complete <strong>"${sessionName}"</strong> to discover this location!
                    </p>
                </div>
            </div>
        `;
    },

    updateLegend() {
        if (!Elements.mapLegend) return;

        Elements.mapLegend.innerHTML = '';

        SESSION_NAMES.forEach((name, index) => {
            const isCompleted = AppState.completedSessions.includes(index);
            const item = document.createElement('div');
            item.className = `legend-item ${isCompleted ? 'completed' : 'locked'}`;
            item.innerHTML = `
                <span class="legend-dot ${isCompleted ? 'completed' : 'locked'}"></span>
                <span>${index + 1}. ${name.length > 20 ? name.substring(0, 20) + '...' : name}</span>
            `;
            Elements.mapLegend.appendChild(item);
        });
    },

    updateCounts() {
        if (typeof MAP_LOCATIONS === 'undefined') return;

        const unlockedCount = MAP_LOCATIONS.filter(loc => this.isLocationUnlocked(loc)).length;
        const totalCount = MAP_LOCATIONS.length;

        if (Elements.mapUnlockCount) {
            Elements.mapUnlockCount.textContent = unlockedCount;
        }
        if (Elements.mapTotalCount) {
            Elements.mapTotalCount.textContent = totalCount;
        }
    },

    getUnlockedCount() {
        if (typeof MAP_LOCATIONS === 'undefined') return { unlocked: 0, total: 0 };
        const unlocked = MAP_LOCATIONS.filter(loc => this.isLocationUnlocked(loc)).length;
        return { unlocked, total: MAP_LOCATIONS.length };
    }
};

// ============================================
// VIDEO PLAYER
// ============================================
const VideoPlayer = {
    modal: null,

    init() {
        // Create modal if it doesn't exist
        if (!document.getElementById('video-modal')) {
            const modal = document.createElement('div');
            modal.id = 'video-modal';
            modal.className = 'video-modal hidden';
            modal.innerHTML = `
                <div class="video-modal-content">
                    <button class="video-modal-close" aria-label="Close video">&times;</button>
                    <div class="video-iframe-container">
                        <iframe id="video-iframe"
                                src=""
                                title="Video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen>
                        </iframe>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Event listeners
            modal.querySelector('.video-modal-close').addEventListener('click', () => this.close());
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.close();
            });
        }
        this.modal = document.getElementById('video-modal');
    },

    play(videoId, timestamp = 0) {
        if (!this.modal) this.init();

        const iframe = document.getElementById('video-iframe');
        const startTime = timestamp ? `&start=${timestamp}` : '';
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1${startTime}&rel=0`;

        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Stop TTS if playing
        TTS.stop();
    },

    close() {
        if (!this.modal) return;

        const iframe = document.getElementById('video-iframe');
        iframe.src = '';

        this.modal.classList.add('hidden');
        document.body.style.overflow = '';
    },

    renderVideoSection(sessionIndex) {
        if (typeof SESSION_VIDEOS === 'undefined') return '';

        const videos = SESSION_VIDEOS[sessionIndex];
        if (!videos || videos.length === 0) return '';

        const videoCards = videos.map(video => `
            <div class="video-card" onclick="VideoPlayer.play('${video.id}', ${video.timestamp || 0})">
                <div class="video-thumbnail">
                    <img src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg"
                         alt="${video.title}"
                         loading="lazy">
                    <div class="video-play-overlay">
                        <div class="video-play-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="video-info">
                    <h4 class="video-title">${video.title}</h4>
                    <p class="video-description">${video.description}</p>
                    <span class="video-duration">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 6v6l4 2"/>
                        </svg>
                        ${video.duration}
                    </span>
                </div>
            </div>
        `).join('');

        return `
            <div class="video-section">
                <div class="video-section-header">
                    <h3>
                        <span>🎬</span>
                        Watch & Learn
                    </h3>
                </div>
                <div class="video-grid">
                    ${videoCards}
                </div>
            </div>
        `;
    }
};

// ============================================
// SESSION COMPLETION
// ============================================
const Session = {
    complete() {
        const index = AppState.currentSessionIndex;

        // Mark as completed
        if (!AppState.completedSessions.includes(index)) {
            AppState.completedSessions.push(index);
        }

        // Clear saved position since session is complete
        delete AppState.lastSessionPosition[index];

        Storage.save();

        // Get quiz score
        const score = Quiz.getScore();

        // Stop TTS
        TTS.stop();

        // Show celebration
        UI.showCelebration(score.correct, score.total);
    },

    goToNext() {
        UI.hideCelebration();

        const nextIndex = AppState.currentSessionIndex + 1;
        if (nextIndex < SESSIONS_DATA.length) {
            Navigation.showSession(nextIndex);
        } else {
            Navigation.showHome();
        }
    }
};

// ============================================
// KEYBOARD NAVIGATION
// ============================================
const Keyboard = {
    init() {
        document.addEventListener('keydown', (e) => {
            // Escape key to go back/close
            if (e.key === 'Escape') {
                // Close video modal first if open
                const videoModal = document.getElementById('video-modal');
                if (videoModal && !videoModal.classList.contains('hidden')) {
                    VideoPlayer.close();
                    return;
                }

                if (!Elements.celebrationOverlay.classList.contains('hidden')) {
                    UI.hideCelebration();
                    Navigation.showHome();
                } else if (AppState.currentView === 'session' || AppState.currentView === 'map') {
                    TTS.stop();
                    Navigation.showHome();
                }
            }

            // Space to toggle TTS when in session view (if not focused on button/input)
            if (e.key === ' ' && AppState.currentView === 'session') {
                const focusedTag = document.activeElement.tagName.toLowerCase();
                if (!['button', 'input', 'select', 'textarea'].includes(focusedTag)) {
                    e.preventDefault();
                    TTS.toggle();
                }
            }

            // Arrow keys for speed control when TTS controls are focused
            if (document.activeElement === Elements.ttsSpeed) {
                // Let default behavior handle it
                return;
            }
        });
    }
};

// ============================================
// EVENT LISTENERS
// ============================================
function initEventListeners() {
    // Back button
    Elements.backBtn.addEventListener('click', () => {
        TTS.stop();
        Navigation.showHome();
    });

    // Map toggle button
    if (Elements.mapToggleBtn) {
        Elements.mapToggleBtn.addEventListener('click', () => Navigation.showMap());
    }

    // TTS controls
    Elements.ttsPlayBtn.addEventListener('click', () => TTS.toggle());
    Elements.ttsSpeed.addEventListener('change', (e) => TTS.setSpeed(e.target.value));

    // Session completion
    Elements.completeSessionBtn.addEventListener('click', () => Session.complete());

    // Review/scroll button
    Elements.reviewSessionBtn.addEventListener('click', () => {
        Elements.sessionContent.scrollIntoView({ behavior: 'smooth' });
    });

    // Celebration buttons
    Elements.nextSessionBtn.addEventListener('click', () => Session.goToNext());
    Elements.backHomeBtn.addEventListener('click', () => {
        UI.hideCelebration();
        Navigation.showHome();
    });

    // Close celebration on overlay click (outside content)
    Elements.celebrationOverlay.addEventListener('click', (e) => {
        if (e.target === Elements.celebrationOverlay) {
            UI.hideCelebration();
            Navigation.showHome();
        }
    });

    // Handle browser back button
    window.addEventListener('popstate', () => {
        if (AppState.currentView === 'session') {
            TTS.stop();
            Navigation.showHome();
        }
    });

    // Handle visibility change (pause TTS when tab hidden)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && AppState.tts.isPlaying) {
            TTS.pause();
        }
    });

    // Click on sentences to jump TTS there (optional feature)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('sentence') && AppState.currentView === 'session') {
            const sentenceIndex = parseInt(e.target.dataset.sentenceIndex);
            if (!isNaN(sentenceIndex)) {
                TTS.skipTo(sentenceIndex);
            }
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================
async function init() {
    // Load saved progress
    Storage.load();

    // Initialize TTS (async to check for pre-generated audio)
    await TTS.init();

    // Initialize video player
    VideoPlayer.init();

    // Initialize keyboard navigation
    Keyboard.init();

    // Set up event listeners
    initEventListeners();

    // Render initial UI
    UI.renderSessionCards();
    UI.updateProgress();

    console.log('Discover LA initialized! Phase 3 with interactive map, videos, and enhanced TTS.');
    console.log(`TTS Mode: ${TTS.getMode()}`);
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
