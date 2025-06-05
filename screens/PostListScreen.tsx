import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

import { usePostNavigation, ROUTES } from '../navigation';
import { PostCard } from '../components/PostCard';
import { useRecoilRefresher_UNSTABLE, useRecoilValueLoadable } from 'recoil';
import { postsState } from '../states/postsState';

export default function PostListScreen() {
  const navigation = usePostNavigation();
  const postsLoadable = useRecoilValueLoadable(postsState);
  const refresh = useRecoilRefresher_UNSTABLE(postsState);

  if (postsLoadable.state === 'loading') {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size='large' />
        <Text>載入中...</Text>
      </View>
    );
  }

  if (postsLoadable.state === 'hasError') {
    return (
      <View style={styles.loader}>
        <Text>載入失敗</Text>
      </View>
    );
  }

  const posts = postsLoadable.contents;

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <PostCard post={item} onPress={() => navigation.navigate(ROUTES.Post.PostDetail, { post: item })} />
      )}
      refreshing={postsLoadable.state === ('loading' as any)}
      onRefresh={refresh}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
