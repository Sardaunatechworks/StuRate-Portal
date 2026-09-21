/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        academic: {
          50: '#F0F7F2',
          100: '#DCF0E1',
          200: '#C5E0CC',
          300: '#9DCBAA',
          400: '#6BAE7E',
          500: '#3D8F56',
          600: '#2D7745',
          700: '#006838',
          800: '#004D2A',
          900: '#004225',
          950: '#002415',
        },
        gold: {
          50: '#FDF8EC',
          100: '#FAF0D4',
          200: '#F5E0A4',
          300: '#EDCC6E',
          400: '#D4A843',
          500: '#C49630',
          600: '#A87925',
          700: '#8A5E1E',
          800: '#6F4A1A',
          900: '#5C3D17',
        },
        accent: {
          orange: '#F28C28',
          'orange-hover': '#E07B1A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'count-up': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'count-up': 'count-up 0.5s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
