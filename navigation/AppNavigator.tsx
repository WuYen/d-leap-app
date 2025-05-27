import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from './routes';
import type { RootStackParamList, RootTabParamList } from './types';

import RegisterScreen from '../screens/RegisterScreen';
import PostStack from './stack/PostStack';
import FavoriteStack from './stack/FavoriteStack';
import AuthorStack from './stack/AuthorStack';
import { navigationRef } from './navigationRef';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

type Props = {
  isLoggedIn: boolean;
  onSetIsLoggedIn: (isLoggedIn: boolean) => void;
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size, focused }) => {
        let iconName: string;

        if (route.name === ROUTES.Tab.Post) {
          iconName = focused ? 'document-text' : 'document-text-outline';
        } else if (route.name === ROUTES.Tab.Favorite) {
          iconName = focused ? 'heart' : 'heart-outline';
        } else if (route.name === ROUTES.Tab.Author) {
          iconName = focused ? 'people' : 'people-outline';
        } else {
          iconName = 'help'; // default fallback icon
        }

        return <Ionicons name={iconName as any} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#1976d2',
      tabBarInactiveTintColor: '#888',
    })}
  >
    <Tab.Screen name={ROUTES.Tab.Post} component={PostStack} options={{ tabBarLabel: '貼文' }} />
    <Tab.Screen name={ROUTES.Tab.Favorite} component={FavoriteStack} options={{ tabBarLabel: '收藏' }} />
    <Tab.Screen name={ROUTES.Tab.Author} component={AuthorStack} options={{ tabBarLabel: '作者' }} />
  </Tab.Navigator>
);

export default function AppNavigator({ isLoggedIn, onSetIsLoggedIn }: Props) {
  return (
    <NavigationContainer ref={navigationRef}>
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
