// screens/DetailScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import PostDetailCard from '../components/PostDetailCard';

type DetailRouteProp = RouteProp<RootStackParamList, 'Detail'>;

export default function DetailScreen() {
  const route = useRoute<DetailRouteProp>();
  const { post } = route.params;

  return (
    <View style={styles.container}>
      <PostDetailCard post={post} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
