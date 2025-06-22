import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PriceFeedResponse } from '../interfaces/price-feed.interface';
import { Candlestick, Temporality } from '../interfaces/candlestick.interface';

@Injectable({
  providedIn: 'root'
})
export class PriceFeedService {
  private apiUrl = 'https://api.gemini.com/v1/pricefeed';

  constructor(private http: HttpClient) { }

  getPriceFeed(): Observable<PriceFeedResponse> {
    return this.http.get<PriceFeedResponse>(this.apiUrl);
  }

  getCandlestickData(symbol: string, temporality: Temporality): Observable<Candlestick[]> {
    // Gemini API endpoint for candlesticks: /v2/candles/{symbol}/{timeframe}
    // Example: https://api.gemini.com/v2/candles/btcusd/5m
    const url = `https://api.gemini.com/v2/candles/${symbol}/${temporality}`;
    return this.http.get<any[]>(url).pipe(
      // Gemini returns: [ [timestamp, open, close, high, low, volume], ... ]
      // We map it to our Candlestick interface
      map(data => data.map(item => ({
        time: item[0],
        open: item[1],
        close: item[2],
        high: item[3],
        low: item[4],
        volume: item[5],
      })))
    );
  }
}