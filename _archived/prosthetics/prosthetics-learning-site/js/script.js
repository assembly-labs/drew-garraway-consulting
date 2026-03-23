/* ========================================
   PROSTHETICS LEARNING SITE - JAVASCRIPT
   Progress tracking, quizzes, interactives,
   scroll reveal animations
   ======================================== */

(function () {
  'use strict';

  // --- Storage Keys ---
  const STORAGE_KEYS = {
    progress: 'prosthetics_progress',
    quizzes: 'prosthetics_quizzes',
    badges: 'prosthetics_badges',
    bookmarks: 'prosthetics_bookmarks',
    advancedMode: 'prosthetics_advanced',
  };

  // --- Section definitions ---
  const SECTIONS = [
    { id: 'body', label: 'Body', page: 'pages/how-body-works.html' },
    { id: 'mechanical', label: 'Mechanical', page: 'pages/mechanical-prosthetics.html' },
    { id: 'blades', label: 'Blades', page: 'pages/running-blades.html' },
    { id: 'bionic', label: 'Bionic', page: 'pages/bionic-arms.html' },
    { id: 'athletes', label: 'Athletes', page: 'pages/athletes.html' },
    { id: 'future', label: 'Future', page: 'pages/future-tech.html' },
  ];

  // --- Badge definitions ---
  const BADGE_DEFS = [
    { id: 'first_section', label: 'First Steps', icon: '&#x25B6;', desc: 'Complete your first section' },
    { id: 'quiz_ace', label: 'Quiz Ace', icon: '&#x2713;', desc: 'Get 3/3 on any quiz' },
    { id: 'half_done', label: 'Halfway', icon: '&#x2605;', desc: 'Complete 3 sections' },
    { id: 'all_done', label: 'Complete', icon: '&#x2666;', desc: 'Complete all 6 sections' },
    { id: 'explorer', label: 'Explorer', icon: '&#x2261;', desc: 'Read 3 advanced sections' },
    { id: 'bookworm', label: 'Bookworm', icon: '&#x2302;', desc: 'Bookmark 5 facts' },
  ];

  // --- State ---
  let state = {
    progress: {},
    quizzes: {},
    badges: [],
    bookmarks: [],
    advancedMode: false,
  };

  // --- Helpers ---
  function loadState() {
    try {
      const p = localStorage.getItem(STORAGE_KEYS.progress);
      const q = localStorage.getItem(STORAGE_KEYS.quizzes);
      const b = localStorage.getItem(STORAGE_KEYS.badges);
      const bk = localStorage.getItem(STORAGE_KEYS.bookmarks);
      const adv = localStorage.getItem(STORAGE_KEYS.advancedMode);
      if (p) state.progress = JSON.parse(p);
      if (q) state.quizzes = JSON.parse(q);
      if (b) state.badges = JSON.parse(b);
      if (bk) state.bookmarks = JSON.parse(bk);
      if (adv) state.advancedMode = JSON.parse(adv);
    } catch (e) {
      console.warn('Could not load saved progress:', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(state.progress));
      localStorage.setItem(STORAGE_KEYS.quizzes, JSON.stringify(state.quizzes));
      localStorage.setItem(STORAGE_KEYS.badges, JSON.stringify(state.badges));
      localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(state.bookmarks));
      localStorage.setItem(STORAGE_KEYS.advancedMode, JSON.stringify(state.advancedMode));
    } catch (e) {
      console.warn('Could not save progress:', e);
    }
  }

  function getCompletedCount() {
    return SECTIONS.filter(s => state.progress[s.id]).length;
  }

  function getProgressPercent() {
    return Math.round((getCompletedCount() / SECTIONS.length) * 100);
  }

  // --- Scroll Reveal ---
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  // --- Badge System ---
  function checkBadges() {
    const completed = getCompletedCount();
    const newBadges = [];

    if (completed >= 1 && !state.badges.includes('first_section')) {
      state.badges.push('first_section');
      newBadges.push('first_section');
    }
    if (completed >= 3 && !state.badges.includes('half_done')) {
      state.badges.push('half_done');
      newBadges.push('half_done');
    }
    if (completed >= 6 && !state.badges.includes('all_done')) {
      state.badges.push('all_done');
      newBadges.push('all_done');
    }

    // Check quiz ace
    for (const key of Object.keys(state.quizzes)) {
      const quiz = state.quizzes[key];
      if (quiz && quiz.correct === quiz.total && quiz.total >= 3) {
        if (!state.badges.includes('quiz_ace')) {
          state.badges.push('quiz_ace');
          newBadges.push('quiz_ace');
        }
        break;
      }
    }

    // Check bookworm
    if (state.bookmarks.length >= 5 && !state.badges.includes('bookworm')) {
      state.badges.push('bookworm');
      newBadges.push('bookworm');
    }

    if (newBadges.length > 0) {
      saveState();
      newBadges.forEach(id => showBadgeNotification(id));
    }
  }

  function showBadgeNotification(badgeId) {
    const badge = BADGE_DEFS.find(b => b.id === badgeId);
    if (!badge) return;

    let notif = document.querySelector('.badge-notification');
    if (!notif) {
      notif = document.createElement('div');
      notif.className = 'badge-notification';
      notif.setAttribute('role', 'alert');
      document.body.appendChild(notif);
    }

    notif.innerHTML =
      '<span class="notif-icon">' + badge.icon + '</span>' +
      '<div>' +
      '<div class="notif-text">Badge Earned</div>' +
      '<div class="notif-subtext">' + badge.label + ': ' + badge.desc + '</div>' +
      '</div>';

    requestAnimationFrame(() => {
      notif.classList.add('show');
    });

    setTimeout(() => {
      notif.classList.remove('show');
    }, 4000);
  }

  // --- Progress UI Updates ---
  function updateProgressBar() {
    const fill = document.querySelector('.progress-fill');
    const count = document.querySelector('.progress-count');
    if (fill) {
      fill.style.width = getProgressPercent() + '%';
    }
    if (count) {
      count.textContent = getCompletedCount() + ' of ' + SECTIONS.length;
    }

    // Update dots
    SECTIONS.forEach(function (section) {
      const dot = document.querySelector('.progress-dot[data-section="' + section.id + '"]');
      if (dot) {
        dot.classList.toggle('completed', !!state.progress[section.id]);
      }
    });
  }

  function updateCardBadges() {
    SECTIONS.forEach(function (section) {
      const card = document.querySelector('.section-card[data-section="' + section.id + '"]');
      if (!card) return;
      const badge = card.querySelector('.card-badge');
      if (badge) {
        if (state.progress[section.id]) {
          badge.textContent = 'Done';
          badge.classList.remove('incomplete');
        } else {
          badge.textContent = 'Not yet';
          badge.classList.add('incomplete');
        }
      }
    });
  }

  function updateBadgesDisplay() {
    const container = document.querySelector('.badges-grid');
    if (!container) return;

    BADGE_DEFS.forEach(function (badge) {
      const item = container.querySelector('[data-badge="' + badge.id + '"]');
      if (item) {
        item.classList.toggle('earned', state.badges.includes(badge.id));
      }
    });
  }

  // --- Section Completion ---
  function markSectionComplete(sectionId) {
    state.progress[sectionId] = true;
    saveState();
    updateProgressBar();
    updateCardBadges();
    checkBadges();

    const btn = document.querySelector('.btn-complete');
    if (btn) {
      btn.textContent = 'Section Complete';
      btn.classList.add('completed');
      btn.disabled = true;
    }
  }

  // --- Quiz System ---
  function initQuiz(sectionId) {
    const quizEl = document.querySelector('.quiz-section');
    if (!quizEl) return;

    const questions = quizEl.querySelectorAll('.quiz-question');
    let correctCount = 0;
    let answeredCount = 0;
    const totalQuestions = questions.length;

    questions.forEach(function (questionEl) {
      const options = questionEl.querySelectorAll('.quiz-option');
      const feedbackEl = questionEl.querySelector('.quiz-feedback');
      const correctAnswer = questionEl.getAttribute('data-answer');

      options.forEach(function (optionEl) {
        optionEl.addEventListener('click', function () {
          if (questionEl.classList.contains('answered')) return;
          questionEl.classList.add('answered');

          const selected = this.getAttribute('data-value');
          const isCorrect = selected === correctAnswer;

          options.forEach(function (opt) {
            opt.classList.add('disabled');
            if (opt.getAttribute('data-value') === correctAnswer) {
              opt.classList.add('correct');
            }
          });

          if (isCorrect) {
            this.classList.add('correct');
            correctCount++;
            if (feedbackEl) {
              feedbackEl.textContent = 'Correct.';
              feedbackEl.classList.add('correct', 'show');
            }
          } else {
            this.classList.add('incorrect');
            if (feedbackEl) {
              feedbackEl.textContent = 'Not quite -- check the correct answer highlighted above.';
              feedbackEl.classList.add('incorrect', 'show');
            }
          }

          answeredCount++;

          if (answeredCount === totalQuestions) {
            state.quizzes[sectionId] = { correct: correctCount, total: totalQuestions };
            saveState();

            const scoreEl = document.querySelector('.quiz-score');
            if (scoreEl) {
              scoreEl.querySelector('.score-text').textContent =
                'You got ' + correctCount + ' out of ' + totalQuestions + '.';
              scoreEl.classList.add('show');
            }

            checkBadges();
          }
        });
      });
    });

    // Restore previous quiz state
    var prevQuiz = state.quizzes[sectionId];
    if (prevQuiz) {
      var scoreEl = document.querySelector('.quiz-score');
      if (scoreEl) {
        scoreEl.querySelector('.score-text').textContent =
          'You got ' + prevQuiz.correct + ' out of ' + prevQuiz.total + '.';
        scoreEl.classList.add('show');
      }
    }
  }

  // --- Bookmark System ---
  function initBookmarks() {
    document.querySelectorAll('.btn-bookmark').forEach(function (btn) {
      var factId = btn.getAttribute('data-fact');
      if (state.bookmarks.includes(factId)) {
        btn.classList.add('saved');
        btn.textContent = 'Saved';
      }

      btn.addEventListener('click', function () {
        var fid = this.getAttribute('data-fact');
        if (state.bookmarks.includes(fid)) {
          state.bookmarks = state.bookmarks.filter(function (b) { return b !== fid; });
          this.classList.remove('saved');
          this.textContent = 'Save';
        } else {
          state.bookmarks.push(fid);
          this.classList.add('saved');
          this.textContent = 'Saved';
        }
        saveState();
        checkBadges();
      });
    });
  }

  // --- Advanced Content Toggle ---
  function initAdvancedToggle() {
    document.querySelectorAll('.advanced-toggle').forEach(function (toggle) {
      var targetId = toggle.getAttribute('data-target');
      var content = document.getElementById(targetId);
      if (!content) return;

      if (state.advancedMode) {
        content.classList.add('show');
        toggle.setAttribute('aria-expanded', 'true');
      }

      toggle.addEventListener('click', function () {
        var isOpen = content.classList.contains('show');
        content.classList.toggle('show');
        this.setAttribute('aria-expanded', !isOpen);

        if (!isOpen) {
          var advCount = parseInt(localStorage.getItem('prosthetics_adv_count') || '0', 10);
          advCount++;
          localStorage.setItem('prosthetics_adv_count', String(advCount));
          if (advCount >= 3 && !state.badges.includes('explorer')) {
            state.badges.push('explorer');
            saveState();
            showBadgeNotification('explorer');
          }
        }
      });
    });
  }

  // --- Reading Level Toggle ---
  function initReadingToggle() {
    var toggle = document.querySelector('.toggle-switch');
    if (!toggle) return;

    if (state.advancedMode) {
      toggle.classList.add('on');
      document.body.classList.add('advanced-reading');
    }

    toggle.addEventListener('click', function () {
      state.advancedMode = !state.advancedMode;
      this.classList.toggle('on');
      document.body.classList.toggle('advanced-reading');
      saveState();

      document.querySelectorAll('.advanced-content').forEach(function (el) {
        el.classList.toggle('show', state.advancedMode);
      });
    });
  }

  // --- Print Button ---
  function initPrintButtons() {
    document.querySelectorAll('.btn-print').forEach(function (btn) {
      btn.addEventListener('click', function () { window.print(); });
    });
  }

  // --- Mobile Nav Toggle ---
  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      var isOpen = links.classList.contains('open');
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Brain Signal Visualization ---
  function initSignalViz() {
    var nodes = document.querySelectorAll('.signal-node');
    var arrows = document.querySelectorAll('.signal-arrow');
    if (nodes.length === 0) return;

    var startBtn = document.querySelector('.viz-start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', animateSignal);
    }

    function animateSignal() {
      nodes.forEach(function (n) { n.classList.remove('active'); });
      arrows.forEach(function (a) { a.classList.remove('active'); });

      nodes.forEach(function (node, i) {
        setTimeout(function () {
          node.classList.add('active');
          if (i > 0 && arrows[i - 1]) {
            arrows[i - 1].classList.add('active');
          }
        }, i * 600);
      });

      setTimeout(function () {
        nodes.forEach(function (n) { n.classList.remove('active'); });
        arrows.forEach(function (a) { a.classList.remove('active'); });
      }, nodes.length * 600 + 2000);
    }
  }

  // --- Spring Compression Demo (Running Blades) ---
  function initSpringDemo() {
    var blade = document.querySelector('.spring-blade');
    var btn = document.querySelector('.spring-btn');
    var label = document.querySelector('.spring-label');
    if (!blade || !btn) return;

    var compressed = false;
    btn.addEventListener('click', function () {
      compressed = !compressed;
      blade.classList.toggle('compressed', compressed);
      if (label) {
        label.textContent = compressed
          ? 'Compressed -- energy stored'
          : 'Released -- energy pushes forward';
      }
      btn.textContent = compressed ? 'Release Energy' : 'Step Down';
    });
  }

  // --- Hook Open/Close Demo (Mechanical) ---
  function initHookDemo() {
    var hook = document.querySelector('.hook-demo');
    var btn = document.querySelector('.hook-btn');
    var label = document.querySelector('.hook-label');
    if (!hook || !btn) return;

    var isOpen = false;
    btn.addEventListener('click', function () {
      isOpen = !isOpen;
      hook.classList.toggle('open', isOpen);
      if (label) {
        label.textContent = isOpen ? 'Hook is OPEN' : 'Hook is CLOSED';
      }
      btn.textContent = isOpen ? 'Release Cable' : 'Pull Cable';
    });
  }

  // --- Flowchart Interaction (Bionic Arms) ---
  function initFlowchart() {
    var steps = document.querySelectorAll('.flowchart-step');
    steps.forEach(function (step) {
      step.addEventListener('click', function () {
        steps.forEach(function (s) { s.classList.remove('active'); });
        step.classList.add('active');
      });
    });
  }

  // --- Grip Patterns (Bionic Arms) ---
  function initGripPatterns() {
    var items = document.querySelectorAll('.grip-item');
    var display = document.querySelector('.grip-display');
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        items.forEach(function (i) { i.classList.remove('active'); });
        item.classList.add('active');
        if (display) {
          display.textContent = item.getAttribute('data-desc') || '';
        }
      });
    });
  }

  // --- Athlete Expand/Collapse ---
  function initAthleteCards() {
    document.querySelectorAll('.btn-learn-more').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = this.closest('.athlete-card');
        var expandable = card ? card.querySelector('.athlete-expandable') : null;
        if (!expandable) return;

        var isOpen = expandable.classList.contains('show');
        expandable.classList.toggle('show');
        this.textContent = isOpen ? 'Read More' : 'Show Less';
      });
    });
  }

  // --- Prosthetic Customizer (Future Tech) ---
  function initCustomizer() {
    var typeSelect = document.querySelector('#customizer-type');
    var colorSelect = document.querySelector('#customizer-color');
    var featureSelect = document.querySelector('#customizer-feature');
    var sportSelect = document.querySelector('#customizer-sport');
    var preview = document.querySelector('.customizer-preview');
    if (!typeSelect || !preview) return;

    function updatePreview() {
      var type = typeSelect.value;
      var color = colorSelect ? colorSelect.value : '';
      var feature = featureSelect ? featureSelect.value : '';
      var sport = sportSelect ? sportSelect.value : '';

      var colorNames = {
        blue: 'Electric Blue',
        red: 'Racing Red',
        green: 'Neon Green',
        gold: 'Champion Gold',
        black: 'Stealth Black',
        custom: 'Custom Design',
      };

      var typeName = type ? type.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }) : 'Prosthetic';

      preview.innerHTML =
        '<div><strong>Your ' + typeName + '</strong></div>' +
        (color ? '<div>Color: ' + (colorNames[color] || color) + '</div>' : '') +
        (feature ? '<div>Feature: ' + feature.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }) + '</div>' : '') +
        (sport ? '<div>Optimized for: ' + sport.replace(/\b\w/g, function (c) { return c.toUpperCase(); }) + '</div>' : '');
    }

    [typeSelect, colorSelect, featureSelect, sportSelect].forEach(function (sel) {
      if (sel) sel.addEventListener('change', updatePreview);
    });
  }

  // --- Video Category Filter ---
  function initVideoFilter() {
    var btns = document.querySelectorAll('.video-category-btn');
    var cards = document.querySelectorAll('.video-card');
    if (btns.length === 0) return;

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = this.getAttribute('data-category');

        btns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        cards.forEach(function (card) {
          if (cat === 'all' || card.getAttribute('data-category') === cat) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- Complete Button ---
  function initCompleteButton() {
    var btn = document.querySelector('.btn-complete');
    if (!btn) return;

    var sectionId = btn.getAttribute('data-section');
    if (state.progress[sectionId]) {
      btn.textContent = 'Section Complete';
      btn.classList.add('completed');
      btn.disabled = true;
    }

    btn.addEventListener('click', function () {
      if (!this.classList.contains('completed')) {
        markSectionComplete(sectionId);
      }
    });
  }

  // --- Initialize Everything ---
  function init() {
    loadState();
    initScrollReveal();
    updateProgressBar();
    updateCardBadges();
    updateBadgesDisplay();
    initMobileNav();
    initSignalViz();
    initBookmarks();
    initAdvancedToggle();
    initReadingToggle();
    initPrintButtons();
    initQuiz(document.body.getAttribute('data-section') || '');
    initSpringDemo();
    initHookDemo();
    initFlowchart();
    initGripPatterns();
    initAthleteCards();
    initCustomizer();
    initVideoFilter();
    initCompleteButton();
    checkBadges();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
