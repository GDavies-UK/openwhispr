import { PlatformColor } from 'react-native';

// Bus Tools house style (bus-tools.co.uk): a dark UI with the Bus Tools red as
// the accent and teal as the second accent. Kept in step with the portal's
// `:root` tokens in bus-tools/index.html (--bg, --red, --red-deep, --teal …).
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

export const BRAND = BUS_TOOLS.red;

// Gradient for primary surfaces (buttons, avatar, the record button), Bus Tools
// red into its deep red. Rendered diagonally (top-left → bottom-right). Single
// source of truth for every gradient-glass surface. The keyboard extension's
// dictation button draws its own copy in Swift (KeyboardViewController.swift).
export const BRAND_GRADIENT = ['#f0475a', BUS_TOOLS.red, BUS_TOOLS.redDeep] as const;

// App-wide page background. Overrides iOS `systemBackground` so the Bus Tools
// background appears uniformly across screens and components that read this token.
export const APP_BACKGROUND = BUS_TOOLS.bg;

const ANDROID_FALLBACKS: Record<string, string> = {
  label: BUS_TOOLS.textHi,
  secondaryLabel: '#EBEBF599',
  tertiaryLabel: '#EBEBF54D',
  quaternaryLabel: '#EBEBF52E',
  systemBackground: APP_BACKGROUND,
  secondarySystemBackground: BUS_TOOLS.bg2,
  secondarySystemGroupedBackground: BUS_TOOLS.panel,
  tertiarySystemFill: '#7676803D',
  quaternarySystemFill: '#7676802E',
  separator: '#54545899',
  link: BRAND,
  systemRed: '#FF453A',
  systemGreen: BUS_TOOLS.green,
  systemBlue: BRAND,
  systemPurple: '#AF52DE',
  systemOrange: BUS_TOOLS.amber,
  systemIndigo: '#5856D6',
  systemPink: '#FF2D55',
  systemGray2: '#636366',
};

// The app runs in dark appearance (app.base.json `userInterfaceStyle`), so the
// iOS system colors that aren't overridden here already resolve to their dark values.
const IOS_LITERAL_OVERRIDES: Record<string, string> = {
  systemBackground: APP_BACKGROUND,
  secondarySystemBackground: BUS_TOOLS.bg2,
  secondarySystemGroupedBackground: BUS_TOOLS.panel,
  systemBlue: BRAND,
  link: BRAND,
};

export function iosColor(name: string): string {
  if (process.env.EXPO_OS === 'ios') {
    return IOS_LITERAL_OVERRIDES[name] ?? (PlatformColor(name) as unknown as string);
  }
  return ANDROID_FALLBACKS[name] ?? BUS_TOOLS.textHi;
}

// Fixed colors for the Chat tab that have no system token. Text and fills that
// do have one (label, secondaryLabel, ...) use the NativeWind token instead.
export const CHAT_COLORS = {
  darkFill: BUS_TOOLS.panel2,
  hairline: BUS_TOOLS.line,
  neutralRing: 'rgba(255,255,255,0.14)',
  neutralTrack: 'rgba(255,255,255,0.06)',
  successForeground: BUS_TOOLS.green,
  successBackground: 'rgba(45,216,130,0.12)',
  errorForeground: '#ff6b78',
  errorBackground: 'rgba(229,39,58,0.14)',
  // BRAND_GRADIENT's middle stop, around the mic while it listens.
  listeningRing: 'rgba(229,39,58,0.28)',
  // Faint enough that text over it keeps its contrast.
  watermark: 'rgba(255,255,255,0.035)',
  onGradient: '#FFFFFF',
  onGradientSubtle: 'rgba(255,255,255,0.55)',
} as const;
