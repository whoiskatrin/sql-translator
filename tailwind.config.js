/** @type {import('tailwindcss').Config} */
module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundColor: {
        "custom-gray-bg": "#F8F8F8",
        "custom-gray": "#171717",
        "custom-dark-gray": "#1D1D1D",
        "frame-gray": "EEEEEE",
      },
      borderColor: {
        "custom-gray": "#171717",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@headlessui/tailwindcss")],
};
