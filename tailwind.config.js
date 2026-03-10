/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#D0AF6A",
        "primary-hover": "#B79352",
      },
      fontFamily: {
        sans: ['"Montserrat"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
