/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./content/**/*.md",
    "./layouts/**/*.html",
    "./themes/saar/layouts/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: "#18A999",
          light: "#66D5C5",
          dark: "#0C756C",
          border: "rgba(24,169,153,0.26)",
        },
        navy: {
          DEFAULT: "#0D2634",
          100: "#0A1E2A",
          200: "#12374A",
          300: "#173F54",
          400: "#1D4B5E",
        },
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
