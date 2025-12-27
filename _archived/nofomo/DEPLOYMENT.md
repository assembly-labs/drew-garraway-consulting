# NO FOMO - Deployment Guide

## Prerequisites
- Node.js 18+ and npm
- Polygon.io API key (free tier or paid)

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Polygon API key:
```
VITE_POLYGON_API_KEY=your_polygon_api_key_here
```

## Build for Production

```bash
npm install
npm run build
```

This creates a `dist/` folder with optimized production files.

## Deployment Options

### Option 1: GitHub Pages (Recommended)

The repository is configured for GitHub Pages deployment:

1. Push to main branch
2. GitHub Actions will automatically build and deploy to GitHub Pages
3. Access at: `https://[username].github.io/nofomo/`

### Option 2: Vercel

1. Connect repository to Vercel
2. Set environment variable: `VITE_POLYGON_API_KEY`
3. Deploy with default settings

### Option 3: Netlify

1. Connect repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variable in Netlify dashboard

### Option 4: Static Hosting (S3, etc.)

Upload contents of `dist/` folder to your static hosting provider.

## API Limitations (Free Tier)

The Polygon.io free tier has date limitations:
- **Cryptocurrency**: October 2023 - Present
- **Stocks**: Last 5 years (2020 - Present)

For historical data before these dates, upgrade to a paid Polygon plan.

## Configuration

### Update Date Limits
Edit `src/config.js` to adjust date constraints:
```javascript
DATE_LIMITS: {
  crypto: { min: '2023-10' },
  stocks: { min: '2020-01' }
}
```

### Base URL Configuration
If deploying to a subdirectory, update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/your-subdirectory/',
  // ...
})
```

## Testing Production Build Locally

```bash
npm run preview
```

This serves the production build locally at http://localhost:4173

## Troubleshooting

### API Key Issues
- Ensure API key is set in environment variables
- Check Polygon.io dashboard for API usage limits
- Verify API key has necessary permissions

### Date Range Errors
- The app enforces strict date limits based on API plan
- Users cannot select dates outside supported ranges
- Dates auto-adjust when switching between crypto/stocks

### Build Issues
- Clear cache: `rm -rf node_modules dist && npm install`
- Ensure Node.js version is 18+
- Check for TypeScript/ESLint errors

## Performance Notes

- Initial bundle size: ~670KB (199KB gzipped)
- Consider code splitting for larger deployments
- Chart library (Recharts) is the largest dependency

## Security

- Never commit `.env` file with real API keys
- Use environment variables in production
- Consider implementing rate limiting for API calls
- Add CORS configuration if needed

## Support

For issues related to:
- API data: Check Polygon.io documentation
- Deployment: See provider-specific documentation
- Application bugs: Open GitHub issue