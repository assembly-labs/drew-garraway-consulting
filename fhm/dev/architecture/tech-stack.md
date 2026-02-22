# Technology Stack

## Franklin Hugh Money

---

## Core Technologies

### Frontend Framework

**Current**: Vanilla HTML/CSS/JS **Future Consideration**: 11ty or Astro for static site generation
**Rationale**: Start simple, scale when needed

### Styling

**Primary**: Tailwind CSS v3.x **Methodology**: BEM for custom components **Preprocessor**: PostCSS
**Rationale**: Utility-first with component structure

### JavaScript

**Version**: ES6+ Modules **Framework**: None (vanilla) **Bundler**: Vite (when needed)
**Rationale**: Progressive enhancement, no framework lock-in

### Content Management

**Format**: Markdown with frontmatter **Processor**: Marked.js or similar **Storage**: File-based
**Rationale**: Developer-friendly, version controlled

---

## Infrastructure

### Hosting

**Platform**: Cloudflare Pages **CDN**: Cloudflare **Domain**: drewgarraway.com/fhm **SSL**:
Cloudflare automatic

### Version Control

**Platform**: GitHub **Strategy**: main/dev branches **CI/CD**: GitHub Actions → Cloudflare Pages

### Analytics

**Service**: Plausible or Fathom **Rationale**: Privacy-focused, lightweight **Implementation**:
Single script tag

---

## Development Tools

### Build Tools

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src/**/*.js",
    "format": "prettier --write ."
  }
}
```

### Code Quality

- **Linter**: ESLint with custom config
- **Formatter**: Prettier
- **Git Hooks**: Husky for pre-commit
- **Testing**: Vitest (when needed)

### Editor Config

```editorconfig
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```

---

## Performance Targets

### Core Web Vitals

- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

### Bundle Size

- **CSS**: < 50kb (gzipped)
- **JS**: < 30kb per page (gzipped)
- **Images**: WebP with fallbacks

### Optimization

- Lazy loading for images
- Code splitting for routes
- Preconnect to critical origins
- Service worker for offline

---

## Security Measures

### Headers

```http
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
```

### Bot Protection

- robots.txt blocking all crawlers
- No sitemap.xml on this domain
- Linked only from main site

---

## Browser Support

### Minimum Versions

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers last 2 versions

### Progressive Enhancement

- Core content works without JS
- CSS Grid with Flexbox fallbacks
- Modern JS with polyfills where critical

---

## Future Considerations

### Potential Additions

1. **Comments**: Giscus (GitHub discussions)
2. **Search**: Algolia or lunr.js
3. **Newsletter**: ConvertKit or Ghost
4. **Payments**: Stripe for premium content
5. **API**: Express.js for dynamic features

### Scaling Strategy

1. **Phase 1**: Static site (current)
2. **Phase 2**: Static site generator
3. **Phase 3**: JAMstack with API
4. **Phase 4**: Full application if needed

---

_Last Updated: 2024-12-05_
