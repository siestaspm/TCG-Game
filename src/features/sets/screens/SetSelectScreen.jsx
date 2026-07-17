// src/features/sets/screens/SetSelectScreen.jsx
import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useSets } from '../hooks/useSets';
import { usePackEconomy } from '../../economy/hooks/usePackEconomy';
import { useQuests } from '../../economy/hooks/useQuests';
import { colors } from '../../../constants/theme';

export default function SetSelectScreen({ navigation }) {
  const { data: sets, isLoading, isError, error, refetch, isRefetching } = useSets();
  const { data: economy } = usePackEconomy();
  const { data: quests } = useQuests();

  // SetSelect lives inside HomeStackNavigator, but the binder ("Collection")
  // now lives in its own tab (see CollectionStackNavigator). navigation.navigate
  // can't reach a screen in a sibling tab's stack directly - you have to go up
  // to the tab navigator first, then tell it which screen inside that tab to
  // land on.
  const goToBinder = (setId) => {
    navigation.getParent()?.navigate('Binder', {
      screen: 'CollectionMain',
      params: setId ? { setId } : undefined,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.blue} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error?.message ?? 'Could not load sets.'}</Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  const freeRemaining = economy?.freePacksRemaining ?? 0;
  const previewQuests = (quests ?? []).filter((q) => q.type === 'daily').slice(0, 2);

  return (
    <View style={styles.container}>
      <View style={styles.economyRow}>
        <View style={styles.freePill}>
          <Text style={styles.freePillText}>
            {freeRemaining > 0 ? `${freeRemaining} free packs today` : 'No free packs left today'}
          </Text>
        </View>
        <View style={styles.creditPill}>
          <Text style={styles.creditPillText}>{economy?.creditBalance ?? 0} credits</Text>
        </View>
      </View>

      <View style={styles.headerRow}>
        <Text style={styles.title}>Select set</Text>
        <Pressable style={styles.binderLink} onPress={() => goToBinder()}>
          <Text style={styles.binderLinkText}>My binder</Text>
        </Pressable>
      </View>

      <FlatList
        data={sets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={
          <Text style={styles.empty}>No sets available yet.</Text>
        }
        ListFooterComponent={
          previewQuests.length > 0 ? (
            <View style={styles.questsSection}>
              <View style={styles.questsHeaderRow}>
                <Text style={styles.questsTitle}>Today's quests</Text>
                <Pressable onPress={() => navigation.navigate('Quests')}>
                  <Text style={styles.questsLink}>View all</Text>
                </Pressable>
              </View>
              {previewQuests.map((quest) => (
                <QuestPreviewRow key={quest.id} quest={quest} />
              ))}
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const isFree = freeRemaining > 0;
          return (
            <View style={styles.card}>
              <Pressable
                style={styles.cardMain}
                onPress={() => navigation.navigate('PackOpening', { setId: item.id })}
              >
                {item.pack_art_url ? (
                  <Image source={{ uri: item.pack_art_url }} style={styles.packArt} />
                ) : (
                  <View style={[styles.packArt, styles.packArtPlaceholder]}>
                    <Text style={styles.packArtPlaceholderText}>?</Text>
                  </View>
                )}

                <View style={styles.cardOverlay}>
                  <Text style={styles.cardCode}>{item.code}</Text>
                  <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                </View>

                <View
                  style={[
                    styles.priceBadge,
                    isFree ? styles.priceBadgeFree : styles.priceBadgePaid,
                  ]}
                >
                  <Text
                    style={[
                      styles.priceBadgeText,
                      isFree ? styles.priceBadgeTextFree : styles.priceBadgeTextPaid,
                    ]}
                  >
                    {isFree ? 'Free today' : `${item.credit_cost} credits`}
                  </Text>
                </View>
              </Pressable>

              <Pressable style={styles.binderButton} onPress={() => goToBinder(item.id)}>
                <Text style={styles.binderButtonText}>View binder</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

function QuestPreviewRow({ quest }) {
  const pct = Math.min(quest.progress / quest.requirement_target, 1);
  return (
    <View style={styles.questCard}>
      <View style={styles.questLabelRow}>
        <Text style={styles.questLabel}>{quest.title}</Text>
        <Text style={styles.questCount}>
          {quest.progress} / {quest.requirement_target}
        </Text>
      </View>
      <View style={styles.questTrack}>
        <View style={[styles.questFill, { width: `${pct * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.mist, paddingTop: 56, paddingHorizontal: 16 },
  centered: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.mist, gap: 16,
  },

  economyRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  freePill: {
    backgroundColor: colors.blueLight,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  freePillText: { color: colors.blueDeep, fontSize: 12, fontWeight: '600' },
  creditPill: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  creditPillText: { color: colors.textPrimary, fontSize: 12, fontWeight: '600' },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, letterSpacing: 1 },
  binderLink: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: colors.blueLight,
    borderWidth: 1,
    borderColor: colors.blue,
  },
  binderLinkText: { color: colors.blueDeep, fontWeight: '800', fontSize: 11, letterSpacing: 0.5 },

  list: { gap: 16, paddingBottom: 32, paddingHorizontal: 4 },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 40 },
  error: { color: colors.red, fontSize: 14, fontWeight: '600', textAlign: 'center', paddingHorizontal: 24 },
  retryButton: {
    backgroundColor: colors.blue,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  retryButtonText: { color: colors.white, fontWeight: '800', letterSpacing: 1 },

  card: { gap: 8 },

  cardMain: {
    height: 150,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  packArt: { width: '100%', height: '100%', position: 'absolute' },
  packArtPlaceholder: {
    width: '100%', height: '100%', position: 'absolute',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.blueLight,
  },
  packArtPlaceholderText: { fontSize: 40, color: colors.blue, fontWeight: '800' },

  cardOverlay: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 2,
  },
  cardCode: { fontSize: 11, fontWeight: '800', color: colors.blueDeep, letterSpacing: 1.5 },
  cardName: { fontSize: 17, fontWeight: '800', color: colors.textPrimary },

  priceBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  priceBadgeFree: { backgroundColor: colors.blue },
  priceBadgePaid: { backgroundColor: colors.redLight, borderWidth: 1, borderColor: colors.red },
  priceBadgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.3 },
  priceBadgeTextFree: { color: colors.white },
  priceBadgeTextPaid: { color: colors.redDeep },

  binderButton: {
    borderWidth: 1,
    borderColor: colors.red,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: colors.redLight,
  },
  binderButtonText: { color: colors.redDeep, fontWeight: '800', fontSize: 12, letterSpacing: 0.5 },

  questsSection: { marginTop: 8, marginBottom: 8 },
  questsHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 10, paddingHorizontal: 4,
  },
  questsTitle: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, letterSpacing: 0.5 },
  questsLink: { fontSize: 12, fontWeight: '700', color: colors.blue },

  questCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 8,
  },
  questLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  questLabel: { fontSize: 13, color: colors.textPrimary, fontWeight: '600' },
  questCount: { fontSize: 12, color: colors.textSecondary },
  questTrack: { height: 6, borderRadius: 999, backgroundColor: colors.border, overflow: 'hidden' },
  questFill: { height: '100%', backgroundColor: colors.blue },
});