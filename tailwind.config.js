/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pearlstay: {
          primary: '#747293',
          secondary: '#908ea9',
          accent: '#acaabe',
          neutral: '#c7c7d4',
          background: '#e3e3e9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};