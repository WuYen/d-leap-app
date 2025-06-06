import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

import { usePostNavigation, ROUTES } from '../navigation';
import { PostCard } from '../components/PostCard';
import { useRecoilRefresher_UNSTABLE, useRecoilValueLoadable } from 'recoil';
import { postsState } from '../states/postsState';
import api from '../utils/api';
import { PostInfo } from '../types';
import SearchBar from '../components/SearchBar';

export default function PostListScreen() {
  const navigation = usePostNavigation();
  const postsLoadable = useRecoilValueLoadable(postsState);
  const refresh = useRecoilRefresher_UNSTABLE(postsState);

  const [filterText, setFilterText] = useState('');
  const [searchResults, setSearchResults] = useState<PostInfo[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleChangeText = (text: string) => {
    setFilterText(text);
    if (text === '') {
      setSearchResults(null);
    } else {
      // clear previous results so local filter will be used until search is pressed
      setSearchResults(null);
    }
  };

  const handleSearch = async (text: string) => {
    if (!text.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      setSearchLoading(true);
      const res = await api.get<{ posts: PostInfo[] }>(
        `/my/posts/search?search=${encodeURIComponent(text)}`
      );
      setSearchResults(res.data.posts);
    } catch (err) {
      console.error('Search posts failed:', err);
    } finally {
      setSearchLoading(false);
    }
  };

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
  const filteredPosts = filterText
    ? posts.filter((p) => p.title.includes(filterText))
    : posts;
  const data: PostInfo[] =
    filterText === '' ? posts : searchResults ?? filteredPosts;

  return (
    <FlatList
      ListHeaderComponent={
        <SearchBar
          onDebouncedTextChange={handleChangeText}
          onSearch={handleSearch}
          loading={searchLoading}
        />
      }
      contentContainerStyle={styles.container}
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <PostCard
          post={item}
          onPress={() => navigation.navigate(ROUTES.Post.PostDetail, { post: item })}
        />
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
