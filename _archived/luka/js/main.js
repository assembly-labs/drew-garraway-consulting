(function () {
    'use strict';

    // ============================================
    // HEADER SCROLL BEHAVIOR
    // ============================================

    const header = document.getElementById('header');

    function handleHeaderScroll() {
        if (!header) return;
        if (window.scrollY > 40) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    }

    // Throttle scroll events
    let scrollTicking = false;
    window.addEventListener('scroll', function () {
        if (!scrollTicking) {
            window.requestAnimationFrame(function () {
                handleHeaderScroll();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    // Set initial state
    handleHeaderScroll();

    // ============================================
    // SCROLL REVEAL (Intersection Observer)
    // ============================================

    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px',
            }
        );

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // Fallback: show all elements immediately
        revealElements.forEach(function (el) {
            el.classList.add('is-visible');
        });
    }

    // ============================================
    // GSAP ANIMATIONS (Progressive Enhancement)
    // ============================================

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Respect reduced motion preference
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (!prefersReducedMotion) {
            // Hero section entrance
            gsap.fromTo(
                '#main > section:first-child .eyebrow',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' }
            );

            gsap.fromTo(
                '#main > section:first-child h1',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, delay: 0.35, ease: 'power3.out' }
            );

            gsap.fromTo(
                '#main > section:first-child h1 + p',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, delay: 0.55, ease: 'power3.out' }
            );

            gsap.fromTo(
                '#main > section:first-child .flex.flex-col',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, delay: 0.7, ease: 'power3.out' }
            );

            // Stats counter animation
            const statElements = document.querySelectorAll('.stat-value');
            statElements.forEach(function (el) {
                const countTo = el.getAttribute('data-count');
                if (!countTo) return;

                ScrollTrigger.create({
                    trigger: el,
                    start: 'top 80%',
                    once: true,
                    onEnter: function () {
                        gsap.fromTo(
                            el,
                            { innerText: 0 },
                            {
                                innerText: parseInt(countTo, 10),
                                duration: 2,
                                ease: 'power2.out',
                                snap: { innerText: 1 },
                                onUpdate: function () {
                                    el.textContent =
                                        Math.round(
                                            parseFloat(el.textContent)
                                        ) + '+';
                                },
                            }
                        );
                    },
                });
            });

            // Service cards subtle entrance
            gsap.utils.toArray('.card-hover').forEach(function (card, i) {
                gsap.fromTo(
                    card,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        delay: i * 0.08,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            once: true,
                        },
                    }
                );
            });

            // How It Works steps
            gsap.utils.toArray('#how-it-works .text-center').forEach(function (step, i) {
                gsap.fromTo(
                    step,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        delay: i * 0.15,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: '#how-it-works',
                            start: 'top 60%',
                            once: true,
                        },
                    }
                );
            });

            // Divider line animation
            gsap.utils.toArray('.divider').forEach(function (el) {
                gsap.fromTo(
                    el,
                    { width: 0 },
                    {
                        width: '3rem',
                        duration: 0.8,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 85%',
                            once: true,
                        },
                    }
                );
            });
        }
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;

            e.preventDefault();

            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition =
                targetEl.getBoundingClientRect().top +
                window.pageYOffset -
                headerHeight -
                16;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth',
            });

            // Update URL without triggering scroll
            history.pushState(null, null, targetId);
        });
    });

    // ============================================
    // ALPINE.JS COMPONENTS
    // ============================================

    // Contact form component (available globally for Alpine)
    window.contactForm = function () {
        return {
            form: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                interest: '',
                message: '',
            },
            submitting: false,
            submitted: false,
            errors: {},

            validateForm: function () {
                this.errors = {};

                if (!this.form.firstName.trim()) {
                    this.errors.firstName = 'First name is required';
                }
                if (!this.form.lastName.trim()) {
                    this.errors.lastName = 'Last name is required';
                }
                if (!this.form.email.trim()) {
                    this.errors.email = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
                    this.errors.email = 'Please enter a valid email';
                }

                return Object.keys(this.errors).length === 0;
            },

            submitForm: async function () {
                if (!this.validateForm()) return;

                this.submitting = true;

                try {
                    // Simulate form submission
                    // Replace with actual endpoint (e.g., Formspree, Cloudflare Worker, etc.)
                    await new Promise(function (resolve) {
                        setTimeout(resolve, 1500);
                    });

                    this.submitted = true;
                    this.form = {
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
                        interest: '',
                        message: '',
                    };
                } catch (error) {
                    // Handle error gracefully
                    this.errors.submit =
                        'Something went wrong. Please try again or call us directly.';
                } finally {
                    this.submitting = false;
                }
            },
        };
    };
})();
