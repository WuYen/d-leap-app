// components/RankAuthorList.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AuthorCard from '../components/AuthorCard';
import { ROUTES, useAuthorNavigation } from '../navigation';
import { useRecoilRefresher_UNSTABLE, useRecoilValueLoadable } from 'recoil';
import { authorsState } from '../states/authorsState';
import SearchBar from '../components/SearchBar';
import { LeaderboardItem } from '../types';

export default function AuthorListScreen() {
  const navigation = useAuthorNavigation();
  const authorsLoadable = useRecoilValueLoadable(authorsState);
  const refresh = useRecoilRefresher_UNSTABLE(authorsState);
  const [search, setSearch] = React.useState('');

  const data = authorsLoadable.contents as LeaderboardItem[];

  // filter authors by search
  const filteredData = React.useMemo(() => {
    if (!search) return data;
    return data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  }, [data, search]);

  if (authorsLoadable.state === 'loading') {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size='large' />
        <Text>載入排行榜中...</Text>
      </View>
    );
  }

  if (authorsLoadable.state === 'hasError') {
    return (
      <View style={styles.loader}>
        <Text>載入失敗</Text>
      </View>
    );
  }

  return (
    <FlatList
      ListHeaderComponent={
        <View>
          <SearchBar
            placeholder='搜尋作者'
            onDebouncedTextChange={setSearch}
            loading={authorsLoadable.state === ('loading' as any)}
            onSearch={(text) => {
              console.log('Search text:', text);
            }}
          />
        </View>
      }
      contentContainerStyle={styles.container}
      data={filteredData}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <AuthorCard
          author={item}
          showPosts={false}
          onPress={() => navigation.navigate(ROUTES.Author.AuthorDetail, { authorId: item.name })}
        />
      )}
      refreshing={authorsLoadable.state === ('loading' as any)}
      onRefresh={refresh}
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
