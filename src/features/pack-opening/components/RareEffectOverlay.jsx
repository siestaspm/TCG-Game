import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { rarityColor } from '../../../constants/rarity';
import { CARD_BORDER_RADIUS } from '../animations/constants';

/**
 * Purely presentational — it renders whatever glowOpacity/glowScale say.
 * All decisions about WHETHER to animate live in lib/cardEffects.js and
 * are triggered by the owning ActiveCard, not by this component.
 */
export default function RareEffectOverlay({ rarity, glowOpacity, glowScale, visible }) {
  const style = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  if (!visible) return null;

  const color = rarityColor(rarity);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.overlay, style, { borderColor: color, shadowColor: color }]}
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
});