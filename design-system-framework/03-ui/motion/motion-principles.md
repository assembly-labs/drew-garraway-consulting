# Motion Principles

> **Status:** Template — Fill in during 03-UI phase
>
> **Purpose:** Define how motion supports the user experience. Motion should be purposeful, not decorative.

---

## Motion Philosophy

### Our Approach

**Motion personality:**
[Describe: Fast and snappy? Smooth and elegant? Minimal and efficient?]

**Core belief:**
[e.g., "Motion should help users understand, not impress them."]

### Brand Alignment

How motion reflects the brand adjectives:

| Adjective | Motion Expression |
|-----------|-------------------|
| [Adjective 1] | [How motion reflects this] |
| [Adjective 2] | [How motion reflects this] |
| [Adjective 3] | [How motion reflects this] |

---

## Motion Principles

### 1. Purpose Over Polish

Every animation should have a reason:
- [ ] Provides feedback
- [ ] Guides attention
- [ ] Explains change
- [ ] Maintains context

If it doesn't serve one of these, don't animate it.

---

### 2. Fast by Default

**Principle:** Users shouldn't wait for animations.

| Duration | Token | Use Case |
|----------|-------|----------|
| Instant | `motion.duration.instant` (0ms) | State that shouldn't animate |
| Fast | `motion.duration.fast` (100ms) | Micro-interactions, feedback |
| Normal | `motion.duration.normal` (200ms) | Standard transitions |
| Slow | `motion.duration.slow` (300ms) | Emphasis, larger movements |
| Slower | `motion.duration.slower` (500ms) | Complex sequences only |

**Default choice:** Normal (200ms) or faster.

---

### 3. Natural Easing

**Principle:** Motion should feel physical, not mechanical.

| Easing | Token | When to Use |
|--------|-------|-------------|
| Default | `motion.easing.default` | Most transitions |
| Out | `motion.easing.out` | Elements entering |
| In | `motion.easing.in` | Elements exiting |
| In-Out | `motion.easing.inOut` | Elements moving on screen |
| Linear | CSS `linear` | Progress bars, looping |

**Never use:** Linear for UI transitions (feels robotic).

---

### 4. Reduced Motion Respect

**Principle:** Always respect `prefers-reduced-motion`.

**When reduced motion is enabled:**
- Remove non-essential animations
- Keep essential state changes (but make instant)
- Opacity changes may remain (less motion-triggering)

**Implementation:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Motion Categories

### 1. Micro-interactions

Small feedback animations that confirm user actions.

**Examples:**
- Button press feedback
- Toggle switches
- Checkbox animations
- Icon transitions

**Guidelines:**
- Duration: Fast (100ms)
- Easing: Default
- Keep subtle

---

### 2. State Transitions

Visual changes between component states.

**Examples:**
- Hover states
- Focus states
- Expanded/collapsed
- Selected/unselected

**Guidelines:**
- Duration: Fast to Normal (100-200ms)
- Easing: Default
- All properties should transition together

---

### 3. Page/View Transitions

Larger transitions between screens or sections.

**Examples:**
- Page navigation
- Modal open/close
- Tab switching
- Drawer slide

**Guidelines:**
- Duration: Normal to Slow (200-300ms)
- Easing: Out for enter, In for exit
- Consider direction (enter from where?)

---

### 4. Loading & Progress

Animations indicating system activity.

**Examples:**
- Spinners
- Skeleton screens
- Progress bars
- Pulsing placeholders

**Guidelines:**
- Keep smooth and consistent
- Don't distract from content
- Duration appropriate to expected wait

---

### 5. Feedback & Celebration

Animations confirming success or providing feedback.

**Examples:**
- Success checkmarks
- Error shakes
- Toast notifications
- Completion celebrations

**Guidelines:**
- Success should feel rewarding but brief
- Error should be noticeable but not alarming
- Don't over-celebrate routine actions

---

## Specific Animation Patterns

### Modal/Dialog

**Enter:**
- Fade in backdrop: 200ms, ease-out
- Scale up dialog: 200ms, ease-out, from 95% to 100%

**Exit:**
- Fade out all: 150ms, ease-in

**Reduced motion:**
- Instant appear/disappear

---

### Dropdown/Menu

**Enter:**
- Fade + slide from top: 150ms, ease-out

**Exit:**
- Fade: 100ms, ease-in

**Reduced motion:**
- Instant appear/disappear

---

### Toast/Notification

**Enter:**
- Slide in from edge: 200ms, ease-out

**Exit:**
- Fade out: 150ms, ease-in

**Reduced motion:**
- Instant appear/disappear

---

### Accordion/Collapse

**Expand:**
- Height: 200ms, ease-out
- Opacity: 200ms, ease-out

**Collapse:**
- Height: 150ms, ease-in
- Opacity: 150ms, ease-in

**Reduced motion:**
- Instant expand/collapse

---

### Button Press

**Press:**
- Scale to 98%: 50ms, ease-in

**Release:**
- Scale to 100%: 100ms, ease-out

**Reduced motion:**
- No scale, just color change

---

### Loading Spinner

**Animation:**
- Rotate: 1s, linear, infinite

**Reduced motion:**
- Static loading indicator or text

---

## Token Reference

### Duration Tokens

| Token | Value | Use Case |
|-------|-------|----------|
| `motion.duration.instant` | 0ms | Disabled states |
| `motion.duration.fast` | 100ms | Micro-interactions |
| `motion.duration.normal` | 200ms | Standard transitions |
| `motion.duration.slow` | 300ms | Emphasis |
| `motion.duration.slower` | 500ms | Complex sequences |

### Easing Tokens

| Token | Value | Use Case |
|-------|-------|----------|
| `motion.easing.default` | cubic-bezier(0.4, 0, 0.2, 1) | Most cases |
| `motion.easing.in` | cubic-bezier(0.4, 0, 1, 1) | Exits |
| `motion.easing.out` | cubic-bezier(0, 0, 0.2, 1) | Enters |
| `motion.easing.inOut` | cubic-bezier(0.4, 0, 0.2, 1) | On-screen movement |

---

## Do / Don't

### Do

- [ ] Use motion to provide feedback
- [ ] Keep durations short (under 300ms for most)
- [ ] Use consistent easing
- [ ] Respect reduced motion preferences
- [ ] Test on slower devices
- [ ] Make motion optional for understanding

### Don't

- [ ] Animate for decoration
- [ ] Make users wait for animations
- [ ] Use bouncy/elastic easing (unless brand appropriate)
- [ ] Animate layout in ways that cause content shift
- [ ] Use different timing for similar actions
- [ ] Block interaction during animation

---

## Testing Checklist

- [ ] All animations tested with reduced motion
- [ ] Performance tested on target devices
- [ ] Animations don't cause layout shift
- [ ] Focus isn't lost during transitions
- [ ] Screen readers announce changes appropriately
- [ ] Animations don't trigger vestibular issues

---

## Implementation Notes

### CSS Custom Properties
```css
:root {
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

*Motion principles complete. Apply these consistently in Phase 04.*
