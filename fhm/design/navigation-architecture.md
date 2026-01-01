# Navigation Architecture for SIE Study Materials

## Current Structure Analysis

### Content Hierarchy
```
SIE Study Materials
├── Chapter 1: Securities Markets
├── Chapter 2: Equity Securities
├── Chapter 3: Corporate Debt
├── Chapter 4: Investment Companies
├── Chapter 5: Municipal Debt & Money Markets
│   ├── Section 1: Municipal Debt
│   └── Section 2: Money Market Instruments
├── Chapter 6: Options
├── Chapter 7: Customer Accounts
├── Chapter 8: Prohibited Activities
├── Chapter 9: Trading & Settlement
├── Chapter 10: Regulatory Framework
├── Chapter 11: Economics & Analysis
├── Chapter 12: Packaged Products
└── Chapter 13: Direct Participation Programs
```

## Navigation Requirements

### 1. Multi-Level Navigation
- **Chapter Navigation**: Move between chapters (1-13)
- **Section Navigation**: Move between sections within a chapter
- **Cross-Navigation**: Jump from any section to any other section/chapter

### 2. User Context Awareness
- Always show current position (Chapter X, Section Y)
- Visual breadcrumb trail
- Progress indicators at both chapter and section level

### 3. Mobile Responsiveness
- Collapsible navigation on mobile
- Touch-friendly navigation controls
- Swipe gestures for next/previous

## Proposed Navigation Components

### A. Enhanced Header Navigation
```html
<header class="header">
    <div class="header__inner">
        <!-- Logo/Title -->
        <h1 class="header__title">Franklin Hugh Money</h1>

        <!-- Enhanced Breadcrumb with Dropdown -->
        <nav class="breadcrumb-nav">
            <a href="index.html">Home</a>
            <span>/</span>
            <div class="breadcrumb-dropdown">
                <a href="sie-study-materials.html">SIE Study Materials</a>
                <div class="dropdown-content">
                    <!-- All chapters listed here -->
                </div>
            </div>
            <span>/</span>
            <div class="breadcrumb-dropdown">
                <span>Chapter 5</span>
                <div class="dropdown-content">
                    <a href="sie-chapter-5.html">Section 1: Municipal Debt</a>
                    <a href="sie-chapter-5-money-markets.html">Section 2: Money Markets</a>
                </div>
            </div>
            <span>/</span>
            <span>Section 2: Money Markets</span>
        </nav>
    </div>

    <!-- Dual Progress Bars -->
    <div class="progress-container">
        <div class="progress progress--chapter">
            <div class="progress__bar" style="width: 38.5%"></div>
            <span class="progress__label">Chapter 5 of 13</span>
        </div>
        <div class="progress progress--section">
            <div class="progress__bar" style="width: 100%"></div>
            <span class="progress__label">Section 2 of 2</span>
        </div>
    </div>
</header>
```

### B. Floating Side Navigation (Desktop)
```html
<nav class="side-nav">
    <button class="side-nav__toggle" aria-label="Toggle navigation">
        <span></span>
    </button>

    <div class="side-nav__content">
        <h3 class="side-nav__title">Study Guide Contents</h3>

        <!-- Search -->
        <input type="search" class="side-nav__search" placeholder="Search topics...">

        <!-- Chapter List -->
        <ul class="side-nav__chapters">
            <li class="side-nav__chapter">
                <button class="side-nav__chapter-toggle">Chapter 1: Securities Markets</button>
            </li>
            <!-- ... -->
            <li class="side-nav__chapter side-nav__chapter--active">
                <button class="side-nav__chapter-toggle">Chapter 5: Municipal & Money Markets</button>
                <ul class="side-nav__sections">
                    <li><a href="sie-chapter-5.html">Section 1: Municipal Debt</a></li>
                    <li class="side-nav__section--active">
                        <a href="sie-chapter-5-money-markets.html">Section 2: Money Markets</a>
                    </li>
                </ul>
            </li>
            <!-- ... -->
        </ul>
    </div>
</nav>
```

### C. Enhanced Bottom Navigation
```html
<nav class="chapter-nav">
    <!-- Previous Section/Chapter -->
    <div class="chapter-nav__prev">
        <a href="sie-chapter-5.html" class="chapter-nav__link">
            <span class="chapter-nav__arrow">←</span>
            <div class="chapter-nav__content">
                <span class="chapter-nav__label">Previous Section</span>
                <span class="chapter-nav__title">Section 1: Municipal Debt</span>
            </div>
        </a>
    </div>

    <!-- Chapter Overview -->
    <div class="chapter-nav__center">
        <button class="chapter-nav__overview">
            View Chapter 5 Overview
        </button>
    </div>

    <!-- Next Section/Chapter -->
    <div class="chapter-nav__next">
        <a href="sie-chapter-6.html" class="chapter-nav__link">
            <div class="chapter-nav__content">
                <span class="chapter-nav__label">Next Chapter</span>
                <span class="chapter-nav__title">Chapter 6: Options</span>
            </div>
            <span class="chapter-nav__arrow">→</span>
        </a>
    </div>
</nav>
```

### D. Mobile Bottom Tab Bar
```html
<nav class="mobile-nav">
    <button class="mobile-nav__item" data-action="menu">
        <svg><!-- menu icon --></svg>
        <span>Menu</span>
    </button>
    <button class="mobile-nav__item" data-action="previous">
        <svg><!-- arrow left --></svg>
        <span>Previous</span>
    </button>
    <button class="mobile-nav__item mobile-nav__item--active" data-action="toc">
        <svg><!-- list icon --></svg>
        <span>Contents</span>
    </button>
    <button class="mobile-nav__item" data-action="next">
        <svg><!-- arrow right --></svg>
        <span>Next</span>
    </button>
    <button class="mobile-nav__item" data-action="progress">
        <svg><!-- progress icon --></svg>
        <span>38%</span>
    </button>
</nav>
```

## Navigation Logic

### URL Structure
```
/sie-study-materials.html                    # Main index
/sie-chapter-1.html                         # Chapter without sections
/sie-chapter-5.html                         # Chapter 5, Section 1 (default)
/sie-chapter-5-section-1.html               # Explicit section 1
/sie-chapter-5-section-2.html               # Section 2
/sie-chapter-5-money-markets.html           # Alias for section 2
```

### JavaScript Navigation Controller
```javascript
class NavigationController {
    constructor() {
        this.chapters = [
            {
                id: 1,
                title: "Securities Markets",
                sections: null,
                url: "sie-chapter-1.html"
            },
            // ...
            {
                id: 5,
                title: "Municipal Debt & Money Markets",
                sections: [
                    {
                        id: 1,
                        title: "Municipal Debt",
                        url: "sie-chapter-5.html"
                    },
                    {
                        id: 2,
                        title: "Money Market Instruments",
                        url: "sie-chapter-5-money-markets.html"
                    }
                ],
                url: "sie-chapter-5.html"
            },
            // ...
        ];

        this.currentChapter = null;
        this.currentSection = null;
    }

    getCurrentPosition() {
        // Determine from URL
    }

    getNextDestination() {
        // Logic for next section or chapter
    }

    getPreviousDestination() {
        // Logic for previous section or chapter
    }

    updateProgressBars() {
        // Update both chapter and section progress
    }

    buildSideNav() {
        // Generate side navigation HTML
    }

    handleKeyboardNavigation(event) {
        // Arrow keys for navigation
    }
}
```

## CSS Styling Approach

### Desktop Layout
```css
/* Side navigation - fixed left */
.side-nav {
    position: fixed;
    left: 0;
    top: 60px;
    width: 280px;
    height: calc(100vh - 60px);
    background: var(--fh-white);
    border-right: 1px solid var(--fh-gray-200);
    transform: translateX(-240px);
    transition: transform 0.3s ease;
}

.side-nav--open {
    transform: translateX(0);
}

/* Main content shifts when nav open */
.main-content {
    transition: margin-left 0.3s ease;
}

.main-content--nav-open {
    margin-left: 280px;
}
```

### Mobile Layout
```css
/* Bottom tab bar - fixed bottom */
@media (max-width: 768px) {
    .mobile-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: var(--fh-white);
        border-top: 1px solid var(--fh-gray-200);
        display: flex;
        justify-content: space-around;
    }

    .side-nav {
        width: 100%;
        transform: translateX(-100%);
    }

    .chapter-nav {
        margin-bottom: 80px; /* Space for mobile nav */
    }
}
```

## Implementation Priority

### Phase 1: Core Navigation
1. Update header with section awareness
2. Implement previous/next logic for sections
3. Add section progress bar
4. Update breadcrumbs

### Phase 2: Side Navigation
1. Build collapsible side nav
2. Add chapter/section hierarchy
3. Implement toggle functionality
4. Add keyboard shortcuts

### Phase 3: Mobile Optimization
1. Create mobile bottom tab bar
2. Add swipe gestures
3. Optimize touch targets
4. Test on various devices

### Phase 4: Enhanced Features
1. Search within navigation
2. Bookmark sections
3. Progress persistence
4. Keyboard navigation

## Benefits

1. **Clear Hierarchy**: Users always know where they are
2. **Easy Navigation**: Multiple ways to navigate content
3. **Progressive Enhancement**: Works without JavaScript
4. **Accessibility**: Keyboard and screen reader friendly
5. **Mobile First**: Optimized for all devices
6. **Scalable**: Easy to add more chapters/sections

## Next Steps

1. Create HTML prototype with new navigation
2. Build CSS for all navigation components
3. Implement JavaScript controller
4. Test with real content
5. Gather user feedback
6. Iterate and improve