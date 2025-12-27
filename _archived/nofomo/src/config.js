// API Configuration
// IMPORTANT: For production, use environment variables for API keys

export const API_CONFIG = {
  // Polygon API configuration
  POLYGON: {
    API_KEY: import.meta.env.VITE_POLYGON_API_KEY || "z37IuRmsdR5bzP6L1Eg_u3SCSeW2vUaM",
    BASE_URL: "https://api.polygon.io/v2",
    // Date limits for free tier
    DATE_LIMITS: {
      crypto: {
        min: '2023-10', // Crypto data starts Oct 2023 on free tier
        description: 'Cryptocurrency data limited to October 2023 onwards on free API plan'
      },
      stocks: {
        min: '2020-01', // Conservative limit for stocks (5 years)
        description: 'Stock data limited to last 5 years on free API plan'
      }
    }
  },

  // Feature flags
  FEATURES: {
    ENABLE_DEBUG_PANEL: import.meta.env.VITE_ENABLE_DEBUG === 'true',
    ENABLE_LOGGING: import.meta.env.VITE_ENABLE_LOGGING === 'true',
  }
};

// Validate configuration
if (!API_CONFIG.POLYGON.API_KEY) {
  console.error('⚠️ No Polygon API key configured. Please set VITE_POLYGON_API_KEY environment variable.');
}