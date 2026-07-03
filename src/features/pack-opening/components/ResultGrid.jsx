import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

import CardFace from './CardFace';

export default function ResultGrid({ cards }) {
  return (
    <FlatList
      data={cards}
      keyExtractor={(item, index) => `${item.id}-${item.slot_position}-${index}`}
      numColumns={3}
      scrollEnabled
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <View style={styles.cell}>
          <CardFace card={item} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingBottom: 20, gap: 12 },
  row: { gap: 12 },
  cell: { flex: 1, aspectRatio: 0.72 },
});