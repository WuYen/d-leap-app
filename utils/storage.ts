import AsyncStorage from '@react-native-async-storage/async-storage';

// 存 account
export const saveAccount = async (account: string): Promise<void> => {
  await AsyncStorage.setItem('account', account);
};

// 讀 account
export const getAccount = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('account');
};

// 刪除 account
export const removeAccount = async (): Promise<void> => {
  await AsyncStorage.removeItem('account');
};

// 存 jwt token
export const saveJwtToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem('jwtToken', token);
};

// 讀 jwt token
export const getJwtToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('jwtToken');
};

// 刪除 jwt token
export const removeJwtToken = async ():Promise<void> => {
  await AsyncStorage.removeItem('jwtToken');
};

// 清空所有（登出用）
export const clearStorage = async (): Promise<void> => {
  await AsyncStorage.clear();
};
