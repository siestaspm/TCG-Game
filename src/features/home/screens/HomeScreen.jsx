import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowRightIcon, BinderIcon, CheckCircleIcon } from '../../../components/icons';
import { useAuth } from '../../auth/hooks/useAuth';
import Surface from '../../../components/ui/Surface';
import ScreenBackground from '../../../components/ui/ScreenBackground';
import { colors, gradients, radii } from '../../../constants/theme';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();

  return (
    <ScreenBackground>
      <ScrollView style={styles.page} contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>welcome back</Text>
        <Text style={styles.title} numberOfLines={1}>{user?.email ?? 'Captain'}</Text>

        <Pressable onPress={() => navigation.navigate('GameSelect')}>
          <LinearGradient
            colors={gradients.brand}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.banner}
          >
            <View style={styles.bannerText}>
              <Text style={styles.bannerEyebrow}>Pick a TCG</Text>
              <Text style={styles.bannerTitle}>Open your next pack</Text>
            </View>
            <ArrowRightIcon size={22} color={colors.white} />
          </LinearGradient>
        </Pressable>

        <View style={styles.quickRow}>
          <Pressable style={styles.quickTilePress} onPress={() => navigation.getParent()?.navigate('Binder')}>
            <Surface style={styles.quickTile}>
              <BinderIcon size={18} color={colors.red} />
              <Text style={styles.quickLabel}>My binder</Text>
              <Text style={styles.quickHint}>View your collection</Text>
            </Surface>
          </Pressable>

          <Pressable
            style={styles.quickTilePress}
            onPress={() => navigation.navigate('Quests')}
          >
            <Surface style={styles.quickTile}>
              <CheckCircleIcon size={18} color={colors.blue} />
              <Text style={styles.quickLabel}>Quests</Text>
              <Text style={styles.quickHint}>Daily & weekly goals</Text>
            </Surface>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  content: { padding: 20, paddingTop: 56, paddingBottom: 140, gap: 16 },

  eyebrow: { color: colors.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '800', marginTop: 2 },

  banner: {
    borderRadius: radii.xl,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerText: { gap: 6 },
  bannerEyebrow: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  bannerTitle: { color: colors.white, fontSize: 18, fontWeight: '800' },

  quickRow: { flexDirection: 'row', gap: 12 },
  quickTilePress: { flex: 1 },
  quickTile: { gap: 4 },
  quickLabel: { color: colors.textPrimary, fontSize: 13, fontWeight: '700', marginTop: 4 },
  quickHint: { color: colors.textSecondary, fontSize: 11 },
});
