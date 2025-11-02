/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af', // deep blue
        success: '#22c55e',
        warning: '#f59e0b',
        neutral: '#6b7280',
      },
    },
  },
  plugins: [],
}