/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0A192F',
        'slate-blue': '#1E3A5F',
        gold: '#D4AF37',
        'gold-light': '#E8C84A',
        'gray-bg': '#F1F5F9',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
