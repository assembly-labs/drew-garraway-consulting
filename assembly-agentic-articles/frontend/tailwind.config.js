/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // From our design system
        'bg-primary': '#0D1117',
        'bg-secondary': '#161B22',
        'surface': '#21262D',
        'text-primary': '#F0F6FC',
        'text-secondary': '#8B949E',
        'accent': '#58A6FF',
        'success': '#238636',
        'error': '#F85149',
        'border': '#30363D',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.02em' }],
        'h2': ['1.875rem', { lineHeight: '1.25', fontWeight: '600', letterSpacing: '-0.01em' }],
        'h3': ['1.25rem', { lineHeight: '1.3', fontWeight: '500' }],
        'body': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['0.875rem', { lineHeight: '1.4', fontWeight: '400', letterSpacing: '0.01em' }],
        'micro': ['0.75rem', { lineHeight: '1.3', fontWeight: '400', letterSpacing: '0.02em' }],
      },
      spacing: {
        'xs': '8px',
        'sm': '16px',
        'md': '24px',
        'lg': '32px',
        'xl': '48px',
        '2xl': '64px',
      },
      maxWidth: {
        'container': '1440px',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}