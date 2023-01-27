/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  content: [],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      black: "#000000",
      "yellow-500": "rgb(234 179 8)",
      "purple-blue": "rgb(97, 100, 255)",
      "gray-300": "rgb(209 213 219)",
      "gray-400": "rgb(156 163 175)",
      "gray-500": "rgb(107 114 128)",
      "gray-800": "rgb(31 41 55)",
      "gray-custom": "rgb(64, 64, 68)",
    },
    extend: {},
  },
  plugins: [],
};
