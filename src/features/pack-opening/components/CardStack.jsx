import React from 'react';
import { StyleSheet, View } from 'react-native';

import ActiveCard from './ActiveCard';
import { STACK_OFFSET_Y, STACK_SCALE_STEP, STACK_MAX_VISIBLE_BEHIND } from '../animations/constants';

/**
 * Renders every remaining (not-yet-dismissed) card as an absolutely
 * positioned layer. Only the top card (stackIndex === 0) is interactive;
 * everything below it has pointerEvents disabled so a mis-tap can never
 * flip a card that isn't actually on top.
 *
 * Reveal behavior: only the very first card of the whole pack requires a
 * tap to flip. Every card after that starts already face-up — the player
 * just swipes through them. `currentIndex` (the pack-wide position of the
 * current top card) plus each card's position within this stack slice
 * gives its absolute pack index, which is what decides startRevealed.
 *
 * Cards behind the top are capped at STACK_MAX_VISIBLE_BEHIND so a large
 * pack doesn't fan out into an unreadable pile — extras sit flush behind
 * the last visible layer instead of continuing to offset.
 */
export default function CardStack({ cards, currentIndex, onCardReveal, onCardDismiss }) {
  return (
    <View style={styles.container}>
      {cards
        .slice()
        .reverse()
        .map((card, reverseIndex) => {
          const stackIndex = cards.length - 1 - reverseIndex;
          const isTop = stackIndex === 0;
          const depth = Math.min(stackIndex, STACK_MAX_VISIBLE_BEHIND);
          const absoluteIndex = currentIndex + stackIndex;
          const startRevealed = absoluteIndex !== 0;

          return (
            <View
              key={card.slot_position}
              pointerEvents={isTop ? 'auto' : 'none'}
              style={[
                styles.stackLayer,
                {
                  zIndex: cards.length - stackIndex,
                  transform: [
                    { translateY: depth * STACK_OFFSET_Y },
                    { scale: 1 - depth * STACK_SCALE_STEP },
                  ],
                },
              ]}
            >
              <ActiveCard
                card={card}
                isTop={isTop}
                startRevealed={startRevealed}
                onReveal={isTop ? onCardReveal : undefined}
                onDismiss={isTop ? onCardDismiss : undefined}
              />
            </View>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 420,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stackLayer: {
    position: 'absolute',
  },
});