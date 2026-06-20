/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { ink: '#101828', brand: { 50: '#f0f5ff', 100: '#e0eaff', 500: '#6172f3', 600: '#444ce7', 700: '#3538cd' } },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      boxShadow: { soft: '0 12px 40px rgba(16, 24, 40, 0.08)' }
    }
  },
  plugins: []
}
