# Interactive Overlay System Documentation

## Overview

The interactive overlay system enriches educational content with additional context without
cluttering the main reading flow. Users can click on marked references to reveal detailed
explanations, historical context, humor explanations, and real-world examples.

## Visual Design

### Inline Indicators

```html
Main text with [dotted underline + icon] ↓ click 📝 Popover Window
```

### Reference Types & Colors

- **🏛 Historical** (`ref--history`) - Burgundy (#6B2737) - Historical events and context
- **😏 Humor** (`ref--joke`) - Gold (#B08D57) - Explains jokes and witty references
- **💡 Context** (`ref--context`) - Navy (#002D62) - Deep dives and technical explanations
- **📊 Example** (`ref--example`) - Sage (#7C9885) - Real-world cases and data

## Implementation

### HTML Structure

```html
<!-- Basic reference trigger -->
<span
  class="ref ref--history"
  data-type="history"
  data-title="The Detroit Bankruptcy"
  data-content="In July 2013, Detroit filed for Chapter 9 bankruptcy..."
>
  Detroit circa 2013
</span>

<!-- Reference types -->
<span class="ref ref--history" data-type="history">historical reference</span>
<span class="ref ref--joke" data-type="joke">witty remark</span>
<span class="ref ref--context" data-type="context">technical detail</span>
<span class="ref ref--example" data-type="example">real example</span>
```

### CSS Classes

```css
.ref                 /* Base reference styling */
.ref--history        /* Historical reference */
.ref--joke          /* Humor explanation */
.ref--context       /* Additional context */
.ref--example       /* Real-world example */

.popover            /* Popover container */
.popover--history   /* Type-specific styling */
.popover.active     /* Active state */
```

## Content Examples

### Historical Context

```html
<span
  class="ref ref--history"
  data-type="history"
  data-title="Ford to City: Drop Dead"
  data-content="The Daily News headline from October 30, 1975, became one of the most famous in newspaper history..."
>
  President Ford's initial response
</span>
```

### Humor Explanation

```html
<span
  class="ref ref--joke"
  data-type="joke"
  data-title="Why Wealthy People Love Munis"
  data-content="The joke here is that municipal bonds are stereotypically associated with wealthy, older investors..."
>
  your wealthy uncle keeps talking about "munis"
</span>
```

### Technical Context

```html
<span
  class="ref ref--context"
  data-type="context"
  data-title="Why Tax Exemption Exists"
  data-content="The federal government exempts municipal bond interest from taxes to subsidize state and local infrastructure..."
>
  Uncle Sam decided to encourage infrastructure
</span>
```

### Real Example

```html
<span
  class="ref ref--example"
  data-type="example"
  data-title="Glamorous Municipal Projects"
  data-content="Real municipal bond proceeds at work: The Central Utah Water Conservancy District issued $75 million..."
>
  sewage treatment plants
</span>
```

## UX Features

### Interactions

- **Click**: Opens popover (all devices)
- **Hover**: Shows enhanced border on desktop
- **ESC Key**: Closes popover
- **Click Outside**: Closes popover
- **X Button**: Closes popover

### Accessibility

- Keyboard navigable
- ARIA labels on buttons
- Focus management
- High contrast colors
- Clear visual indicators

### Mobile Optimization

- Touch-friendly tap targets
- Responsive popover sizing (95% width on mobile)
- Smooth animations
- Easy dismissal

## JavaScript API

```javascript
// Show popover
function showPopover(element) {
  const type = element.dataset.type;
  const title = element.dataset.title;
  const content = element.dataset.content;
  // ... display logic
}

// Hide popover
function hidePopover() {
  backdrop.classList.remove('active');
  popover.classList.remove('active');
}
```

## Content Guidelines

### When to Use Interactive References

#### Historical Context (🏛)

- Historical events that provide background
- Past crises or notable cases
- Origin stories of regulations or practices
- "This happened because..." explanations

#### Humor/Wit (😏)

- Explains why something is funny or ironic
- Clarifies cultural references
- Unpacks industry inside jokes
- "The joke here is..." explanations

#### Deep Context (💡)

- Technical explanations that would break reading flow
- "Why this matters" content
- Complex concepts simplified
- Additional detail for curious readers

#### Real Examples (📊)

- Actual data and statistics
- Specific cases or companies
- Real-world applications
- Current market examples

### Writing Style

**Do:**

- Keep popover content concise (2-4 sentences ideal)
- Make it worth the click
- Add genuine value/insight
- Use conversational tone
- Include specific details

**Don't:**

- Simply repeat the main text
- Make every term clickable
- Use for basic definitions (use key-term highlighting instead)
- Break critical information flow
- Overuse (aim for 3-5 per major section)

## Performance Considerations

- Single popover element reused (not creating multiple DOMs)
- Efficient event delegation could be added for many references
- Smooth CSS transitions instead of JavaScript animations
- Lazy loading of content if needed for scale

## Future Enhancements

1. **Tooltip Preview**: Quick hover preview before full click
2. **Swipe Gestures**: Swipe between related popovers
3. **Reading Progress**: Track which references user has viewed
4. **Bookmarking**: Save interesting references
5. **Search**: Search within popover content
6. **Analytics**: Track which references get clicked most

## Testing Checklist

- [ ] Click opens popover
- [ ] ESC key closes popover
- [ ] Click outside closes popover
- [ ] X button closes popover
- [ ] Correct type styling applied
- [ ] Content displays properly
- [ ] Mobile responsive
- [ ] Keyboard accessible
- [ ] Smooth animations
- [ ] No layout shift

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- iOS Safari 12+
- Android Chrome
- No IE11 support (it's 2024)

---

## Quick Reference Card

| Type    | Icon | Color    | Use For                    |
| ------- | ---- | -------- | -------------------------- |
| History | 🏛   | Burgundy | Historical events, origins |
| Joke    | 😏   | Gold     | Humor explanations         |
| Context | 💡   | Navy     | Technical deep dives       |
| Example | 📊   | Sage     | Real-world cases           |

---

_System designed for Franklin Hugh Money SIE Study Materials_ _Version 1.0 - December 2024_
