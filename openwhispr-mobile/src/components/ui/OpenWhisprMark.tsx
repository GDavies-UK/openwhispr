import Svg, { Circle, Path, Rect } from 'react-native-svg';

/**
 * The app's brand mark: Ding Ding's bell push, ringing on both sides (the
 * conductor's two rings). Drawn in one colour on a transparent background so it
 * sits on any surface; the app icon puts the same drawing on a red tile.
 * Geometry matches the desktop's BrandMarkIcon and the icon artwork.
 */
export function OpenWhisprMark({
  size = 32,
  color = '#FFFFFF',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="8 22 104 76">
      <Rect
        x={41}
        y={31}
        width={38}
        height={58}
        rx={13}
        fill="none"
        stroke={color}
        strokeWidth={6}
      />
      <Circle cx={60} cy={60} r={11} fill={color} />
      <Path
        d="M28 48q-6 12 0 24M92 48q6 12 0 24"
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
      />
      <Path
        d="M18 40q-11 20 0 40M102 40q11 20 0 40"
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        opacity={0.55}
      />
    </Svg>
  );
}
