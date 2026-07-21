// src/features/collection/screens/CollectionScreen.jsx
import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Pressable } from 'react-native';
import { useCollection } from '../hooks/useCollection';
import { useSets } from '../../sets/hooks/useSets';
import { GAMES } from '../../../constants/games';
import { getRarityStyle } from '../../../constants/rarity';
import ScreenBackground from '../../../components/ui/ScreenBackground';
import { colors, radii, shadow } from '../../../constants/theme';

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
  const { data: sets } = useSets();
  const [gameFilter, setGameFilter] = useState('all');

  const setGameMap = useMemo(
    () => new Map((sets ?? []).map((s) => [s.id, s.game_code])),
    [sets],
  );

  // Only worth showing filter chips once more than one game actually has
  // sets in Supabase - today that's just Pokemon, so this row stays hidden
  // until a second game's sets are tagged with a game_code.
  const gamesInCollection = useMemo(() => {
    const present = new Set(setGameMap.values());
    return GAMES.filter((g) => present.has(g.id));
  }, [setGameMap]);

  const visibleCards = useMemo(() => {
    if (setId || gameFilter === 'all') return cards ?? [];
    return (cards ?? []).filter((c) => setGameMap.get(c.set_id) === gameFilter);
  }, [cards, gameFilter, setGameMap, setId]);

  if (isLoading) {
    return (
      <ScreenBackground>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.red} />
        </View>
      </ScreenBackground>
    );
  }

  if (error) {
    return (
      <ScreenBackground>
        <View style={styles.center}>
          <Text style={styles.errorText}>Couldn't load your binder.</Text>
        </View>
      </ScreenBackground>
    );
  }

  const ownedCount = visibleCards.filter((c) => c.quantity > 0).length;
  const pct = visibleCards.length ? ownedCount / visibleCards.length : 0;

  return (
    <ScreenBackground>
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Collection</Text>
        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{ownedCount} / {visibleCards.length}</Text>
        </View>

        {!setId && gamesInCollection.length > 1 && (
          <View style={styles.chipRow}>
            <Chip label="All" active={gameFilter === 'all'} onPress={() => setGameFilter('all')} />
            {gamesInCollection.map((g) => (
              <Chip
                key={g.id}
                label={g.name}
                active={gameFilter === g.id}
                onPress={() => setGameFilter(g.id)}
              />
            ))}
          </View>
        )}
      </View>

      <FlatList
        data={visibleCards}
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
    </ScreenBackground>
  );
}

function Chip({ label, active, onPress }) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: colors.redDeep, fontWeight: '600' },

  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 18, gap: 12 },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.redLight,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radii.pill,
    backgroundColor: colors.red,
  },
  progressLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: '700' },

  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.blue, borderColor: colors.blue },
  chipText: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
  chipTextActive: { color: colors.white },

  grid: { paddingHorizontal: 10, paddingBottom: 140 },

  slot: {
    flex: 1 / COLUMNS,
    margin: 6,
    aspectRatio: 0.7,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 2,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    ...shadow.card,
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
    shadowOpacity: 0,
    elevation: 0,
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
    borderRadius: radii.sm,
  },
  rarityBadgeText: { color: colors.white, fontSize: 10, fontWeight: '800' },

  rarityPip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
    marginBottom: 6,
  },
  rarityPipText: { fontSize: 11, fontWeight: '800' },

  qtyBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: radii.sm,
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
