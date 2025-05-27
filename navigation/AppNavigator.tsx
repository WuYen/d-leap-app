import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ROUTES } from './routes';
import type { RootStackParamList, RootTabParamList } from './types';

import RegisterScreen from '../screens/RegisterScreen';
import PostStack from './stack/PostStack';
import FavoriteStack from './stack/FavoriteStack';
import AuthorStack from './stack/AuthorStack';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

type Props = {
  isLoggedIn: boolean;
  onSetIsLoggedIn: (isLoggedIn: boolean) => void;
};

const MainTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name={ROUTES.Tab.Post} component={PostStack} options={{ tabBarLabel: '貼文' }} />
    <Tab.Screen name={ROUTES.Tab.Favorite} component={FavoriteStack} options={{ tabBarLabel: '收藏' }} />
    <Tab.Screen name={ROUTES.Tab.Author} component={AuthorStack} options={{ tabBarLabel: '作者' }} />
  </Tab.Navigator>
);

export default function AppNavigator({ isLoggedIn, onSetIsLoggedIn }: Props) {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <RootStack.Screen name={ROUTES.Root.MainTabs} component={MainTabs} />
        ) : (
          <RootStack.Screen name={ROUTES.Root.Register}>
            {(props) => <RegisterScreen {...props} onSetIsLoggedIn={onSetIsLoggedIn} />}
          </RootStack.Screen>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
