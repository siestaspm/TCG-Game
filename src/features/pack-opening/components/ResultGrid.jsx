import React from 'react';
import { View, FlatList, Pressable, StyleSheet } from 'react-native';

import CardFace from './CardFace';

export default function ResultGrid({ cards, navigation }) {
  return (
    <FlatList
      data={cards}
      keyExtractor={(item, index) => `${item.id}-${item.slot_position}-${index}`}
      numColumns={3}
      scrollEnabled
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <Pressable
          style={styles.cell}
          onPress={() =>
            navigation?.navigate('CardDetail', { card: item, context: 'pulled' })
          }
        >
          <CardFace card={item} />
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingBottom: 20, gap: 12 },
  row: { gap: 12 },
  cell: { flex: 1, aspectRatio: 0.72 },
});