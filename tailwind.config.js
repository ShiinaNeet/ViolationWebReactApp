/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        ss: "320px",
      },
      boxShadow: {
        huge: "0px 20px 40px rgba(0, 0, 0, 0.3)",
      },
      colors: {
        primary: "var(--primary-color)",
        dark: {
          bg: "#1a1a2e",
          paper: "#16213e",
          surface: "#0f3460",
        },
      },
    },
  },
  plugins: [],
};
