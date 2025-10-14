/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          red: '#DC2626',
          'red-dark': '#991B1B',
          'red-light': '#EF4444',
          black: '#0A0A0A',
          'black-secondary': '#1A1A1A',
          white: '#FFFFFF',
          'white-muted': '#F5F5F5',
        },
        // Semantic Colors
        semantic: {
          success: '#16A34A',
          warning: '#F59E0B',
          error: '#DC2626',
          disabled: '#525252',
        },
        // Grays
        gray: {
          100: '#F5F5F5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display': ['72px', { lineHeight: '1.0', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1': ['48px', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h2': ['36px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '800' }],
        'h3': ['24px', { lineHeight: '1.3', letterSpacing: '0', fontWeight: '700' }],
        'body-large': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
        'small': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        'xxs': '4px',
        'xs': '8px',
        's': '16px',
        'm': '24px',
        'l': '32px',
        'xl': '48px',
        'xxl': '64px',
        'xxxl': '96px',
      },
      borderRadius: {
        'none': '0',
        'small': '4px',
        'medium': '8px',
        'large': '16px',
        'round': '9999px',
      },
      boxShadow: {
        'level1': '0px 2px 8px rgba(0, 0, 0, 0.4)',
        'level2': '0px 8px 24px rgba(0, 0, 0, 0.6)',
        'level3': '0px 16px 48px rgba(0, 0, 0, 0.8)',
        'red-glow': '0px 0px 20px rgba(220, 38, 38, 0.6)',
        'red-glow-pulse': '0px 0px 40px rgba(220, 38, 38, 0.6)',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        'pulse': 'pulse 2s ease-in-out infinite',
        'slide-in': 'slide-in 0.4s ease-out',
        'fade-out': 'fade-out 0.4s ease-in',
      },
    },
  },
  plugins: [],
}
