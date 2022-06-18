const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      primary: {
        150: '#00A878',
        100: '#6CC17A', // green = primary
        75: '#86CC92',
        50: '#A1D7AA',
        25: '#BCE2C2',
        10: '#D6EEDA',
        5: '#E4F3E6',
      },
      secondary: {
        100: '#8CD867',
        50: '#ABE290',
        20: '#CDEFBD',
      },
      yellow: {
        100: '#E5E059',
        50: '#EFEC9C',
        20: '#F1EDA7',
      },
      orange: {
        100: '#FFC15E',
        20: '#FFE0AD',
      },
      grey: {
        10: '#121212', // aka black
        25: '#3e3e3e',
        50: '#808080',
        60: '#9a9a9a',
        75: '#c0c0c0',
        85: '#dadada',
        95: '#f2f2f2',
        98: '#fafafa', // aka white-ish
      },
      white: '#fff',
      negative: {
        150: '#AD705F',
        100: '#FF8360',
        75: '#DD9F8D',
        50: '#DBB5AB',
        10: '#F9F0F0',
      },
    },
    fontFamily: {
      sans: ['Work Sans', ...defaultTheme.fontFamily.sans],
    },
    fontSize: {
      xxs: '0.875rem',
      xs: '1rem',
      'xs+': '1.125rem',
      sm: '1.25rem', // text (20px)
      md: '1.5rem', // h3
      lg: '1.75rem',
      xl: '2.125rem', // h2
      xxl: '2.625rem', // h1
    },
    fontWeight: {
      light: '300',
      bold: '600',
      massive: '800',
    },
    extend: {
      boxShadow: {
        'button-primary': '0 4px #00A878',
        'button-secondary': '0 4px #a8a8a8',
        'button-caution': '0 4px #AD705F',
        modal: '0 20px 25px -5px rgb(0 0 0 / 0.2), 0 8px 10px -6px rgb(0 0 0 / 0.2);',
      },
      lineHeight: {
        terse: 1.125,
      },
      screens: {
        xxs: '380px',
        xs: '480px',
      },
    },
  },
  plugins: [],
};
