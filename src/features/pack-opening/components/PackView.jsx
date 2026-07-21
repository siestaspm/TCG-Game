import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CardStack from './CardStack';
import ProgressIndicator from './ProgressIndicator';
import ResultGrid from './ResultGrid';
import usePackSequence from '../hooks/usePackSequence';
import {
  openPack as playOpenAnim,
  pressPack,
  releasePack,
  startIdlePack,
  stopIdlePack,
} from '../animations/packAnimations';
import { RESULT_STAGGER_MS } from '../animations/constants';
import { useHaptics } from '../../../hooks/useHaptics';
import Button from '../../../components/ui/Button';
import { colors, gradients, radii } from '../../../constants/theme';

export default function PackView({
  cards = [],
  onRequestOpen,
  loading,
  isError,
  errorMessage,
  creditCost,
  freePacksRemaining,
  creditBalance,
  navigation,
}) {
  const { phase, currentIndex, totalCards, remainingCards, beginReveal, advance, reset } =
    usePackSequence(cards);
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();

  const packScale = useSharedValue(1);
  const packOpacity = useSharedValue(1);
  const packRotate = useSharedValue(0);
  const packTranslateY = useSharedValue(0);
  const packSheen = useSharedValue(0);
  const packFlash = useSharedValue(0);
  const screenShake = useSharedValue(0);

  // True from tap until cards have arrived AND the rip animation has played.
  const [awaitingCards, setAwaitingCards] = useState(false);

  const packStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: packTranslateY.value },
      { rotate: `${packRotate.value}deg` },
      { scale: packScale.value },
    ],
    opacity: packOpacity.value,
  }));

  const sheenStyle = useAnimatedStyle(() => ({
    opacity: interpolate(packSheen.value, [0, 0.15, 0.5, 0.85, 1], [0, 0.55, 0, 0.55, 0], Extrapolation.CLAMP),
    transform: [{ translateX: interpolate(packSheen.value, [0, 1], [-260, 260]) }, { rotate: '20deg' }],
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: packFlash.value,
    transform: [{ scale: interpolate(packFlash.value, [0, 0.9], [0.5, 1.6], Extrapolation.CLAMP) }],
  }));

  const screenShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: screenShake.value }],
  }));

  // Idle bob + sheen sweep while the pack sits waiting for a tap. Restarts
  // whenever we come back to an idle PACK phase (e.g. after a failed open),
  // not just on first mount.
  useEffect(() => {
    if (phase !== 'PACK' || awaitingCards) return;
    startIdlePack({ packTranslateY, packSheen });
    return () => stopIdlePack({ packTranslateY, packSheen });
  }, [phase, awaitingCards]);

  const handleTapPack = () => {
    if (awaitingCards) return;
    haptics.tap();
    setAwaitingCards(true);
    onRequestOpen();
  };

  // Once the fetch resolves and cards are actually available, play the
  // rip-open animation, then flip the state machine into REVEAL — driven
  // by the animation's own onFinished callback rather than a matching
  // setTimeout, so the transition can never fire before the animation
  // actually finishes.
  useEffect(() => {
    if (!awaitingCards || loading || !cards.length) return;

    haptics.impact();

    playOpenAnim({
      packScale,
      packOpacity,
      packRotate,
      packFlash,
      screenShake,
      onFinished: () => {
        beginReveal();
        setAwaitingCards(false);
      },
    });
  }, [awaitingCards, loading, cards.length]);

  // A failed open (insufficient credits, network error, etc.) never
  // produces cards, so the effect above never fires. Without this, the
  // button would stay disabled showing "Opening…" forever.
  useEffect(() => {
    if (!isError) return;
    setAwaitingCards(false);
    packScale.value = 1;
    packOpacity.value = 1;
  }, [isError]);

  if (phase === 'PACK') {
    const isFree = freePacksRemaining > 0;
    const costLabel = isFree
      ? `Free pack (${freePacksRemaining} left today)`
      : `${creditCost ?? '—'} credits · you have ${creditBalance ?? 0}`;

    return (
      <Animated.View
        style={[styles.center, { paddingTop: insets.top, paddingBottom: insets.bottom }, screenShakeStyle]}
      >
        <View style={styles.packStage}>
          <Animated.View pointerEvents="none" style={[styles.flash, flashStyle]} />

          <Pressable
            onPress={handleTapPack}
            onPressIn={() => pressPack(packScale)}
            onPressOut={() => releasePack(packScale)}
            disabled={awaitingCards}
          >
            <Animated.View style={[styles.pack, packStyle]}>
              <LinearGradient
                colors={gradients.brand}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.packArt}
              >
                <Text style={styles.packArtText}>PACK</Text>
                <Animated.View pointerEvents="none" style={[styles.sheen, sheenStyle]} />
              </LinearGradient>
            </Animated.View>
          </Pressable>
        </View>

        <Text style={styles.text}>{awaitingCards ? 'Opening…' : 'Tap to open pack'}</Text>
        {!awaitingCards && <Text style={styles.costLabel}>{costLabel}</Text>}

        {isError && (
          <Text style={styles.error}>{errorMessage ?? 'Could not open pack. Try again.'}</Text>
        )}
      </Animated.View>
    );
  }

  if (phase === 'REVEAL') {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <ProgressIndicator current={currentIndex} total={totalCards} />
        <CardStack
          cards={remainingCards}
          currentIndex={currentIndex}
          onCardReveal={() => {}}
          onCardDismiss={advance}
        />
      </View>
    );
  }

  // RESULTS - tapping a card here opens CardDetail with context: 'pulled',
  // so the screen knows this came from a fresh pull rather than the binder.
  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <ProgressIndicator current={totalCards} total={totalCards} />
      <Animated.Text entering={FadeInDown.springify().damping(14)} style={styles.done}>
        Pack Complete
      </Animated.Text>
      <ResultGrid cards={cards} navigation={navigation} />
      <Animated.View entering={FadeInUp.delay(cards.length * RESULT_STAGGER_MS).springify()}>
        <Button title="Open Another" onPress={reset} style={styles.againButton} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  container: { flex: 1, paddingTop: 20 },
  packStage: { alignItems: 'center', justifyContent: 'center' },
  pack: { width: 220, height: 300 },
  packArt: {
    flex: 1,
    borderRadius: radii.lg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  packArtText: { color: colors.white, fontWeight: '900', fontSize: 24, letterSpacing: 2 },
  sheen: {
    position: 'absolute',
    top: -60,
    width: 90,
    height: 420,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  flash: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: colors.white,
  },
  text: { marginTop: 16, fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  costLabel: { marginTop: 4, fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  error: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
    color: colors.redDeep,
    textAlign: 'center',
  },
  done: { textAlign: 'center', marginTop: 12, fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  againButton: {
    marginTop: 8,
    marginBottom: 140,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
});
