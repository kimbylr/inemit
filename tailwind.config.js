/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
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
        150: '#62C332',
        100: '#8CD867',
        50: '#ABE290',
        20: '#CDEFBD',
      },
      yellow: {
        150: '#D4CE21',
        100: '#E5E059',
        50: '#EFEC9C',
        20: '#F1EDA7',
      },
      orange: {
        150: '#F59700',
        100: '#FFC15E',
        20: '#FFE0AD',
      },
      grey: {
        10: '#121212', // aka black
        25: '#3e3e3e',
        35: '#5a5a5a',
        50: '#808080',
        60: '#9a9a9a',
        75: '#c0c0c0',
        85: '#dadada',
        95: '#f2f2f2',
        98: '#fafafa', // aka white-ish
      },
      white: '#fff',
      black: '#000',
      negative: {
        150: '#AD705F',
        100: '#FF8360',
        75: '#DD9F8D',
        60: '#FBAD97',
        50: '#DBB5AB',
        10: '#F9F0F0',
        5: '#FAF5F4',
      },
    },
    fontSize: {
      xxs: '0.875rem',
      xs: '1rem',
      'xs+': '1.125rem',
      sm: '1.25rem', // text (20px)
      md: '1.5rem', // h2
      lg: '1.75rem',
      xl: '2.125rem', // h1
      xxl: '2.625rem', //
    },
    fontWeight: {
      light: '300',
      bold: '600',
      massive: '800',
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-work-sans)'],
      },
      boxShadow: {
        'button-primary': '0 4px #00A878',
        'button-secondary': '0 4px #a8a8a8',
        'button-caution': '0 4px #AD705F',
        modal: '0 20px 25px -5px rgb(0 0 0 / 0.2), 0 8px 10px -6px rgb(0 0 0 / 0.2);',
        image: '0 8px 32px #9a9a9a',
        'blurry-focus': '0 0 16px #6CC17A',
      },
      lineHeight: {
        terse: 1.125,
      },
      screens: {
        xxs: '380px',
        xs: '480px',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        wobble: { '0%, 100%': { transform: 'scale(0)' }, '50%': { transform: 'scale(1)' } },
        slideIn: {
          '0%': { transform: 'translateY(-50px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in 0.5s forwards',
        bounce: 'wobble 2s infinite ease-in-out',
        'slide-in': 'slideIn 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
