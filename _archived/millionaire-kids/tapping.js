// tapping.js — Tapping mini-game between questions
const TappingGame = (() => {
  let area = null;
  let scoreDisplay = null;
  let timerBar = null;
  let tapScore = 0;
  let targets = [];
  let spawnInterval = null;
  let gameTimer = null;
  let timeLeft = 0;
  let totalTime = 0;
  let onComplete = null;
  let active = false;
  let targetId = 0;

  const SHAPES = ['circle', 'star', 'diamond', 'hexagon'];
  const COLORS = [
    '#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF',
    '#FF8B94', '#7EC8E3', '#F7DC6F', '#BB8FCE',
    '#F0B27A', '#82E0AA'
  ];

  function init(areaEl, scoreEl, timerEl) {
    area = areaEl;
    scoreDisplay = scoreEl;
    timerBar = timerEl;
  }

  function start(duration, callback) {
    tapScore = 0;
    targets = [];
    timeLeft = duration;
    totalTime = duration;
    onComplete = callback;
    active = true;
    targetId = 0;
    area.innerHTML = '';
    updateScore();
    SoundFX.tappingStart();

    // Spawn targets periodically
    spawnInterval = setInterval(spawnTarget, 700);
    spawnTarget(); // immediate first

    // Countdown
    gameTimer = setInterval(() => {
      timeLeft -= 50;
      const pct = Math.max(0, timeLeft / (totalTime));
      timerBar.style.width = (pct * 100) + '%';
      if (timeLeft <= 0) {
        stop();
      }
    }, 50);
  }

  function stop() {
    active = false;
    clearInterval(spawnInterval);
    clearInterval(gameTimer);
    // Fade out remaining targets
    targets.forEach(t => {
      if (t.el && t.el.parentNode) {
        t.el.classList.add('target-fade');
      }
    });
    targets = [];
    setTimeout(() => {
      if (onComplete) onComplete(tapScore);
    }, 400);
  }

  function spawnTarget() {
    if (!active) return;
    const id = ++targetId;
    const size = 44 + Math.random() * 30;
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const rect = area.getBoundingClientRect();
    const x = Math.random() * (rect.width - size - 20) + 10;
    const y = Math.random() * (rect.height - size - 20) + 10;
    const lifetime = 1200 + Math.random() * 800;

    const el = document.createElement('div');
    el.className = 'tap-target tap-shape-' + shape;
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.setProperty('--target-color', color);
    el.dataset.id = id;

    // Touch / click handler
    const handler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!active) return;
      hitTarget(id, el);
    };
    el.addEventListener('pointerdown', handler);

    area.appendChild(el);
    // Force reflow then add visible class
    el.offsetHeight;
    el.classList.add('target-visible');

    const entry = { id, el, timeout: null };
    targets.push(entry);

    // Auto-remove after lifetime
    entry.timeout = setTimeout(() => {
      if (!active) return;
      missTarget(id, el);
    }, lifetime);
  }

  function hitTarget(id, el) {
    const idx = targets.findIndex(t => t.id === id);
    if (idx === -1) return;
    clearTimeout(targets[idx].timeout);
    targets.splice(idx, 1);

    tapScore += 10;
    updateScore();
    SoundFX.tapHit();

    // Pop animation
    el.classList.remove('target-visible');
    el.classList.add('target-hit');
    showRipple(el);
    showFloatingPoints(el, '+10');
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 350);
  }

  function missTarget(id, el) {
    const idx = targets.findIndex(t => t.id === id);
    if (idx === -1) return;
    targets.splice(idx, 1);

    el.classList.remove('target-visible');
    el.classList.add('target-miss');
    SoundFX.tapMiss();
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 350);
  }

  function showRipple(el) {
    const ripple = document.createElement('div');
    ripple.className = 'tap-ripple';
    ripple.style.left = el.style.left;
    ripple.style.top = el.style.top;
    ripple.style.width = el.style.width;
    ripple.style.height = el.style.height;
    area.appendChild(ripple);
    setTimeout(() => { if (ripple.parentNode) ripple.parentNode.removeChild(ripple); }, 500);
  }

  function showFloatingPoints(el, text) {
    const fp = document.createElement('div');
    fp.className = 'floating-points';
    fp.textContent = text;
    fp.style.left = (parseFloat(el.style.left) + parseFloat(el.style.width) / 2) + 'px';
    fp.style.top = el.style.top;
    area.appendChild(fp);
    setTimeout(() => { if (fp.parentNode) fp.parentNode.removeChild(fp); }, 800);
  }

  function updateScore() {
    if (scoreDisplay) scoreDisplay.textContent = tapScore;
  }

  function getScore() {
    return tapScore;
  }

  return { init, start, stop, getScore };
})();
