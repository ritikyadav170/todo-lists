/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F4FF',
          100: '#E0E9FE',
          200: '#C7D7FE',
          300: '#A4BCFD',
          400: '#7B98FB',
          500: '#3B66FF',
          600: '#2D55FB',
          700: '#1E3ECB',
          800: '#1831A3',
          900: '#152A7E',
          navy: '#1A2758',
        },
        card: {
          blue: '#EEF4FF',
          pink: '#FFF0F2',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 2px 10px rgba(0, 0, 0, 0.04)',
        float: '0 10px 25px -5px rgba(45, 85, 251, 0.4)',
        sheet: '0 -10px 30px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};

