// components/RankAuthorList.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AuthorCard from '../components/AuthorCard';
import { ROUTES, useAuthorNavigation } from '../navigation';
import { useRecoilRefresher_UNSTABLE, useRecoilValueLoadable } from 'recoil';
import { authorsState } from '../states/authorsState';

export default function AuthorListScreen() {
  const navigation = useAuthorNavigation();
  const authorsLoadable = useRecoilValueLoadable(authorsState);
  const refresh = useRecoilRefresher_UNSTABLE(authorsState);

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

  const data = authorsLoadable.contents;

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={data}
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
