// screens/DetailScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { PostCard } from '../components/PostCard';
import { usePostRoute, ROUTES } from '../navigation';

export default function DetailScreen() {
  const route = usePostRoute<typeof ROUTES.Post.PostDetail>(); // ✅ 型別安全補完
  const { post } = route.params;

  return (
    <View style={styles.container}>
      <PostCard post={post} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
