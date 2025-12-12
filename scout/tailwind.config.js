/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Plus Jakarta Sans', 'Inter', ...defaultTheme.fontFamily.sans],
        'serif': ['Crimson Pro', 'Source Serif Pro', ...defaultTheme.fontFamily.serif],
        'display': ['Plus Jakarta Sans', 'Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Core Brand Colors - The Scout Color System
        navy: {
          DEFAULT: '#1A3E67',  // Primary - Trust, authority, professionalism
          50: '#E8EEF5',       // Lightest (backgrounds)
          100: '#D1DDE9',
          200: '#A3BBD3',
          300: '#7599BD',
          400: '#4777A7',
          500: '#1A3E67',      // Base navy
          600: '#153354',
          700: '#102841',
          800: '#0B1D2E',
          900: '#06121B',      // Darkest (text)
          text: '#1A3E67',     // Always safe on white
        },
        sage: {
          DEFAULT: '#83A07F',  // Secondary - Growth, learning, calm
          50: '#F2F4F1',       // Lightest (success backgrounds)
          100: '#E5E9E3',
          200: '#CBD3C7',
          300: '#B1BDAB',
          400: '#97A78F',
          500: '#83A07F',      // Base sage
          600: '#6B8368',
          700: '#536651',
          800: '#3B493A',
          900: '#232C23',
          text: '#5D7A5A',     // Darkened for WCAG AA accessibility
          dark: '#374837',     // For text on light sage backgrounds
        },
        coral: {
          DEFAULT: '#F2895E',  // Accent - Engagement, discovery, warmth
          50: '#FEF5F2',       // Lightest (attention backgrounds)
          100: '#FDEBE5',
          200: '#FBD7CB',
          300: '#F9C3B1',
          400: '#F7AF97',
          500: '#F2895E',      // Base coral
          600: '#E86E3E',
          700: '#D96A3F',      // Accessible text variant
          800: '#B54D2A',
          900: '#8F4326',      // Darkest (text on light backgrounds)
          text: '#D96A3F',     // Darkened for WCAG AA accessibility
        },
        neutral: {
          DEFAULT: '#BAB9B1',  // Background - Approachability, paper-like
          50: '#FAFAF9',       // Nearly white
          100: '#F5F5F2',      // Lightest neutral
          200: '#E6E5DF',
          300: '#D6D5CE',
          400: '#C6C5BD',
          500: '#BAB9B1',      // Base neutral
          600: '#A09F97',
          700: '#86857E',
          800: '#6C6B65',
          900: '#52514C',
          text: '#6C6B65',     // Secondary text
        },

        // Semantic colors for status/feedback
        success: {
          light: '#F2F4F1',    // Light sage background
          DEFAULT: '#83A07F',  // Sage
          dark: '#374837',     // Dark sage text
          border: '#83A07F',   // Sage border
        },
        info: {
          light: '#E8EEF5',    // Light navy background
          DEFAULT: '#1A3E67',  // Navy
          dark: '#06121B',     // Dark navy text
          border: '#1A3E67',   // Navy border
        },
        attention: {
          light: '#FEF5F2',    // Light coral background
          DEFAULT: '#F2895E',  // Coral
          dark: '#8F4326',     // Dark coral text
          border: '#F2895E',   // Coral border
        },
        warning: {
          light: '#FEF3C7',    // Light amber background
          DEFAULT: '#F59E0B',  // Amber
          dark: '#78350F',     // Dark amber text
          border: '#F59E0B',   // Amber border
        },
        error: {
          light: '#FFEBEE',    // Light red background
          DEFAULT: '#D32F2F',  // Red
          dark: '#B71C1C',     // Dark red text
          border: '#D32F2F',   // Red border
        },

        // Page and surface colors
        page: {
          DEFAULT: '#FAFAF9',  // Warm off-white for main background
          alt: '#F5F5F2',      // Light neutral for variety
        },
        surface: {
          DEFAULT: '#FFFFFF',  // Pure white for cards
          alt: '#F5F5F2',      // Light neutral for nested surfaces
        },
      },

      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },

      // Focus ring utilities
      ringColor: {
        DEFAULT: '#1A3E67',
        navy: '#1A3E67',
        sage: '#83A07F',
        coral: '#F2895E',
      },

      ringOffsetWidth: {
        DEFAULT: '2px',
      },
    },
  },
  plugins: [],
}