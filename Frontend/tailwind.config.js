/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        desktop: "#2563eb",  // Custom color for desktop bars
        mobile: "#60a5fa",   // Custom color for mobile bars
      },
    },
  },
  plugins: [],
}
