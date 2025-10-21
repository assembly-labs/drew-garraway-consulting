import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Bebas Neue', 'Arial Narrow', 'sans-serif'],
        'body': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'mono': ['Roboto Mono', 'monospace'],
        'accent': ['Graduate', 'serif'],
      },
      colors: {
        // Dark theme colors - minimal palette
        dark: {
          900: '#0a0a0b', // Primary background (near-black)
          800: '#141417', // Card backgrounds (elevated)
          700: '#1a1a1f', // Hover states
          600: '#2a2a30', // Borders/dividers
          500: '#3a3a42', // Secondary borders
        },
        cyan: {
          500: '#00d4ff', // Primary accent (electric cyan)
          400: '#33dfff', // Lighter variant
          600: '#00a8cc', // Darker/hover variant
          700: '#007799', // Pressed state
        },
        gray: {
          100: '#ffffff', // Primary text
          200: '#f0f0f5', // High emphasis text
          300: '#b8b8c0', // Body text
          400: '#8a8a95', // Secondary text
          500: '#6b6b75', // Muted text
          600: '#4a4a55', // Disabled text
        },
      },
      animation: {
        'card-flip': 'flip 0.6s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
export default config