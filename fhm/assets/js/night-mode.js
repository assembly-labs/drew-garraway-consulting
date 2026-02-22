/**
 * Night Mode - Automatic Time-Based Dark Theme
 * Activates between 5pm (17:00) and 9am (09:00)
 */

(function () {
    'use strict';

    function isNightTime() {
        var hour = new Date().getHours();
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

    // Check every minute for time changes
    setInterval(function () {
        if (document.body) {
            applyNightMode();
        }
    }, 60000);
})();
