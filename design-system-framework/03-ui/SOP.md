# 03-UI: Standard Operating Procedure

This document is the complete guide for running the UI phase. Follow it step-by-step.

---

## Phase Overview

**Purpose:** Create the visual system—how the product looks, moves, and feels.

**Duration:** 2-4 working sessions (4-10 hours total)

**Inputs:**
- Completed `02-ux/wireframes/`
- Completed `02-ux/content-strategy.md`
- Completed `02-ux/brand-voice-matrix.md` (for verbal-visual alignment)
- Brand adjectives from `01-concept/brief.md`
- Reference products from `01-concept/competitive-analysis.md`

**Outputs:**
- Completed `MAGENTA.md` (visual design source of truth)
- Finalized `tokens.json`
- Moodboard in `moodboard/`
- Component specifications in `components/`
- Motion documentation in `motion/`

**Key Question:** "What does the user see and feel?"

---

## How Claude Participates

In this phase, Claude acts as a **visual design assistant**:

| Claude Does | Claude Doesn't |
|-------------|----------------|
| Propose color palettes with rationale | Use arbitrary/default values |
| Define systematic token scales | Skip token definition |
| Document component specifications | Build final components (that's Phase 04) |
| Ensure accessibility compliance | Ignore contrast requirements |
| Reference moodboard and brand | Make choices without justification |
| Create motion principles | Over-animate |

**Collaboration mode:** Options-first. Present visual choices for human approval before documenting.

---

## Core Principle: Tokens, Not Magic Numbers

Every visual decision becomes a token:
- Colors are tokens
- Spacing is tokens
- Typography is tokens
- Radius, shadow, motion—all tokens

**No raw values in components.** Everything references the token system.

---

## Step-by-Step Process

### Step 1: Moodboard Creation (60-90 min)

**Goal:** Gather visual references that inform the design direction.

**Input:** Brand adjectives, reference products, anti-patterns

**Process:**

1. **Review inputs**
   - Brand adjectives from brief
   - Reference products (what to steal)
   - Anti-patterns (what to avoid)

2. **Gather references**
   - Screenshots from reference products
   - Color palettes that match adjectives
   - Typography specimens
   - UI patterns that resonate
   - Photography/illustration styles (if applicable)

3. **Organize by category**
   - Color references
   - Typography references
   - Layout/spacing references
   - Component references
   - Motion references (links to examples)

4. **Document in `moodboard/`**
   - Save images with descriptive names
   - Create `moodboard/README.md` with annotations

**Output:** Populated `moodboard/` folder with `README.md`

**Claude's role:** Help analyze references, identify patterns, articulate why something works.

**Quality check:**
- [ ] References align with brand adjectives
- [ ] Anti-patterns are clearly excluded
- [ ] Enough variety to make informed decisions

---

### Step 2: Color System (45-60 min)

**Goal:** Define the complete color palette as tokens.

**Input:** Moodboard, brand adjectives

**Process:**

1. **Define color philosophy**
   - How does color support the brand?
   - What emotional response should colors evoke?
   - Light mode only? Dark mode too?

2. **Choose primary accent color**
   - NOT default blue unless justified
   - Test against brand adjectives
   - Check accessibility at various tints/shades

3. **Build surface colors**
   - Base (primary background)
   - Subtle (secondary background)
   - Muted (tertiary)
   - Inverse (dark/inverted)

4. **Build text colors**
   - Primary, secondary, muted, inverse
   - Ensure sufficient contrast with surfaces

5. **Define status colors**
   - Success, warning, error, info
   - Check they're distinguishable (including colorblind)

6. **Define accent colors**
   - Primary accent + hover state
   - Secondary accent (if needed)
   - Interactive states

7. **Check accessibility**
   - WCAG AA minimum (4.5:1 for text, 3:1 for large text/UI)
   - Test all text/surface combinations

**Output:** Color section of `tokens.json`

**Claude's role:** Propose palette options, check contrast ratios, justify choices.

**Quality check:**
- [ ] Colors are intentional, not default
- [ ] All combinations pass accessibility
- [ ] Palette feels cohesive
- [ ] Colors support brand adjectives

---

### Step 3: Typography System (45-60 min)

**Goal:** Define the type scale and choices as tokens.

**Input:** Moodboard, content strategy

**Process:**

1. **Define typography philosophy**
   - What should type feel like?
   - Speed/efficiency? Craft/premium? Warmth/approachable?

2. **Choose font families**
   - Primary (body text, UI)
   - Secondary (headings, if different)
   - Monospace (code, if needed)
   - Consider loading performance

3. **Define type scale**
   - Base size (typically 16px)
   - Scale ratio (1.25, 1.333, etc.)
   - Create size tokens: xs, sm, base, lg, xl, 2xl, 3xl, 4xl

4. **Define line heights**
   - Pair with each font size
   - Tighter for headings, looser for body

5. **Define font weights**
   - normal (400)
   - medium (500)
   - semibold (600)
   - bold (700)

6. **Create type presets (optional)**
   - heading-1, heading-2, heading-3
   - body, body-small
   - label, caption

**Output:** Typography section of `tokens.json`

**Claude's role:** Propose type choices, calculate scale, ensure readability.

**Quality check:**
- [ ] Type feels aligned with brand
- [ ] Hierarchy is clear (size + weight)
- [ ] Line heights are comfortable
- [ ] Fonts are web-safe or loadable

---

### Step 4: Spacing System (30-45 min)

**Goal:** Define the spacing scale as tokens.

**Input:** Wireframes, moodboard (density reference)

**Process:**

1. **Define spacing philosophy**
   - Dense and efficient?
   - Airy and breathable?
   - What's the base unit?

2. **Choose base unit**
   - Common: 4px or 8px
   - 4px gives more granularity
   - 8px gives fewer decisions

3. **Create scale**
   - Multipliers of base: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24
   - Example with 4px base: 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

4. **Define semantic aliases (optional)**
   - compact, normal, relaxed
   - inset-sm, inset-md, inset-lg

**Output:** Spacing section of `tokens.json`

**Claude's role:** Propose scale, ensure consistency with overall density.

**Quality check:**
- [ ] Scale covers all needed sizes
- [ ] Gaps between steps are logical
- [ ] Density matches brand feel

---

### Step 5: Additional Tokens (30-45 min)

**Goal:** Define radius, shadow, and motion tokens.

**Input:** Moodboard, brand adjectives

**Process:**

1. **Border radius**
   - Philosophy: Sharp? Soft? Rounded?
   - Scale: none, sm, md, lg, xl, full
   - Avoid excessive radius (AI aesthetic tell)

2. **Shadows**
   - Philosophy: Flat? Layered? Subtle?
   - Scale: none, sm, md, lg, xl
   - Consistent light source (typically top-left)
   - Avoid heavy shadows unless justified

3. **Motion durations**
   - instant (0ms)
   - fast (100ms) - micro-interactions
   - normal (200ms) - standard transitions
   - slow (300ms) - emphasis
   - slower (500ms) - complex animations

4. **Motion easing**
   - default (ease-in-out)
   - in (ease-in) - exits
   - out (ease-out) - enters
   - linear (for specific cases)

5. **Breakpoints**
   - sm, md, lg, xl
   - Match platform conventions

**Output:** Radius, shadow, motion sections of `tokens.json`

**Claude's role:** Propose values, ensure consistency with overall feel.

**Quality check:**
- [ ] Radius feels intentional
- [ ] Shadows have consistent light source
- [ ] Motion feels aligned with brand (snappy vs. smooth)

---

### Step 6: MAGENTA.md Documentation (45-60 min)

**Goal:** Create the visual design source of truth document.

**Input:** All token decisions, moodboard

**Process:**

1. **Document design inputs**
   - Brand adjectives (from brief)
   - Reference products
   - Anti-patterns

2. **Write UX principles**
   - 5 non-negotiables for this product
   - Derived from UX phase + brand

3. **Document visual language**
   - Color philosophy + summary
   - Typography philosophy + summary
   - Spacing philosophy + summary
   - Motion philosophy + summary

4. **Create Do/Don't rules**
   - Specific guidance to prevent generic AI aesthetic
   - Based on anti-patterns from brief

5. **Document accessibility baseline**
   - Contrast requirements
   - Focus state requirements
   - Touch target sizes
   - Motion considerations

**Output:** Completed `MAGENTA.md`

**Claude's role:** Draft documentation, ensure completeness, articulate rationale.

**Quality check:**
- [ ] Principles are specific, not generic
- [ ] Do/Don't rules are actionable
- [ ] All token categories are covered
- [ ] Accessibility is addressed

---

### Step 7: Component Specifications (60-90 min)

**Goal:** Document key components before development.

**Input:** Wireframes, tokens, content strategy

**Process:**

1. **Identify key components**
   - From wireframes, what reusable pieces exist?
   - Typically: Button, Input, Card, Navigation, etc.

2. **For each component, document:**
   - Purpose and when to use
   - Variants (primary, secondary, etc.)
   - States (default, hover, active, disabled, focus)
   - Sizes (if applicable)
   - Token usage (which tokens apply where)
   - Accessibility requirements

3. **Save in `components/` folder**
   - One file per component or component group

**Output:** Component specifications in `components/`

**Claude's role:** Draft specifications, ensure all states are covered.

**Quality check:**
- [ ] All states are defined
- [ ] Token references are correct
- [ ] Accessibility is addressed
- [ ] Edge cases are considered

---

### Step 8: Motion Documentation (30-45 min)

**Goal:** Define motion principles and key animations.

**Input:** Motion tokens, brand adjectives

**Process:**

1. **Document motion philosophy**
   - Fast and snappy? Smooth and elegant?
   - When to animate, when not to

2. **Define motion categories**
   - Micro-interactions (button feedback, toggles)
   - Transitions (page changes, modals)
   - Loading animations
   - Celebratory/feedback animations

3. **Create motion principles**
   - Duration by purpose
   - Easing by direction
   - Reduce motion considerations

4. **Document specific animations (optional)**
   - Key animations worth specifying

**Output:** Motion documentation in `motion/`

**Claude's role:** Draft motion principles, suggest appropriate durations/easings.

**Quality check:**
- [ ] Motion supports UX, doesn't distract
- [ ] Reduced motion is considered
- [ ] Principles are actionable

---

### Step 9: Gate Review

**Goal:** Verify readiness to proceed to Development phase.

**Checklist:**

- [ ] Moodboard exists and is annotated
- [ ] `tokens.json` is complete (all categories)
- [ ] `MAGENTA.md` is complete
- [ ] Key components are specified
- [ ] Motion principles are documented
- [ ] All token values are intentional (not defaults)
- [ ] Accessibility requirements are met (contrast, focus, etc.)
- [ ] You can explain every visual decision

**If all boxes checked:** Proceed to `04-development/SOP.md`

**If boxes unchecked:** Address gaps before proceeding

---

## Templates Reference

| Template | Purpose | When to Complete |
|----------|---------|------------------|
| `moodboard/README.md` | Visual reference annotations | Step 1 |
| `tokens.json` | Design token definitions | Steps 2-5 |
| `MAGENTA.md` | Visual design source of truth | Step 6 |
| `components/*.md` | Component specifications | Step 7 |
| `motion/*.md` | Motion documentation | Step 8 |

---

## Common Pitfalls

### Using defaults
"It's the default" is not a reason. Every choice needs justification.

### Skipping contrast checks
Test all color combinations. WCAG AA is the minimum.

### Over-designing tokens
Start minimal. You can add tokens later; removing is harder.

### Forgetting states
Every interactive element has: default, hover, active, focus, disabled.

### Generic AI aesthetic
Avoid: excessive gradients, gratuitous animations, generic blue, over-rounded corners.

### Tokens that don't get used
If a token isn't used, remove it. Every token should earn its place.

---

## Session Templates

### Session 1: Foundation (2-3 hours)
1. Moodboard creation (60 min)
2. Color system (45 min)
3. Typography system (45 min)

### Session 2: Details (2 hours)
1. Spacing system (30 min)
2. Radius, shadow, motion tokens (45 min)
3. MAGENTA.md documentation (45 min)

### Session 3: Components (2-3 hours)
1. Component specifications (90 min)
2. Motion documentation (30 min)
3. Gate review (15 min)

---

## Completion Checklist

```
□ Step 1: Moodboard created
□ Step 2: Color system defined
□ Step 3: Typography system defined
□ Step 4: Spacing system defined
□ Step 5: Additional tokens defined
□ Step 6: MAGENTA.md complete
□ Step 7: Key components specified
□ Step 8: Motion documented
□ Step 9: Gate review passed
```

**Phase 03 complete. Proceed to Phase 04-Development.**
