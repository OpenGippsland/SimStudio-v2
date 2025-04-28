/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'simstudio-yellow': '#FFC20E',
        'simstudio-black': '#000000',
      },
      fontFamily: {
        'spantaran': ['Spantaran', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
