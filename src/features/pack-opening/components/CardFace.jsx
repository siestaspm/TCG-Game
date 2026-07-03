import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import { isHit, rarityColor } from '../lib/rarity';
import { CARD_BORDER_RADIUS } from '../animations/constants';

export default function CardFace({ card }) {
  const hit = isHit(card.rarity);
  const color = rarityColor(card.rarity);

  return (
    <View style={[styles.card, hit && { borderColor: color, borderWidth: 3 }]}>
      {card.image_url ? (
        <Image source={{ uri: card.image_url }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>{card.card_code}</Text>
        </View>
      )}

      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>{card.rarity}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.code}>{card.card_code}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {card.name}
        </Text>
        {hit && <Text style={[styles.hit, { color }]}>HIT!</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: CARD_BORDER_RADIUS,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  image: { width: '100%', height: '80%', backgroundColor: '#E5EAF5' },
  placeholder: {
    width: '100%',
    height: '80%',
    backgroundColor: '#E5EAF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { color: '#9AA5C3', fontWeight: '700', fontSize: 12 },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { color: '#FFF', fontWeight: '800', fontSize: 11 },
  info: { flex: 1, justifyContent: 'center', paddingHorizontal: 14 },
  code: { fontSize: 11, color: '#2F6FED', fontWeight: '700', letterSpacing: 0.5 },
  name: { marginTop: 4, fontSize: 15, fontWeight: '800', color: '#14192E' },
  hit: { marginTop: 4, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
});