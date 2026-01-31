
export interface ExchangeRate {
  currency: string;
  rate: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

export interface MarketInsight {
  summary: string;
  trend: 'up' | 'down' | 'neutral';
  sources: { title: string; uri: string }[];
}

export interface ChartData {
  date: string;
  usd: number;
  jpy: number;
}
