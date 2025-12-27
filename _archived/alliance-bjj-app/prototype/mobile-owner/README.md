# Alliance BJJ Mobile Owner Prototype

## Overview
This is a clickable prototype of the mobile web app for gym owners. It demonstrates the user interface and navigation flow optimized for mobile devices (iPhone/Android).

## Access the Prototype
Open `index.html` in your browser or navigate directly to `dashboard.html`

## Pages Included

### Core Navigation (Bottom Tabs)
1. **Dashboard** (`dashboard.html`) - Home screen with overview of gym status
2. **Members** (`members.html`) - Member list with search and filters
3. **Schedule** (`schedule.html`) - Weekly class schedule view
4. **Quick Actions** (`quick-actions.html`) - Common tasks grid
5. **More** (`more.html`) - Settings, billing, and additional features

### Detail Pages
- **Member Detail** (`member-detail.html`) - Individual member information and actions

## Features Demonstrated

### Dashboard
- Critical alerts bar (failed payments)
- Today's snapshot (collapsible stats)
- Today's classes with quick check-in buttons
- Recent activity feed
- Promotion queue preview

### Members
- Search functionality (visual only)
- Belt rank filters
- Member cards with belt/stripe indicators
- Payment status indicators
- Tap to view member details

### Schedule
- Week navigation
- Day selector tabs
- Class list with enrollment counts
- Add class button

### Quick Actions
- 2x4 grid of common tasks
- Icon-based navigation
- Recent actions history

### More Menu
- Billing & Payments (with notification badge)
- Belt Promotions
- Reports & Analytics
- Settings
- Profile section with logout

## Design System
- Dark mode by default
- Alliance yellow (#FCD34D) as primary accent
- Belt colors preserved (industry standard)
- Bottom navigation for thumb-friendly access
- 44px minimum touch targets
- Optimized for 375-428px viewport width

## Navigation Flow
- All pages connect via bottom navigation
- Members list links to member detail page
- Back button on detail pages returns to list
- Alert/action buttons show placeholder alerts
- Consistent navigation state indicators

## Mobile Optimizations
- Fixed bottom navigation
- Sticky headers
- Collapsible sections
- Swipeable components (visual indicators)
- Pull-to-refresh ready (visual cue)
- Touch-friendly button sizes
- No hover states (touch only)

## Testing
Best viewed on:
- Mobile devices (iPhone/Android)
- Chrome DevTools mobile emulator (375px width)
- Safari Responsive Design Mode

## Notes
- This is a clickable prototype only - no backend functionality
- Forms and actions trigger alert messages
- Data shown is static/dummy content
- Optimized for portrait orientation
- PWA-ready structure for future implementation