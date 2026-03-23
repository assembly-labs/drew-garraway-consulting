// game.js — Core game logic & state machine
const Game = (() => {
  // State
  const STATE = { START: 'START', QUESTION: 'QUESTION', TAPPING: 'TAPPING', GAME_OVER: 'GAME_OVER', TRANSITION: 'TRANSITION' };
  let state = STATE.START;
  let questions = [];
  let roundQuestions = [];
  let currentIndex = 0;
  let quizScore = 0;
  let tapTotalScore = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let timerInterval = null;
  let timeLeft = 0;
  const TIME_PER_QUESTION = 22;
  const TOTAL_QUESTIONS = 22;
  const TAPPING_DURATION = 5000; // 5 seconds

  // Point values per difficulty
  const POINTS = { easy: 100, medium: 250, hard: 500 };

  // DOM refs
  const $ = (s) => document.querySelector(s);
  const screens = {
    start: $('#start-screen'),
    game: $('#game-screen'),
    tapping: $('#tapping-screen'),
    gameover: $('#gameover-screen'),
  };

  // Elements
  const els = {
    playBtn: $('#btn-play'),
    questionText: $('#question-text'),
    answers: Array.from(document.querySelectorAll('.answer-btn')),
    timerText: $('#timer-text'),
    timerRing: $('#timer-ring-fg'),
    scoreDisplay: $('#score-display'),
    questionNum: $('#question-num'),
    categoryBadge: $('#category-badge'),
    diffDots: Array.from(document.querySelectorAll('.difficulty-dot')),
    learningPopup: $('#learning-popup'),
    // Tapping
    tappingArea: $('#tapping-area'),
    tappingScore: $('#tapping-score'),
    tappingTimerBar: $('#tapping-timer-bar'),
    // Game over
    gameoverTitle: $('#gameover-title'),
    gameoverSubtitle: $('#gameover-subtitle'),
    finalScore: $('#final-score'),
    correctCountEl: $('#correct-count'),
    wrongCountEl: $('#wrong-count'),
    tapCountEl: $('#tap-count'),
    quizPointsEl: $('#quiz-points'),
    tapPointsEl: $('#tap-points'),
    playAgainBtn: $('#btn-play-again'),
    // Transition
    transitionOverlay: $('#transition-overlay'),
    transitionText: $('#transition-text'),
  };

  // ===== INIT =====
  function init() {
    questions = QUESTIONS_DATA;
    els.playBtn.addEventListener('click', startGame);
    els.playAgainBtn.addEventListener('click', startGame);
    els.answers.forEach((btn, i) => {
      btn.addEventListener('click', () => selectAnswer(i));
    });
    TappingGame.init(els.tappingArea, els.tappingScore, els.tappingTimerBar);
  }

  // ===== SCREEN MANAGEMENT =====
  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
  }

  // ===== START GAME =====
  function startGame() {
    SoundFX.init();
    quizScore = 0;
    tapTotalScore = 0;
    correctCount = 0;
    wrongCount = 0;
    currentIndex = 0;
    selectRoundQuestions();
    showScreen('game');
    state = STATE.QUESTION;
    showQuestion();
  }

  function selectRoundQuestions() {
    const easy = shuffle(questions.filter(q => q.difficulty === 'easy')).slice(0, 9);
    const medium = shuffle(questions.filter(q => q.difficulty === 'medium')).slice(0, 9);
    const hard = shuffle(questions.filter(q => q.difficulty === 'hard')).slice(0, 4);
    roundQuestions = [...easy, ...medium, ...hard];
  }

  // ===== SHOW QUESTION =====
  function showQuestion() {
    if (currentIndex >= TOTAL_QUESTIONS) {
      endGame();
      return;
    }

    state = STATE.QUESTION;
    const q = roundQuestions[currentIndex];

    // Update UI
    els.questionText.textContent = q.question;
    els.questionNum.innerHTML = `Q <span>${currentIndex + 1}</span>/${TOTAL_QUESTIONS}`;
    els.categoryBadge.textContent = q.category;
    els.scoreDisplay.innerHTML = `Score: <span>${quizScore + tapTotalScore}</span>`;

    // Difficulty dots
    const level = q.difficulty === 'easy' ? 1 : q.difficulty === 'medium' ? 2 : 3;
    els.diffDots.forEach((dot, i) => {
      dot.classList.toggle('filled', i < level);
    });

    // Answers
    els.answers.forEach((btn, i) => {
      btn.className = 'answer-btn';
      btn.querySelector('.answer-label').textContent = q.answers[i];
    });

    // Hide learning popup
    els.learningPopup.classList.remove('show');

    // Start timer
    startTimer();
  }

  // ===== TIMER =====
  function startTimer() {
    timeLeft = TIME_PER_QUESTION;
    updateTimerDisplay();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft -= 0.1;
      if (timeLeft <= 0) {
        timeLeft = 0;
        clearInterval(timerInterval);
        timeUp();
      }
      updateTimerDisplay();
      if (Math.ceil(timeLeft) !== Math.ceil(timeLeft + 0.1) && timeLeft > 0 && timeLeft <= 5) {
        SoundFX.countdown();
      }
    }, 100);
  }

  function updateTimerDisplay() {
    const secs = Math.ceil(timeLeft);
    els.timerText.textContent = secs;
    const pct = timeLeft / TIME_PER_QUESTION;
    const offset = 283 * (1 - pct);
    els.timerRing.style.strokeDashoffset = offset;

    // Color states
    els.timerRing.classList.remove('warning', 'danger');
    els.timerText.classList.remove('warning', 'danger');
    if (timeLeft <= 5) {
      els.timerRing.classList.add('danger');
      els.timerText.classList.add('danger');
    } else if (timeLeft <= 10) {
      els.timerRing.classList.add('warning');
      els.timerText.classList.add('warning');
    }
  }

  function timeUp() {
    wrongCount++;
    const q = roundQuestions[currentIndex];
    SoundFX.wrong();

    // Highlight correct answer
    els.answers[q.correct].classList.add('correct');
    els.answers.forEach(btn => btn.classList.add('disabled'));

    showLearning(q.learning_objective);
    setTimeout(advanceAfterQuestion, 1800);
  }

  // ===== SELECT ANSWER =====
  function selectAnswer(index) {
    if (state !== STATE.QUESTION) return;
    state = STATE.TRANSITION; // prevent double-clicks
    clearInterval(timerInterval);
    SoundFX.select();

    const q = roundQuestions[currentIndex];
    const btn = els.answers[index];

    // Disable all
    els.answers.forEach(b => b.classList.add('disabled'));
    btn.classList.add('selected');

    setTimeout(() => {
      if (index === q.correct) {
        btn.classList.add('correct');
        quizScore += POINTS[q.difficulty];
        correctCount++;
        SoundFX.correct();
        spawnParticles(btn);
      } else {
        btn.classList.add('wrong');
        els.answers[q.correct].classList.add('correct');
        wrongCount++;
        SoundFX.wrong();
      }
      els.scoreDisplay.innerHTML = `Score: <span>${quizScore + tapTotalScore}</span>`;
      showLearning(q.learning_objective);
      setTimeout(advanceAfterQuestion, 1600);
    }, 600);
  }

  // ===== ADVANCE =====
  function advanceAfterQuestion() {
    currentIndex++;
    if (currentIndex >= TOTAL_QUESTIONS) {
      endGame();
    } else {
      startTappingPhase();
    }
  }

  // ===== TAPPING PHASE =====
  function startTappingPhase() {
    state = STATE.TAPPING;
    showTransition('Tap Time!', () => {
      showScreen('tapping');
      TappingGame.start(TAPPING_DURATION, (score) => {
        tapTotalScore += score;
        showTransition(`+${score} Bonus!`, () => {
          showScreen('game');
          showQuestion();
        });
      });
    });
  }

  // ===== TRANSITION =====
  function showTransition(text, callback) {
    els.transitionText.textContent = text;
    els.transitionOverlay.classList.add('active');
    setTimeout(() => {
      els.transitionOverlay.classList.remove('active');
      setTimeout(callback, 300);
    }, 1000);
  }

  // ===== LEARNING POPUP =====
  function showLearning(text) {
    els.learningPopup.textContent = '📚 ' + text;
    els.learningPopup.classList.add('show');
  }

  // ===== END GAME =====
  function endGame() {
    state = STATE.GAME_OVER;
    clearInterval(timerInterval);

    const total = quizScore + tapTotalScore;
    const pct = Math.round((correctCount / TOTAL_QUESTIONS) * 100);

    // Title & subtitle
    if (pct >= 90) {
      els.gameoverTitle.textContent = 'Genius!';
      els.gameoverSubtitle.textContent = 'You are a Brain Millionaire!';
      SoundFX.victory();
      spawnConfetti();
    } else if (pct >= 70) {
      els.gameoverTitle.textContent = 'Great Job!';
      els.gameoverSubtitle.textContent = 'You really know your stuff!';
      SoundFX.victory();
      spawnConfetti();
    } else if (pct >= 50) {
      els.gameoverTitle.textContent = 'Good Try!';
      els.gameoverSubtitle.textContent = 'Keep learning and you\'ll be a millionaire!';
      SoundFX.correct();
    } else {
      els.gameoverTitle.textContent = 'Keep Practicing!';
      els.gameoverSubtitle.textContent = 'Every question is a chance to learn!';
      SoundFX.gameOver();
    }

    els.finalScore.textContent = total.toLocaleString();
    els.correctCountEl.textContent = correctCount;
    els.wrongCountEl.textContent = wrongCount;
    els.tapCountEl.textContent = tapTotalScore;
    els.quizPointsEl.textContent = quizScore.toLocaleString();
    els.tapPointsEl.textContent = tapTotalScore.toLocaleString();

    showScreen('gameover');
  }

  // ===== PARTICLES =====
  function spawnParticles(targetEl) {
    const rect = targetEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const container = document.createElement('div');
    container.className = 'particle-burst';
    container.style.left = cx + 'px';
    container.style.top = cy + 'px';
    const colors = ['#ffd700', '#00e676', '#6c63ff', '#ff6b6b', '#4ecdc4'];
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const angle = (Math.PI * 2 * i) / 12;
      const dist = 40 + Math.random() * 40;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      p.style.background = colors[i % colors.length];
      p.style.animation = `particle-fly 0.7s ease-out forwards`;
      p.style.transform = `translate(${dx}px, ${dy}px) scale(0)`;
      // Override animation with custom end state
      p.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 },
      ], { duration: 700, easing: 'ease-out', fill: 'forwards' });
      container.appendChild(p);
    }
    document.body.appendChild(container);
    setTimeout(() => container.remove(), 800);
  }

  // ===== CONFETTI =====
  function spawnConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#a29bfe', '#00e676', '#ff8b94', '#f7dc6f'];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = (6 + Math.random() * 8) + 'px';
      piece.style.height = (6 + Math.random() * 8) + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.animationDuration = (2 + Math.random() * 3) + 's';
      piece.style.animationDelay = (Math.random() * 2) + 's';
      container.appendChild(piece);
    }
    document.body.appendChild(container);
    setTimeout(() => container.remove(), 6000);
  }

  // ===== UTIL =====
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  return { init };
})();

// Boot
document.addEventListener('DOMContentLoaded', () => Game.init());
