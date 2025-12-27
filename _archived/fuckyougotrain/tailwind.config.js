/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DC2626', // red-600
          dark: '#B91C1C', // red-700
        },
        timer: {
          green: '#22C55E', // green-500
          yellow: '#EAB308', // yellow-500
          red: '#DC2626', // red-600
        },
      },
      animation: {
        'pulse-fast': 'pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
