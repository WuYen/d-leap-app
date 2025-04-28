import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER_URL = 'https://你的server.com'; // TODO: 換成你的server base URL

const api = axios.create({
  baseURL: SERVER_URL,
  timeout: 10000,
});

// ✨ 自動加上 Authorization Bearer Token 的小工具
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('jwtToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✨ 通用 API 方法
export const post = async <T = any>(path: string, data?: any): Promise<T> => {
  const response = await api.post<T>(path, data);
  return response.data;
};

export const get = async <T = any>(path: string, params?: any): Promise<T> => {
  const response = await api.get<T>(path, { params });
  return response.data;
};

export const put = async <T = any>(path: string, data?: any): Promise<T> => {
  const response = await api.put<T>(path, data);
  return response.data;
};

export const del = async <T = any>(path: string): Promise<T> => {
  const response = await api.delete<T>(path);
  return response.data;
};

export default {
  post,
  get,
  put,
  del,
};
