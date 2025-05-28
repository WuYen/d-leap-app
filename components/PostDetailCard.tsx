// components/PostDetailCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { PostItem } from '../types/PostItem';

type Props = {
  post: PostItem;
};

export default function PostDetailCard({ post }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        [{post.tag}] {post.title}
      </Text>
      <Text style={styles.info}>作者：{post.author}</Text>
      <Text style={styles.info}>日期：{post.date}</Text>
      <TouchableOpacity onPress={() => Linking.openURL(`https://www.ptt.cc${post.href}`)}>
        <Text
          style={[
            styles.info,
            {
              color: '#1976d2',
              textDecorationLine: 'underline',
              fontStyle: 'italic', // 斜體
            },
          ]}
        >
          查看來源
        </Text>
      </TouchableOpacity>
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
