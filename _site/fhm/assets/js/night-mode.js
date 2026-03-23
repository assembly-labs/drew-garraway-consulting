/**
 * Night Mode - Automatic Time-Based Dark Theme
 * Activates between 5pm (17:00) and 9am (09:00)
 */

(function () {
    'use strict';

    function isNightTime() {
        const hour = new Date().getHours();
        // Night mode: 5pm (17) to 9am (9)
        return hour >= 17 || hour < 9;
    }

    function applyNightMode() {
        if (isNightTime()) {
            document.body.classList.add('night-mode');
        } else {
            document.body.classList.remove('night-mode');
        }
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyNightMode);
    } else {
        // DOM already loaded
        applyNightMode();
    }

    // Re-check at the next hour boundary (9am or 5pm)
    function scheduleNextCheck() {
        const now = new Date();
        const hour = now.getHours();
        const nextHour = hour < 9 ? 9 : hour < 17 ? 17 : 33; // 33 = 9am next day
        const msUntilNext = new Date(now.getFullYear(), now.getMonth(), now.getDate(), nextHour, 0, 1) - now;
        setTimeout(function () {
            if (document.body) applyNightMode();
            scheduleNextCheck();
        }, msUntilNext);
    }
    scheduleNextCheck();
})();
