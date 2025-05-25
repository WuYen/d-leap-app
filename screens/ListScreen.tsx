import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { PostItem } from '../types/PostItem';
import api from '../utils/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'List'>;

export default function ListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    setLoading(true);

    try {
      const res = await api.get<{ data: { posts: PostItem[] } }>('/ptt/posts');
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
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Detail', { post: item })} // 👈 傳整個物件
        >
          <Text style={styles.title}>
            [{item.tag}] {item.title}
          </Text>
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
});
