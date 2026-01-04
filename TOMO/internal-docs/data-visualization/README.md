# Data Visualization Components

Interactive examples of infographic components for the TOMO BJJ training app.

## Quick Start

Open `index.html` in a browser to view all visualization examples.

## Contents

| File | Purpose |
|------|---------|
| `index.html` | Interactive gallery with working examples of all visualization types |
| `INFOGRAPHIC_STRATEGY.md` | Strategy document outlining 22+ visualization types with rationale |

## Visualization Tiers

### Tier 1 - High Priority (Confidence 9-10)
Proven patterns from fitness apps. Implement first.

| Component | Belt Level | Description |
|-----------|------------|-------------|
| **Weekly Progress Ring** | All | Apple Watch-style circular progress toward weekly goal |
| **Calendar Heat Map** | White | GitHub-style contribution graph for training consistency |
| **Dashboard Summary Card** | All | Key metrics at-a-glance (sessions, hours, streak, belt) |
| **Belt Progression Checklist** | White | Visual checklist showing path to next belt |
| **Goal Progress Bars** | All | Linear progress indicators for active goals |

### Tier 2 - Medium-High Priority (Confidence 7-8)
Adapted patterns requiring BJJ-specific implementation.

| Component | Belt Level | Description |
|-----------|------------|-------------|
| **Session Type Distribution** | Blue+ | Donut chart showing gi/no-gi/open mat balance |
| **Training Frequency Trend** | Blue | Line chart with rolling averages over months |
| **Technique Coverage Matrix** | Blue | Position x Category grid with mastery levels |
| **Sparring Pattern Analysis** | Purple | Bar charts for submission exchange rates |
| **Milestone Timeline** | All | Achievement history with dates |

### Tier 3 - Advanced (Confidence 6-7)
Complex visualizations requiring careful mobile optimization.

| Component | Belt Level | Description |
|-----------|------------|-------------|
| **Positional Radar Chart** | Purple | Spider chart for game balance analysis |
| **Coach Feedback Timeline** | Brown | Theme evolution over time |
| **Position Transition Flow** | Purple/Brown | Sankey diagram (desktop recommended) |

## Design System Integration

All components use TOMO design tokens from `../design-system/styles.css`:

- **Colors**: `--color-gold`, `--color-positive`, `--color-negative`
- **Typography**: Unbounded for numbers, Inter for text, JetBrains Mono for labels
- **Spacing**: 4px base unit system
- **Dark theme**: `#111111` background

## Implementation Notes

### For Prototype Integration

When moving components to the React prototype:

1. Extract the relevant CSS into component-level styles
2. Replace mock data with real data from services
3. Use `useBeltPersonalization()` hook to show appropriate visualizations per belt level

### Mobile Optimization

- Progress rings work well at all sizes
- Heat maps need horizontal scroll on mobile
- Radar charts need careful axis label placement
- Consider simplifying complex charts for mobile

### Progressive Disclosure

From the strategy document:
- **White Belt**: 3-4 visualizations max
- **Blue Belt**: Add 2-3 more
- **Purple Belt**: Add 2-3 advanced analytics
- **Brown Belt**: Add teaching/mastery focus

Never show more than 4-6 charts at once on mobile.

## Related Files

- `/internal-docs/design-system/` - Design tokens and styles
- `/prototype/src/config/belt-system/` - Belt personalization engine
- `/internal-docs/product/STATS_MODULE_STRATEGY.md` - Stats module planning
