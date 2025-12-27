/**
 * Alliance BJJ - Interactive Elements & Micro-interactions
 * Smooth, responsive interactions for enhanced user experience
 */

class InteractionEngine {
    constructor() {
        this.ripples = [];
        this.tooltips = [];
        this.init();
    }

    init() {
        // Initialize different interaction types
        this.initButtonInteractions();
        this.initCardInteractions();
        this.initFormInteractions();
        this.initScrollAnimations();
        this.initNumberCounters();
        this.initTooltips();
        this.initMobileGestures();
    }

    // ============================================
    // BUTTON INTERACTIONS
    // ============================================

    initButtonInteractions() {
        // Add ripple effect to buttons
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.btn, .btn-interactive, [data-ripple]');
            if (button) {
                this.createRipple(e, button);
            }
        });

        // Enhanced hover states
        document.querySelectorAll('.btn, button').forEach(btn => {
            if (!btn.classList.contains('interaction-ready')) {
                btn.classList.add('btn-interactive', 'interaction-ready');

                // Add haptic feedback on mobile (if supported)
                btn.addEventListener('touchstart', () => {
                    if ('vibrate' in navigator) {
                        navigator.vibrate(10);
                    }
                });
            }
        });
    }

    createRipple(event, element) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => ripple.remove(), 600);
    }

    // ============================================
    // CARD INTERACTIONS
    // ============================================

    initCardInteractions() {
        // Add hover effects to all cards
        document.querySelectorAll('.card, .member-card, .info-card').forEach(card => {
            if (!card.classList.contains('card-interactive')) {
                card.classList.add('card-hover', 'card-interactive');
            }
        });

        // Add click feedback
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.card, .member-card');
            if (card) {
                card.classList.add('card-clicked');
                setTimeout(() => card.classList.remove('card-clicked'), 200);
            }
        });
    }

    // ============================================
    // FORM INTERACTIONS
    // ============================================

    initFormInteractions() {
        // Floating labels
        document.querySelectorAll('input, textarea, select').forEach(input => {
            if (!input.classList.contains('input-enhanced')) {
                input.classList.add('input-modern', 'input-enhanced');

                // Add focus animations
                input.addEventListener('focus', () => {
                    input.parentElement?.classList.add('input-focused');
                    this.animateLabel(input);
                });

                input.addEventListener('blur', () => {
                    input.parentElement?.classList.remove('input-focused');
                    if (!input.value) {
                        this.resetLabel(input);
                    }
                });

                // Real-time validation feedback
                if (input.type === 'email') {
                    input.addEventListener('input', () => this.validateEmail(input));
                }

                if (input.type === 'tel') {
                    input.addEventListener('input', () => this.validatePhone(input));
                }
            }
        });

        // Form submission effects
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        });
    }

    animateLabel(input) {
        const label = input.parentElement?.querySelector('label');
        if (label) {
            label.style.transform = 'translateY(-25px) scale(0.8)';
            label.style.color = 'var(--accent-yellow)';
        }
    }

    resetLabel(input) {
        const label = input.parentElement?.querySelector('label');
        if (label && !input.value) {
            label.style.transform = '';
            label.style.color = '';
        }
    }

    validateEmail(input) {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
        this.showValidationFeedback(input, isValid);
    }

    validatePhone(input) {
        const cleaned = input.value.replace(/\D/g, '');
        const isValid = cleaned.length >= 10;
        this.showValidationFeedback(input, isValid);
    }

    showValidationFeedback(input, isValid) {
        if (input.value.length > 3) {
            if (isValid) {
                input.classList.remove('invalid');
                input.classList.add('valid');
                this.showCheckmark(input);
            } else {
                input.classList.remove('valid');
                input.classList.add('invalid');
            }
        } else {
            input.classList.remove('valid', 'invalid');
        }
    }

    showCheckmark(input) {
        const existingCheck = input.parentElement?.querySelector('.validation-check');
        if (existingCheck) return;

        const checkmark = document.createElement('span');
        checkmark.className = 'validation-check';
        checkmark.innerHTML = '✓';
        checkmark.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--success);
            animation: fadeInScale 0.3s ease;
        `;

        if (input.parentElement) {
            input.parentElement.style.position = 'relative';
            input.parentElement.appendChild(checkmark);

            setTimeout(() => checkmark.remove(), 3000);
        }
    }

    handleFormSubmit(form) {
        // Add loading state to submit button
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
            submitBtn.disabled = true;

            // Simulate processing
            setTimeout(() => {
                submitBtn.innerHTML = '✓ Success!';
                submitBtn.classList.add('success-flash');

                // Reset after delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('success-flash');
                }, 2000);
            }, 1500);
        }
    }

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================

    initScrollAnimations() {
        // Intersection Observer for scroll reveal
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('revealed');
                        }, index * 100);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        // Observe elements
        document.querySelectorAll('.card, .member-card, h1, h2, .info-card').forEach(el => {
            if (!el.classList.contains('scroll-observed')) {
                el.classList.add('scroll-reveal', 'scroll-observed');
                observer.observe(el);
            }
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ============================================
    // NUMBER COUNTERS
    // ============================================

    initNumberCounters() {
        const counters = document.querySelectorAll('[data-counter], .stat-number');

        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                        this.animateNumber(entry.target);
                        entry.target.classList.add('counted');
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach(counter => {
            counterObserver.observe(counter);

            // Store original value
            const value = counter.textContent.replace(/[^0-9.-]/g, '');
            counter.dataset.targetValue = value;
        });
    }

    animateNumber(element) {
        const target = parseFloat(element.dataset.targetValue || element.textContent);
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        const isCurrency = element.textContent.includes('$');
        const hasComma = element.textContent.includes(',');

        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (target - start) * easeOutQuart;

            let displayValue = Math.round(current);

            if (hasComma) {
                displayValue = displayValue.toLocaleString();
            }

            if (isCurrency) {
                element.textContent = '$' + displayValue;
            } else {
                element.textContent = displayValue;
            }

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.classList.add('number-animate');
            }
        };

        requestAnimationFrame(updateNumber);
    }

    // ============================================
    // TOOLTIPS
    // ============================================

    initTooltips() {
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target);
            });

            element.addEventListener('mouseleave', (e) => {
                this.hideTooltip(e.target);
            });
        });
    }

    showTooltip(element) {
        const text = element.dataset.tooltip;
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip-popup';
        tooltip.textContent = text;

        // Style the tooltip
        tooltip.style.cssText = `
            position: absolute;
            background: var(--gray-900);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
        `;

        document.body.appendChild(tooltip);

        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';

        // Fade in
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
        });

        element.currentTooltip = tooltip;
    }

    hideTooltip(element) {
        const tooltip = element.currentTooltip;
        if (tooltip) {
            tooltip.style.opacity = '0';
            setTimeout(() => tooltip.remove(), 300);
            element.currentTooltip = null;
        }
    }

    // ============================================
    // MOBILE GESTURES
    // ============================================

    initMobileGestures() {
        let touchStartX = 0;
        let touchStartY = 0;

        // Swipe detection for cards
        document.addEventListener('touchstart', (e) => {
            const card = e.target.closest('.member-card, .swipeable');
            if (card) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                card.dataset.touching = 'true';
            }
        });

        document.addEventListener('touchmove', (e) => {
            const card = e.target.closest('.member-card, .swipeable');
            if (card && card.dataset.touching === 'true') {
                const touchX = e.touches[0].clientX;
                const diffX = touchX - touchStartX;

                // Add visual feedback for swipe
                if (Math.abs(diffX) > 50) {
                    card.style.transform = `translateX(${diffX * 0.3}px)`;
                    card.style.opacity = 1 - Math.abs(diffX) / 300;
                }
            }
        });

        document.addEventListener('touchend', (e) => {
            const card = e.target.closest('.member-card, .swipeable');
            if (card && card.dataset.touching === 'true') {
                const touchEndX = e.changedTouches[0].clientX;
                const diffX = touchEndX - touchStartX;

                // Reset card position
                card.style.transform = '';
                card.style.opacity = '';
                card.dataset.touching = 'false';

                // Handle swipe actions
                if (Math.abs(diffX) > 100) {
                    if (diffX > 0) {
                        this.handleSwipeRight(card);
                    } else {
                        this.handleSwipeLeft(card);
                    }
                }
            }
        });
    }

    handleSwipeRight(element) {
        // Add success animation
        element.classList.add('swipe-success');
        setTimeout(() => element.classList.remove('swipe-success'), 500);
    }

    handleSwipeLeft(element) {
        // Add delete animation
        element.classList.add('swipe-delete');
        setTimeout(() => element.classList.remove('swipe-delete'), 500);
    }

    // ============================================
    // PUBLIC API
    // ============================================

    refresh() {
        this.initCardInteractions();
        this.initScrollAnimations();
        this.initNumberCounters();
    }

    addNotification(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${this.getToastIcon(type)}</span>
                <span class="toast-message">${message}</span>
            </div>
        `;

        // Add styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            min-width: 250px;
        `;

        document.body.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    getToastIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }
}

// Initialize and expose globally
window.InteractionEngine = new InteractionEngine();

// Quick access functions
window.showNotification = (message, type) => {
    window.InteractionEngine.addNotification(message, type);
};

window.refreshInteractions = () => {
    window.InteractionEngine.refresh();
};