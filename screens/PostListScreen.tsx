import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRecoilRefresher_UNSTABLE, useRecoilValueLoadable } from 'recoil';

import { usePostNavigation, ROUTES } from '../navigation';
import { postsState } from '../states/postsState';
import { PostInfo } from '../types';
import { PostCard } from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import { usePostListData } from '../hooks/usePostListData';

export default function PostListScreen() {
  const navigation = usePostNavigation();
  const postsLoadable = useRecoilValueLoadable(postsState);
  const refresh = useRecoilRefresher_UNSTABLE(postsState);
  const { postListState, setTag, handleDebouncedTextChange, handleSearch } = usePostListData(postsLoadable);

  // 點擊貼文跳轉
  const handlePressPost = useCallback(
    (item: PostInfo) => {
      navigation.navigate(ROUTES.Post.PostDetail, { post: item });
    },
    [navigation]
  );

  // 資料載入判斷
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
        <Text>載入失敗，請稍後再試 🙈</Text>
      </View>
    );
  }

  return (
    <FlatList
      ListHeaderComponent={
        <View>
          <SearchBar
            placeholder={'搜尋文章標題'}
            onDebouncedTextChange={handleDebouncedTextChange}
            onSearch={handleSearch}
            loading={postListState.searchLoading}
          />
          <View style={styles.tagRow}>
            {postListState.tags.map((tag) => (
              <TouchableOpacity
                key={tag}
                onPress={() => setTag(tag as '標的' | '全部')}
                style={[styles.tagButton, postListState.activeTag === tag && styles.activeTagButton]}
              >
                <Text style={postListState.activeTag === tag ? styles.activeTagText : styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      }
      contentContainerStyle={styles.container}
      data={postListState.displayData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <PostCard post={item} onPress={() => handlePressPost(item)} />}
      refreshing={postsLoadable.state === ('loading' as any)}
      onRefresh={refresh}
      ListEmptyComponent={
        <View style={{ alignItems: 'center', marginTop: 32 }}>
          <Text>目前沒有符合條件的貼文喔</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  tagRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tagButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
    marginRight: 8,
  },
  activeTagButton: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  tagText: {
    color: '#333',
  },
  activeTagText: {
    color: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
