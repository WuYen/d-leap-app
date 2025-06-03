// AuthorDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useAuthorRoute } from '../navigation';
import AuthorCard from '../components/AuthorCard';
import { PostCard } from '../components/PostCard'; // 你剛剛那張卡片
import api from '../utils/api';
import { PostHistoricalResponse } from '../types/PostTypes';
import { LeaderboardItem } from '../types/AuthorTypes';

export default function AuthorDetailScreen() {
  const route = useAuthorRoute<'AuthorDetail'>();
  const { author, authorId } = route.params;
  const [posts, setPosts] = useState<PostHistoricalResponse[]>([]);
  const [authorData, setAuthorData] = useState<LeaderboardItem>(author);
  const [loading, setLoading] = useState(true);

  const loadAuthorData = async () => {
    setLoading(true);
    try {
      // 1. 兩個 promise 準備好
      const authorPromise = !authorData
        ? api.get<{ data: LeaderboardItem[] }>('/my/authors/rank')
        : Promise.resolve({ data: [] as LeaderboardItem[] }); // dummy

      const postsPromise = api.get<{ success: boolean; data: PostHistoricalResponse[] }>(
        `/ptt/author/${authorId}?refresh=false`
      );

      // 2. 並行呼叫！
      const [authorList, postsRes] = await Promise.all([authorPromise, postsPromise]);

      // 3. 處理 author 資料
      if (!authorData && authorList.data.length > 0 && authorId) {
        const found = authorList.data.find((item) => item.name === authorId);
        if (found) setAuthorData(found);
      }
      setPosts(postsRes.data);
    } catch (err) {
      console.error('Fetch author posts failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthorData();
  }, [authorId]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size='large' />
        <Text>載入文章中...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AuthorCard author={authorData} />
      <Text style={styles.sectionTitle}>近期發文</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostCard post={item} />}
        scrollEnabled={false} // 因為用 ScrollView 包起來，這裡關掉 FlatList 滾動
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 14 },
});
