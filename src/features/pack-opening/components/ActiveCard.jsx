import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import useCardAnimations from '../hooks/useCardAnimations';
import { updateDrag, resetDrag, dismissCard, flipToFront } from '../animations/cardAnimations';
import { triggerCardEffects, clearCardEffects, getCardEffects } from '../lib/cardEffects';
import { CARD_WIDTH, CARD_ASPECT_RATIO, SWIPE_THRESHOLD_RATIO, SWIPE_VELOCITY } from '../animations/constants';

import CardFace from './CardFace';
import CardBack from './CardBack';
import RareEffectOverlay from './RareEffectOverlay';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Renders ONE card in the stack.
 *
 * Reveal model: `startRevealed` decides whether this card mounts already
 * face-up (every card except the very first in the pack) or back-facing
 * and requiring a tap (only the first card). Either way, `revealed` is
 * still local state owned by this instance alone — a startRevealed card
 * simply initializes that state to true instead of false. Non-top cards
 * have gestures disabled entirely, so nothing but a card's own tap can
 * ever flip IT specifically.
 *
 * The flip itself uses a single view whose content (CardBack vs CardFace)
 * is swapped by local state at the animation's edge-on midpoint, rather
 * than two overlapping cross-fading views (that approach didn't render
 * reliably in practice).
 */
export default function ActiveCard({
  card,
  isTop,
  startRevealed = false,
  onReveal,
  onDismiss,
  onEffectsFeedback,
}) {
  const { translateX, translateY, rotateZ, rotateY, glowOpacity, glowScale, particleProgress } =
    useCardAnimations();

  const [revealed, setRevealed] = useState(startRevealed);
  const effectsFiredRef = useRef(false);

  const effects = getCardEffects(card.rarity);

  // Cards that start already revealed never go through handleTapReveal, so
  // their hit effects (glow/shake) would otherwise never fire. Trigger them
  // once, right when the card becomes the interactive top of the stack —
  // not on mount, so a glow doesn't run to completion buried under other
  // cards before the player ever sees it.
  useEffect(() => {
    if (isTop && revealed && !effectsFiredRef.current) {
      effectsFiredRef.current = true;
      triggerCardEffects(
        card.rarity,
        { translateX, glowOpacity, glowScale, particleProgress },
        onEffectsFeedback,
      );
    }
  }, [isTop, revealed]);

  const handleTapReveal = () => {
    flipToFront(
      { rotateY },
      {
        // Fires at the edge-on midpoint of the flip — content swaps here.
        onMidpoint: () => setRevealed(true),
      },
    );
    onReveal?.();
  };

  const handleDismissFinished = () => {
    clearCardEffects({ glowOpacity, glowScale, particleProgress });
    onDismiss?.();
  };

  const tap = Gesture.Tap()
    .enabled(isTop && !revealed)
    .onEnd(() => {
      handleTapReveal();
    })
    .runOnJS(true);

  const pan = Gesture.Pan()
    .enabled(isTop && revealed)
    .onUpdate((event) => {
      updateDrag({ event, translateX, translateY, rotateZ });
    })
    .onEnd((event) => {
      const clearedThreshold =
        Math.abs(event.translationX) > SCREEN_WIDTH * SWIPE_THRESHOLD_RATIO ||
        Math.abs(event.velocityX) > SWIPE_VELOCITY;

      if (clearedThreshold) {
        const direction = event.translationX >= 0 ? 1 : -1;
        dismissCard({
          translateX,
          rotateZ,
          direction,
          screenWidth: SCREEN_WIDTH,
          onFinished: handleDismissFinished,
        });
      } else {
        resetDrag({ translateX, translateY, rotateZ });
      }
    });

  const gesture = Gesture.Simultaneous(tap, pan);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${rotateY.value}deg` },
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotateZ.value}deg` },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={styles.container}>
        <Animated.View style={[styles.card, cardStyle]}>
          {revealed ? (
            <>
              <CardFace card={card} />
              <RareEffectOverlay
                rarity={card.rarity}
                visible={effects.glow}
                glowOpacity={glowOpacity}
                glowScale={glowScale}
              />
            </>
          ) : (
            <CardBack showHint={isTop} />
          )}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    aspectRatio: CARD_ASPECT_RATIO,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
  },
});