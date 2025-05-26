// AppNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import { navigationRef } from './navigationRef'; // ✅ 引入你的 navigationRef

import PostStack from './stake/PostStack';
import FavoriteStack from './stake/FavoriteStack';
import AuthorStack from './stake/AuthorStack';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef}> {/* ✅ 綁定 ref */}
      <Tab.Navigator
        initialRouteName="貼文"
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="貼文" component={PostStack} />
        <Tab.Screen name="收藏" component={FavoriteStack} />
        <Tab.Screen name="作者" component={AuthorStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
