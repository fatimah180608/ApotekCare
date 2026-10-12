/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
        'primary-dark': '#6d28d9',
        'primary-light': '#ede9fe',
        accent: '#06b6d4',
        'accent-dark': '#0891b2',
        'accent-light': '#cffafe',
        dark: '#1e1b4b'
      }
    }
  },
  plugins: []
};