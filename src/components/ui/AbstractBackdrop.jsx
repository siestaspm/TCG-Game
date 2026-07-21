// src/components/ui/AbstractBackdrop.jsx
//
// Decorative abstract-art layer for ScreenBackground: a few large,
// soft-edged blobs (radial gradients fading to transparent, so there's no
// hard edge) plus a couple of faint line-art rings for texture. Purely
// decorative - pointerEvents "none", sits behind all real content.
//
// The page itself (ScreenBackground / gradients.surface) is deliberately
// near-white and "nonchalant" - these blobs are the only texture on it, so
// they carry tinted brand color (blue/coral/glow) rather than white-on-white,
// which would be invisible. Kept very low-opacity so it still reads as
// atmosphere, not as competing with cards/text on top of it.
import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { colors } from '../../constants/theme';

export default function AbstractBackdrop() {
  const { width, height } = useWindowDimensions();

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      <Defs>
        <RadialGradient id="blobBlue" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={colors.blueBright} stopOpacity={0.16} />
          <Stop offset="100%" stopColor={colors.blueBright} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="blobCoral" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={colors.red} stopOpacity={0.13} />
          <Stop offset="100%" stopColor={colors.red} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="blobDeep" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={colors.blueDeep} stopOpacity={0.1} />
          <Stop offset="100%" stopColor={colors.blueDeep} stopOpacity={0} />
        </RadialGradient>
        {/* One small, slightly stronger glow accent - the "boom" wink */}
        <RadialGradient id="blobGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={colors.glow} stopOpacity={0.18} />
          <Stop offset="100%" stopColor={colors.glow} stopOpacity={0} />
        </RadialGradient>
      </Defs>

      {/* Large soft glow, upper-right */}
      <Circle cx={width * 0.88} cy={height * 0.04} r={width * 0.55} fill="url(#blobBlue)" />

      {/* Coral accent, mid-left */}
      <Circle cx={width * -0.08} cy={height * 0.34} r={width * 0.4} fill="url(#blobCoral)" />

      {/* Deep navy pool, lower-right */}
      <Circle cx={width * 1.08} cy={height * 0.8} r={width * 0.48} fill="url(#blobDeep)" />

      {/* Small glow accent, tucked mid-right - the one "boom" flourish */}
      <Circle cx={width * 0.78} cy={height * 0.5} r={width * 0.16} fill="url(#blobGlow)" />

      {/* Faint line-art rings for texture, echoing the card-back motif */}
      <Circle
        cx={width * 0.18}
        cy={height * 0.62}
        r={width * 0.22}
        fill="none"
        stroke={colors.blue}
        strokeOpacity={0.08}
        strokeWidth={1.5}
      />
      <Circle
        cx={width * 0.9}
        cy={height * 0.46}
        r={width * 0.12}
        fill="none"
        stroke={colors.blue}
        strokeOpacity={0.07}
        strokeWidth={1.5}
      />
    </Svg>
  );
}
