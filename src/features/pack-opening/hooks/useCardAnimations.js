import { useSharedValue } from 'react-native-reanimated';

/**
 * Holds every animated shared value for ONE card instance.
 * Pure state container — no animation logic belongs here.
 *
 * Every card that mounts gets its own instance of these values, so there is
 * no way for one card's animation state to leak into another's (this was
 * the root cause of the old "cards reveal themselves early" bug).
 */
export default function useCardAnimations() {
  // Drag / dismiss
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotateZ = useSharedValue(0);

  // Flip — always starts at 0 (back-facing). A card only ever leaves 0
  // because ITS OWN tap handler moved it, never because of a prop change.
  const rotateY = useSharedValue(0);

  const scale = useSharedValue(1);

  // Rare-hit celebration
  const glowOpacity = useSharedValue(0);
  const glowScale = useSharedValue(1);
  const particleProgress = useSharedValue(0);

  return {
    translateX,
    translateY,
    rotateZ,
    rotateY,
    scale,
    glowOpacity,
    glowScale,
    particleProgress,
  };
}