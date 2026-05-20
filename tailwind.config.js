/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: '#FAFAFA',
        ink: '#1A1A1A',
        muted: '#333333',
        line: '#D4D4D4',
      },
    },
  },
  plugins: [],
}
