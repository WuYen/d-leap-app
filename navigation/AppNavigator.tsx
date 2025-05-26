// AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../screens/LoginScreen';
import PostListScreen from '../screens/PostListScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import FavoriteListScreen from '../screens/FavoriteListScreen';
import FavoriteDetailScreen from '../screens/FavoriteDetailScreen';
import AuthorListScreen from '../screens/AuthorListScreen';
import AuthorDetailScreen from '../screens/AuthorDetailScreen';
import PostStack from './stake/PostStack';
import FavoriteStack from './stake/FavoriteStack';
import AuthorStack from './stake/AuthorStack';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

type Props = {
  isLoggedIn: boolean;
  onLoginSuccess: () => void;
};

// ✅ Bottom Tabs (整合在這個檔案)
const MainTabs = () => (
  <Tab.Navigator initialRouteName="貼文" screenOptions={{ headerShown: false }}>
    <Tab.Screen name="貼文" component={PostStack} />
    <Tab.Screen name="收藏" component={FavoriteStack} />
    <Tab.Screen name="作者" component={AuthorStack} />
  </Tab.Navigator>
);

export default function AppNavigator({ isLoggedIn, onLoginSuccess }: Props) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
