import { useCallback, useMemo, useState } from 'react';

/**
 * Pure sequence/state-machine controller. Owns NO card data of its own —
 * `cards` always comes in as a prop from the server response, this hook
 * only tracks which phase we're in and how far through the stack we are.
 *
 * Phases:
 *   PACK    -> unopened pack, waiting for tap
 *   REVEAL  -> stacked cards, one at a time
 *   RESULTS -> full grid of everything pulled
 */
export default function usePackSequence(cards = []) {
  const [phase, setPhase] = useState('PACK');
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalCards = cards.length;

  const remainingCards = useMemo(
    () => cards.slice(currentIndex),
    [cards, currentIndex],
  );

  const revealedCount = currentIndex;

  /** Call once the pack-open animation has finished and cards are ready. */
  const beginReveal = useCallback(() => {
    if (!cards.length) return;
    setCurrentIndex(0);
    setPhase('REVEAL');
  }, [cards]);

  /** Call when the active top card has been swiped away. */
  const advance = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = prev + 1;
      if (next >= cards.length) {
        setPhase('RESULTS');
      }
      return next;
    });
  }, [cards]);

  const reset = useCallback(() => {
    setPhase('PACK');
    setCurrentIndex(0);
  }, []);

  return {
    phase,
    currentIndex,
    revealedCount,
    totalCards,
    remainingCards,
    beginReveal,
    advance,
    reset,
  };
}