/**
 * Alliance BJJ - Bot Protection
 * Blocks automated crawlers, bots, and AI scrapers
 */

(function() {
    'use strict';

    // Check for bot indicators
    function detectBot() {
        const userAgent = navigator.userAgent.toLowerCase();

        // Common bot patterns
        const botPatterns = [
            'bot', 'crawler', 'spider', 'scraper', 'crawl',
            'slurp', 'mediapartners', 'adsbot', 'googlebot',
            'bingbot', 'yandexbot', 'baiduspider', 'facebookexternalhit',
            'twitterbot', 'linkedinbot', 'whatsapp', 'telegram',
            'applebot', 'pinterest', 'semrush', 'ahref', 'mj12bot',
            'gptbot', 'chatgpt', 'claude', 'anthropic', 'ccbot',
            'wget', 'curl', 'python', 'java', 'ruby', 'perl',
            'php', 'node-fetch', 'axios', 'got', 'request',
            'headless', 'phantom', 'nightmare', 'puppeteer', 'playwright'
        ];

        // Check user agent against bot patterns
        for (const pattern of botPatterns) {
            if (userAgent.includes(pattern)) {
                return true;
            }
        }

        // Check for headless browser indicators
        if (navigator.webdriver ||
            window.navigator.webdriver ||
            window.Cypress ||
            window.__nightmare ||
            window._phantom ||
            window._selenium ||
            window.callPhantom ||
            window.phantom) {
            return true;
        }

        // Check for missing browser features that bots often lack
        if (!window.chrome && !window.safari && userAgent.includes('chrome')) {
            return true; // Fake Chrome
        }

        // Check for zero dimensions (headless browsers)
        if (window.outerWidth === 0 || window.outerHeight === 0) {
            return true;
        }

        // Check for automation tools
        if (document.documentElement.getAttribute('webdriver') ||
            navigator.permissions?.query?.toString().includes('native code') === false) {
            return true;
        }

        return false;
    }

    // Block detected bots
    function blockBot() {
        document.body.innerHTML = '<h1>403 Forbidden</h1><p>Access denied.</p>';
        document.head.innerHTML = '<title>403 Forbidden</title><meta name="robots" content="noindex, nofollow">';

        // Stop all JavaScript execution
        window.stop && window.stop();

        // Prevent further navigation
        window.location.href = 'about:blank';
    }

    // Run detection
    if (detectBot()) {
        blockBot();
        return;
    }

    // Additional protection: disable right-click and text selection
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable text selection
    document.addEventListener('selectstart', function(e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            return false;
        }
    });

    // Log legitimate access (remove in production)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.info('Alliance BJJ - Development Mode');
    }
})();