// src/features/pack-opening/screens/PackOpeningScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useSet } from '../../sets/hooks/useSets';
import { useOpenPack } from '../hooks/useOpenPack';
import SwipeableCard from '../components/SwipeableCard';
import RevealedCardsGrid from '../components/RevealedCardsGrid';

// Screen walks through three stages for a single pack:
//   'closed'    - pack art, tap to open
//   'revealing' - swipe right through each pulled card, one at a time
//   'summary'   - grid of everything pulled, hits highlighted
export default function PackOpeningScreen({ route, navigation }) {
  const { setId } = route.params ?? {};
  const { data: set } = useSet(setId);
  const openPack = useOpenPack();

  console.log(openPack)

  const [stage, setStage] = useState('closed');
  const [revealIndex, setRevealIndex] = useState(0);

  const cards = openPack.data?.cards ?? [];

  const handleOpenPack = () => {
    openPack.mutate(setId, {
      onSuccess: () => {
        setRevealIndex(0);
        setStage('revealing');
      },
    });
  };

  const handleCardSwiped = () => {
    setRevealIndex((prev) => {
      const next = prev + 1;
      if (next >= cards.length) {
        setStage('summary');
      }
      return next;
    });
  };

  const handleOpenAnother = () => {
    openPack.reset();
    setStage('closed');
    setRevealIndex(0);
  };

  if (stage === 'summary') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{set?.name ?? 'Pack Results'}</Text>
        <RevealedCardsGrid cards={cards} />
        <View style={styles.footer}>
          <Pressable style={styles.primaryButton} onPress={handleOpenAnother}>
            <Text style={styles.primaryButtonText}>Open Another Pack</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('SetSelect')}>
            <Text style={styles.link}>Back to sets</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (stage === 'revealing') {
    // Render current card on top plus up to 2 cards stacked behind it for depth.
    const stackSlice = cards.slice(revealIndex, revealIndex + 3);

    return (
      <View style={styles.container}>
        <Text style={styles.progress}>
          {Math.min(revealIndex + 1, cards.length)} / {cards.length}
        </Text>
        <View style={styles.stack}>
          {stackSlice
            .map((card, i) => (
              <SwipeableCard
                key={`${card.id}-${revealIndex + i}`}
                card={card}
                isTop={i === 0}
                onSwiped={handleCardSwiped}
              />
            ))
            .reverse()}
        </View>
        <Text style={styles.hint}>Swipe right to reveal the next card</Text>
      </View>
    );
  }

  // stage === 'closed'
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{set?.name ?? 'Pack Opening'}</Text>

      {set?.pack_art_url ? (
        <Image source={{ uri: set.pack_art_url }} style={styles.packArt} resizeMode="contain" />
      ) : (
        <View style={[styles.packArt, styles.packArtPlaceholder]} />
      )}

      {openPack.isError ? (
        <Text style={styles.error}>
          {openPack.error?.message ?? 'Could not open pack. Try again.'}
        </Text>
      ) : null}

      <Pressable
        style={styles.primaryButton}
        onPress={handleOpenPack}
        disabled={openPack.isPending}
      >
        {openPack.isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.primaryButtonText}>Open Pack</Text>
        )}
      </Pressable>

      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.link}>← Back to sets</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F6FC',
    paddingTop: 40,
    paddingHorizontal: 20,
    gap: 16,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#14192E', textAlign: 'center' },
  packArt: { width: 220, height: 300, borderRadius: 16 },
  packArtPlaceholder: { backgroundColor: '#E5EAF5' },
  error: { color: '#E24C4C', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  primaryButton: {
    backgroundColor: '#2F6FED',
    borderRadius: 999,
    paddingVertical: 15,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  primaryButtonText: { color: 'white', fontWeight: '700', fontSize: 15 },
  link: { color: '#6B7280', fontSize: 13, fontWeight: '600' },
  progress: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  stack: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' },
  hint: { color: '#6B7280', fontSize: 13, marginBottom: 20 },
  footer: { width: '100%', alignItems: 'center', gap: 10, paddingTop: 12 },
});