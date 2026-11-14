import { useId } from "react";

interface AppLogoProps {
  className?: string;
  /** Accessible name; omit for a decorative logo next to text that already names the app. */
  label?: string;
}

/**
 * Ding Ding's app icon: a bell push ringing on both sides, white on the Bus
 * Tools red tile. Same drawing as src/assets/logo.svg and the installed icons,
 * for places that draw the icon in the page (the loading screen, notices).
 */
export function AppLogo({ className, label }: AppLogoProps) {
  // Several logos can be on screen at once; each needs its own gradient id.
  const gradientId = `app-logo-${useId().replace(/:/g, "")}`;
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0475a" />
          <stop offset=".5" stopColor="#e5273a" />
          <stop offset="1" stopColor="#a91622" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="27" fill={`url(#${gradientId})`} />
      <rect x="38" y="28" width="44" height="64" rx="14" fill="#fff" />
      <circle cx="60" cy="60" r="15" fill="#e5273a" />
      <circle cx="55" cy="55" r="4.5" fill="#fff" opacity=".45" />
      <g fill="none" stroke="#fff" strokeWidth="5.5" strokeLinecap="round">
        <path d="M28 48q-6 12 0 24M92 48q6 12 0 24" />
        <path d="M18 40q-11 20 0 40M102 40q11 20 0 40" opacity=".55" />
      </g>
    </svg>
  );
}
