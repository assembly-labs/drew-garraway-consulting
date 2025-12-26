/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#141414',
        surfaceHover: '#1a1a1a',
        border: '#262626',
        textPrimary: '#fafafa',
        textSecondary: '#a1a1a1',
        accent: '#3b82f6',
        accentHover: '#2563eb',
      },
      gridTemplateColumns: {
        'gallery': 'repeat(auto-fill, minmax(250px, 1fr))',
      }
    },
  },
  plugins: [],
}

