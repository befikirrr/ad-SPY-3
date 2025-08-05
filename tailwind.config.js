/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#0D1117',
        'accent': '#58A6FF',
        'card': 'rgba(255, 255, 255, 0.05)',
        'border': 'rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
