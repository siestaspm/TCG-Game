// src/features/pack-opening/components/RevealedCardsGrid.jsx
import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { isHit, rarityColor } from '../lib/rarity';

export default function RevealedCardsGrid({ cards }) {
  const hitCount = cards.filter((c) => isHit(c.rarity)).length;

  return (
    <View style={styles.container}>
      <Text style={styles.summary}>
        {cards.length} cards opened
        {hitCount > 0 ? ` \u2022 ${hitCount} hit${hitCount > 1 ? 's' : ''}!` : ''}
      </Text>
      <FlatList
        data={cards}
        keyExtractor={(item) => `${item.id}-${item.slot_position}`}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => {
          const hit = isHit(item.rarity);
          return (
            <View style={[styles.cell, hit && styles.cellHit]}>
              {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.image} resizeMode="cover" />
              ) : (
                <View style={[styles.image, styles.imagePlaceholder]} />
              )}
              <View style={[styles.rarityChip, { backgroundColor: rarityColor(item.rarity) }]}>
                <Text style={styles.rarityChipText}>{item.rarity}</Text>
              </View>
              <Text style={styles.cardName} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  summary: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#14192E',
    marginBottom: 12,
  },
  grid: { gap: 12, paddingBottom: 24 },
  row: { gap: 12 },
  cell: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 6,
    alignItems: 'center',
  },
  cellHit: {
    borderWidth: 2,
    borderColor: '#E0A429',
    shadowColor: '#E0A429',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  image: {
    width: '100%',
    aspectRatio: 0.72,
    borderRadius: 10,
    backgroundColor: '#E5EAF5',
  },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  rarityChip: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  rarityChipText: { color: 'white', fontWeight: '800', fontSize: 9 },
  cardName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#14192E',
    marginTop: 6,
    textAlign: 'center',
  },
});