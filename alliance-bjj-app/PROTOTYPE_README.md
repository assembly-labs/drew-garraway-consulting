# Alliance BJJ App - Clickable Prototype

## Overview
This is a **UI/UX clickable prototype** with no functional backend code. All interactions are visual demonstrations only.

## What Has Been Modified

### ✅ Removed All Functional Code
- **NO** AsyncStorage or data persistence
- **NO** API calls or network requests
- **NO** Authentication or validation
- **NO** State management beyond UI display
- **NO** Security or bot protection logic

### 🎨 What Remains
- **Static HTML/CSS** interfaces
- **Visual navigation** between screens
- **Mock data** for display purposes
- **Click handlers** for UI transitions only
- **Responsive layouts** for mobile/desktop

## Project Structure

```
alliance-bjj-app/
│
├── prototype/                 # Static HTML Prototype (RECOMMENDED)
│   ├── owner/                # Admin dashboard interface
│   │   ├── dashboard.html
│   │   ├── members.html
│   │   ├── schedule.html
│   │   └── ...
│   │
│   ├── member/               # Member mobile interface
│   │   ├── home.html
│   │   ├── schedule.html
│   │   ├── checkin.html
│   │   └── ...
│   │
│   └── styles.css           # Design system (colors, spacing, etc)
│
└── alliance-mobile/          # React Native Prototype
    ├── context/
    │   └── AppContext.js    # Stripped to static mock data only
    ├── screens/
    │   └── LoginScreen.js   # Auto-login, no validation
    └── ...
```

## How to View the Prototypes

### Option 1: HTML Prototype (Recommended)
Simply open any HTML file in your browser:
```bash
# Owner/Admin Interface
open prototype/owner/dashboard.html

# Member Mobile Interface
open prototype/member/home.html
```

### Option 2: React Native Prototype
```bash
cd alliance-mobile
npm install
npm start
# Follow Expo instructions to open on device/simulator
```

## Key Features Demonstrated

### Owner/Admin Interface
- Dashboard with statistics cards
- Member management table
- Class schedule management
- Billing and payments
- Belt promotion workflows
- Settings and configuration

### Member Mobile Interface
- Home screen with personal stats
- Class schedule view
- QR code check-in screen
- Progress tracking with belt/stripes
- Profile management
- Payment history

## Design System

The prototype uses a comprehensive design system with:
- **Belt colors**: White, Blue, Purple, Brown, Black
- **Consistent spacing**: 4px base unit
- **Typography scale**: 12px to 32px
- **Card-based layouts**
- **Responsive breakpoints**: 375px (mobile), 768px+ (desktop)

## Important Notes

⚠️ **This is a PROTOTYPE only**
- All data is hardcoded/mock data
- Form submissions don't save anywhere
- Login accepts any credentials (or auto-logs in)
- Buttons navigate between screens but don't process data
- Perfect for demonstrating UX flow and visual design

## Next Steps

Once the UI/UX is approved through this prototype:
1. Finalize the design system
2. Implement actual backend API
3. Add real authentication
4. Connect to database
5. Implement business logic
6. Add security measures

## Support

This prototype is for demonstration purposes only. For questions about the actual implementation, please refer to the main project documentation.