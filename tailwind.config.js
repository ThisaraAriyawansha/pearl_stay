/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f4f7',
          100: '#ebeaef',
          200: '#d7d5df',
          300: '#b8b4c7',
          400: '#928faa',
          500: '#747293',
          600: '#5d5a7a',
          700: '#4d4a64',
          800: '#424055',
          900: '#3a3649',
        },
        secondary: {
          50: '#f6f5f8',
          100: '#edeceef',
          200: '#dbd9de',
          300: '#c0bdc6',
          400: '#a09dab',
          500: '#908ea9',
          600: '#6f6d88',
          700: '#5c5a70',
          800: '#4e4c5e',
          900: '#434250',
        },
        accent: {
          50: '#f7f6f8',
          100: '#efeeef',
          200: '#e0dee2',
          300: '#cac7ce',
          400: '#b0acba',
          500: '#acaabe',
          600: '#8a869a',
          700: '#71707e',
          800: '#5f5e69',
          900: '#504f59',
        },
        neutral: {
          50: '#f8f8f9',
          100: '#f1f1f2',
          200: '#e4e4e6',
          300: '#d1d1d4',
          400: '#b4b4b9',
          500: '#c7c7d4',
          600: '#9a9aa4',
          700: '#818188',
          800: '#6c6c72',
          900: '#5a5a5f',
        },
        background: {
          50: '#fbfbfc',
          100: '#f6f6f7',
          200: '#ededef',
          300: '#dedee2',
          400: '#c9c9ce',
          500: '#e3e3e9',
          600: '#b5b5bc',
          700: '#95959d',
          800: '#7c7c83',
          900: '#68686e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
};

