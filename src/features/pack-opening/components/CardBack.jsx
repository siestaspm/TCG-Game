import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { CARD_BORDER_RADIUS } from '../animations/constants';

/**
 * Card back is fully code-drawn — no bundled image required. This keeps
 * card visibility/logic independent of asset loading (a broken/missing
 * image should never be able to make a card disappear).
 */
export default function CardBack({ showHint = false, style }) {
  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.inner}>
        <View style={styles.diamond} />
        <View style={styles.ring} />
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
    backgroundColor: '#161B2E',
    borderWidth: 2,
    borderColor: '#2A3357',
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
    borderWidth: 2,
    borderColor: '#3B4677',
  },
  diamond: {
    width: 46,
    height: 46,
    backgroundColor: '#4C5B9C',
    transform: [{ rotate: '45deg' }],
    borderRadius: 6,
  },
  hint: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  hintText: { color: '#FFF', fontWeight: '700', fontSize: 12 },
});