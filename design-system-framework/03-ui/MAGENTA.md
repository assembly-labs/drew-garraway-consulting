# MAGENTA.md — Visual Design Source of Truth

> **Status:** Template — Fill in during 03-UI phase
>
> **Purpose:** This document is THE source of truth for all visual design decisions. Developers reference this. Designers reference this. When in doubt, consult MAGENTA.

---

## Design Inputs

*Pull these from earlier phases. They drive all visual decisions.*

### Brand Adjectives

From `01-concept/brief.md`:

1. **[Adjective 1]** — [What this means visually]
2. **[Adjective 2]** — [What this means visually]
3. **[Adjective 3]** — [What this means visually]

### Reference Products

From `01-concept/competitive-analysis.md`:

| Product | What to Steal | How It Applies |
|---------|---------------|----------------|
| [Reference 1] | [Specific element] | [How we'll use it] |
| [Reference 2] | [Specific element] | [How we'll use it] |
| [Reference 3] | [Specific element] | [How we'll use it] |

### Anti-Patterns (What to Avoid)

| Anti-Pattern | Why It's Bad | Our Alternative |
|--------------|--------------|-----------------|
| [Pattern 1] | [Problem] | [What we do instead] |
| [Pattern 2] | [Problem] | [What we do instead] |
| [Pattern 3] | [Problem] | [What we do instead] |

---

## UX Principles

*Five non-negotiable principles that drive every design decision.*

### 1. [Principle Name]

**Statement:** [Clear, actionable principle]

**Why it matters:** [Rationale]

**In practice:**
- [Specific example of how this applies]
- [Specific example of how this applies]

---

### 2. [Principle Name]

**Statement:** [Clear, actionable principle]

**Why it matters:** [Rationale]

**In practice:**
- [Specific example of how this applies]
- [Specific example of how this applies]

---

### 3. [Principle Name]

**Statement:** [Clear, actionable principle]

**Why it matters:** [Rationale]

**In practice:**
- [Specific example of how this applies]
- [Specific example of how this applies]

---

### 4. [Principle Name]

**Statement:** [Clear, actionable principle]

**Why it matters:** [Rationale]

**In practice:**
- [Specific example of how this applies]
- [Specific example of how this applies]

---

### 5. [Principle Name]

**Statement:** [Clear, actionable principle]

**Why it matters:** [Rationale]

**In practice:**
- [Specific example of how this applies]
- [Specific example of how this applies]

---

## Visual Language

### Color Philosophy

**Approach:** [Describe the overall approach to color]

**Palette strategy:**
- [Light/dark mode approach]
- [Accent color strategy]
- [How color creates hierarchy]

**Emotional intent:**
[What feelings should the colors evoke?]

**Summary:**

| Category | Purpose | Primary Token |
|----------|---------|---------------|
| Surface | [Backgrounds and containers] | `color.surface.base` |
| Text | [Typography colors] | `color.text.primary` |
| Accent | [Interactive and brand] | `color.accent.primary` |
| Status | [Feedback states] | `color.status.*` |
| Border | [Separation and definition] | `color.border.default` |

---

### Typography Philosophy

**Approach:** [Describe the overall approach to type]

**Font choices:**
- **Primary:** [Font name] — [Why this font]
- **Mono (if needed):** [Font name] — [Why this font]

**Type personality:**
[What should type feel like? Efficient? Warm? Professional?]

**Hierarchy strategy:**
[How do we create hierarchy? Size? Weight? Both?]

**Summary:**

| Style | Use Case | Size Token | Weight |
|-------|----------|------------|--------|
| Display | [When used] | `typography.fontSize.4xl` | [Weight] |
| Heading 1 | [When used] | `typography.fontSize.3xl` | [Weight] |
| Heading 2 | [When used] | `typography.fontSize.2xl` | [Weight] |
| Heading 3 | [When used] | `typography.fontSize.xl` | [Weight] |
| Body | [When used] | `typography.fontSize.base` | [Weight] |
| Small | [When used] | `typography.fontSize.sm` | [Weight] |
| Caption | [When used] | `typography.fontSize.xs` | [Weight] |

---

### Spacing Philosophy

**Approach:** [Describe the overall approach to spacing]

**Density:**
[Is the UI dense/efficient or airy/breathable?]

**Base unit:** [4px / 8px]

**Rhythm:**
[How does spacing create rhythm and grouping?]

**Summary:**

| Context | Token | Value | Use Case |
|---------|-------|-------|----------|
| Tight | `spacing.1` | 4px | [When] |
| Compact | `spacing.2` | 8px | [When] |
| Default | `spacing.4` | 16px | [When] |
| Relaxed | `spacing.6` | 24px | [When] |
| Spacious | `spacing.8` | 32px | [When] |

---

### Motion Philosophy

**Approach:** [Describe the overall approach to motion]

**Personality:**
[Fast and snappy? Smooth and elegant? Minimal?]

**When to animate:**
- [Animation purpose 1]
- [Animation purpose 2]
- [Animation purpose 3]

**When NOT to animate:**
- [When animation would be gratuitous]
- [When it would slow users down]

**Summary:**

| Purpose | Duration Token | Easing Token |
|---------|---------------|--------------|
| Micro-interaction | `motion.duration.fast` | `motion.easing.default` |
| State change | `motion.duration.normal` | `motion.easing.default` |
| Enter | `motion.duration.normal` | `motion.easing.out` |
| Exit | `motion.duration.fast` | `motion.easing.in` |
| Complex | `motion.duration.slow` | `motion.easing.inOut` |

---

### Shape Philosophy

**Approach:** [Describe the overall approach to shapes/radius]

**Personality:**
[Sharp and precise? Soft and approachable? Highly rounded?]

**Consistency rule:**
[How do we decide which radius to use?]

**Summary:**

| Context | Token | Value | Use Case |
|---------|-------|-------|----------|
| None | `radius.none` | 0px | [When] |
| Subtle | `radius.sm` | 4px | [When] |
| Default | `radius.md` | 8px | [When] |
| Soft | `radius.lg` | 12px | [When] |
| Pill | `radius.full` | 9999px | [When] |

---

### Shadow/Depth Philosophy

**Approach:** [Describe the overall approach to elevation]

**Light source:** [Direction, e.g., "Top-left, consistent across all shadows"]

**Layering strategy:**
[How does shadow create hierarchy?]

**Summary:**

| Level | Token | Use Case |
|-------|-------|----------|
| Flat | `shadow.none` | [When] |
| Subtle | `shadow.sm` | [When] |
| Default | `shadow.md` | [When] |
| Raised | `shadow.lg` | [When] |
| Floating | `shadow.xl` | [When] |

---

## Do / Don't Rules

*Specific guidance to ensure consistency and avoid generic AI aesthetic.*

### Visual Do's

| Do | Why | Example |
|-----|-----|---------|
| [Specific visual behavior] | [Rationale] | [Where/how applied] |
| [Specific visual behavior] | [Rationale] | [Where/how applied] |
| [Specific visual behavior] | [Rationale] | [Where/how applied] |
| [Specific visual behavior] | [Rationale] | [Where/how applied] |
| [Specific visual behavior] | [Rationale] | [Where/how applied] |

### Visual Don'ts

| Don't | Why Not | Instead |
|-------|---------|---------|
| Use generic blue (#007AFF) without justification | Screams "default" | [Our accent color and why] |
| Apply excessive border-radius to everything | AI aesthetic tell | [Our radius strategy] |
| Add gratuitous gradients | Dated, distracting | [When/if we use gradients] |
| Use heavy shadows without purpose | Creates visual noise | [Our shadow approach] |
| Over-animate everything | Slows users down | [When we animate] |
| [Product-specific don't] | [Why] | [Alternative] |
| [Product-specific don't] | [Why] | [Alternative] |

---

## Iconography

**Style:** [Outlined / Filled / Duo-tone / Mixed]

**Source:** [Icon library or custom]

**Size tokens:**
| Name | Size | Use Case |
|------|------|----------|
| sm | 16px | [When] |
| md | 20px | [When] |
| lg | 24px | [When] |

**Stroke weight:** [If outlined]

**Color rules:**
- [When icons inherit text color]
- [When icons have specific colors]

---

## Imagery (if applicable)

**Photography style:**
[Describe if using photos]

**Illustration style:**
[Describe if using illustrations]

**What to avoid:**
- Corporate Memphis / generic illustration style
- Stock photography clichés
- [Product-specific things to avoid]

---

## Accessibility Baseline

### Contrast Requirements

**Standard:** WCAG 2.1 AA

| Combination | Minimum Ratio | Our Ratio |
|-------------|---------------|-----------|
| Text on surface.base | 4.5:1 | [Actual] |
| Text on surface.subtle | 4.5:1 | [Actual] |
| Large text on surface.base | 3:1 | [Actual] |
| UI components | 3:1 | [Actual] |

### Focus States

**Requirement:** All interactive elements must have visible focus

**Focus style:**
- [Describe focus ring/style]
- Token: [Which tokens used]

**Focus visibility:**
- [ ] Focus is visible on all backgrounds
- [ ] Focus doesn't rely only on color

### Touch Targets

**Minimum size:** 44×44px (iOS) / 48×48dp (Android)

**Spacing between targets:** [Minimum spacing]

### Motion Accessibility

**Requirement:** Respect `prefers-reduced-motion`

**When reduced motion is enabled:**
- [What changes]
- [What still animates, if anything]

### Screen Reader Considerations

- [ ] All images have alt text
- [ ] Interactive elements have accessible names
- [ ] Status changes are announced
- [ ] Focus order is logical

---

## Token Reference

*Quick reference to `tokens.json`. See file for full definitions.*

### Color Tokens
```
color.surface.{base, subtle, muted, inverse}
color.text.{primary, secondary, muted, inverse}
color.accent.{primary, primaryHover, secondary}
color.status.{success, warning, error, info}
color.border.{default, subtle, strong}
```

### Spacing Tokens
```
spacing.{0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24}
```

### Typography Tokens
```
typography.fontFamily.{sans, mono}
typography.fontSize.{xs, sm, base, lg, xl, 2xl, 3xl, 4xl}
typography.fontWeight.{normal, medium, semibold, bold}
```

### Other Tokens
```
radius.{none, sm, md, lg, xl, full}
shadow.{none, sm, md, lg, xl}
motion.duration.{instant, fast, normal, slow, slower}
motion.easing.{default, in, out, inOut}
breakpoint.{sm, md, lg, xl}
```

---

## Changelog

| Date | Change | Rationale |
|------|--------|-----------|
| [Date] | Initial creation | Phase 03 completion |
| | | |

---

## Approval

**Created by:** [Name]
**Date:** [Date]
**Approved by:** [Name]
**Approval date:** [Date]

---

*This document governs all visual design decisions. Update when tokens change.*
