const { platformColor } = require('nativewind/theme');

// Bus Tools house style — keep in step with BUS_TOOLS in src/config/colors.ts.
const BUS = {
  bg: '#07090f',
  bg2: '#0a0d16',
  panel: '#121822',
  panel2: '#1a2130',
  line: 'rgba(255,255,255,0.08)',
  text: '#dbe2ee',
  textHi: '#f4f6fb',
  muted: '#8b94a9',
  red: '#e5273a',
  redDeep: '#a91622',
  teal: '#00c2b8',
  amber: '#ffb000',
  green: '#2dd882',
};
const BRAND = BUS.red;

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

        label: ios('label', BUS.textHi, BUS.textHi),
        secondaryLabel: ios('secondaryLabel', '#EBEBF599', '#EBEBF599'),
        tertiaryLabel: ios('tertiaryLabel', '#EBEBF54D', '#EBEBF54D'),
        quaternaryLabel: ios('quaternaryLabel', '#EBEBF52E', '#EBEBF52E'),

        systemBackground: BUS.bg,
        secondarySystemBackground: BUS.bg2,
        secondarySystemGroupedBackground: BUS.panel,
        tertiarySystemFill: ios('tertiarySystemFill', '#7676803D', '#7676803D'),
        quaternarySystemFill: ios('quaternarySystemFill', '#7676802E', '#7676802E'),

        separator: ios('separator', '#54545899', '#54545899'),
        link: BRAND,

        systemRed: ios('systemRed', '#FF3B30', '#FF3B30'),
        systemGreen: ios('systemGreen', BUS.green, BUS.green),
        systemBlue: BRAND,
        systemOrange: ios('systemOrange', BUS.amber, BUS.amber),

        border: BUS.line,
        input: BUS.line,
        ring: BRAND,
        background: BUS.bg,
        foreground: BUS.text,
        primary: {
          DEFAULT: BRAND,
          foreground: BUS.textHi,
        },
        secondary: {
          DEFAULT: BUS.panel2,
          foreground: BUS.text,
        },
        destructive: {
          DEFAULT: BUS.red,
          foreground: BUS.textHi,
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
