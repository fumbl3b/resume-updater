/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#63a4ff',
          DEFAULT: '#1976d2',
          dark: '#004ba0',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}