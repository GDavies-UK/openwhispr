import { Appearance, DynamicColorIOS, PlatformColor, type ColorValue } from 'react-native';

// Bus Tools house style (bus-tools.co.uk), in its dark and light palettes. Dark
// follows the portal's `:root` tokens (bus-tools/index.html: --bg, --red,
// --red-deep, --teal …); light follows the tools' `[data-theme="light"]` tokens
// (tool/concourse-console.html). The app follows the phone's appearance.
// global.css carries the same values as CSS variables for the NativeWind classes.
export const BUS_TOOLS = {
  bg: '#07090f',
  bg2: '#0a0d16',
  panel: '#121822',
  panel2: '#1a2130',
  line: 'rgba(255,255,255,0.08)',
  text: '#dbe2ee',
  textHi: '#f4f6fb',
  muted: '#8b94a9',
  faint: '#5b6478',
  red: '#e5273a',
  redDeep: '#a91622',
  teal: '#00c2b8',
  amber: '#ffb000',
  green: '#2dd882',
  blue: '#7aa2ff',
} as const;

export const BUS_TOOLS_LIGHT = {
  bg: '#f4f7fb',
  bg2: '#eaeff6',
  panel: '#ffffff',
  panel2: '#f4f7fb',
  line: '#d9e1ec',
  text: '#1f2733',
  textHi: '#1f2733',
  muted: '#46566e',
  faint: '#9aa8bd',
  red: '#e5273a',
  redDeep: '#a91622',
  teal: '#0e7490',
  amber: '#b45309',
  green: '#15803d',
  blue: '#3a6ea5',
} as const;

// A color that follows the phone's appearance. iOS switches it live; Android
// reads the appearance when the color is made.
export function themed(light: string, dark: string): ColorValue {
  if (process.env.EXPO_OS === 'ios') return DynamicColorIOS({ light, dark });
  return Appearance.getColorScheme() === 'dark' ? dark : light;
}

// Bus Tools colors for StyleSheets and color props, light or dark with the phone.
export const BUS = {
  bg: themed(BUS_TOOLS_LIGHT.bg, BUS_TOOLS.bg),
  bg2: themed(BUS_TOOLS_LIGHT.bg2, BUS_TOOLS.bg2),
  panel: themed(BUS_TOOLS_LIGHT.panel, BUS_TOOLS.panel),
  panel2: themed(BUS_TOOLS_LIGHT.panel2, BUS_TOOLS.panel2),
  line: themed(BUS_TOOLS_LIGHT.line, BUS_TOOLS.line),
  text: themed(BUS_TOOLS_LIGHT.text, BUS_TOOLS.text),
  textHi: themed(BUS_TOOLS_LIGHT.textHi, BUS_TOOLS.textHi),
  teal: themed(BUS_TOOLS_LIGHT.teal, BUS_TOOLS.teal),
  // Frosted fills over content (the FAB's actions, Home's status pill).
  frost: themed('rgba(255,255,255,0.92)', 'rgba(18,24,34,0.92)'),
  frostStrong: themed('rgba(248,248,250,0.94)', 'rgba(26,33,48,0.94)'),
  frostClear: themed('rgba(255,255,255,0.42)', 'rgba(26,33,48,0.42)'),
} as const;

export const BRAND = BUS_TOOLS.red;

// Gradient for primary surfaces (buttons, avatar, the record button), Bus Tools
// red into its deep red, the same in light and dark. Rendered diagonally
// (top-left → bottom-right). Single source of truth for every gradient-glass
// surface. The keyboard extension's dictation button draws its own copy in Swift
// (KeyboardViewController.swift).
export const BRAND_GRADIENT = ['#f0475a', BUS_TOOLS.red, BUS_TOOLS.redDeep] as const;

// App-wide page background (the dark value; BUS.bg follows the appearance).
export const APP_BACKGROUND = BUS_TOOLS.bg;

const ANDROID_LIGHT: Record<string, string> = {
  label: BUS_TOOLS_LIGHT.text,
  secondaryLabel: '#3C3C4399',
  tertiaryLabel: '#3C3C434D',
  quaternaryLabel: '#3C3C432E',
  systemBackground: BUS_TOOLS_LIGHT.bg,
  secondarySystemBackground: BUS_TOOLS_LIGHT.bg2,
  secondarySystemGroupedBackground: BUS_TOOLS_LIGHT.panel,
  tertiarySystemFill: '#76768014',
  quaternarySystemFill: '#7676800F',
  separator: '#3C3C4349',
  link: BRAND,
  systemRed: '#FF3B30',
  systemGreen: BUS_TOOLS_LIGHT.green,
  systemBlue: BRAND,
  systemPurple: '#AF52DE',
  systemOrange: BUS_TOOLS_LIGHT.amber,
  systemIndigo: '#5856D6',
  systemPink: '#FF2D55',
  systemGray2: '#AEAEB2',
};

const ANDROID_DARK: Record<string, string> = {
  label: BUS_TOOLS.textHi,
  secondaryLabel: '#EBEBF599',
  tertiaryLabel: '#EBEBF54D',
  quaternaryLabel: '#EBEBF52E',
  systemBackground: BUS_TOOLS.bg,
  secondarySystemBackground: BUS_TOOLS.bg2,
  secondarySystemGroupedBackground: BUS_TOOLS.panel,
  tertiarySystemFill: '#7676803D',
  quaternarySystemFill: '#7676802E',
  separator: '#54545899',
  link: BRAND,
  systemRed: '#FF453A',
  systemGreen: BUS_TOOLS.green,
  systemBlue: BRAND,
  systemPurple: '#BF5AF2',
  systemOrange: BUS_TOOLS.amber,
  systemIndigo: '#5E5CE6',
  systemPink: '#FF375F',
  systemGray2: '#636366',
};

// iOS system colors already follow the appearance; these replace the ones the
// Bus Tools palette sets itself.
const IOS_OVERRIDES: Record<string, ColorValue> = {
  systemBackground: BUS.bg,
  secondarySystemBackground: BUS.bg2,
  secondarySystemGroupedBackground: BUS.panel,
  systemBlue: BRAND,
  link: BRAND,
};

export function iosColor(name: string): string {
  if (process.env.EXPO_OS === 'ios') {
    return (IOS_OVERRIDES[name] ?? PlatformColor(name)) as unknown as string;
  }
  const palette = Appearance.getColorScheme() === 'dark' ? ANDROID_DARK : ANDROID_LIGHT;
  return palette[name] ?? palette.label;
}

// Colors for the Chat tab that have no system token. Text and fills that do
// have one (label, secondaryLabel, ...) use the NativeWind token instead. Icon
// and drawing colors are plain strings that read on both backgrounds.
export const CHAT_COLORS = {
  darkFill: themed('#1f2733', BUS_TOOLS.panel2),
  hairline: themed('rgba(0,0,0,0.08)', BUS_TOOLS.line),
  neutralRing: themed('rgba(0,0,0,0.12)', 'rgba(255,255,255,0.14)'),
  neutralTrack: themed('rgba(0,0,0,0.06)', 'rgba(255,255,255,0.06)'),
  successForeground: '#1fa463',
  successBackground: themed('#e3f3ea', 'rgba(45,216,130,0.12)'),
  errorForeground: BRAND,
  errorBackground: themed('#fbe8e5', 'rgba(229,39,58,0.14)'),
  // BRAND_GRADIENT's middle stop, around the mic while it listens.
  listeningRing: 'rgba(229,39,58,0.28)',
  // Faint enough that text over it keeps its contrast.
  watermark: 'rgba(127,127,127,0.06)',
  onGradient: '#FFFFFF',
  onGradientSubtle: 'rgba(255,255,255,0.55)',
} as const;
