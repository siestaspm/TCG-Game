import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import CardStack from './CardStack';
import ProgressIndicator from './ProgressIndicator';
import ResultGrid from './ResultGrid';
import usePackSequence from '../hooks/usePackSequence';
import { openPack as playOpenAnim, pressPack, releasePack } from '../animations/packAnimations';

export default function PackView({ cards = [], onRequestOpen, loading, onCardEffectsFeedback }) {
  const { phase, currentIndex, totalCards, remainingCards, beginReveal, advance, reset } =
    usePackSequence(cards);

  const packScale = useSharedValue(1);
  const packOpacity = useSharedValue(1);

  // True from tap until cards have arrived AND the rip animation has played.
  const [awaitingCards, setAwaitingCards] = useState(false);

  const packStyle = useAnimatedStyle(() => ({
    transform: [{ scale: packScale.value }],
    opacity: packOpacity.value,
  }));

  const handleTapPack = () => {
    if (awaitingCards) return;
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

    playOpenAnim({
      packScale,
      packOpacity,
      onFinished: () => {
        beginReveal();
        setAwaitingCards(false);
      },
    });
  }, [awaitingCards, loading, cards.length]);

  if (phase === 'PACK') {
    return (
      <View style={styles.center}>
        <Pressable
          onPress={handleTapPack}
          onPressIn={() => pressPack(packScale)}
          onPressOut={() => releasePack(packScale)}
          disabled={awaitingCards}
        >
          <Animated.View style={[styles.pack, packStyle]}>
            <View style={styles.packArt}>
              <Text style={styles.packArtText}>PACK</Text>
            </View>
          </Animated.View>
        </Pressable>

        <Text style={styles.text}>{awaitingCards ? 'Opening…' : 'Tap to open pack'}</Text>
      </View>
    );
  }

  if (phase === 'REVEAL') {
    return (
      <View style={styles.container}>
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

  // RESULTS
  return (
    <View style={styles.container}>
      <ProgressIndicator current={totalCards} total={totalCards} />
      <Text style={styles.done}>Pack Complete</Text>
      <ResultGrid cards={cards} />
      <Pressable style={styles.againButton} onPress={reset}>
        <Text style={styles.againText}>Open Another</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, paddingTop: 20 },
  pack: { width: 220, height: 300 },
  packArt: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#2F6FED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  packArtText: { color: '#FFF', fontWeight: '900', fontSize: 24, letterSpacing: 2 },
  text: { marginTop: 16, fontSize: 14, fontWeight: '700', color: '#14192E' },
  done: { textAlign: 'center', marginTop: 12, fontSize: 18, fontWeight: '800' },
  againButton: {
    marginTop: 8,
    marginBottom: 20,
    alignSelf: 'center',
    backgroundColor: '#2F6FED',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
  },
  againText: { color: '#FFF', fontWeight: '800' },
});