/**
 * Night Mode - Automatic Time-Based Dark Theme
 * Activates between 5pm (17:00) and 9am (09:00)
 */

(function() {
    'use strict';

    function isNightTime() {
        const hour = new Date().getHours();
        // Night mode: 5pm (17) to 9am (9)
        // This means: hour >= 17 OR hour < 9
        return hour >= 17 || hour < 9;
    }

    function applyNightMode() {
        if (isNightTime()) {
            document.body.classList.add('night-mode');
        } else {
            document.body.classList.remove('night-mode');
        }
    }

    // Apply immediately when script loads
    if (document.body) {
        applyNightMode();
    } else {
        // If body isn't ready yet, wait for DOMContentLoaded
        document.addEventListener('DOMContentLoaded', applyNightMode);
    }

    // Check every minute for time changes (in case user leaves page open)
    setInterval(applyNightMode, 60000);
})();
