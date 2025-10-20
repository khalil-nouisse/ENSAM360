/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
      colors: {
        'beige': '#F1E8DD',
        'darkblue': '#213985',
        'dark': '#151A28',
      },
    },
  },
  plugins: [],
}
