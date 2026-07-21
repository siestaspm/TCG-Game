// src/features/games/screens/GameSelectScreen.jsx
import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SwordIcon, FlameIcon, ChevronRightIcon } from '../../../components/icons';
import { GAMES } from '../../../constants/games';
import ScreenBackground from '../../../components/ui/ScreenBackground';
import { colors, gradients, radii, shadow } from '../../../constants/theme';

const GAME_ICONS = {
  sword: SwordIcon,
  flame: FlameIcon,
};

export default function GameSelectScreen({ navigation }) {
  return (
    <ScreenBackground>
      <ScrollView style={styles.page} contentContainerStyle={styles.content}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>‹ Back</Text>
        </Pressable>

        <Text style={styles.title}>Pick a TCG</Text>
        <Text style={styles.subtitle}>Choose a trading card game to open packs from.</Text>

        <View style={styles.list}>
          {GAMES.map((game) => (
            <GameTile
              key={game.id}
              game={game}
              onPress={() => navigation.navigate('SetSelect', { gameId: game.id })}
            />
          ))}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

function GameTile({ game, onPress }) {
  const GameIcon = GAME_ICONS[game.icon];

  return (
    <Pressable
      style={[styles.tile, !game.available && styles.tileLocked]}
      onPress={game.available ? onPress : undefined}
      disabled={!game.available}
    >
      <LinearGradient
        colors={game.available ? gradients.brand : ['#B9C0D6', '#9AA2BE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.badge}
      >
        <GameIcon size={26} color={colors.white} />
      </LinearGradient>

      <View style={styles.tileText}>
        <Text style={styles.tileName}>{game.name}</Text>
        <Text style={styles.tileTagline}>{game.tagline}</Text>
      </View>

      {!game.available && (
        <View style={styles.soonPill}>
          <Text style={styles.soonPillText}>Coming soon</Text>
        </View>
      )}

      {game.available && <ChevronRightIcon size={20} color={colors.textSecondary} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  content: { padding: 20, paddingTop: 56, paddingBottom: 140, gap: 16 },

  backButton: { alignSelf: 'flex-start', paddingVertical: 4, marginBottom: 4 },
  backButtonText: { color: colors.textSecondary, fontWeight: '700', fontSize: 13, letterSpacing: 0.5 },

  title: { color: colors.textPrimary, fontSize: 26, fontWeight: '800' },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginBottom: 8 },

  list: { gap: 14 },

  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    ...shadow.card,
  },
  tileLocked: { opacity: 0.65 },

  badge: {
    width: 52,
    height: 52,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tileText: { flex: 1, gap: 3 },
  tileName: { color: colors.textPrimary, fontSize: 16, fontWeight: '800' },
  tileTagline: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },

  soonPill: {
    backgroundColor: colors.mist,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  soonPillText: { color: colors.textSecondary, fontSize: 11, fontWeight: '800' },
});
