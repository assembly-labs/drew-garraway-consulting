# Insights Screen

Weekly training insights generated from your session data. Shows patterns, progress, and things to watch.

**Code:** `tomo/src/screens/InsightsScreen.tsx`
**Tab:** Insights (third tab)

## Elements

### Screen Title
- "Insights" (Unbounded ExtraBold, 28px, white)

### Pre-Insight State (new users or < 7 days)
- Shown when there's not enough data yet
- Typewriter animation text: "Building your training insights..."
- Subtitle explaining that insights appear after a few sessions
- Gold typewriter cursor

### Latest Week Card (primary content)
- **Period Label:** Date range, e.g., "Mar 26 - Apr 1"
- **Insight Paragraphs:** Sequential text blocks with typewriter animation on first view
  - Uses "Ember Text" animation: gold trailing glow (12 characters) that fades to gray as text completes
  - Bold text supported within paragraphs
  - **Normal paragraphs:** Gray text on dark background
  - **Risk/Watch paragraphs:** Gold background with left border, flagging things worth discussing with your coach
  - **Defer notes:** Subtle hints below certain paragraphs
- **Focus Next Callout:** Gold-accented section highlighting what to work on next week

### Older Insights (collapsible)
- "Older insights" section header
- Collapsed by default
- List of prior weeks, each tappable to expand
- Shows the same paragraph format as Latest Week

### Loading State
- Skeleton loader with animated gray bars
- Mimics the layout of insight paragraphs

### Error State
- Error card with description
- "Retry" button

### Pull to Refresh
- Pull down to refresh insights
- Gold-tinted refresh spinner
