import Constants from 'expo-constants';

// 這裡統一管理所有環境變數
const { SERVER_URL, ENV } = Constants.expoConfig?.extra || {};

export default {
  SERVER_URL,
  ENV,
  // 你可以在這裡加更多變數
};
