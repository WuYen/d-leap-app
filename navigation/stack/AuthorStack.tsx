import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../routes';
import type { AuthorStackParamList } from '../types';

import AuthorListScreen from '../../screens/AuthorListScreen';
import AuthorDetailScreen from '../../screens/AuthorDetailScreen';

const Stack = createNativeStackNavigator<AuthorStackParamList>();

export default function AuthorStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ROUTES.Author.AuthorList} component={AuthorListScreen} options={{ title: '作者' }} />
      <Stack.Screen name={ROUTES.Author.AuthorDetail} component={AuthorDetailScreen} options={{ title: '作者資料' }} />
    </Stack.Navigator>
  );
}
