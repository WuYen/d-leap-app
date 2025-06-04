import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

import { usePostNavigation, ROUTES } from '../navigation';
import { PostInfo } from '../types';
import api from '../utils/api';
import { PostCard } from '../components/PostCard';

export default function PostListScreen() {
  const navigation = usePostNavigation();
  const [posts, setPosts] = useState<PostInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ posts: PostInfo[] }>('/ptt/posts');
      setPosts(res.data.posts);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return loading ? (
    <View style={styles.loader}>
      <ActivityIndicator size='large' />
      <Text>載入中...</Text>
    </View>
  ) : (
    <FlatList
      contentContainerStyle={styles.container}
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <PostCard post={item} onPress={() => navigation.navigate(ROUTES.Post.PostDetail, { post: item })} />
      )}
      refreshing={loading}
      onRefresh={loadPosts}
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
