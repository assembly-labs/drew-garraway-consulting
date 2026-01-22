/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.html"],
  theme: {
    extend: {
      colors: {
        forest: '#2D5016',
        sage: '#7A9E7E',
        cream: '#FAF8F5',
        wheat: '#E8DFD0',
        earth: '#8B5E3C',
        charcoal: '#1F2937',
      },
      fontFamily: {
        heading: ['"DM Serif Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
