/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chill-green': 'rgb(34, 197, 94)',
        'no-chill-red': 'rgb(239, 68, 68)',
        'neutral-day': 'rgb(226, 232, 240)',
      },
      animation: {
        'pop': 'pop 0.3s ease-out',
      },
      keyframes: {
        pop: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        }
      }
    },
  },
  plugins: [],
}
