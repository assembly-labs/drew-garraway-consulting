# Drew Garraway Consulting - Visual Style Guide

## 🎨 Brand Identity

**Visual Theme:** Luxury Tech Gradient
**Aesthetic:** Sophisticated yet energetic, professional yet creative
**Inspiration:** Premium tech brands, bold startups, creative technologists

---

## Color Palette

### Primary Gradient Colors

```css
--indigo-deep: #1E1B4B;      /* Sophistication, depth, foundation */
--purple-rich: #4C1D95;       /* Creativity, transition, innovation */
--magenta-vibrant: #C026D3;   /* Energy, boldness, impact */
--coral-pink: #FB7185;        /* Warmth, approachability, action */
```

### Gradient Definitions

**Main Brand Gradient (Full Spectrum):**
```css
background: linear-gradient(135deg, #1E1B4B 0%, #4C1D95 35%, #C026D3 70%, #FB7185 100%);
```
*Use for: CTA sections, hero backgrounds (subtle), major section dividers*

**Subtle Background Gradient:**
```css
background: linear-gradient(135deg, #1E1B4B 0%, #4C1D95 100%);
```
*Use for: Hero sections, modal backgrounds, card backgrounds*

**Accent Gradient (Calls to Action):**
```css
background: linear-gradient(90deg, #C026D3 0%, #FB7185 100%);
```
*Use for: Buttons, links, highlights, statistics, interactive elements*

**Text Gradient (Primary):**
```css
background: linear-gradient(90deg, #4C1D95, #C026D3, #FB7185);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```
*Use for: H1 headings, major section titles*

**Text Gradient (Reverse):**
```css
background: linear-gradient(90deg, #FB7185, #C026D3, #4C1D95);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```
*Use for: H2 section headers, alternating sections*

---

## Typography Hierarchy

### Headings

**H1 - Main Hero Heading**
- Font Size: `clamp(2.5rem, 8vw, 5rem)`
- Font Weight: 900
- Treatment: Full gradient text
- Color Fallback: `#C026D3`

**H2 - Section Headers**
- Font Size: `clamp(2rem, 4vw, 3rem)`
- Font Weight: 800
- Treatment: Reverse gradient text
- Color Fallback: `#FB7185`

**H3 - Card/Service Titles**
- Font Size: `1.5rem`
- Font Weight: 700
- Treatment: Solid white
- Color: `#ffffff`

### Body Text

**Paragraph - Primary**
- Font Size: `clamp(1.1rem, 2vw, 1.3rem)`
- Color: `rgba(255, 255, 255, 0.9)`
- Line Height: 1.8

**Paragraph - Secondary**
- Font Size: `1rem`
- Color: `rgba(255, 255, 255, 0.8)`
- Line Height: 1.7

### Highlights & Accents

**Inline Highlights**
```css
.highlight {
    background: linear-gradient(90deg, #C026D3, #FB7185);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 600;
}
```

**Statistics/Metrics**
```css
.service-stat {
    background: linear-gradient(90deg, #C026D3, #FB7185);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 600;
}
```

---

## Component Styles

### Buttons

**Primary CTA Button**
```css
.cta-button {
    background: rgba(255, 255, 255, 0.95);
    color: #1E1B4B;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    font-weight: 600;
    border-radius: 6px;
    box-shadow: 0 4px 20px rgba(251, 113, 133, 0.3);
    transition: all 0.3s ease;
}

.cta-button:hover {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 10px 40px rgba(251, 113, 133, 0.5);
    transform: translateY(-2px);
}
```

### Cards

**Service Card**
```css
.service-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(192, 38, 211, 0.2);
    padding: 2rem;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.service-card:hover {
    border-color: rgba(251, 113, 133, 0.4);
    background: rgba(78, 29, 149, 0.05);
    transform: translateY(-5px);
}
```

---

## Usage Guidelines

### ✅ DO Use Gradients For:

1. **Main headings (H1, H2)** - Creates visual hierarchy and brand recognition
2. **CTA sections** - Full gradient backgrounds grab attention
3. **Statistics and highlights** - Emphasizes key metrics
4. **Card borders** - Subtle sophistication without overwhelming
5. **Interactive elements on hover** - Provides visual feedback
6. **Section dividers** - Gradient lines create flow

### ❌ DON'T Use Gradients For:

1. **Body text** - Readability nightmare, accessibility issue
2. **Small text under 18px** - Can't be read properly
3. **Backgrounds at full opacity** - Too overwhelming, causes eye strain
4. **Navigation elements** - Keep functional elements simple
5. **Form inputs** - Accessibility and usability concerns
6. **Every single element** - Less is more; strategic use creates impact

### ⚖️ Balance Principles

1. **60-30-10 Rule**
   - 60%: Dark backgrounds (black, indigo)
   - 30%: White/light text
   - 10%: Gradient accents

2. **Hierarchy Through Gradient**
   - Most important: Full gradient text
   - Important: Gradient border/accent
   - Supporting: Subtle gradient background

3. **Animation Restraint**
   - Use subtle hover transitions (0.3s)
   - Animate position, not color shifts (performance)
   - One animated element per viewport

---

## Accessibility Standards

### Contrast Ratios

- **Body Text**: 4.5:1 minimum (white on dark backgrounds) ✅
- **Large Text (24px+)**: 3:1 minimum ✅
- **Interactive Elements**: Clear focus indicators required
- **Gradient Text**: Only use on large headings (24px+)

### Fallback Colors

Always provide solid color fallbacks for gradient text:

```css
.gradient-text {
    /* Fallback for browsers without gradient support */
    color: #C026D3;

    /* Gradient for modern browsers */
    background: linear-gradient(90deg, #1E1B4B, #4C1D95, #C026D3, #FB7185);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
```

### Browser Compatibility

- Use both `-webkit-background-clip` and `background-clip`
- Use both `-webkit-text-fill-color: transparent` and `color: transparent`
- Test on Safari, Chrome, Firefox, Edge

---

## Animation Guidelines

### Subtle Gradient Shift (Optional Enhancement)

```css
@keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.animated-gradient {
    background: linear-gradient(90deg, #1E1B4B, #4C1D95, #C026D3, #FB7185);
    background-size: 200% 200%;
    animation: gradientShift 8s ease infinite;
}
```

**Use sparingly:** Only for hero sections or major CTAs, never for body content.

---

## Implementation Checklist

When applying this style guide to new pages/projects:

- [ ] Import CSS variables from main stylesheet
- [ ] Apply gradient backgrounds to hero sections (subtle)
- [ ] Use gradient text on H1 and H2 only
- [ ] Add gradient borders to cards/interactive elements
- [ ] Apply accent gradient to statistics and highlights
- [ ] Use full gradient background for CTA sections
- [ ] Test contrast ratios for accessibility
- [ ] Verify fallback colors display correctly
- [ ] Test on multiple browsers (Chrome, Safari, Firefox, Edge)
- [ ] Verify mobile responsiveness

---

## Brand Voice Alignment

The gradient palette reflects the brand voice:

- **Deep Indigo → Rich Purple**: "I Ship Ideas and Products" (sophisticated, deep foundation)
- **Vibrant Magenta**: "Not PowerPoints and Fluff" (bold, energetic, action-oriented)
- **Coral Pink**: "Ready to ship something real?" (warm, approachable, human)

---

**Last Updated:** 2025-10-16
**Maintained By:** Drew Garraway
**Version:** 1.0
