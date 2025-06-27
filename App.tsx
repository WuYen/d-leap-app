import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Button, ActivityIndicator } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { navigateToAuthorDetail, navigateToPostDetail, navigationRef } from './navigation/navigationRef';
import PendingAuthorNavigator from './components/PendingAuthorNavigator';
import api from './utils/api';
import { clearStorage } from './utils/storage';
import { useAuth } from './hooks/useAuth';
import config from './utils/config';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import { favoritesState } from './states/favoritesState';
import { MyPostHistoricalResponse } from './types';

export default function App() {
  return (
    <RecoilRoot>
      <AppWithState />
    </RecoilRoot>
  );
}

function AppWithState() {
  const { isLoggedIn, isLoading, expoPushToken } = useAuth();
  const setFavorites = useSetRecoilState(favoritesState);
  const [showDevPanel, setShowDevPanel] = React.useState(config.ENV === 'dev' || config.ENV === 'develop');
  const tapCountRef = React.useRef(0);
  const tapTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // 神秘按鈕觸發邏輯
  const handleSecretTap = () => {
    if (config.ENV === 'dev' || config.ENV === 'develop') return; // dev 直接顯示
    tapCountRef.current += 1;
    if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
    tapTimeoutRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 2000); // 2 秒內要連點
    if (tapCountRef.current >= 10) {
      setShowDevPanel(true);
      tapCountRef.current = 0;
    }
  };

  console.log('AppWithState isLoggedIn: ', isLoggedIn);
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isLoggedIn) {
        setFavorites({ posts: [], authors: [], loading: false });
        return;
      }

      setFavorites((prev) => ({ ...prev, loading: true }));
      try {
        const res = await api.get<MyPostHistoricalResponse[]>('/my/posts/favorite');

        setFavorites({ posts: res.data, authors: [], loading: false });
      } catch (err) {
        console.error('Fetch favorites failed:', err);
        setFavorites((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchFavorites();
  }, [isLoggedIn, setFavorites]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 神秘觸發區塊 */}
      {config.ENV !== 'dev' && config.ENV !== 'develop' && !showDevPanel && (
        <View style={styles.secretArea}>
          <Text onPress={handleSecretTap} style={styles.secretButton} accessibilityLabel="dev-panel-trigger">
            {' '}
          </Text>
        </View>
      )}
      {/* 全域操作按鈕 */}
      {showDevPanel && <DevPanel />}

      {/* 導航主畫面 */}
      <View style={styles.navigator}>
        <AppNavigator isLoggedIn={isLoggedIn} />
        <PendingAuthorNavigator />
      </View>

      {/* 推播 Token 區塊 */}
      {showDevPanel && (
        <View style={styles.tokenContainer}>
          <Text style={styles.label}>Expo Push Token:</Text>
          <Text selectable style={styles.tokenText}>
            {expoPushToken || 'Loading.......'}
          </Text>
        </View>
      )}
    </View>
  );
}

function DevPanel() {
  const handleLogout = async () => {
    await clearStorage();
    Alert.alert('登出成功');
    navigationRef.current?.reset({
      index: 0,
      routes: [{ name: 'Register' as never }],
    });
  };

  const handlePing = async () => {
    try {
      const result = await api.get('/tool/healthy');
      Alert.alert('Ping 成功', JSON.stringify(result));
    } catch (error) {
      console.error(error);
      Alert.alert('Ping 失敗', '無法連線到Server');
    }
  };

  const handleFakePostDetail = () => {
    console.log('模擬進入 PostDetail');
    const mockPost = {
      id: 123,
      tag: '測試',
      title: '這是一篇測試貼文',
      date: '2024/05/27',
      href: '/ptt/test',
      highest: {
        date: '2024/05/27',
        diff: 5,
        diffPercent: 10,
        price: 100,
        type: ['test'],
      },
      _id: 'fake-id',
    };

    navigateToPostDetail(mockPost);
  };

  const handleFakeAuthorDetail = () => {
    console.log('模擬進入 AuthorDetail');
    const mockAuthor = {
      name: '測試作者',
      mean: 12.34,
      maxRate: 20.5,
      minRate: -3.2,
      median: 11.1,
      stdDev: 4.5,
      posts: [], // 可加代表作
      totalRate: 36.9,
      score: 88.8,
      combinedRank: 1,
      author: 'tester',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 99,
      dislikes: 1,
    };

    navigateToAuthorDetail(mockAuthor);
  };

  return (
    <View style={styles.globalButtons}>
      <Text>ENV:{config.ENV}</Text>
      <Button title="登出" onPress={handleLogout} />
      <Button title="測試Ping" onPress={handlePing} />
      <Button title="PostDetail" onPress={handleFakePostDetail} />
      <Button title="AuthorDetail" onPress={handleFakeAuthorDetail} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  globalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    marginTop: 20, // 👈 新增這行！往下推一點
    backgroundColor: '#fafafa',
  },
  navigator: {
    flex: 1,
  },
  tokenContainer: {
    padding: 10,
    backgroundColor: '#eee',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  tokenText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secretArea: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secretButton: {
    width: 40,
    height: 40,
    opacity: 0.01, // 幾乎不可見
    backgroundColor: 'transparent',
  },
});
