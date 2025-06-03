import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DiffInfo, PostHistoricalResponse, PostItem } from '../types/PostTypes';

type PostCardProps = {
  post: PostItem | PostHistoricalResponse;
  showBookmark?: boolean;
  isBookmarked?: boolean;
  onBookmark?: () => void;
  onPress?: () => void;
  showLink?: boolean;
};

export function PostCard({ post, showBookmark, isBookmarked, onBookmark, onPress, showLink }: PostCardProps) {
  return (
    <TouchableOpacity activeOpacity={onPress ? 0.8 : 1} style={styles.card} onPress={onPress}>
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={2}>
          [{post.tag}] {post.title}
        </Text>
        {showBookmark && (
          <TouchableOpacity onPress={onBookmark} style={{ padding: 4 }}>
            <Ionicons name={isBookmarked ? 'bookmark' : 'bookmark-outline'} size={22} color="#333" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.subRow}>
        <Text style={styles.author}>作者：{post.author}</Text>
        <Text style={styles.date}>{post.date}</Text>
      </View>

      {/* 價格表（只在有 processedData 且 showPriceTable 時顯示） */}
      <PriceTable processedData={'processedData' in post ? post.processedData : undefined} />

      {/* 來源連結 */}
      {showLink && post.href && (
        <TouchableOpacity onPress={() => Linking.openURL(`https://www.ptt.cc${post.href}`)}>
          <Text style={styles.link}>查看來源</Text>
        </TouchableOpacity>
      )}
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

// PriceTable 小組件：自動判斷 processedData，有才顯示
function PriceTable({ processedData }: { processedData?: DiffInfo[] }) {
  if (!processedData) return null;

  // 分別找三種 type
  const base = processedData.find((d) => d.type === 'base');
  const highest = processedData.find((d) => d.type === 'highest');
  const latest = processedData.find((d) => d.type === 'latest');

  return (
    <View style={styles.priceTable}>
      <Row label="基準" date={base?.date} price={base?.price} />
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
  link: {
    color: '#1976d2',
    textDecorationLine: 'underline',
    fontStyle: 'italic',
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
    alignSelf: 'flex-start',
  },
});

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  label: { width: 42, fontWeight: '500', color: '#444' },
  date: { width: 85, fontSize: 13, color: '#888' },
  price: { width: 52, fontSize: 15, fontWeight: 'bold', color: '#222' },
  diff: { flex: 1, fontSize: 14, marginLeft: 6 },
});
