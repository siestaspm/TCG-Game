// src/features/profile/screens/ProfileScreen.jsx
import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LockIcon, LogOutIcon, ChevronRightIcon } from '../../../components/icons';
import { useAuth } from '../../auth/hooks/useAuth';
import Surface from '../../../components/ui/Surface';
import ScreenBackground from '../../../components/ui/ScreenBackground';
import { colors, gradients, radii } from '../../../constants/theme';

const ROW_ICONS = {
  lock: LockIcon,
  'log-out': LogOutIcon,
};

export default function ProfileScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const initial = (user?.email?.[0] ?? '?').toUpperCase();

  return (
    <ScreenBackground>
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <LinearGradient
          colors={gradients.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>{initial}</Text>
        </LinearGradient>
        <View style={styles.headerText}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{user?.email}</Text>
        </View>
      </View>

      <Surface padded={false} style={styles.group}>
        <SettingsRow
          icon="lock"
          label="Change password"
          onPress={() => navigation.navigate('ChangePassword')}
        />
      </Surface>

      <Surface padded={false} style={styles.group}>
        <SettingsRow
          icon="log-out"
          label="Sign out"
          destructive
          onPress={() => signOut()}
          last
        />
      </Surface>
    </ScrollView>
    </ScreenBackground>
  );
}

function SettingsRow({ icon, label, onPress, destructive, last }) {
  const RowIcon = ROW_ICONS[icon];
  return (
    <Pressable style={[styles.row, !last && styles.rowDivider]} onPress={onPress}>
      <RowIcon size={18} color={destructive ? colors.redDeep : colors.blue} />
      <Text style={[styles.rowLabel, destructive && styles.rowLabelDestructive]}>{label}</Text>
      {!destructive && <ChevronRightIcon size={18} color={colors.textSecondary} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  content: { padding: 20, paddingTop: 56, paddingBottom: 140, gap: 20 },

  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.white, fontSize: 22, fontWeight: '800' },
  headerText: { flex: 1, gap: 2 },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: '800' },
  subtitle: { color: colors.textSecondary, fontSize: 13 },

  group: { overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLabel: { flex: 1, color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  rowLabelDestructive: { color: colors.redDeep },
});
