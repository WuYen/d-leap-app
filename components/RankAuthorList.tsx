// components/RankAuthorList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../utils/api';

interface LeaderboardPost {
  title: string;
  href: string;
  date: string;
  id: number;
  highest: {
    date: string;
    diff: number;
    diffPercent: number;
    price: number;
    type: string[];
  };
  _id: string;
}

interface LeaderboardItem {
  name: string;
  mean: number;
  maxRate: number;
  minRate: number;
  median: number;
  stdDev: number;
  posts: LeaderboardPost[];
  totalRate: number;
  score: number;
  combinedRank: number;
  author: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  dislikes: number;
}

export default function RankAuthorList() {
  const [data, setData] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: LeaderboardItem[] }>('/leaderboard');
      setData(res.data);
    } catch (err) {
      console.error('Fetch leaderboard failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size='large' />
        <Text>載入排行榜中...</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={data}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.score}>分數: {item.score.toFixed(2)}</Text>
          <Text style={styles.stats}>
            平均: {item.mean.toFixed(2)} 最高: {item.maxRate.toFixed(2)} 最低: {item.minRate.toFixed(2)} 中位:{' '}
            {item.median.toFixed(2)}
          </Text>
          <Text style={styles.stats}>
            標準差: {item.stdDev.toFixed(2)} 總報酬: {item.totalRate.toFixed(2)}
          </Text>
          <Text style={styles.postsTitle}>代表文章:</Text>
          {item.posts.map((post) => (
            <View key={post.id} style={styles.postItem}>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postInfo}>
                日期: {post.date} 報酬: {post.highest.diffPercent.toFixed(2)}%
              </Text>
            </View>
          ))}
        </View>
      )}
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
  card: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  score: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  stats: {
    fontSize: 13,
    color: '#333',
  },
  postsTitle: {
    marginTop: 8,
    fontWeight: '600',
    color: '#1565c0',
  },
  postItem: {
    marginLeft: 8,
    marginTop: 2,
  },
  postTitle: {
    fontSize: 14,
    color: '#222',
  },
  postInfo: {
    fontSize: 12,
    color: '#666',
  },
});
