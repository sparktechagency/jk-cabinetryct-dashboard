/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#721011",
        primaryBg: "#721011",
        secondary: "#D9D9D9",
        whiteText: "#FFFFFF",
        header: "#193664",
      },
    },
  },
  plugins: [],
};
