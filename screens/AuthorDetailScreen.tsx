import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthorRoute } from '../navigation';

export default function AuthorDetailScreen() {
  const route = useAuthorRoute<'AuthorDetail'>();
  const { author } = route.params;

  //TODO: call api, display author details
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{author.name}</Text>
      <Text>總分數: {author.score.toFixed(2)}</Text>
      <Text>總報酬: {author.totalRate.toFixed(2)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
