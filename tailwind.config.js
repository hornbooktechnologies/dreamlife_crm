/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3a7fc4",
        "primary-hover": "#2d6aa8",
      },
      fontFamily: {
        sans: ['"Montserrat"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
