// src/features/collection/screens/CardDetailScreen.jsx
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, ScrollView } from 'react-native';
import { getRarityStyle } from '../../../constants/rarity';
import { colors } from '../../../constants/theme';

export default function CardDetailScreen({ route, navigation }) {
  const { card, context = 'binder' } = route?.params ?? {};

  if (!card) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Card not found.</Text>
      </View>
    );
  }

  const owned = card.quantity > 0;
  const rarity = getRarityStyle(card.rarity);

  // context comes from whichever stack pushed this screen - HomeStackNavigator
  // passes 'pulled' (just opened in a pack), CollectionStackNavigator passes
  // 'binder' (browsing the grid). Same component either way, just a couple of
  // small copy/affordance changes below - not a second screen to maintain.
  const isFreshPull = context === 'pulled';
  const backLabel = isFreshPull ? '‹ Continue' : '‹ Back to binder';

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{backLabel}</Text>
      </Pressable>

      <View
        style={[
          styles.artFrame,
          { borderColor: rarity.color },
          rarity.glow && { shadowColor: rarity.color, ...styles.glow },
        ]}
      >
        {owned ? (
          <Image source={{ uri: card.image_url }} style={styles.art} resizeMode="cover" />
        ) : (
          <View style={styles.artLocked}>
            <Text style={styles.lockGlyph}>?</Text>
            <Text style={styles.lockedLabel}>Not yet collected</Text>
          </View>
        )}
        {owned && rarity.glow && <View style={styles.foilSheen} pointerEvents="none" />}
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.cardName} numberOfLines={2}>
          {owned ? card.name : '???'}
        </Text>
        {isFreshPull && owned ? (
          <View style={styles.newPill}>
            <Text style={styles.newPillText}>New pull</Text>
          </View>
        ) : (
          card.quantity > 1 && (
            <View style={styles.qtyPill}>
              <Text style={styles.qtyPillText}>Owned ×{card.quantity}</Text>
            </View>
          )
        )}
      </View>

      <View style={[styles.rarityTag, { backgroundColor: rarity.color }]}>
        <Text style={styles.rarityTagText}>{rarity.label.toUpperCase()}</Text>
      </View>

      <View style={styles.statGrid}>
        <StatRow label="Card No." value={card.card_code} />
        <StatRow label="Type" value={card.card_type ?? '—'} />
        <StatRow label="Color" value={card.color ?? '—'} />
        <StatRow
          label="Variant"
          value={card.art_variant > 0 ? `Alt Art #${card.art_variant}` : 'Original'}
        />
      </View>

      {!owned && (
        <View style={styles.hintBox}>
          <Text style={styles.hintText}>
            Open packs from this set for a chance to pull this card.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

function StatRow({ label, value }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.mist },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.mist },
  errorText: { color: colors.red, fontWeight: '600' },
  content: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 40, gap: 16 },

  backButton: { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 2 },
  backButtonText: { color: colors.textSecondary, fontWeight: '700', fontSize: 13, letterSpacing: 0.5 },

  artFrame: {
    width: '100%',
    aspectRatio: 0.7,
    borderRadius: 18,
    borderWidth: 3,
    backgroundColor: colors.white,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  glow: { shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { width: 0, height: 0 }, elevation: 8 },
  art: { width: '100%', height: '100%' },
  artLocked: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  lockGlyph: { fontSize: 56, color: colors.textSecondary, fontWeight: '800' },
  lockedLabel: { color: colors.textSecondary, fontWeight: '800', fontSize: 12, letterSpacing: 2 },
  foilSheen: {
    position: 'absolute', top: -100, left: -60, width: '220%', height: 100,
    backgroundColor: 'rgba(255,255,255,0.4)', transform: [{ rotate: '20deg' }],
  },

  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  cardName: { flex: 1, fontSize: 24, fontWeight: '800', color: colors.textPrimary },

  qtyPill: { backgroundColor: colors.blueLight, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  qtyPillText: { color: colors.blueDeep, fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },

  newPill: { backgroundColor: colors.redLight, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  newPillText: { color: colors.redDeep, fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },

  rarityTag: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  rarityTagText: { color: colors.white, fontWeight: '800', fontSize: 11, letterSpacing: 1 },

  statGrid: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  statRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  statLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  statValue: { color: colors.textPrimary, fontSize: 13, fontWeight: '700' },

  hintBox: {
    backgroundColor: colors.blueLight,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: colors.blue,
  },
  hintText: { color: colors.blueDeep, fontSize: 13, lineHeight: 18 },
});