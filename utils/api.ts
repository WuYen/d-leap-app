import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from './config';

const api = axios.create({
  baseURL: config.SERVER_URL,
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

export type ResponseType<T = any> = {
  message?: string;
  data: T;
};

// ✨ 通用 API 方法
export const post = async <T = any>(path: string, data?: any): Promise<ResponseType<T>> => {
  const response = await api.post<ResponseType<T>>(path, data);
  if (response.status !== 200) {
    throw new Error(response.data?.message || `POST ${path} failed: ${response.status}`);
  }
  return response.data;
};

export const get = async <T = any>(path: string, params?: any): Promise<ResponseType<T>> => {
  const response = await api.get<ResponseType<T>>(path, { params });
  if (response.status !== 200) {
    throw new Error(response.data?.message || `GET ${path} failed: ${response.status}`);
  }
  return response.data;
};

export const put = async <T = any>(path: string, data?: any): Promise<ResponseType<T>> => {
  const response = await api.put<ResponseType<T>>(path, data);
  if (response.status !== 200) {
    throw new Error(response.data?.message || `PUT ${path} failed: ${response.status}`);
  }
  return response.data;
};

export const del = async <T = any>(path: string): Promise<ResponseType<T>> => {
  const response = await api.delete<ResponseType<T>>(path);
  if (response.status !== 200) {
    throw new Error(response.data?.message || `DELETE ${path} failed: ${response.status}`);
  }
  return response.data;
};

export default {
  post,
  get,
  put,
  del,
};
