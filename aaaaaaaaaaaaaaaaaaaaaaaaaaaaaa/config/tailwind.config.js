/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'header-color': '#0e5c84',
        'subject-bg-color': '#0e5c84',
        'subject-accent': '#0e5c84',
        'subject-accent-dark': '#0b4766',
        'button-top': '#396f96',
        'button-bottom': '#1d4e72',
      },
      spacing: {
        'dashboard-offset': '256px',
      },
    },
  },
  plugins: [],
}


