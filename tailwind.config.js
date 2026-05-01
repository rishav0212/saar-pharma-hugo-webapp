/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./content/**/*.md",
    "./layouts/**/*.html",
    "./themes/saar/layouts/**/*.html",
  ],
  theme: {
    /* Direct Definitions to ensure 3xl and 4xl variants exist */
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1140px',   /* Force 4 columns on your screen */
      '2xl': '1340px',
      '3xl': '1600px',
      '4xl': '1850px',
    },
    container: {
      center: true,
      padding: '1.5rem',
    },
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
