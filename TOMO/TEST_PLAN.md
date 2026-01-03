# BJJ Journal - Mobile Test Plan

## Live URL

**Production:** https://bjj-journal.pages.dev

---

## IMPORTANT: Mobile-Only Testing

**This app is designed exclusively for mobile devices.**

### How to Test:
1. **On iPhone/Android** (Recommended): Open the URL directly in Safari/Chrome
2. **On Desktop**: Use Chrome DevTools mobile emulation:
   - Press F12 → Click device toolbar (📱 icon) → Select "iPhone 14 Pro"
   - Refresh the page after enabling device emulation

### Mobile Constraints:
- Max width: 430px (iPhone 14 Pro Max)
- Touch targets: Minimum 44px (48px for primary actions)
- No hover states - uses :active for touch feedback
- iOS PWA-ready (Add to Home Screen works)

---

## Pre-Test Setup

1. Open https://bjj-journal.pages.dev on your **mobile device**
2. For fresh testing: Clear localStorage (Settings → Clear Site Data)
3. Optional: Add to Home Screen for PWA experience

---

## Test Scenarios

### 1. Onboarding Flow

**Goal:** Verify new user can complete onboarding on mobile

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1.1 | Open app fresh (clear localStorage) | Welcome screen appears | |
| 1.2 | Tap name field | Keyboard appears, easy to type | |
| 1.3 | Select belt level | Belt selector is easy to tap (large targets) | |
| 1.4 | Complete onboarding | Redirects to Dashboard | |
| 1.5 | Close and reopen app | User remains logged in | |

---

### 2. Dashboard (Mobile Experience)

**Goal:** Verify dashboard is readable and tappable on mobile

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 2.1 | View Dashboard | Large hero number is visible and readable | |
| 2.2 | Scroll down | Smooth scrolling, no horizontal overflow | |
| 2.3 | Tap "Log Training" button | Button responds with visual feedback (scale down) | |
| 2.4 | Tap "Techniques" button | Navigates to technique library | |
| 2.5 | Tap a recent session | Opens session detail (if applicable) | |
| 2.6 | Check text readability | All text is readable (no tiny fonts) | |

---

### 3. Voice Logger (Mobile Core Feature)

**Goal:** Verify voice logging works on mobile

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 3.1 | Tap "Log Training" | Full-screen logger opens | |
| 3.2 | Tap close button (X) | Easy to tap, returns to previous screen | |
| 3.3 | Tap "Start Recording" | Button is large, responds to touch | |
| 3.4 | Recording state | Timer visible, waveform animates | |
| 3.5 | Tap "Done" | Button is large, easy to tap when tired | |
| 3.6 | Gi/No-Gi selection | Both buttons are large and easy to tap | |
| 3.7 | Review screen | Content fits on screen, scrollable | |
| 3.8 | Tap "Save" | Session saves, success screen appears | |

---

### 4. Tab Navigation (Mobile Bottom Bar)

**Goal:** Verify tab bar works like native iOS/Android

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 4.1 | View tab bar | Fixed at bottom, above safe area | |
| 4.2 | Tap each tab | Immediate response, correct screen loads | |
| 4.3 | Current tab indicator | Active tab clearly highlighted | |
| 4.4 | Tab touch targets | Easy to tap without hitting wrong tab | |
| 4.5 | Check safe area | Tab bar respects iPhone notch/home indicator | |

---

### 5. Session History (Mobile List)

**Goal:** Verify session list is browsable on mobile

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 5.1 | Navigate to Journal tab | Session list loads | |
| 5.2 | Scroll session list | Smooth scrolling | |
| 5.3 | Tap a session | Opens detail view | |
| 5.4 | Training type badges | Readable and colored correctly | |
| 5.5 | Empty state | Helpful message when no sessions | |

---

### 6. Profile & Settings (Mobile)

**Goal:** Verify profile screen works on mobile

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 6.1 | Tap profile avatar in header | Profile screen opens | |
| 6.2 | Back button works | Returns to previous tab | |
| 6.3 | Edit fields | Text inputs work, keyboard appears | |
| 6.4 | Toggle switches | Easy to tap and toggle | |
| 6.5 | Save changes | Changes persist after closing app | |

---

### 7. Technique Library (Mobile Search)

**Goal:** Verify technique browsing works on mobile

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 7.1 | Navigate to Techniques tab | Library loads | |
| 7.2 | Tap search field | Keyboard appears | |
| 7.3 | Type "armbar" | Results filter correctly | |
| 7.4 | Tap a technique | Detail view opens | |
| 7.5 | Scroll technique list | Smooth scrolling | |

---

### 8. Touch Interactions

**Goal:** Verify all touch targets are properly sized

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 8.1 | Close buttons (X icons) | 44px minimum, easy to tap | |
| 8.2 | Primary action buttons | 48-56px height, prominent | |
| 8.3 | Form inputs | Easy to tap and focus | |
| 8.4 | Tab bar items | Easy to tap correct tab | |
| 8.5 | No accidental taps | Adequate spacing between elements | |
| 8.6 | Active state feedback | Buttons scale/dim when pressed | |

---

### 9. Mobile-Specific Features

**Goal:** Verify iOS/Android optimizations

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 9.1 | Pull to refresh | No browser refresh interferes | |
| 9.2 | Add to Home Screen (iOS) | App icon appears, launches fullscreen | |
| 9.3 | Safe areas | Content respects notch/home indicator | |
| 9.4 | Landscape orientation | App still usable (if rotated) | |
| 9.5 | Zoom disabled | No accidental zoom on double-tap | |
| 9.6 | Keyboard behavior | No layout shift when keyboard appears | |

---

### 10. Performance (Mobile)

**Goal:** Verify app is fast on mobile

| Check | Target | Pass/Fail |
|-------|--------|-----------|
| Initial load | < 3 seconds on 4G | |
| Tab switch | Instant (< 100ms) | |
| Scroll performance | 60fps, no jank | |
| Voice logger open | < 500ms | |
| Session save | < 1 second | |

---

## Device Compatibility

### Primary Test Devices:
| Device | iOS/Android Version | Status | Notes |
|--------|---------------------|--------|-------|
| iPhone 14 Pro | iOS 17+ | | Primary target |
| iPhone SE | iOS 15+ | | Small screen test |
| iPhone 15 Pro Max | iOS 17+ | | Large screen test |

### Secondary (if available):
| Device | Version | Status | Notes |
|--------|---------|--------|-------|
| Samsung Galaxy S23 | Android 13+ | | |
| Pixel 7 | Android 14+ | | |

---

## Browser Compatibility

| Browser | Priority | Status | Notes |
|---------|----------|--------|-------|
| Safari iOS | Critical | | Primary target |
| Chrome iOS | High | | |
| Chrome Android | High | | |
| Samsung Internet | Medium | | |

---

## Known Prototype Limitations

- **No real authentication** - Data is device-local (localStorage)
- **No backend sync** - Sessions only on this device
- **Mock voice transcription** - Real AssemblyAI integration in iOS build
- **No push notifications** - Coming in iOS TestFlight build

---

## Test Completion Sign-off

**Tester Name:** ______________________

**Device Used:** ______________________

**Date:** ______________________

**Overall Result:** [ ] APPROVED FOR SHARING / [ ] NEEDS FIXES

### Critical Issues (Blocking):
1.
2.
3.

### Minor Issues (Non-blocking):
1.
2.
3.

### Feedback/Suggestions:
1.
2.
3.

---

## Next Steps After Approval

1. **Share URL** with 3-5 testers: https://bjj-journal.pages.dev
2. **Collect feedback** via messages or form
3. **Prioritize fixes** based on severity
4. **Proceed to iOS TestFlight** build (React Native + Expo)
