/**
 * FHM Custom Audio Player
 * Replaces native <audio controls> with a branded, accessible player.
 *
 * Features:
 *  - Custom play/pause, skip +-15s, playback speed (1x/1.25x/1.5x/2x)
 *  - Clickable/draggable progress bar with buffered indicator
 *  - Persists playback position in localStorage per audio source
 *  - Single-player management: pauses others when one starts
 *  - Keyboard accessible (Space, Arrow keys)
 *  - Night-mode compatible via CSS custom properties
 *
 * Usage: include this script on any page with <audio controls> elements.
 * The script auto-initializes on DOMContentLoaded.
 */

(function () {
  'use strict';

  var SPEEDS = [1, 1.25, 1.5, 2];
  var SKIP_SECONDS = 15;
  var STORAGE_PREFIX = 'fhm_audio_';
  var activePlayers = [];

  // --- Helpers ---

  function formatTime(seconds) {
    if (!seconds || !isFinite(seconds)) return '0:00';
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function storageKey(src) {
    // Use the filename as key to keep it short
    var parts = src.split('/');
    return STORAGE_PREFIX + parts[parts.length - 1];
  }

  function savePosition(audio) {
    try {
      var key = storageKey(audio.currentSrc || audio.querySelector('source').src);
      localStorage.setItem(key, JSON.stringify({
        time: audio.currentTime,
        speed: audio.playbackRate
      }));
    } catch (e) { /* localStorage full or unavailable */ }
  }

  function loadPosition(audio) {
    try {
      var key = storageKey(audio.currentSrc || audio.querySelector('source').src);
      var data = localStorage.getItem(key);
      if (data) return JSON.parse(data);
    } catch (e) { /* ignore */ }
    return null;
  }

  function pauseAllExcept(currentAudio) {
    activePlayers.forEach(function (p) {
      if (p.audio !== currentAudio && !p.audio.paused) {
        p.audio.pause();
      }
    });
  }

  // --- SVG Icons ---

  var icons = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
    skipBack: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/><text x="12" y="15.5" text-anchor="middle" font-size="7" font-weight="700" font-family="Inter,sans-serif">15</text></svg>',
    skipForward: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.01 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/><text x="12" y="15.5" text-anchor="middle" font-size="7" font-weight="700" font-family="Inter,sans-serif">15</text></svg>'
  };

  // --- Build Custom Player ---

  function createPlayer(audio) {
    // Remove native controls
    audio.removeAttribute('controls');

    var wrapper = document.createElement('div');
    wrapper.className = 'cp';
    wrapper.setAttribute('role', 'group');
    wrapper.setAttribute('aria-label', 'Audio player');

    // Row: controls
    var row = document.createElement('div');
    row.className = 'cp__row';

    // Play/Pause
    var playBtn = document.createElement('button');
    playBtn.className = 'cp__btn cp__play';
    playBtn.setAttribute('aria-label', 'Play');
    playBtn.innerHTML = icons.play;

    // Skip back
    var skipBackBtn = document.createElement('button');
    skipBackBtn.className = 'cp__btn cp__skip';
    skipBackBtn.setAttribute('aria-label', 'Skip back 15 seconds');
    skipBackBtn.innerHTML = icons.skipBack;

    // Skip forward
    var skipFwdBtn = document.createElement('button');
    skipFwdBtn.className = 'cp__btn cp__skip';
    skipFwdBtn.setAttribute('aria-label', 'Skip forward 15 seconds');
    skipFwdBtn.innerHTML = icons.skipForward;

    // Progress wrapper
    var progressWrap = document.createElement('div');
    progressWrap.className = 'cp__progress-wrap';

    var progressBar = document.createElement('div');
    progressBar.className = 'cp__progress-bar';
    progressBar.setAttribute('role', 'slider');
    progressBar.setAttribute('aria-label', 'Seek');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
    progressBar.setAttribute('aria-valuenow', '0');
    progressBar.setAttribute('tabindex', '0');

    var buffered = document.createElement('div');
    buffered.className = 'cp__buffered';

    var fill = document.createElement('div');
    fill.className = 'cp__fill';

    var handle = document.createElement('div');
    handle.className = 'cp__handle';

    progressBar.appendChild(buffered);
    progressBar.appendChild(fill);
    progressBar.appendChild(handle);
    progressWrap.appendChild(progressBar);

    // Time display
    var timeDisplay = document.createElement('div');
    timeDisplay.className = 'cp__time';

    var currentTime = document.createElement('span');
    currentTime.className = 'cp__current';
    currentTime.textContent = '0:00';

    var separator = document.createElement('span');
    separator.className = 'cp__sep';
    separator.textContent = '/';

    var totalTime = document.createElement('span');
    totalTime.className = 'cp__total';
    totalTime.textContent = '0:00';

    timeDisplay.appendChild(currentTime);
    timeDisplay.appendChild(separator);
    timeDisplay.appendChild(totalTime);

    // Speed button
    var speedBtn = document.createElement('button');
    speedBtn.className = 'cp__btn cp__speed';
    speedBtn.setAttribute('aria-label', 'Playback speed');
    speedBtn.textContent = '1x';

    // Assemble row
    row.appendChild(skipBackBtn);
    row.appendChild(playBtn);
    row.appendChild(skipFwdBtn);
    row.appendChild(progressWrap);
    row.appendChild(timeDisplay);
    row.appendChild(speedBtn);

    wrapper.appendChild(row);

    // Insert custom player after the audio element
    audio.parentNode.insertBefore(wrapper, audio.nextSibling);

    // --- State ---
    var player = {
      audio: audio,
      wrapper: wrapper,
      playBtn: playBtn,
      fill: fill,
      buffered: buffered,
      handle: handle,
      progressBar: progressBar,
      currentTime: currentTime,
      totalTime: totalTime,
      speedBtn: speedBtn,
      speedIndex: 0,
      seeking: false
    };
    activePlayers.push(player);

    // --- Restore saved position ---
    var saved = loadPosition(audio);
    if (saved) {
      player.speedIndex = SPEEDS.indexOf(saved.speed);
      if (player.speedIndex < 0) player.speedIndex = 0;
      audio.playbackRate = SPEEDS[player.speedIndex];
      speedBtn.textContent = SPEEDS[player.speedIndex] + 'x';

      // Restore time once metadata loads
      var restoreTime = function () {
        if (saved.time > 0 && saved.time < audio.duration - 1) {
          audio.currentTime = saved.time;
        }
        audio.removeEventListener('loadedmetadata', restoreTime);
      };
      if (audio.readyState >= 1) {
        restoreTime();
      } else {
        audio.addEventListener('loadedmetadata', restoreTime);
      }
    }

    // --- Event Handlers ---

    playBtn.addEventListener('click', function () {
      if (audio.paused) {
        pauseAllExcept(audio);
        audio.play();
      } else {
        audio.pause();
      }
    });

    skipBackBtn.addEventListener('click', function () {
      audio.currentTime = Math.max(0, audio.currentTime - SKIP_SECONDS);
    });

    skipFwdBtn.addEventListener('click', function () {
      audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + SKIP_SECONDS);
    });

    speedBtn.addEventListener('click', function () {
      player.speedIndex = (player.speedIndex + 1) % SPEEDS.length;
      audio.playbackRate = SPEEDS[player.speedIndex];
      speedBtn.textContent = SPEEDS[player.speedIndex] + 'x';
      savePosition(audio);
    });

    audio.addEventListener('play', function () {
      playBtn.innerHTML = icons.pause;
      playBtn.setAttribute('aria-label', 'Pause');
      wrapper.classList.add('cp--playing');
    });

    audio.addEventListener('pause', function () {
      playBtn.innerHTML = icons.play;
      playBtn.setAttribute('aria-label', 'Play');
      wrapper.classList.remove('cp--playing');
      savePosition(audio);
    });

    audio.addEventListener('ended', function () {
      playBtn.innerHTML = icons.play;
      playBtn.setAttribute('aria-label', 'Play');
      wrapper.classList.remove('cp--playing');
      fill.style.width = '100%';
      // Clear saved position on completion
      try {
        var key = storageKey(audio.currentSrc || audio.querySelector('source').src);
        localStorage.removeItem(key);
      } catch (e) { /* ignore */ }
    });

    audio.addEventListener('loadedmetadata', function () {
      totalTime.textContent = formatTime(audio.duration);
      progressBar.setAttribute('aria-valuemax', Math.floor(audio.duration));
    });

    audio.addEventListener('timeupdate', function () {
      if (player.seeking) return;
      var pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      fill.style.width = pct + '%';
      handle.style.left = pct + '%';
      currentTime.textContent = formatTime(audio.currentTime);
      progressBar.setAttribute('aria-valuenow', Math.floor(audio.currentTime));
    });

    audio.addEventListener('progress', function () {
      if (audio.buffered.length > 0) {
        var end = audio.buffered.end(audio.buffered.length - 1);
        var pct = audio.duration ? (end / audio.duration) * 100 : 0;
        buffered.style.width = pct + '%';
      }
    });

    // Save position periodically
    var saveInterval = setInterval(function () {
      if (!audio.paused) savePosition(audio);
    }, 5000);

    // --- Progress bar seek (click + drag) ---

    function seekFromEvent(e) {
      var rect = progressBar.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      var pct = Math.max(0, Math.min(1, x / rect.width));
      if (audio.duration) {
        audio.currentTime = pct * audio.duration;
        fill.style.width = (pct * 100) + '%';
        handle.style.left = (pct * 100) + '%';
        currentTime.textContent = formatTime(audio.currentTime);
      }
    }

    function onDragStart(e) {
      player.seeking = true;
      seekFromEvent(e);
      document.addEventListener('mousemove', onDragMove);
      document.addEventListener('mouseup', onDragEnd);
      document.addEventListener('touchmove', onDragMove, { passive: false });
      document.addEventListener('touchend', onDragEnd);
    }

    function onDragMove(e) {
      if (!player.seeking) return;
      e.preventDefault();
      seekFromEvent(e);
    }

    function onDragEnd() {
      player.seeking = false;
      document.removeEventListener('mousemove', onDragMove);
      document.removeEventListener('mouseup', onDragEnd);
      document.removeEventListener('touchmove', onDragMove);
      document.removeEventListener('touchend', onDragEnd);
      savePosition(audio);
    }

    progressBar.addEventListener('mousedown', onDragStart);
    progressBar.addEventListener('touchstart', onDragStart, { passive: false });

    // Keyboard on progress bar
    progressBar.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') {
        audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        audio.currentTime = Math.max(0, audio.currentTime - 5);
        e.preventDefault();
      }
    });

    // Keyboard on wrapper (space to play/pause)
    wrapper.addEventListener('keydown', function (e) {
      if (e.key === ' ' && e.target === wrapper) {
        e.preventDefault();
        playBtn.click();
      }
    });

    return player;
  }

  // --- Init ---

  function init() {
    var audios = document.querySelectorAll('audio[controls]');
    for (var i = 0; i < audios.length; i++) {
      createPlayer(audios[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
