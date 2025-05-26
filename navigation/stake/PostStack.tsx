// PostStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PostListScreen from '../../screens/PostListScreen';
import PostDetailScreen from '../../screens/PostDetailScreen';

export type PostStackParamList = {
  PostList: undefined;
  PostDetail: { post: any }; // 替換成你的 PostItem 類型
};

const Stack = createNativeStackNavigator<PostStackParamList>();

export default function PostStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PostList" component={PostListScreen} options={{ title: '貼文列表' }} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: '貼文內容' }} />
    </Stack.Navigator>
  );
}
