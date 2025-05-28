// AuthorDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useAuthorRoute } from '../navigation';
import AuthorCard from '../components/AuthorCard';
import { PostCard } from '../components/PostCard'; // 你剛剛那張卡片
import api from '../utils/api';

export default function AuthorDetailScreen() {
  const route = useAuthorRoute<'AuthorDetail'>();
  const { author } = route.params;
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 這邊 api 回傳格式: { success: true, data: [ {...文章物件...} ] }
  const loadAuthorPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: any[] }>(`/ptt/author/${author.name}?refresh=false`);
      setPosts(res.data);
    } catch (err) {
      console.error('Fetch author posts failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthorPosts();
  }, [author]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>載入文章中...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 上方沿用 AuthorCard（可以傳入 author 或自訂 props） */}
      <AuthorCard author={author} />
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
