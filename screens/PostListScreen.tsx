import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

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

  // 搜尋與過濾相關 state
  const [filterText, setFilterText] = useState('');
  const [searchResults, setSearchResults] = useState<PostInfo[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Tag 管理
  const defaultTag = useRef<'標的' | '全部'>('全部');
  const [activeTag, setActiveTag] = useState<'標的' | '全部'>('全部');

  // 資料載入判斷
  if (postsLoadable.state === 'loading') {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
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

  const posts: PostInfo[] = postsLoadable.contents;

  // Tag 初始化
  useEffect(() => {
    if (postsLoadable.state === 'hasValue') {
      const hasTarget = posts.some((p) => p.tag === '標的');
      const initialTag = hasTarget ? '標的' : '全部';
      defaultTag.current = initialTag;
      setActiveTag(initialTag);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postsLoadable.state]);

  // 搜尋文字變動，重置 searchResults
  const handleDebouncedTextChange = useCallback((text: string) => {
    setFilterText(text);
    setSearchResults(null);
    if (text === '') setActiveTag(defaultTag.current);
    else setActiveTag('全部');
  }, []);

  // 點擊搜尋或鍵盤送出
  const handleSearch = useCallback(async (text: string) => {
    if (!text.trim()) {
      setSearchResults(null);
      return;
    }
    setActiveTag('全部');
    setSearchLoading(true);
    try {
      const res = await api.get<{ posts: PostInfo[] }>(`/my/posts/search?search=${encodeURIComponent(text)}`);
      setSearchResults(res.data.posts);
    } catch (err) {
      console.error('Search posts failed:', err);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // 本地搜尋過濾，忽略大小寫
  const filteredPosts = useMemo(() => {
    if (!filterText) return posts;
    const lower = filterText.toLowerCase();
    return posts.filter((p) => p.title.toLowerCase().includes(lower));
  }, [posts, filterText]);

  // 決定資料來源：有 searchResults 優先用，否則用本地過濾
  const baseData = filterText === '' ? posts : searchResults ?? filteredPosts;

  // Tag 過濾
  const displayData = useMemo(() => {
    return activeTag === '標的' ? baseData.filter((p) => p.tag === '標的') : baseData;
  }, [activeTag, baseData]);

  // 點擊貼文跳轉
  const handlePressPost = useCallback(
    (item: PostInfo) => {
      navigation.navigate(ROUTES.Post.PostDetail, { post: item });
    },
    [navigation]
  );

  // Tag Button 列表
  const tags = defaultTag.current === '標的' ? ['標的', '全部'] : ['全部'];

  return (
    <FlatList
      ListHeaderComponent={
        <View>
          <SearchBar
            onDebouncedTextChange={handleDebouncedTextChange}
            onSearch={handleSearch}
            loading={searchLoading}
          />
          <View style={styles.tagRow}>
            {tags.map((tag) => (
              <TouchableOpacity
                key={tag}
                onPress={() => setActiveTag(tag as '標的' | '全部')}
                style={[styles.tagButton, activeTag === tag && styles.activeTagButton]}
              >
                <Text style={activeTag === tag ? styles.activeTagText : styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      }
      contentContainerStyle={styles.container}
      data={displayData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <PostCard post={item} onPress={() => handlePressPost(item)} />}
      refreshing={postsLoadable.state === ('loading' as any)}
      onRefresh={refresh}
      ListEmptyComponent={
        <View style={{ alignItems: 'center', marginTop: 32 }}>
          <Text>目前沒有符合條件的貼文喔～🥺</Text>
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
    marginBottom: 12,
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
