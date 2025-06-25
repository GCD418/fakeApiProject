export interface Candlestick {
  time: number; // Unix timestamp (seconds)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

type Temporality = '1m' | '5m' | '15m' | '30m' | '1h' | '6h' | '1day';

export type { Temporality };
