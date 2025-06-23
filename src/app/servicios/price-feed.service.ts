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
    const url = `https://api.gemini.com/v2/candles/${symbol}/${temporality}`;
    return this.http.get<any[]>(url).pipe(
      map(data => {
        // Map Gemini data to Candlestick objects
        const mapped = data.map(item => ({
          time: item[0],
          open: item[1],
          close: item[2],
          high: item[3],
          low: item[4],
          volume: item[5],
        }));
        // Only keep candles from the last 10 days (and max 500 most recent)
        const now = Math.floor(Date.now() / 1000);
        const tenDaysAgo = now - 10 * 24 * 60 * 60;
        const filtered = mapped.filter(c => c.time >= tenDaysAgo);
        // If too many, keep only the most recent 500
        return filtered.slice(0, 500);
      })
    );
  }
}