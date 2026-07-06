import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { CARD_BORDER_RADIUS } from '../animations/constants';
import { colors } from '../../../constants/theme';

/**
 * Card back is fully code-drawn — no bundled image required. This keeps
 * card visibility/logic independent of asset loading (a broken/missing
 * image should never be able to make a card disappear).
 *
 * Motif is a literal expression of the app's "even split" rule: the ring
 * is blue, the diamond is red - one card back, both brand colors, neither
 * one dominant.
 */
export default function CardBack({ showHint = false, style }) {
  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.inner}>
        <View style={styles.ring} />
        <View style={styles.diamond} />
      </View>

      {showHint && (
        <View style={styles.hint}>
          <Text style={styles.hintText}>Tap to reveal</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    height: '100%',
    borderRadius: CARD_BORDER_RADIUS,
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: colors.blue,
  },
  diamond: {
    width: 46,
    height: 46,
    backgroundColor: colors.red,
    transform: [{ rotate: '45deg' }],
    borderRadius: 6,
  },
  hint: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  hintText: { color: colors.white, fontWeight: '700', fontSize: 12 },
});