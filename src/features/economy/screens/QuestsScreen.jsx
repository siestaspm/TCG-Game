// src/features/economy/screens/QuestsScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, SectionList, ActivityIndicator, Pressable } from 'react-native';
import { useQuests } from '../hooks/useQuests';
import Button from '../../../components/ui/Button';
import ScreenBackground from '../../../components/ui/ScreenBackground';
import { colors, radii, shadow } from '../../../constants/theme';

export default function QuestsScreen({ navigation }) {
  const { data: quests, isLoading, isError, error, refetch, isRefetching } = useQuests();

  if (isLoading) {
    return (
      <ScreenBackground>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.blue} />
        </View>
      </ScreenBackground>
    );
  }

  if (isError) {
    return (
      <ScreenBackground>
        <View style={styles.centered}>
          <Text style={styles.error}>{error?.message ?? 'Could not load quests.'}</Text>
          <Button title="Retry" onPress={() => refetch()} style={styles.retryButton} />
        </View>
      </ScreenBackground>
    );
  }

  const sections = [
    { title: 'Daily', data: (quests ?? []).filter((q) => q.type === 'daily') },
    { title: 'Weekly', data: (quests ?? []).filter((q) => q.type === 'weekly') },
  ].filter((section) => section.data.length > 0);

  return (
    <ScreenBackground>
      <SectionList
        style={styles.page}
        contentContainerStyle={styles.content}
        sections={sections}
        keyExtractor={(item) => item.id}
        refreshing={isRefetching}
        onRefresh={refetch}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        ListHeaderComponent={
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>‹ Back</Text>
          </Pressable>
        }
        ListEmptyComponent={<Text style={styles.empty}>No active quests right now.</Text>}
        renderItem={({ item }) => <QuestRow quest={item} />}
      />
    </ScreenBackground>
  );
}

function QuestRow({ quest }) {
  const pct = Math.min(quest.progress / quest.requirement_target, 1);

  return (
    <View style={[styles.card, quest.completed && styles.cardDone]}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardTitle}>{quest.title}</Text>
        <Text style={styles.reward}>+{quest.credit_reward}</Text>
      </View>

      {quest.description ? <Text style={styles.description}>{quest.description}</Text> : null}

      <View style={styles.trackRow}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${pct * 100}%` }]} />
        </View>
        <Text style={styles.count}>
          {quest.progress} / {quest.requirement_target}
        </Text>
      </View>

      {quest.completed && <Text style={styles.doneLabel}>Completed</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 140, gap: 10 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  error: { color: colors.redDeep, fontSize: 14, fontWeight: '600', textAlign: 'center', paddingHorizontal: 24 },
  retryButton: { alignSelf: 'center', paddingHorizontal: 28 },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 40 },

  backButton: { alignSelf: 'flex-start', paddingVertical: 4, marginBottom: 8 },
  backButtonText: { color: colors.textSecondary, fontWeight: '700', fontSize: 13, letterSpacing: 0.5 },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 8,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    ...shadow.card,
  },
  cardDone: { backgroundColor: colors.blueLight, borderColor: colors.blue },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  reward: { fontSize: 13, fontWeight: '800', color: colors.blueDeep },
  description: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },

  trackRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  track: { flex: 1, height: 6, borderRadius: radii.pill, backgroundColor: colors.border, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.blue },
  count: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },

  doneLabel: { marginTop: 8, fontSize: 11, fontWeight: '800', color: colors.blueDeep, letterSpacing: 0.5 },
});