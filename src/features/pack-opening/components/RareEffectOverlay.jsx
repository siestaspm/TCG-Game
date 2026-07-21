import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';

import { rarityColor } from '../../../constants/rarity';
import { CARD_BORDER_RADIUS, PARTICLE_COUNT, PARTICLE_DISTANCE, PARTICLE_SIZE } from '../animations/constants';

/**
 * Purely presentational — it renders whatever glowOpacity/glowScale/
 * particleProgress say. All decisions about WHETHER to animate live in
 * lib/cardEffects.js and are triggered by the owning ActiveCard, not by
 * this component.
 */
export default function RareEffectOverlay({
  rarity,
  glowOpacity,
  glowScale,
  particleProgress,
  visible,
  particles,
}) {
  const style = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  if (!visible) return null;

  const color = rarityColor(rarity);

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[styles.overlay, style, { borderColor: color, shadowColor: color }]}
      />
      {particles && particleProgress && (
        <ParticleBurst color={color} progress={particleProgress} />
      )}
    </>
  );
}

function ParticleBurst({ color, progress }) {
  const angles = useMemo(
    () => Array.from({ length: PARTICLE_COUNT }, (_, i) => (i / PARTICLE_COUNT) * Math.PI * 2),
    [],
  );

  return (
    <>
      {angles.map((angle, i) => (
        <Particle key={i} angle={angle} color={color} progress={progress} />
      ))}
    </>
  );
}

function Particle({ angle, color, progress }) {
  // Alternate travel distance slightly per-particle so the burst reads as
  // a spray rather than a perfectly uniform ring.
  const distance = PARTICLE_DISTANCE * (0.7 + 0.3 * Math.abs(Math.sin(angle * 2)));
  const baseX = Math.cos(angle) * distance;
  const baseY = Math.sin(angle) * distance;

  const style = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      opacity: interpolate(p, [0, 0.15, 0.75, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
      transform: [
        { translateX: baseX * p },
        { translateY: baseY * p },
        { scale: interpolate(p, [0, 1], [0.5, 1], Extrapolation.CLAMP) },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.particle, style, { backgroundColor: color, shadowColor: color }]}
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 4,
    borderRadius: CARD_BORDER_RADIUS,
    shadowOpacity: 0.8,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
  },
  particle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: PARTICLE_SIZE,
    height: PARTICLE_SIZE,
    marginTop: -PARTICLE_SIZE / 2,
    marginLeft: -PARTICLE_SIZE / 2,
    borderRadius: PARTICLE_SIZE / 2,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
});
