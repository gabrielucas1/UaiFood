/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f4',
          100: '#dcf2e8',
          200: '#bce5d3',
          300: '#8dd1b4',
          400: '#56b391',
          500: '#2c9374',  // Verde principal
          600: '#1f7a5e',
          700: '#1a624e',
          800: '#174f40',
          900: '#154035',
        },
        secondary: {
          50: '#fffcf0',
          100: '#fff7db',
          200: '#ffeeb8',
          300: '#ffe084',
          400: '#ffce4f',
          500: '#ffb429',  // Dourado/amarelo
          600: '#f59e0b',
          700: '#d97706',
          800: '#b45309',
          900: '#92400e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

