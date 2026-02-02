# Prosthetics Learning Site

An interactive, multi-page educational website about prosthetic arms and legs designed for a 4th-grade audience with a sports focus.

## Opening the Site

This is a static HTML/CSS/JS site with no build step required.

1. Open `index.html` in any modern web browser
2. Navigate through the 6 learning sections + videos page
3. Progress is saved automatically in your browser (localStorage)

To run a local server (optional, for best experience):

```bash
# Python 3
cd prosthetics-learning-site
python3 -m http.server 8000
# Then open http://localhost:8000

# Node.js (if npx available)
npx serve .
```

## Project Structure

```
prosthetics-learning-site/
├── index.html                        # Homepage with section cards & progress
├── css/
│   └── styles.css                    # All styles (responsive, print, accessible)
├── js/
│   └── script.js                     # Progress tracking, quizzes, interactives
├── images/                           # Placeholder directory for future images
└── pages/
    ├── how-body-works.html           # Section 1: Brain, nerves, muscles
    ├── mechanical-prosthetics.html   # Section 2: Body-powered prosthetics
    ├── running-blades.html           # Section 3: Carbon fiber blades
    ├── bionic-arms.html              # Section 4: Myoelectric / Hero Arm
    ├── athletes.html                 # Section 5: Paralympic athlete profiles
    ├── future-tech.html              # Section 6: Innovations & customizer
    └── videos.html                   # Curated video resources
```

## Features

- **Progress Tracking** - localStorage saves which sections are completed
- **Quiz System** - 3 multiple-choice questions per section with instant feedback
- **Achievement Badges** - Earned by completing sections, acing quizzes, bookmarking facts
- **Bookmark System** - Save interesting facts for later
- **Advanced Info Toggle** - Extra content for curious learners
- **Print-Friendly** - Clean print stylesheet for any page
- **Mobile Responsive** - Works on tablets and phones
- **Accessible** - ARIA labels, keyboard navigation, skip links, focus styles
- **Prosthetic Customizer** - Interactive "Design Your Own" tool on Future Tech page

## Tech Stack

- Semantic HTML5
- CSS3 (Grid, Flexbox, Custom Properties)
- Vanilla JavaScript (no frameworks)
- localStorage for persistence

## Suggested Next Steps

### Images to Add

Replace the placeholder `<div class="image-placeholder">` elements with real images:

- **How Body Works**: Diagram of brain-to-muscle nerve pathway; biceps/triceps illustration
- **Mechanical Prosthetics**: Body-powered arm with labeled harness/cable/hook; socket cross-section
- **Running Blades**: Labeled running blade anatomy; cheetah leg comparison; Ossur Flex-Foot Cheetah
- **Bionic Arms**: Hero Arm product photos (Open Bionics has press images); EMG sensor close-up
- **Athletes**: Photos of Hunter Woodhall, Ezra Frech, Jessica Long, Amy Purdy, Hugh Herr (check press kits or Creative Commons sources)
- **Future Tech**: MiniTouch device; PSYONIC Ability Hand; 3D-printed prosthetic hand; e-NABLE volunteers

Recommended image sources:
- [Unsplash](https://unsplash.com) - Free high-quality photos
- [Open Bionics Press Kit](https://openbionics.com) - Hero Arm images
- [Ossur Media](https://www.ossur.com) - Running blade images
- [Paralympic.org](https://www.paralympic.org) - Athlete photos
- [Wikimedia Commons](https://commons.wikimedia.org) - Creative Commons images

### Videos to Embed

The Videos page currently links out to external sites. To embed directly:

1. For YouTube videos, replace the thumbnail `<a>` tags with `<iframe>` embeds
2. For TED talks, use TED's embed code from each talk page
3. Consider adding `loading="lazy"` to iframes for performance

### Additional Enhancements

- Add a service worker for offline support
- Add Web Animations API for the brain signal visualization
- Add a glossary page with prosthetics vocabulary
- Add a "Resources for Parents/Teachers" section
- Consider adding text-to-speech for younger readers
