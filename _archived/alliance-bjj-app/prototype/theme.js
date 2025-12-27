/**
 * Alliance BJJ Theme Management
 * Handles dark/light mode switching and persistence
 */

(() => {
    'use strict';

    const STORAGE_KEY = 'alliance-theme';
    const DEFAULT_THEME = 'dark';
    const THEMES = {
        DARK: 'dark',
        LIGHT: 'light'
    };

    // Initialize theme on page load
    const initializeTheme = () => {
        const savedTheme = localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;

        // Add loading class for smooth transition
        document.documentElement.classList.add('theme-loading');

        // Only add dark-mode class if theme is dark
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }

        // Remove loading class after theme is applied
        requestAnimationFrame(() => {
            document.documentElement.classList.remove('theme-loading');
        });
    };

    // Initialize immediately
    initializeTheme();
})();

/**
 * Theme Manager - Modern ES6 implementation
 */
class ThemeManager {
    static STORAGE_KEY = 'alliance-theme';
    static DEFAULT_THEME = 'dark';

    /**
     * Set the application theme
     * @param {string} theme - 'dark' or 'light'
     */
    static setTheme(theme) {
        // Validate theme
        if (!['dark', 'light'].includes(theme)) {
            console.warn(`Invalid theme: ${theme}. Using default.`);
            theme = this.DEFAULT_THEME;
        }

        // Update classes - only use dark-mode class for dark theme
        document.body.classList.remove('dark-mode', 'light-mode');

        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        }
        // For light mode, we don't add any class (default styles apply)

        // Persist to storage
        localStorage.setItem(this.STORAGE_KEY, theme);

        // Update UI elements
        this.updateThemeUI(theme);
    }

    /**
     * Get current active theme
     * @returns {string} 'dark' or 'light'
     */
    static getCurrentTheme() {
        const classList = document.body.classList;

        if (classList.contains('dark-mode')) return 'dark';

        // If no dark-mode class, it's light mode
        return 'light';
    }

    /**
     * Toggle between dark and light themes
     */
    static toggleTheme() {
        const currentTheme = this.getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    /**
     * Update theme toggle UI elements
     * @param {string} theme - Current theme
     */
    static updateThemeUI(theme) {
        // Update radio buttons if they exist
        const darkRadio = document.getElementById('theme-dark');
        const lightRadio = document.getElementById('theme-light');

        if (darkRadio && lightRadio) {
            darkRadio.checked = theme === 'dark';
            lightRadio.checked = theme === 'light';
        }

        // Update toggle button text if it exists
        const toggleBtn = document.getElementById('theme-toggle-btn');
        if (toggleBtn) {
            toggleBtn.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
        }
    }
}

// Export for global access (maintaining backward compatibility)
window.setTheme = ThemeManager.setTheme.bind(ThemeManager);
window.getCurrentTheme = ThemeManager.getCurrentTheme.bind(ThemeManager);
window.toggleTheme = ThemeManager.toggleTheme.bind(ThemeManager);

// Initialize UI when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.updateThemeUI(ThemeManager.getCurrentTheme());
});
