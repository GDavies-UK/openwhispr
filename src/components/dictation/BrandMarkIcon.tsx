import React from "react";

interface BrandMarkIconProps {
  size?: number;
  className?: string;
}

/**
 * Ding Ding's brand mark: a bell push ringing on both sides. Draws in
 * `currentColor` so it follows the neutral foreground treatment of the surface
 * that contains it. Same geometry as the app icon (src/assets/logo.svg).
 */
export function BrandMarkIcon({ size = 24, className }: BrandMarkIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="8 22 104 76"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="41" y="31" width="38" height="58" rx="13" stroke="currentColor" strokeWidth="6" />
      <circle cx="60" cy="60" r="11" fill="currentColor" />
      <path
        d="M28 48q-6 12 0 24M92 48q6 12 0 24"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M18 40q-11 20 0 40M102 40q11 20 0 40"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
