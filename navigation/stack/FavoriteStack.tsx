import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../routes';
import type { FavoriteStackParamList } from '../types';

import FavoriteListScreen from '../../screens/FavoriteListScreen';
import FavoriteDetailScreen from '../../screens/FavoriteDetailScreen';

const Stack = createNativeStackNavigator<FavoriteStackParamList>();

export default function FavoriteStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.Favorite.FavoriteList}
        component={FavoriteListScreen}
        options={{ title: '我的收藏' }}
      />
      <Stack.Screen
        name={ROUTES.Favorite.FavoriteDetail}
        component={FavoriteDetailScreen}
        options={{ title: '收藏細節' }}
      />
    </Stack.Navigator>
  );
}
