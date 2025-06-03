import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform, UIManager, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LeaderboardItem } from '../types/AuthorTypes';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  author: LeaderboardItem;
};

export default function AuthorCard({ author }: Props) {
  const [expanded, setExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  useEffect(() => {
    // icon rotate
    Animated.timing(rotateAnim, {
      toValue: expanded ? 1 : 0,
      duration: 250,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    // height animate
    Animated.timing(heightAnim, {
      toValue: expanded ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false, // 高度無法 nativeDriver
    }).start();
  }, [expanded]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const contentHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, author.posts.length * 48], // 每篇約 48px 高度，可調整
  });

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{author.name}</Text>
        <TouchableOpacity onPress={toggleExpand} activeOpacity={0.7}>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons name="chevron-down" size={20} color="#1976d2" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Median</Text>
          <Text style={styles.metricValue}>{author.median.toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Max Rate</Text>
          <Text style={styles.metricValue}>{author.maxRate.toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Score</Text>
          <Text style={styles.metricValue}>{author.score.toFixed(2)}</Text>
        </View>
      </View>

      {/* 展開區塊動畫包裹 */}
      <Animated.View style={[styles.collapsibleWrapper, { height: contentHeight }]}>
        <View style={styles.postsContainer}>
          {author.posts.map((post) => (
            <View key={post.id} style={styles.postItem}>
              <Text style={styles.postTitle}>{post.title}</Text>
              <View style={styles.postInfoRow}>
                <Text style={styles.postDate}>{post.date}</Text>
                <Text
                  style={[
                    styles.postPercent,
                    {
                      color: (post.highest?.diffPercent ?? 0) >= 0 ? '#d32f2f' : '#388e3c',
                    },
                  ]}
                >
                  {post.highest?.diffPercent.toFixed(2)}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 8,
  },
  metricBox: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1565c0',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#ccc',
  },
  postItem: {
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  postInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  postDate: {
    fontSize: 12,
    color: '#888',
  },
  postPercent: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  collapsibleWrapper: {
    overflow: 'hidden',
  },
  postsContainer: {
    paddingTop: 8,
  },
});
