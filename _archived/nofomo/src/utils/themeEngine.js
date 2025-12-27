// Theme engine for dynamic mode switching
export class ThemeEngine {
  constructor(root = document.documentElement) {
    this.root = root;
    this.mode = 'base';
  }

  setMode(mode) {
    const next = ['base', 'profit', 'loss'].includes(mode) ? mode : 'base';
    this.root.setAttribute('data-mode', next);
    this.mode = next;
    window.dispatchEvent(new CustomEvent('theme:change', { detail: { mode: next } }));
  }

  getMode() {
    return this.mode;
  }
}