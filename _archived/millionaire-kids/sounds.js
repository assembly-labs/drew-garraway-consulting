// sounds.js — Programmatic sound effects via Web Audio API
const SoundFX = (() => {
  let ctx = null;

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function playTone(freq, duration, type = 'sine', gainVal = 0.3) {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime);
    gain.gain.setValueAtTime(gainVal, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + duration);
  }

  function playNotes(notes) {
    const c = getCtx();
    let t = c.currentTime;
    notes.forEach(([freq, dur, type, vol]) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(vol || 0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(t);
      osc.stop(t + dur);
      t += dur * 0.7;
    });
  }

  return {
    tick() {
      playTone(880, 0.06, 'square', 0.08);
    },
    correct() {
      playNotes([
        [523, 0.12, 'sine', 0.3],
        [659, 0.12, 'sine', 0.3],
        [784, 0.2, 'sine', 0.35],
      ]);
    },
    wrong() {
      playNotes([
        [300, 0.2, 'sawtooth', 0.2],
        [200, 0.4, 'sawtooth', 0.25],
      ]);
    },
    tapHit() {
      playTone(1200, 0.08, 'sine', 0.2);
    },
    tapMiss() {
      playTone(200, 0.15, 'triangle', 0.1);
    },
    victory() {
      playNotes([
        [523, 0.15, 'sine', 0.3],
        [659, 0.15, 'sine', 0.3],
        [784, 0.15, 'sine', 0.3],
        [1047, 0.3, 'sine', 0.35],
        [784, 0.1, 'sine', 0.2],
        [1047, 0.4, 'sine', 0.35],
      ]);
    },
    countdown() {
      playTone(600, 0.1, 'square', 0.1);
    },
    select() {
      playTone(700, 0.08, 'sine', 0.15);
    },
    gameOver() {
      playNotes([
        [400, 0.25, 'sawtooth', 0.2],
        [350, 0.25, 'sawtooth', 0.2],
        [300, 0.25, 'sawtooth', 0.2],
        [250, 0.5, 'sawtooth', 0.25],
      ]);
    },
    tappingStart() {
      playNotes([
        [400, 0.1, 'sine', 0.2],
        [600, 0.1, 'sine', 0.2],
        [800, 0.15, 'sine', 0.25],
      ]);
    },
    init() {
      getCtx();
    }
  };
})();
