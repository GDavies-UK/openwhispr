const { platformColor } = require('nativewind/theme');

// Bus Tools house style, light and dark: the values live in global.css as CSS
// variables (and in src/config/colors.ts for code), and follow the phone's appearance.
const v = (name) => `rgb(var(--bus-${name}) / <alpha-value>)`;
const BUS = {
  bg: v('bg'),
  bg2: v('bg2'),
  panel: v('panel'),
  panel2: v('panel2'),
  line: v('line'),
  text: v('text'),
  textHi: v('text-hi'),
  muted: v('muted'),
  red: '#e5273a',
  redDeep: '#a91622',
  teal: v('teal'),
  amber: v('amber'),
  green: v('green'),
};
const BRAND = '#e5273a';

const ios = (iosName, androidFallback, web = androidFallback) =>
  platformColor(iosName, androidFallback, web);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: BRAND,
        bus: BUS,

        label: ios('label', '#000000', '#000000'),
        secondaryLabel: ios('secondaryLabel', '#3C3C4399', '#3C3C4399'),
        tertiaryLabel: ios('tertiaryLabel', '#3C3C434D', '#3C3C434D'),
        quaternaryLabel: ios('quaternaryLabel', '#3C3C432E', '#3C3C432E'),

        systemBackground: BUS.bg,
        secondarySystemBackground: BUS.bg2,
        secondarySystemGroupedBackground: BUS.panel,
        tertiarySystemFill: ios('tertiarySystemFill', '#76768014', '#76768014'),
        quaternarySystemFill: ios('quaternarySystemFill', '#7676800F', '#7676800F'),

        separator: ios('separator', '#3C3C4349', '#3C3C4349'),
        link: BRAND,

        systemRed: ios('systemRed', '#FF3B30', '#FF3B30'),
        systemGreen: ios('systemGreen', '#15803d', '#15803d'),
        systemBlue: BRAND,
        systemOrange: ios('systemOrange', '#b45309', '#b45309'),

        border: BUS.line,
        input: BUS.line,
        ring: BRAND,
        background: BUS.bg,
        foreground: BUS.text,
        primary: {
          DEFAULT: BRAND,
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: BUS.panel2,
          foreground: BUS.text,
        },
        destructive: {
          DEFAULT: BUS.red,
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: BUS.panel2,
          foreground: BUS.muted,
        },
        accent: {
          DEFAULT: BUS.teal,
          foreground: BUS.bg,
        },
        popover: {
          DEFAULT: BUS.panel,
          foreground: BUS.text,
        },
        card: {
          DEFAULT: BUS.panel,
          foreground: BUS.text,
        },
      },
      borderRadius: {
        // Bus Tools panels use a 14px radius (--rad).
        xl: '14px',
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      fontFamily: {
        sans: ['SpaceGrotesk_400Regular'],
      },
    },
  },
  plugins: [],
};
