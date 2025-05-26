// FavoriteStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FavoriteListScreen from '../../screens/FavoriteListScreen';
import FavoriteDetailScreen from '../../screens/FavoriteDetailScreen';

const Stack = createNativeStackNavigator();

export default function FavoriteStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FavoriteList" component={FavoriteListScreen} options={{ title: '我的收藏' }} />
      <Stack.Screen name="FavoriteDetail" component={FavoriteDetailScreen} options={{ title: '收藏細節' }} />
    </Stack.Navigator>
  );
}
