import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 需要安裝 @expo/vector-icons

type PostCardProps = {
  post: any;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  onPress?: () => void;
};

export function PostCard({ post, isBookmarked, onBookmark, onPress }: PostCardProps) {
  // 找對應三種 type
  const base = post.processedData.find((d: any) => d.type === 'base');
  const highest = post.processedData.find((d: any) => d.type === 'highest');
  const latest = post.processedData.find((d: any) => d.type === 'latest');

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={2}>
          [{post.tag}] {post.title}
        </Text>
        <TouchableOpacity onPress={onBookmark} style={{ padding: 4 }}>
          <Ionicons name={isBookmarked ? 'bookmark' : 'bookmark-outline'} size={22} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.subRow}>
        <Text style={styles.author}>{post.author}</Text>
        <Text style={styles.date}>{post.date}</Text>
      </View>

      <View style={styles.priceTable}>
        {/* 標題行 */}
        <Row label="基準" date={base?.date} price={base?.price} diff={undefined} diffPercent={undefined} />
        <Row
          label="最高"
          date={highest?.date}
          price={highest?.price}
          diff={highest?.diff}
          diffPercent={highest?.diffPercent}
        />
        <Row
          label="最近"
          date={latest?.date}
          price={latest?.price}
          diff={latest?.diff}
          diffPercent={latest?.diffPercent}
        />
      </View>
    </TouchableOpacity>
  );
}

// 小組件：單行
function Row({ label, date, price, diff, diffPercent }: any) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={rowStyles.date}>{date || '-'}</Text>
      <Text style={rowStyles.price}>{price == null ? '-' : <Text style={{ fontWeight: 'bold' }}>{price}</Text>}</Text>
      <Text style={rowStyles.diff}>
        {diff == null || diffPercent == null ? (
          '-'
        ) : (
          <Text style={{ color: diff > 0 ? '#d32f2f' : diff < 0 ? '#388e3c' : '#555', fontWeight: 'bold' }}>
            {diff > 0 ? '+' : ''}
            {diff} ({diff > 0 ? '+' : ''}
            {diffPercent}%)
          </Text>
        )}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontWeight: 'bold', fontSize: 16, flex: 1, marginRight: 6 },
  subRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  author: { fontSize: 14, color: '#555' },
  date: { fontSize: 14, color: '#888' },
  priceTable: { marginTop: 12 },
});

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  label: { width: 42, fontWeight: '500', color: '#444' },
  date: { width: 85, fontSize: 13, color: '#888' },
  price: { width: 52, fontSize: 15, fontWeight: 'bold', color: '#222' },
  diff: { flex: 1, fontSize: 14, marginLeft: 6 },
});
