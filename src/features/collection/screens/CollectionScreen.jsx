// src/features/collection/screens/CollectionScreen.jsx
import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useCollection } from '../hooks/useCollection';
import { getRarityStyle } from '../../../constants/rarity';
import { colors } from '../../../constants/theme';

const COLUMNS = 3;

function CardSlot({ card, onPress }) {
  const owned = card.quantity > 0;
  const rarity = getRarityStyle(card.rarity);

  if (!owned) {
    return (
      <View style={[styles.slot, styles.slotLocked, { borderColor: rarity.color + '55' }]}>
        <Text style={styles.lockGlyph}>?</Text>
        <View style={[styles.rarityPip, { backgroundColor: rarity.color + '22' }]}>
          <Text style={[styles.rarityPipText, { color: rarity.color }]}>{rarity.label}</Text>
        </View>
        <Text style={styles.cardCodeLocked} numberOfLines={1}>{card.card_code}</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.slot,
        { borderColor: rarity.color },
        rarity.glow && { shadowColor: rarity.color, ...styles.glow },
      ]}
      onPress={onPress}
    >
      <Image source={{ uri: card.image_url }} style={styles.cardImage} resizeMode="cover" />

      {/* diagonal foil sheen - only on the rarities worth flexing */}
      {rarity.glow && <View style={styles.foilSheen} pointerEvents="none" />}

      <View style={[styles.rarityBadge, { backgroundColor: rarity.color }]}>
        <Text style={styles.rarityBadgeText}>{rarity.label}</Text>
      </View>

      {card.quantity > 1 && (
        <View style={styles.qtyBadge}>
          <Text style={styles.qtyText}>×{card.quantity}</Text>
        </View>
      )}

      <View style={styles.cardCodeBar}>
        <Text style={styles.cardCode} numberOfLines={1}>{card.card_code}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function CollectionScreen({ route, navigation }) {
  const { setId } = route?.params ?? {};
  const { data: cards, isLoading, error } = useCollection(setId);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.red} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Couldn't load your binder.</Text>
      </View>
    );
  }

  const ownedCount = cards.filter((c) => c.quantity > 0).length;
  const pct = cards.length ? ownedCount / cards.length : 0;

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Collection</Text>
        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{ownedCount} / {cards.length}</Text>
        </View>
      </View>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        numColumns={COLUMNS}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <CardSlot
            card={item}
            onPress={() => navigation.navigate('CardDetail', { card: item, context: 'binder' })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.mist },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.mist },
  errorText: { color: colors.red, fontWeight: '600' },

  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 18 },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
  },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.redLight,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.red,
  },
  progressLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: '700' },

  grid: { paddingHorizontal: 10, paddingBottom: 24 },

  slot: {
    flex: 1 / COLUMNS,
    margin: 6,
    aspectRatio: 0.7,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  glow: {
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  slotLocked: {
    backgroundColor: colors.mist,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockGlyph: { fontSize: 26, color: colors.textSecondary, fontWeight: '800' },

  cardImage: { width: '100%', height: '100%', position: 'absolute' },

  foilSheen: {
    position: 'absolute',
    top: -40,
    left: -20,
    width: '160%',
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.35)',
    transform: [{ rotate: '25deg' }],
  },

  rarityBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rarityBadgeText: { color: colors.white, fontSize: 10, fontWeight: '800' },

  rarityPip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  rarityPipText: { fontSize: 11, fontWeight: '800' },

  qtyBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  qtyText: { color: colors.white, fontSize: 11, fontWeight: '700' },

  cardCodeBar: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 3,
  },
  cardCode: {
    fontSize: 10,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardCodeLocked: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});