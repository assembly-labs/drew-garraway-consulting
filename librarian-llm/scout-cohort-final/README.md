# Scout Librarian Cohort Recruitment Materials
**Version 2.0 - Modern Design System**
**Last Updated:** December 4, 2024

## 📁 Folder Structure

```
scout-cohort-final/
├── README.md                    # This file
├── modern/                      # Current production-ready files
│   ├── cohort-generic.html      # General recruitment page
│   └── cohort-template.html     # Customizable template
├── examples/                    # Example implementations
│   └── cohort-tredyffrin-example.html  # Tredyffrin Public Library
└── legacy/                      # Previous versions (archived)
    ├── librarian-cohort-generic.html
    ├── librarian-cohort-template.html
    └── librarian-cohort-tredyffrin.html
```

## 🎨 Design System Features

### Brand Colors
- **Navy (#1A3E67)** - Primary brand color for headers and CTAs
- **Sage (#83A07F)** - Success states and positive messaging
- **Coral (#F2895E)** - Attention and accent elements
- **Cream (#FAFAF9)** - Warm page background

### Typography
- **Headings:** Plus Jakarta Sans (700-800 weight)
- **Body Text:** Crimson Pro (400 weight)
- **Responsive Sizing:** Uses clamp() for fluid typography

### Modern UI Elements
- Glassmorphism cards with subtle gradients
- Smooth animations and micro-interactions
- Hover effects with scale and shadow transitions
- Animated conversation bubbles
- Gradient text effects for statistics

## 🚀 Quick Start Guide

### For General Outreach
Use **`modern/cohort-generic.html`**
- Ready to post on website
- Can be emailed to multiple libraries
- Fully self-contained with embedded styles

### For Personalized Outreach

1. **Open** `modern/cohort-template.html`
2. **Replace** these variables with library-specific information:
   ```
   {{LIBRARY_NAME}}        Full library name
   {{LIBRARY_SHORT}}       Short name or acronym
   {{COMMUNITY_DESC}}      Community description
   {{PATRON_COUNT}}        Number of patrons served
   {{UNIQUE_FEATURE}}      Notable program or service
   {{ILS_SYSTEM}}          Their ILS platform
   {{DIRECTOR_NAME}}       Director's name (if known)
   {{SPECIFIC_CHALLENGE}}  Known pain point
   {{WHY_SELECTED}}        Why this library specifically
   ```
3. **Remove** the yellow instruction box at the top
4. **Save** with a library-specific filename
5. **Send** via email or host online

### Example Implementation
See **`examples/cohort-tredyffrin-example.html`** for a fully personalized version showing:
- Local references (Valley Forge, Chester County)
- Specific programs (STEM initiatives)
- Targeted pain points
- Community-relevant examples

## 📧 Email Template

```
Subject: Invitation: Help Shape the Future of Library Discovery

Dear [Director Name],

I'm reaching out with an exclusive invitation for [Library Name] to join Scout's founding librarian cohort—a small group of innovative libraries shaping AI-powered patron discovery.

We specifically selected [Library Name] because [specific reason].

The attached invitation provides full details about this opportunity to co-create tools that respect library values while solving real patron needs.

Time commitment: 15-20 hours over 4-8 weeks (January-February 2025)
Compensation: $3K-8K pending IMLS grant approval

Would you be interested in a brief conversation to discuss how this could benefit [Library Name]?

Best regards,
Drew Garraway
Scout Co-Founder
drew@scout-library.com
```

## ✨ What's New in Version 2.0

### Visual Improvements
- ✅ Implemented Scout/Librarian LLM design system
- ✅ Modern glassmorphism and gradient effects
- ✅ Enhanced typography hierarchy
- ✅ Improved color contrast and accessibility
- ✅ Smooth animations and transitions

### Content Updates
- ✅ More authentic librarian voice
- ✅ Clearer value propositions
- ✅ Better organized information flow
- ✅ Stronger CTAs with visual hierarchy

### Technical Enhancements
- ✅ Fully responsive design
- ✅ Print-friendly styles
- ✅ Optimized for email distribution
- ✅ Cross-browser compatibility
- ✅ Accessibility compliance (WCAG)

## 🛠 Technical Notes

### File Specifications
- **Format:** Self-contained HTML with embedded CSS
- **Size:** ~37-38KB per file (email-friendly)
- **Dependencies:** Google Fonts (optional, degrades gracefully)
- **Browser Support:** All modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile:** Fully responsive design

### Customization Tips
- Test on actual devices before sending
- Preview in email clients if sending as attachment
- Consider hosting online for easier sharing
- Print to PDF for board presentations

## 📞 Support

For questions or customization help:
- **Email:** drew@scout-library.com
- **Project:** Scout Library Discovery

---

*Building WITH librarians, not for them.*