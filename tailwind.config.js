/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        flame: {
          '0%': { height: '70%', opacity: '0.9' },
          '50%': { height: '100%', opacity: '1' },
          '100%': { height: '80%', opacity: '0.8' },
        }
      },
      animation: {
        flame: 'flame 0.6s infinite alternate',
      }
    },
  },
  plugins: [],
}