import { PostHistoricalResponse } from './PostTypes';

export interface LeaderboardItem {
  name: string;
  mean: number;
  maxRate: number;
  minRate: number;
  median: number;
  stdDev: number;
  posts: PostHistoricalResponse[];
  totalRate: number;
  score: number;
  combinedRank: number;
  author: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  dislikes: number;
}
