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

export default function SetSelectScreen({ navigation }) {
  const { data: sets, isLoading, isError, error, refetch, isRefetching } = useSets();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#2F6FED" />
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Set</Text>
      <FlatList
        data={sets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={
          <Text style={styles.empty}>No sets available yet.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('PackOpening', { setId: item.id })}
          >
            {item.pack_art_url ? (
              <Image source={{ uri: item.pack_art_url }} style={styles.packArt} />
            ) : (
              <View style={[styles.packArt, styles.packArtPlaceholder]} />
            )}
            <View style={styles.cardText}>
              <Text style={styles.cardCode}>{item.code}</Text>
              <Text style={styles.cardName}>{item.name}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F6FC', paddingTop: 60, paddingHorizontal: 20 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F6FC', gap: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#14192E', marginBottom: 16 },
  list: { gap: 12, paddingBottom: 24 },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 40 },
  error: { color: '#E24C4C', fontSize: 14, fontWeight: '600', textAlign: 'center', paddingHorizontal: 24 },
  retryButton: {
    backgroundColor: '#2F6FED',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  retryButtonText: { color: 'white', fontWeight: '700' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    gap: 14,
  },
  packArt: { width: 48, height: 64, borderRadius: 8, backgroundColor: '#E5EAF5' },
  packArtPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  cardText: { flex: 1, gap: 2 },
  cardCode: { fontSize: 12, fontWeight: '700', color: '#2F6FED', letterSpacing: 0.5 },
  cardName: { fontSize: 16, fontWeight: '700', color: '#14192E' },
});