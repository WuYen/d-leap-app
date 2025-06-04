export type PostInfo = {
  id: number;
  title: string;
  tag: string;
  href: string;
  author: string;
  date: string;
  batchNo: number;
};

export interface PostHistoricalResponse extends PostInfo {
  stockNo: string;
  processedData: DiffInfo[];
  historicalInfo: HistoricalDataInfo[];
  isRecentPost?: boolean;
  isFavorite?: boolean;
  highest?: DiffInfo;
}

export interface DiffInfo {
  date: string;
  diff: number;
  diffPercent: number;
  price: number;
  type?: DiffType;
}

export enum DiffType {
  HIGHEST = 'highest',
  LATEST = 'latest',
  BASE = 'base',
}

export interface HistoricalDataInfo {
  date: string; //yyyyMMdd
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  turnover: number;
  change: number;
}
