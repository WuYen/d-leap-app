// components/RankAuthorList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import api from '../utils/api';
import { ROUTES, useAuthorNavigation } from '../navigation';
import AuthorCard from '../components/AuthorCard';

export interface LeaderboardPost {
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

export interface LeaderboardItem {
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

export default function AuthorListScreen() {
  const navigation = useAuthorNavigation();
  const [data, setData] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: LeaderboardItem[] }>('/my/authors/rank');
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
      renderItem={({ item }) => <AuthorCard author={item} />}
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
