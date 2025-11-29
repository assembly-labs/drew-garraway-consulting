/**
 * Alliance BJJ Platform - Main Application
 * Coordinates all modules and initializes the enhanced prototype
 */

class AllianceApp {
    constructor() {
        this.modules = {};
        this.config = {
            animations: true,
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            theme: localStorage.getItem('alliance-theme') || 'dark',
            debug: false
        };

        this.pageType = null;
        this.isInitialized = false;
    }

    async init() {
        try {
            // Show loading state
            this.showLoadingState();

            // 1. Detect page type and context
            this.detectPageType();

            // 2. Initialize core modules
            await this.initializeCoreModules();

            // 3. Initialize page-specific features
            this.initializePageFeatures();

            // 4. Add entrance animations
            if (!this.config.reducedMotion) {
                this.addEntranceAnimations();
            }

            // 5. Setup global event listeners
            this.setupGlobalListeners();

            // 6. Hide loading state and reveal content
            this.hideLoadingState();

            // Mark as initialized
            this.isInitialized = true;

            // Log success
            this.log('Alliance BJJ App initialized successfully');

        } catch (error) {
            console.error('Error initializing app:', error);
            this.hideLoadingState();
        }
    }

    detectPageType() {
        const path = window.location.pathname;
        const body = document.body;

        if (path.includes('dashboard') || body.classList.contains('dashboard-page')) {
            this.pageType = 'dashboard';
        } else if (path.includes('members')) {
            this.pageType = 'members';
        } else if (path.includes('schedule')) {
            this.pageType = 'schedule';
        } else if (path.includes('member/')) {
            this.pageType = 'member-app';
        } else if (path.includes('onboarding')) {
            this.pageType = 'onboarding';
        } else {
            this.pageType = 'generic';
        }

        // Add page type class to body
        body.classList.add(`page-${this.pageType}`);

        this.log(`Page type detected: ${this.pageType}`);
    }

    async initializeCoreModules() {
        // Load core JavaScript modules if they exist
        try {
            // These modules are already loaded via script tags
            if (window.ModalSystem) {
                this.modules.modal = window.ModalSystem;
                this.log('Modal system initialized');
            }

            if (window.InteractionEngine) {
                this.modules.interactions = window.InteractionEngine;
                this.log('Interaction engine initialized');
            }

            // Initialize existing utils
            if (window.AnimationUtils) {
                this.modules.animations = window.AnimationUtils;
            }

        } catch (error) {
            console.error('Error loading modules:', error);
        }
    }

    initializePageFeatures() {
        switch (this.pageType) {
            case 'dashboard':
                this.initDashboard();
                break;
            case 'members':
                this.initMembersPage();
                break;
            case 'schedule':
                this.initSchedulePage();
                break;
            case 'member-app':
                this.initMemberApp();
                break;
            case 'onboarding':
                this.initOnboarding();
                break;
            default:
                this.initGenericPage();
        }
    }

    // ============================================
    // PAGE-SPECIFIC INITIALIZATION
    // ============================================

    initDashboard() {
        // Add dashboard-specific classes
        const grid = document.querySelector('.dashboard-grid');
        if (grid) {
            grid.classList.add('animate-list');
        }

        // Enhance stats cards
        document.querySelectorAll('.stat-card').forEach((card, index) => {
            card.classList.add('card-hover');
            card.style.animationDelay = `${index * 0.1}s`;
        });

        // Add click handlers for quick actions
        this.setupQuickActions();

        // Initialize revenue counter animation
        this.animateRevenueCounter();
    }

    initMembersPage() {
        // Add search functionality
        this.setupMemberSearch();

        // Enhance member cards
        document.querySelectorAll('.member-card').forEach((card, index) => {
            card.classList.add('card-hover', 'swipeable');
            card.style.animationDelay = `${index * 0.05}s`;

            // Add promote button handler
            const promoteBtn = card.querySelector('[href*="promotion"]');
            if (promoteBtn) {
                promoteBtn.setAttribute('data-modal', 'promote-member');
                promoteBtn.setAttribute('data-member-name',
                    card.querySelector('.member-name')?.textContent || 'Member');
                promoteBtn.setAttribute('data-current-belt',
                    this.detectBeltFromCard(card));
                promoteBtn.removeAttribute('href');
            }
        });

        // Add "Add Member" modal trigger
        const addButton = document.querySelector('[href*="add-modal"]');
        if (addButton) {
            addButton.setAttribute('data-modal', 'add-member');
            addButton.removeAttribute('href');
        }
    }

    initSchedulePage() {
        // Enhance schedule cards
        document.querySelectorAll('.schedule-card, .class-card').forEach((card, index) => {
            card.classList.add('card-hover');
            card.style.animationDelay = `${index * 0.05}s`;

            // Add click handler for class details
            card.addEventListener('click', () => {
                const className = card.querySelector('.class-name')?.textContent || 'Class';
                const classType = card.querySelector('.class-type')?.textContent || 'Gi';

                window.openModal('class-detail', {
                    className,
                    classType,
                    time: card.querySelector('.class-time')?.textContent || '6:00 PM'
                });
            });
        });

        // Add day navigation
        this.setupDayNavigation();
    }

    initMemberApp() {
        // Mobile-specific enhancements
        document.body.classList.add('mobile-view');

        // Enhance mobile navigation
        const tabBar = document.querySelector('.mobile-tab-bar');
        if (tabBar) {
            this.enhanceTabBar(tabBar);
        }

        // Add pull-to-refresh
        this.setupPullToRefresh();

        // Enhance check-in button
        const checkInBtn = document.querySelector('[href*="checkin"]');
        if (checkInBtn) {
            checkInBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.simulateCheckIn();
            });
        }
    }

    initOnboarding() {
        // Multi-step form enhancement
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.classList.add('form-modern');
        });

        // Add progress indicator
        this.setupOnboardingProgress();
    }

    initGenericPage() {
        // Basic enhancements for all pages
        this.log('Generic page initialization');
    }

    // ============================================
    // FEATURE IMPLEMENTATIONS
    // ============================================

    setupMemberSearch() {
        const searchContainer = document.querySelector('.search-container');
        if (!searchContainer) {
            // Create search bar if it doesn't exist
            const header = document.querySelector('.header-right, .page-header');
            if (header) {
                const searchHTML = `
                    <div class="search-container">
                        <input type="text"
                               id="member-search"
                               class="search-input input-modern"
                               placeholder="Search members...">
                        <div class="search-filters">
                            <button class="filter-btn" data-filter="all">All</button>
                            <button class="filter-btn" data-filter="white">White</button>
                            <button class="filter-btn" data-filter="blue">Blue</button>
                            <button class="filter-btn" data-filter="purple">Purple</button>
                            <button class="filter-btn" data-filter="brown">Brown</button>
                            <button class="filter-btn" data-filter="black">Black</button>
                        </div>
                    </div>
                `;
                header.insertAdjacentHTML('afterend', searchHTML);

                // Setup search functionality
                this.initializeSearch();
            }
        }
    }

    initializeSearch() {
        const searchInput = document.getElementById('member-search');
        if (!searchInput) return;

        let debounceTimer;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.filterMembers(e.target.value);
            }, 300);
        });

        // Filter buttons
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterByBelt(btn.dataset.filter);
            });
        });
    }

    filterMembers(query) {
        const members = document.querySelectorAll('.member-card');
        let visibleCount = 0;

        members.forEach((card, index) => {
            const text = card.textContent.toLowerCase();
            const matches = text.includes(query.toLowerCase());

            if (matches) {
                card.style.display = '';
                card.style.animationDelay = `${visibleCount * 0.05}s`;
                card.classList.add('fade-in-up');
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show no results message if needed
        if (visibleCount === 0) {
            this.showNoResults();
        } else {
            this.hideNoResults();
        }
    }

    filterByBelt(belt) {
        const members = document.querySelectorAll('.member-card');

        members.forEach(card => {
            if (belt === 'all') {
                card.style.display = '';
            } else {
                const cardBelt = this.detectBeltFromCard(card);
                card.style.display = cardBelt === belt ? '' : 'none';
            }
        });
    }

    detectBeltFromCard(card) {
        const beltElement = card.querySelector('[class*="belt-"]');
        if (beltElement) {
            const classes = beltElement.className.split(' ');
            for (const cls of classes) {
                if (cls.startsWith('belt-')) {
                    return cls.replace('belt-', '');
                }
            }
        }
        return 'white';
    }

    setupQuickActions() {
        const quickActions = document.querySelectorAll('.quick-action');
        quickActions.forEach(action => {
            action.addEventListener('click', (e) => {
                e.preventDefault();
                const actionType = action.dataset.action || action.textContent.toLowerCase();

                switch (actionType) {
                    case 'add-member':
                        window.openModal('add-member');
                        break;
                    case 'new-class':
                        window.openModal('add-class');
                        break;
                    case 'check-payments':
                        window.location.href = 'billing.html';
                        break;
                    default:
                        window.showNotification(`${actionType} clicked`, 'info');
                }
            });
        });
    }

    animateRevenueCounter() {
        const revenueElement = document.querySelector('[data-revenue], .revenue-number');
        if (revenueElement && !revenueElement.classList.contains('counted')) {
            // Extract number from text like "$23,450"
            const value = revenueElement.textContent.replace(/[^0-9]/g, '');
            revenueElement.dataset.targetValue = value;

            // Trigger animation when visible
            if (window.InteractionEngine) {
                window.InteractionEngine.animateNumber(revenueElement);
            }
        }
    }

    setupDayNavigation() {
        const dayButtons = document.querySelectorAll('.day-selector button');
        dayButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                dayButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Animate schedule change
                const schedule = document.querySelector('.schedule-container');
                if (schedule) {
                    schedule.style.opacity = '0';
                    setTimeout(() => {
                        schedule.style.opacity = '1';
                        // Here you would load the new day's schedule
                        window.showNotification(`Showing ${btn.textContent} schedule`, 'info');
                    }, 300);
                }
            });
        });
    }

    enhanceTabBar(tabBar) {
        const tabs = tabBar.querySelectorAll('a');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                // Add animation to tab switch
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Add haptic feedback on mobile
                if ('vibrate' in navigator) {
                    navigator.vibrate(10);
                }
            });
        });
    }

    setupPullToRefresh() {
        let startY = 0;
        let pulling = false;

        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].pageY;
                pulling = true;
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (!pulling) return;

            const currentY = e.touches[0].pageY;
            const diff = currentY - startY;

            if (diff > 100) {
                document.body.classList.add('pulling-refresh');
            }
        });

        document.addEventListener('touchend', () => {
            if (document.body.classList.contains('pulling-refresh')) {
                this.refresh();
                document.body.classList.remove('pulling-refresh');
            }
            pulling = false;
        });
    }

    simulateCheckIn() {
        // Show camera preview modal
        const modal = document.createElement('div');
        modal.className = 'camera-modal';
        modal.innerHTML = `
            <div class="camera-preview">
                <div class="scan-line"></div>
                <div class="scan-corners"></div>
                <p>Scanning QR Code...</p>
            </div>
        `;

        document.body.appendChild(modal);

        // Simulate successful scan
        setTimeout(() => {
            modal.innerHTML = `
                <div class="check-in-success">
                    <div class="success-icon">✓</div>
                    <h2>Check-in Successful!</h2>
                    <p>Welcome to class, John!</p>
                </div>
            `;

            // Haptic feedback
            if ('vibrate' in navigator) {
                navigator.vibrate([100, 50, 100]);
            }

            setTimeout(() => {
                modal.remove();
                window.showNotification('Successfully checked in!', 'success');
            }, 2000);
        }, 2000);
    }

    setupOnboardingProgress() {
        const steps = document.querySelectorAll('.onboarding-step');
        if (steps.length === 0) return;

        const progressBar = document.createElement('div');
        progressBar.className = 'onboarding-progress';
        progressBar.innerHTML = `
            <div class="progress-track">
                <div class="progress-fill" style="width: 33%"></div>
            </div>
            <div class="progress-steps">
                <span class="step active">1</span>
                <span class="step">2</span>
                <span class="step">3</span>
            </div>
        `;

        const container = document.querySelector('.onboarding-container');
        if (container) {
            container.prepend(progressBar);
        }
    }

    // ============================================
    // ANIMATIONS
    // ============================================

    addEntranceAnimations() {
        // Add staggered animations to main content elements
        const elements = document.querySelectorAll(
            '.card, .stat-card, .member-card, .info-card, h1, h2, .sidebar-nav-item'
        );

        elements.forEach((el, index) => {
            if (!el.classList.contains('animated')) {
                el.classList.add('animate-in', 'animated');
                el.style.animationDelay = `${Math.min(index * 0.05, 0.8)}s`;
            }
        });

        // Special animation for sidebar
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.add('animate-scale');
        }

        // Animate header
        const header = document.querySelector('.header-row, .mobile-header');
        if (header) {
            header.classList.add('animate-in');
        }
    }

    // ============================================
    // UTILITIES
    // ============================================

    showLoadingState() {
        // Add loading class to body
        document.body.classList.add('app-loading');

        // Create loading overlay if needed
        if (!document.querySelector('.loading-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'loading-overlay';
            overlay.innerHTML = '<div class="spinner"></div>';
            document.body.appendChild(overlay);
        }
    }

    hideLoadingState() {
        document.body.classList.remove('app-loading');

        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.classList.add('fade-out');
            setTimeout(() => overlay.remove(), 300);
        }
    }

    refresh() {
        window.showNotification('Refreshing...', 'info');

        // Refresh interactions
        if (window.InteractionEngine) {
            window.InteractionEngine.refresh();
        }

        // Re-initialize page features
        this.initializePageFeatures();

        setTimeout(() => {
            window.showNotification('Updated!', 'success');
        }, 1000);
    }

    showNoResults() {
        if (document.querySelector('.no-results')) return;

        const message = document.createElement('div');
        message.className = 'no-results';
        message.innerHTML = `
            <div class="no-results-content">
                <h3>No members found</h3>
                <p>Try adjusting your search criteria</p>
            </div>
        `;

        const container = document.querySelector('.member-list, .main-content');
        if (container) {
            container.appendChild(message);
        }
    }

    hideNoResults() {
        const message = document.querySelector('.no-results');
        if (message) {
            message.remove();
        }
    }

    setupGlobalListeners() {
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.refresh();
        });

        // Handle online/offline
        window.addEventListener('online', () => {
            window.showNotification('Back online', 'success');
        });

        window.addEventListener('offline', () => {
            window.showNotification('You are offline', 'warning');
        });

        // Custom events
        document.addEventListener('modal:opened', (e) => {
            this.log('Modal opened:', e.detail);
        });

        document.addEventListener('modal:closed', (e) => {
            this.log('Modal closed:', e.detail);
        });
    }

    log(message, data = null) {
        if (this.config.debug) {
            console.log(`[Alliance App] ${message}`, data || '');
        }
    }
}

// ============================================
// INITIALIZATION
// ============================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    // Create global app instance
    window.allianceApp = new AllianceApp();

    // Initialize the app
    window.allianceApp.init();

    // Expose useful functions globally
    window.refreshApp = () => window.allianceApp.refresh();
    window.debugMode = (enabled = true) => {
        window.allianceApp.config.debug = enabled;
        console.log(`Debug mode ${enabled ? 'enabled' : 'disabled'}`);
    };
}