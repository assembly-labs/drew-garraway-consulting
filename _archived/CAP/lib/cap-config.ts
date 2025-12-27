/**
 * CAP Platform Configuration
 * Central configuration for branding, colors, and constants
 */

export const capConfig = {
  // Brand Information
  brand: {
    name: 'CAP',
    fullName: 'Championship Athletic Prospects',
    tagline: 'Turn phone photos into professional trading cards in minutes',
    mission: 'Make every kid feel like a champion',
  },

  // Brand Colors
  colors: {
    primary: '#FFD700', // Gold
    secondary: '#1E40AF', // Blue
    accent: '#DC2626', // Red
    success: '#059669', // Green
    black: '#000000',
    white: '#FFFFFF',
  },

  // Typography
  fonts: {
    ui: 'Inter',
    display: 'Bebas Neue',
    card: 'Graduate',
  },

  // Business Constants
  pricing: {
    rookie: {
      name: 'Rookie Pack',
      price: 28,
      cards: 8,
      description: 'DIY with templates',
    },
    pro: {
      name: 'Pro Session',
      sessionPrice: 75,
      cardPrice: 28,
      description: 'With photographer',
    },
    championship: {
      name: 'Championship Package',
      startingPrice: 150,
      description: 'Premium with custom design',
    },
  },

  // Technical Constants
  limits: {
    maxPhotoSize: 10 * 1024 * 1024, // 10MB
    maxPhotosPerUpload: 100,
    photoRetentionDays: 30,
    minAge: 18,
  },

  // Supported Sports
  sports: [
    'Soccer',
    'Basketball',
    'Baseball',
    'Football',
    'Hockey',
    'Lacrosse',
    'Softball',
    'Volleyball',
    'Tennis',
    'Swimming',
    'Track & Field',
    'Wrestling',
    'Gymnastics',
    'Cheer',
    'Dance',
    'Other',
  ],

  // Card Templates
  templates: [
    {
      id: 'championship-gold',
      name: 'Championship Gold',
      description: 'Premium gold design for champions',
      thumbnail: '/templates/championship-gold.jpg',
    },
    {
      id: 'classic-cap',
      name: 'Classic CAP',
      description: 'Traditional trading card design',
      thumbnail: '/templates/classic-cap.jpg',
    },
    {
      id: 'modern-champion',
      name: 'Modern Champion',
      description: 'Clean, modern design',
      thumbnail: '/templates/modern-champion.jpg',
    },
    {
      id: 'rookie-star',
      name: 'Rookie Star',
      description: 'Perfect for first-time players',
      thumbnail: '/templates/rookie-star.jpg',
    },
    {
      id: 'elite-athlete',
      name: 'Elite Athlete',
      description: 'Professional sports card style',
      thumbnail: '/templates/elite-athlete.jpg',
    },
  ],

  // URLs
  urls: {
    app: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    support: 'support@cap-platform.com',
    privacy: '/privacy',
    terms: '/terms',
  },

  // Messages
  messages: {
    welcome: 'Welcome to CAP! Let\'s create something amazing for your champions.',
    ageVerification: 'You must be 18 or older to create an account. We protect young athletes\' privacy.',
    photoUpload: 'Upload your best action shots! We\'ll make them look professional.',
    cardCreated: 'Your championship cards are ready! They look amazing.',
    orderComplete: 'Order confirmed! Your cards will arrive in 5-7 days.',
  },
};