import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

import { usePostNavigation, ROUTES } from '../navigation';
import { PostInfo } from '../types/PostTypes';
import api from '../utils/api';
import { toYYYYMMDDWithSeparator } from '../utils/datetimeFormatter';

export default function PostListScreen() {
  const navigation = usePostNavigation();
  const [posts, setPosts] = useState<PostInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: { posts: PostInfo[] } }>('/ptt/posts');
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
      <ActivityIndicator size="large" />
      <Text>載入中...</Text>
    </View>
  ) : (
    <FlatList
      contentContainerStyle={styles.container}
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate(ROUTES.Post.PostDetail, { post: item })}
        >
          <Text style={styles.title}>
            [{item.tag}] {item.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.author}>{item.author}</Text>
            <Text style={styles.date}>{toYYYYMMDDWithSeparator(new Date(item.id * 1000), '-')}</Text>
          </View>
        </TouchableOpacity>
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
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    alignItems: 'center',
  },
  author: {
    fontSize: 13,
    color: '#555',
  },
  date: {
    fontSize: 13,
    color: '#888',
  },
});
