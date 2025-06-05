import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { ROUTES, useFavoriteNavigation } from '../navigation';
import { PostCard } from '../components/PostCard';
import { useRecoilState } from 'recoil';
import { favoritesState } from '../states/favoritesState';

export default function FavoriteListScreen() {
  const navigation = useFavoriteNavigation();
  const [favoriteData, setFavoriteData] = useRecoilState(favoritesState);
  const { posts, loading } = favoriteData;

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
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
        // TODO: onPress={() => navigation.navigate(ROUTES.Favorite.FavoriteDetail, { item })}
        <PostCard post={item} />
      )}
      //TODO: 這裡可以加上下拉刷新功能
      //refreshing={loading}
      //onRefresh={loadFavorites}
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
