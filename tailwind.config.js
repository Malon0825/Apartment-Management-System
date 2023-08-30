/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#d4e1ed",
        secondary: "#5e7f9e",
        darkshade: "#0d141a",
        grayblue: "#29445d",
        highlight: "#c17555",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1200px",
      lg: "1400px",
      xl: "1700px",
    },
  },
  plugins: [],
}