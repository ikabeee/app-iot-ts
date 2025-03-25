// tailwind.config.js
const {heroui} = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/(avatar|button|card|drawer|dropdown|form|image|input|input-otp|modal|navbar|user|ripple|spinner|menu|divider|popover).js"
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
};