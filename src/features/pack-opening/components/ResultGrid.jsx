import React from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import CardFace from './CardFace';
import { RESULT_STAGGER_MS } from '../animations/constants';

export default function ResultGrid({ cards, navigation }) {
  return (
    <FlatList
      data={cards}
      keyExtractor={(item, index) => `${item.id}-${item.slot_position}-${index}`}
      numColumns={3}
      scrollEnabled
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
      renderItem={({ item, index }) => (
        <Animated.View
          entering={FadeInUp.delay(index * RESULT_STAGGER_MS).springify().damping(16)}
          style={styles.cell}
        >
          <Pressable
            style={styles.cellPress}
            onPress={() =>
              navigation?.navigate('CardDetail', { card: item, context: 'pulled' })
            }
          >
            <CardFace card={item} />
          </Pressable>
        </Animated.View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingBottom: 20, gap: 12 },
  row: { gap: 12 },
  cell: { flex: 1, aspectRatio: 0.72 },
  cellPress: { flex: 1 },
});