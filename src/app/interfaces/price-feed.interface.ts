export interface PriceFeed {
  pair: string;
  price: string;
  percentChange24h: string;
}

export interface PriceFeedResponse {
  [key: string]: PriceFeed;
}