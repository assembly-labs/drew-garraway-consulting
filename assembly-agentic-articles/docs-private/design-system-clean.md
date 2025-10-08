# Autonomous Content Agent Design System
**Version:** 2.0 (Cleaned)
**Date:** October 8, 2025

## Overview

A minimalist, dark-themed design system for the Autonomous Content Research & Publishing Platform. Optimized for readability, accessibility, and React + TailwindCSS integration.

---

## 1. Design Tokens

### Color System

```css
:root {
  /* Base Palette */
  --gray-950: #0D1117;
  --gray-900: #161B22;
  --gray-800: #21262D;
  --gray-700: #30363D;
  --gray-400: #8B949E;
  --gray-100: #F0F6FC;

  --blue-500: #58A6FF;
  --green-600: #238636;
  --red-500: #F85149;

  /* Semantic Tokens (Dark Mode Default) */
  --bg-primary: var(--gray-950);
  --bg-secondary: var(--gray-900);
  --bg-surface: var(--gray-800);

  --text-primary: var(--gray-100);
  --text-secondary: var(--gray-400);

  --accent: var(--blue-500);
  --success: var(--green-600);
  --error: var(--red-500);
  --border: var(--gray-700);

  /* Interactive States */
  --accent-hover: #3898ff;
  --accent-active: #2080ff;
  --surface-hover: rgba(33, 38, 45, 0.8);
}

/* Light Mode Variant */
.light {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F6F8FA;
  --bg-surface: #FFFFFF;

  --text-primary: #24292F;
  --text-secondary: #57606A;

  --border: #D0D7DE;
  --surface-hover: rgba(246, 248, 250, 0.8);
}
```

### Spacing Scale

```css
:root {
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 32px;
  --space-xl: 48px;
  --space-2xl: 64px;
}
```

### Breakpoints

```css
:root {
  --breakpoint-mobile: 600px;
  --breakpoint-tablet: 1024px;
  --breakpoint-desktop: 1440px;
}
```

---

## 2. Typography

### Font Family

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 1.125rem; /* 18px */
  line-height: 1.6;
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
}
```

### Type Scale

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| H1      | clamp(2rem, 4vw, 2.5rem) | 700 | 1.2 | -0.02em |
| H2      | clamp(1.5rem, 3vw, 1.875rem) | 600 | 1.25 | -0.01em |
| H3      | 1.25rem (20px) | 500 | 1.3 | normal |
| Body    | 1.125rem (18px) | 400 | 1.6 | normal |
| Small   | 0.875rem (14px) | 400 | 1.4 | 0.01em |
| Micro   | 0.75rem (12px) | 400 | 1.3 | 0.02em |

```css
h1 {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-md);
}

h2 {
  font-size: clamp(1.5rem, 3vw, 1.875rem);
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.01em;
  margin-top: var(--space-lg);
  margin-bottom: var(--space-sm);
}

h3 {
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.3;
  margin-top: var(--space-md);
  margin-bottom: var(--space-xs);
}

.text-small {
  font-size: 0.875rem;
  line-height: 1.4;
  letter-spacing: 0.01em;
}

.text-micro {
  font-size: 0.75rem;
  line-height: 1.3;
  letter-spacing: 0.02em;
  color: var(--text-secondary);
}
```

---

## 3. Layout

### Container

```css
.container {
  max-width: var(--breakpoint-desktop);
  margin: 0 auto;
  padding: var(--space-sm) var(--space-md);
}

@media (max-width: 600px) {
  .container {
    padding: var(--space-sm);
  }
}
```

### Grid System

```css
/* Side-by-side layout: Draft (70%) + Sources (30%) */
.editor-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--space-lg);
}

@media (max-width: 1024px) {
  .editor-layout {
    grid-template-columns: 1fr;
  }
}
```

---

## 4. Components

### Forms

```css
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  margin-bottom: var(--space-md);
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.input,
.textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input::placeholder,
.textarea::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
}

.input:focus,
.textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.1);
}

.input:disabled,
.textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.textarea {
  min-height: 120px;
  resize: vertical;
  line-height: 1.5;
}

.input-error {
  border-color: var(--error);
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(248, 81, 73, 0.1);
}

.error-message {
  font-size: 0.75rem;
  color: var(--error);
  margin-top: 4px;
}
```

### Buttons

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Variants */
.btn-primary {
  background: var(--accent);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-hover);
}

.btn-primary:active:not(:disabled) {
  background: var(--accent-active);
}

.btn-success {
  background: var(--success);
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #2ea043;
}

.btn-error {
  background: var(--error);
  color: white;
}

.btn-error:hover:not(:disabled) {
  background: #da3633;
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-primary);
}

.btn-ghost:hover:not(:disabled) {
  background: var(--bg-surface);
}

.btn-text {
  background: transparent;
  color: var(--accent);
  padding: 8px 12px;
}

.btn-text:hover:not(:disabled) {
  background: rgba(88, 166, 255, 0.1);
}
```

### Cards

```css
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: var(--space-md);
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Source Card */
.source-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: var(--space-sm) var(--space-md);
  margin-bottom: var(--space-sm);
}

.source-title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--accent);
  margin-bottom: var(--space-xs);
}

.source-meta {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: var(--space-xs);
}

.source-excerpt {
  font-size: 1rem;
  color: var(--text-primary);
  line-height: 1.5;
}

.credibility-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.credibility-high {
  background: rgba(35, 134, 54, 0.2);
  color: var(--success);
}

.credibility-medium {
  background: rgba(187, 128, 9, 0.2);
  color: #d29922;
}

.credibility-low {
  background: rgba(248, 81, 73, 0.2);
  color: var(--error);
}
```

### Rich Text Editor

```css
.editor {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: var(--space-md);
  min-height: 400px;
  font-size: 1.125rem;
  line-height: 1.6;
}

.editor:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.1);
}

.editor p {
  margin-bottom: var(--space-sm);
}

.editor h2 {
  font-size: 1.5rem;
  margin-top: var(--space-lg);
  margin-bottom: var(--space-sm);
}

/* Citation highlighting */
.editor a.citation {
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px dotted var(--accent);
  cursor: help;
}

.editor a.citation:hover {
  background: rgba(88, 166, 255, 0.1);
}
```

### Platform Previews

```css
.preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.preview-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: var(--space-md);
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: var(--space-sm);
  padding-bottom: var(--space-xs);
  border-bottom: 1px solid var(--border);
}

.preview-content {
  font-size: 0.875rem;
  color: var(--text-primary);
  white-space: pre-wrap;
  line-height: 1.5;
}
```

### Modals

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-md);
}

.modal {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: var(--space-lg);
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--space-md);
}

.modal-body {
  margin-bottom: var(--space-lg);
  line-height: 1.6;
}

.modal-footer {
  display: flex;
  gap: var(--space-sm);
  justify-content: flex-end;
}
```

### Loading States

```css
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-surface) 0%,
    var(--surface-hover) 50%,
    var(--bg-surface) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Dashboard Tables

```css
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: var(--space-sm);
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.table th {
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-surface);
}

.table tbody tr:hover {
  background: var(--surface-hover);
}
```

---

## 5. Utilities

### Text Utilities

```css
.text-muted {
  color: var(--text-secondary);
}

.text-accent {
  color: var(--accent);
}

.text-success {
  color: var(--success);
}

.text-error {
  color: var(--error);
}
```

### Display Utilities

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

---

## 6. Accessibility

### Focus States

All interactive elements include visible focus indicators:
- Buttons: 2px outline with 2px offset
- Inputs: Border color change + subtle box shadow
- Links: Outline with offset

### ARIA Support

```html
<!-- Button with loading state -->
<button class="btn btn-primary" aria-busy="true" disabled>
  <span class="spinner" aria-hidden="true"></span>
  <span>Loading...</span>
</button>

<!-- Form with error -->
<div class="form-group">
  <label for="idea" class="label">Your Idea</label>
  <textarea
    id="idea"
    class="textarea input-error"
    aria-invalid="true"
    aria-describedby="idea-error"
  ></textarea>
  <span id="idea-error" class="error-message" role="alert">
    Idea must be between 5-200 characters
  </span>
</div>
```

### Keyboard Navigation

- All modals trap focus
- Tab order follows logical flow
- Esc closes modals
- Enter submits forms

---

## 7. TailwindCSS Integration

### tailwind.config.js

```js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          950: '#0D1117',
          900: '#161B22',
          800: '#21262D',
          700: '#30363D',
          400: '#8B949E',
          100: '#F0F6FC',
        },
        blue: {
          500: '#58A6FF',
        },
        green: {
          600: '#238636',
        },
        red: {
          500: '#F85149',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        xs: '8px',
        sm: '16px',
        md: '24px',
        lg: '32px',
        xl: '48px',
        '2xl': '64px',
      },
      maxWidth: {
        container: '1440px',
      },
      screens: {
        mobile: '600px',
        tablet: '1024px',
      },
    },
  },
  plugins: [],
};
```

---

## 8. React Component Example

```tsx
// Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'success' | 'error' | 'ghost' | 'text';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  disabled = false,
  children,
  onClick,
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading && <span className="spinner" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
};
```

---

## Implementation Notes

1. **Setup:** Create global stylesheet with CSS variables and base styles
2. **Components:** Build reusable React components with className mappings
3. **Accessibility:** Ensure ARIA labels, focus states, and keyboard navigation
4. **Testing:** Test with React Testing Library, verify WCAG AA compliance
5. **Performance:** Use CSS-in-JS sparingly; prefer CSS modules or Tailwind

---

**This system is modular and extensible. Reference sections as needed when building components.**
