# NO FOMO - The Investment Time Machine

See what your investments would be worth if you'd bought them at different times. A reality check for your financial FOMO.

## Features

- 📊 Real-time investment calculations using Polygon.io market data
- 📈 Interactive charts showing portfolio growth over time
- 💱 Stock split adjustments for accurate calculations
- 🎨 Dynamic themes based on profit/loss
- 📱 Responsive design for all devices
- 🚀 Fast, client-side calculations

## Supported Assets

- **Cryptocurrencies**: Bitcoin, Ethereum, Dogecoin, and more
- **Tech Stocks**: Apple, Microsoft, NVIDIA, Tesla, etc.
- **Blue Chips**: JPMorgan, Walmart, Disney, Coca-Cola
- **Meme Stocks**: GameStop, AMC, BlackBerry
- **Index Funds**: S&P 500, Nasdaq-100

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file from template
cp .env.example .env
# Add your Polygon API key to .env

# Run development server
npm run dev

# Build for production
npm run build
```

## API Configuration

This app uses the [Polygon.io](https://polygon.io) API for market data.

### Free Tier Limitations:
- **Cryptocurrency data**: October 2023 - Present
- **Stock data**: Last 5 years (2020 - Present)

Get your free API key at [polygon.io/dashboard](https://polygon.io/dashboard).

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options:
- **GitHub Pages**: Automatic deployment via GitHub Actions
- **Vercel**: One-click deploy with environment variables
- **Netlify**: Connect repository and deploy
- **Static Hosting**: Upload `dist/` folder contents

## Technology Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling
- **Polygon.io API** - Market data

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Known Limitations

1. **Historical Data**: Limited by API plan (see above)
2. **Update Frequency**: Monthly data points for performance
3. **Asset Coverage**: Limited to assets available on Polygon.io

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Disclaimer

This tool is for educational and entertainment purposes only. It should not be used as financial advice. Past performance does not guarantee future results. Always do your own research before making investment decisions.

## Credits

Built with frustration and annoyance by [Drew Garraway Consulting](https://assemblylabs.co/)