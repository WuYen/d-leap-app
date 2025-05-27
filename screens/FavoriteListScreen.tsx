import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FavoriteListScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name='construct-outline' size={48} color='#1976d2' style={styles.icon} />
      <Text style={styles.title}>即將推出</Text>
      <Text style={styles.subtitle}>這裡會是你收藏的精華文章✨</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1976d2',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
  },
});
