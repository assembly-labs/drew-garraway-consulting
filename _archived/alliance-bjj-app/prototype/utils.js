/**
 * Alliance BJJ Prototype - Utility Functions
 * Common reusable functions for the prototype application
 */

/**
 * DOM Utility Functions
 */
const DOMUtils = {
    /**
     * Safely query selector with null check
     * @param {string} selector - CSS selector
     * @param {Element} parent - Parent element (defaults to document)
     * @returns {Element|null}
     */
    $(selector, parent = document) {
        return parent.querySelector(selector);
    },

    /**
     * Safely query selector all
     * @param {string} selector - CSS selector
     * @param {Element} parent - Parent element (defaults to document)
     * @returns {NodeList}
     */
    $$(selector, parent = document) {
        return parent.querySelectorAll(selector);
    },

    /**
     * Add event listener with delegation support
     * @param {Element} element - Target element
     * @param {string} event - Event type
     * @param {string|Function} selectorOrHandler - Selector for delegation or handler
     * @param {Function} handler - Handler function (optional)
     */
    on(element, event, selectorOrHandler, handler) {
        if (typeof selectorOrHandler === 'function') {
            element.addEventListener(event, selectorOrHandler);
        } else {
            element.addEventListener(event, (e) => {
                const target = e.target.closest(selectorOrHandler);
                if (target) {
                    handler.call(target, e);
                }
            });
        }
    }
};

/**
 * Format utilities
 */
const FormatUtils = {
    /**
     * Format currency values
     * @param {number} amount - Amount to format
     * @returns {string} Formatted currency string
     */
    currency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    /**
     * Format date to readable string
     * @param {Date|string} date - Date to format
     * @returns {string} Formatted date string
     */
    date(date) {
        const d = new Date(date);
        return new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }).format(d);
    },

    /**
     * Format time to readable string
     * @param {string} time - Time string (e.g., "18:30")
     * @returns {string} Formatted time (e.g., "6:30 PM")
     */
    time(time) {
        const [hours, minutes] = time.split(':');
        const h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHours = h > 12 ? h - 12 : (h === 0 ? 12 : h);
        return `${displayHours}:${minutes} ${ampm}`;
    }
};

/**
 * Animation utilities
 */
const AnimationUtils = {
    /**
     * Smooth scroll to element
     * @param {string|Element} target - Target element or selector
     * @param {number} offset - Offset from top (default 0)
     */
    scrollTo(target, offset = 0) {
        const element = typeof target === 'string'
            ? document.querySelector(target)
            : target;

        if (element) {
            const top = element.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({
                top,
                behavior: 'smooth'
            });
        }
    },

    /**
     * Fade in element
     * @param {Element} element - Element to fade in
     * @param {number} duration - Duration in ms
     */
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        element.style.transition = `opacity ${duration}ms`;

        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    },

    /**
     * Fade out element
     * @param {Element} element - Element to fade out
     * @param {number} duration - Duration in ms
     */
    fadeOut(element, duration = 300) {
        element.style.transition = `opacity ${duration}ms`;
        element.style.opacity = '0';

        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }
};

/**
 * Validation utilities
 */
const ValidationUtils = {
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean}
     */
    isEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate phone number
     * @param {string} phone - Phone number to validate
     * @returns {boolean}
     */
    isPhone(phone) {
        const phoneRegex = /^[\d\s\-\(\)\+]+$/;
        const cleaned = phone.replace(/\D/g, '');
        return phoneRegex.test(phone) && cleaned.length >= 10;
    },

    /**
     * Check if value is empty
     * @param {*} value - Value to check
     * @returns {boolean}
     */
    isEmpty(value) {
        return value === null ||
               value === undefined ||
               value === '' ||
               (Array.isArray(value) && value.length === 0);
    }
};

/**
 * Storage utilities
 */
const StorageUtils = {
    /**
     * Get item from localStorage with JSON parsing
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*}
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },

    /**
     * Set item in localStorage with JSON stringification
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('Failed to save to localStorage:', e);
        }
    },

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     */
    remove(key) {
        localStorage.removeItem(key);
    }
};

// Export utilities for global use
window.DOMUtils = DOMUtils;
window.FormatUtils = FormatUtils;
window.AnimationUtils = AnimationUtils;
window.ValidationUtils = ValidationUtils;
window.StorageUtils = StorageUtils;