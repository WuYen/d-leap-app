// components/PostDetailCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PostItem } from '../types/PostItem';

type Props = {
  post: PostItem;
};

export default function PostDetailCard({ post }: Props) {
  //TODO: 打開網頁
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        [{post.tag}] {post.title}
      </Text>
      <Text style={styles.info}>作者：{post.author}</Text>
      <Text style={styles.info}>日期：{post.date}</Text>
      <Text style={styles.info}>連結：{post.href}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
    marginBottom: 6,
  },
});
