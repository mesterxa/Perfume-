/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-blue': {
          900: '#030d1a',
          800: '#061224',
          700: '#0a1a32',
          600: '#0f2440',
        },
        'teal': {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
        },
        'gold': {
          300: '#fde68a',
          400: '#fbbf24',
          500: '#d4af37',
          600: '#b8960c',
        },
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
