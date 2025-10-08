import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001'),

  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/content_platform',
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  apis: {
    anthropic: process.env.ANTHROPIC_API_KEY || '',
    braveSearch: process.env.BRAVE_SEARCH_API_KEY || '',
    serpApi: process.env.SERP_API_KEY || '',
    moz: {
      accessId: process.env.MOZ_ACCESS_ID || '',
      secretKey: process.env.MOZ_SECRET_KEY || '',
    },
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID || '',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
    },
    twitter: {
      apiKey: process.env.TWITTER_API_KEY || '',
      apiSecret: process.env.TWITTER_API_SECRET || '',
      bearerToken: process.env.TWITTER_BEARER_TOKEN || '',
    },
  },

  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  },
};

// Validate required environment variables
export function validateEnv() {
  const required = ['DATABASE_URL'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0 && config.env === 'production') {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}