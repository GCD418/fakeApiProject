import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Simbolo } from '../interfaces/simbolo';

@Injectable({
  providedIn: 'root'
})
export class SimbolosService {

  constructor(private http: HttpClient) { }

  obtenerTodosLosSimbolos():Observable<string[]> {
    return this.http.get<string[]>('https://api.gemini.com/v1/symbols');
  }

  obtenerTradesPorSimbolo(simbolo: string): Observable<any[]> {
    return this.http.get<any[]>(`/gemini-api/v1/trades/${simbolo}`);
  }

//this.http.get(`/gemini-api/v1/trades/${simbolo}`);

}
