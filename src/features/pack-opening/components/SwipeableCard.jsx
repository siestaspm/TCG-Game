// src/features/pack-opening/components/SwipeableCard.jsx
import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { isHit, rarityColor } from '../lib/rarity';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const OFFSCREEN_X = SCREEN_WIDTH * 1.5;

// Renders the top card of the stack. Swipe right past the threshold (or
// flick it fast enough) to dismiss and move on to the next card.
export default function SwipeableCard({ card, onSwiped, isTop }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pan = Gesture.Pan()
    .enabled(isTop)
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY * 0.2;
    })
    .onEnd((e) => {
      const shouldDismiss = e.translationX > SWIPE_THRESHOLD || e.velocityX > 800;

      if (shouldDismiss) {
        translateX.value = withTiming(OFFSCREEN_X, { duration: 220 }, (finished) => {
          if (finished) runOnJS(onSwiped)();
        });
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = `${(translateX.value / SCREEN_WIDTH) * 25}deg`;
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate },
      ],
    };
  });

  const hit = isHit(card.rarity);

  const cardContent = (
    <Animated.View style={[styles.card, hit && styles.cardHit, cardStyle]}>
      {card.image_url ? (
        <Image source={{ uri: card.image_url }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}
      <View style={[styles.rarityBadge, { backgroundColor: rarityColor(card.rarity) }]}>
        <Text style={styles.rarityText}>{card.rarity}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.cardCode}>{card.card_code}</Text>
        <Text style={styles.cardName} numberOfLines={1}>
          {card.name}
        </Text>
      </View>
    </Animated.View>
  );

  // Cards below the top of the stack are static (no gesture attached).
  if (!isTop) return cardContent;

  return <GestureDetector gesture={pan}>{cardContent}</GestureDetector>;
}

const CARD_WIDTH = SCREEN_WIDTH * 0.78;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  cardHit: {
    borderWidth: 3,
    borderColor: '#E0A429',
  },
  image: { width: '100%', height: '80%', backgroundColor: '#E5EAF5' },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  rarityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  rarityText: { color: 'white', fontWeight: '800', fontSize: 12 },
  info: { flex: 1, justifyContent: 'center', paddingHorizontal: 16 },
  cardCode: { fontSize: 11, fontWeight: '700', color: '#2F6FED', letterSpacing: 0.5 },
  cardName: { fontSize: 16, fontWeight: '800', color: '#14192E', marginTop: 2 },
});