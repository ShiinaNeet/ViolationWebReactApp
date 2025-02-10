/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        huge: "0px 20px 40px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};
