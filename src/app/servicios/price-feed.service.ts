import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PriceFeedResponse } from '../interfaces/price-feed.interface';

@Injectable({
  providedIn: 'root'
})
export class PriceFeedService {
  private apiUrl = 'https://api.gemini.com/v1/pricefeed';

  constructor(private http: HttpClient) { }

  getPriceFeed(): Observable<PriceFeedResponse> {
    return this.http.get<PriceFeedResponse>(this.apiUrl);
  }
}