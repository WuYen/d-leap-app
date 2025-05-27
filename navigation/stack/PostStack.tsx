import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../routes';
import type { PostStackParamList } from '../types';

import PostListScreen from '../../screens/PostListScreen';
import PostDetailScreen from '../../screens/PostDetailScreen';

const Stack = createNativeStackNavigator<PostStackParamList>();

export default function PostStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ROUTES.Post.PostList} component={PostListScreen} options={{ title: '貼文列表' }} />
      <Stack.Screen name={ROUTES.Post.PostDetail} component={PostDetailScreen} options={{ title: '貼文內容' }} />
    </Stack.Navigator>
  );
}
