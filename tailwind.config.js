/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'navy-dark': '#0A0F1C',
        'electric-blue': '#00CFFF',
        'electric-blue-dark': '#0077FF',
      },
      fontFamily: {
        'lato': ['Lato', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'orbitron': ['Orbitron', 'sans-serif'],
        'sans': ['Lato', 'sans-serif'], // Make Lato the default sans-serif
      },
      boxShadow: {
        'glow': '0 0 15px rgba(0, 207, 255, 0.3)',
        'glow-strong': '0 0 25px rgba(0, 207, 255, 0.5)',
        'glow-inner': 'inset 0 0 20px rgba(0, 207, 255, 0.1)',
      },
      textShadow: {
        'glow': '0 0 10px rgba(0, 207, 255, 0.5)',
        'glow-strong': '0 0 15px rgba(0, 207, 255, 0.8)',
      },
    },
  },
  plugins: [],
};
