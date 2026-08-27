/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#080808',
        surface: '#121212',
        primary: '#FFFFFF',
        text: {
          main: '#FFFFFF',
          secondary: '#888888',
        },
        border: '#222222',
      }
    },
  },
  plugins: [],
}
