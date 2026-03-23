// SIE Navigation Component
// Reusable navigation component for all SIE study material pages

// eslint-disable-next-line no-unused-vars -- instantiated by HTML pages
class SIENavigationComponent {
    constructor(currentPageFile) {
        this.currentPageFile = currentPageFile;
        this.currentSection = SIECourseStructure.getCurrentSection(currentPageFile);
        this.currentChapter = SIECourseStructure.getChapterForSection(this.currentSection?.id);
        this.initializeNavigation();
    }

    initializeNavigation() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.render());
        } else {
            this.render();
        }
    }

    render() {
        // Create and inject the navigation bar
        this.createNavigationBar();

        // Update progress bar
        this.updateProgressBar();

        // Setup event listeners
        this.setupEventListeners();

        // Setup scroll tracking for section dots
        this.setupScrollTracking();
    }

    createNavigationBar() {
        const navBar = document.createElement('nav');
        navBar.className = 'sie-nav-bar';
        navBar.innerHTML = this.getNavigationHTML();
        document.body.appendChild(navBar);
    }

    getNavigationHTML() {
        const prevSection = SIECourseStructure.getPreviousSection(this.currentSection?.id);
        const nextSection = SIECourseStructure.getNextSection(this.currentSection?.id);

        return `
            <div class="sie-nav-bar__content">
                <!-- Previous button -->
                ${prevSection && !prevSection.locked
                    ? `<a href="${prevSection.file}"
                       class="sie-nav-button sie-nav-button--prev">
                        <span>← ${prevSection.id}</span>
                    </a>`
                    : `<span class="sie-nav-button sie-nav-button--prev sie-nav-button--disabled"
                        aria-disabled="true">
                        <span>← ${prevSection ? prevSection.id : 'Previous'}</span>
                    </span>`
                }

                <!-- Chapter/Section selector -->
                <div class="sie-chapter-selector">
                    <span class="sie-chapter-selector__label">Section:</span>
                    <div class="sie-chapter-selector__dropdown">
                        <div class="sie-chapter-selector__toggle" id="chapterToggle">
                            <span class="sie-chapter-selector__current">
                                ${this.currentSection ? `${this.currentSection.id}. ${this.currentSection.title}` : 'Select Section'}
                            </span>
                            <span>▼</span>
                        </div>
                        <div class="sie-chapter-selector__menu" id="chapterMenu">
                            ${this.generateChapterMenu()}
                        </div>
                    </div>
                </div>

                <!-- Section dots (for current chapter only) -->
                ${this.generateSectionDots()}

                <!-- Next button -->
                ${nextSection && !nextSection.locked
                    ? `<a href="${nextSection.file}"
                       class="sie-nav-button sie-nav-button--next">
                        <span>${nextSection.id} →</span>
                    </a>`
                    : `<span class="sie-nav-button sie-nav-button--next sie-nav-button--disabled"
                        aria-disabled="true">
                        <span>${nextSection ? nextSection.id : 'Next'} →</span>
                    </span>`
                }
            </div>
        `;
    }

    generateChapterMenu() {
        return SIECourseStructure.chapters
            .map(chapter => {
                const chapterSections = chapter.sections
                    .map(section => {
                        const isCurrent = section.id === this.currentSection?.id;
                        const isLocked = section.locked;

                        if (isLocked) {
                            return `
                    <span class="sie-section-option sie-section-option--locked" aria-disabled="true">
                        <span class="sie-section-option__number">${section.id}</span>
                        <span class="sie-section-option__title">${section.title}</span>
                        <span class="sie-section-option__lock">🔒</span>
                    </span>
                `;
                        }
                        return `
                    <a href="${section.file}"
                       class="sie-section-option ${isCurrent ? 'sie-section-option--current' : ''}">
                        <span class="sie-section-option__number">${section.id}</span>
                        <span class="sie-section-option__title">${section.title}</span>
                    </a>
                `;
                    })
                    .join('');

                return `
                <div class="sie-chapter-group">
                    <div class="sie-chapter-group__header">
                        Chapter ${chapter.number}: ${chapter.title}
                    </div>
                    <div class="sie-chapter-group__sections">
                        ${chapterSections}
                    </div>
                </div>
            `;
            })
            .join('');
    }

    generateSectionDots() {
        // Get all sections in the current chapter
        if (!this.currentChapter) return '';

        const sectionsInChapter = this.currentChapter.sections;
        const currentSectionIndex = sectionsInChapter.findIndex(
            s => s.id === this.currentSection?.id
        );

        // Only show dots if there are multiple sections in the chapter
        if (sectionsInChapter.length <= 1) return '';

        const dots = sectionsInChapter
            .map((section, index) => {
                const isActive = index === currentSectionIndex;
                const isLocked = section.locked;

                if (section.id === this.currentSection?.id) {
                    // For current page, use internal section navigation
                    return this.generateInternalSectionDots();
                } else if (isLocked) {
                    return `
                    <span class="sie-section-link-dot ${isActive ? 'active' : ''} locked"
                       aria-disabled="true"
                       title="${section.title} (locked)">
                    </span>
                `;
                } else {
                    return `
                    <a href="${section.file}"
                       class="sie-section-link-dot ${isActive ? 'active' : ''}"
                       title="${section.title}">
                    </a>
                `;
                }
            })
            .join('');

        return `<div class="sie-section-nav">${dots}</div>`;
    }

    generateInternalSectionDots() {
        // Generate dots for internal page sections (if they exist)
        const sections = document.querySelectorAll('section[id]');
        if (sections.length <= 1) return '';

        return Array.from(sections)
            .map((section, index) => {
                const sectionId = section.id;
                const sectionTitle =
                    section.querySelector('h2')?.textContent || `Section ${index + 1}`;

                return `
                <div class="sie-section-dot ${index === 0 ? 'active' : ''}"
                     data-section="${sectionId}"
                     role="button"
                     tabindex="0"
                     title="${sectionTitle}">
                </div>
            `;
            })
            .join('');
    }

    updateProgressBar() {
        if (!this.currentSection) return;

        const progressPercentage = SIECourseStructure.getProgressPercentage(this.currentSection.id);
        const progressBar = document.querySelector('.progress__bar');

        if (progressBar) {
            progressBar.style.width = `${progressPercentage}%`;
        }
    }

    setupEventListeners() {
        // Chapter menu toggle
        const toggle = document.getElementById('chapterToggle');
        const menu = document.getElementById('chapterMenu');

        if (toggle && menu) {
            toggle.addEventListener('click', e => {
                e.stopPropagation();
                menu.classList.toggle('open');
            });

            // Close menu when clicking outside
            document.addEventListener('click', e => {
                if (!menu.contains(e.target) && !toggle.contains(e.target)) {
                    menu.classList.remove('open');
                }
            });
        }

        // Section dot navigation via event delegation
        const navBar = document.querySelector('.sie-nav-bar');
        if (navBar) {
            navBar.addEventListener('click', e => {
                const dot = e.target.closest('.sie-section-dot[data-section]');
                if (dot) {
                    const sectionId = dot.getAttribute('data-section');
                    const section = document.getElementById(sectionId);
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
            navBar.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    const dot = e.target.closest('.sie-section-dot[data-section]');
                    if (dot) {
                        e.preventDefault();
                        const sectionId = dot.getAttribute('data-section');
                        const section = document.getElementById(sectionId);
                        if (section) {
                            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }
                }
            });
        }
    }

    setupScrollTracking() {
        const sections = document.querySelectorAll('section[id]');
        if (sections.length <= 1) return;

        const observerOptions = {
            rootMargin: '-20% 0px -70% 0px',
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.updateActiveSectionDot(entry.target.id);
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    updateActiveSectionDot(activeSectionId) {
        document.querySelectorAll('.sie-section-dot').forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-section') === activeSectionId) {
                dot.classList.add('active');
            }
        });
    }
}

