import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { ROUTES, useFavoriteNavigation } from '../navigation';
import { MyPostHistoricalResponse } from '../types';
import api from '../utils/api';
import { PostCard } from '../components/PostCard';

export default function FavoriteListScreen() {
  const navigation = useFavoriteNavigation();
  const [posts, setPosts] = useState<MyPostHistoricalResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const res = await api.get<MyPostHistoricalResponse[]>('/my/posts/favorite');
      setPosts(res.data);
    } catch (err) {
      console.error('Fetch favorites failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size='large' />
        <Text>載入中...</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <PostCard post={item} onPress={() => navigation.navigate(ROUTES.Favorite.FavoriteDetail, { item })} />
      )}
      refreshing={loading}
      onRefresh={loadFavorites}
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
