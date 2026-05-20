/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'Oswald', 'Inter', 'sans-serif'],
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
        hand: ['Caveat', 'cursive'],
      },
      colors: {
        // Paleta inspirada na referência: bordô profundo + creme + preto
        wine: {
          DEFAULT: '#6E1F26',
          50: '#FAEDEE',
          100: '#F1D5D7',
          200: '#E0A5A9',
          400: '#A8424A',
          600: '#6E1F26',
          700: '#5A1820',
          900: '#3A0E14',
        },
        cream: {
          DEFAULT: '#F5EFE6',
          50: '#FBF8F3',
          100: '#F5EFE6',
          200: '#EBE2D2',
          300: '#D9CCB4',
        },
        paper: '#F5EFE6',
        ink: '#1A1A1A',
        muted: '#3A2C2A',
        line: '#D9CCB4',
      },
    },
  },
  plugins: [],
}
