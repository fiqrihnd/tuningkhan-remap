/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.jsx",
    "./main.jsx",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}" // Memastikan semua file di root folder dipindai oleh Tailwind
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
