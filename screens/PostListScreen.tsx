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
  const [selectedTab, setSelectedTab] = useState<'rank' | 'list'>('rank');

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
    <>
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, selectedTab === 'rank' && styles.tabBtnActive]}
          onPress={() => setSelectedTab('rank')}
        >
          <Text style={selectedTab === 'rank' ? styles.tabTextActive : styles.tabText}>排行榜</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, selectedTab === 'list' && styles.tabBtnActive]}
          onPress={() => setSelectedTab('list')}
        >
          <Text style={selectedTab === 'list' ? styles.tabTextActive : styles.tabText}>文章列表</Text>
        </TouchableOpacity>
      </View>
      {selectedTab === 'rank' ? (
        <Text style={{ padding: 16, textAlign: 'center' }}>排行榜功能尚未實作，敬請期待！</Text>
      ) : (
        <FlatList
          contentContainerStyle={styles.container}
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detail', { post: item })}>
              <Text style={styles.title}>
                [{item.tag}] {item.title}
              </Text>
            </TouchableOpacity>
          )}
          refreshing={loading}
          onRefresh={loadPosts}
        />
      )}
    </>
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
  tabRow: {
    flexDirection: 'row',
    marginBottom: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
  },
  tabBtnActive: {
    backgroundColor: '#1976d2',
  },
  tabText: {
    color: '#1976d2',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
});
