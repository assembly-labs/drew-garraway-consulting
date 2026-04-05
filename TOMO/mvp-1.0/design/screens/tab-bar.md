# Tab Bar

Bottom navigation bar visible on all main app screens.

**Code:** `tomo/src/navigation/MainTabNavigator.tsx`

## Elements

### Tab Bar Container
- Fixed at bottom of screen
- Black background
- Thin gray border on top (1px)
- Height: 88px (includes safe area padding)

### Journal Tab (position 1, left)
- Label: "JOURNAL" (uppercase, monospace, 12px)
- Icon: Journal icon
- Active: gold icon + gold text
- Inactive: gray icon + gray text
- Tap: Opens Journal List

### Log Button (position 2, center)
- Large gold circle (70x70px)
- White plus icon inside (35px)
- Elevated above the tab bar with shadow
- No text label
- Tap: Opens Session Logger (Entry Phase or Recording Phase depending on preference)

### Insights Tab (position 3)
- Label: "INSIGHTS" (uppercase, monospace, 12px)
- Icon: Trend-up arrow icon
- Active: gold icon + gold text
- Inactive: gray icon + gray text
- Tap: Opens Insights Screen

### Profile Tab (position 4, right)
- Label: "PROFILE" (uppercase, monospace, 12px)
- Icon: Person icon
- Active: gold icon + gold text
- Inactive: gray icon + gray text
- Tap: Opens Profile Screen
