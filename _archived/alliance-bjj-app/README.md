# Alliance BJJ Platform - Clickable Prototype

## 🥋 Overview
A wireframe-level clickable prototype for the Alliance BJJ gym management platform. This prototype demonstrates the user interface and navigation flow for both gym owners and members.

## 📁 Structure

```
/prototype
├── index.html          → Entry point (redirects to dashboard)
├── styles.css          → All styling
├── /owner              → Gym owner/admin screens (9 files)
│   ├── dashboard.html
│   ├── members.html
│   ├── member-detail.html
│   ├── schedule.html
│   ├── billing.html
│   └── [+ modals]
└── /member             → Member mobile app screens (7 files)
    ├── home.html
    ├── schedule.html
    ├── checkin.html
    ├── progress.html
    └── profile.html
```

## 🚀 How to View

Simply open the HTML files directly in your browser:

1. Navigate to the `prototype` folder
2. Double-click `index.html` to start
3. Navigate through the screens using the sidebar (owner) or tab bar (member)

### Key Screens:
- **Owner Dashboard**: Start at `prototype/index.html`
- **Member App**: Open `prototype/member/home.html`

## 🎯 Features Demonstrated

- **Belt progression tracking** with stripe indicators
- **Class scheduling** with Gi/No-Gi distinction
- **Member management** with promotion workflows
- **Payment tracking** with failed payment alerts
- **QR code check-in** system
- **Mobile-first member experience** (375px width)

## 📝 Mock Data

The prototype uses consistent mock data throughout:
- Gym: Alliance BJJ Paoli
- Owner: Professor Mike Santos
- Sample member: John Smith (Blue Belt, 3 stripes)
- 156 active members
- $23,450 monthly revenue

## 🔒 Security

This prototype is protected from web crawlers and indexing:
- All HTML files include noindex meta tags
- robots.txt blocks all crawlers
- .htaccess provides additional protection

---

**Note:** This is a static HTML prototype with no backend functionality. All data is hardcoded for demonstration purposes.