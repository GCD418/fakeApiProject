import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Simbolo, SimboloDetalle, Precio, Trade } from '../interfaces/simbolo';

@Injectable({
  providedIn: 'root'
})
export class SimbolosService {

  private baseUrl = 'https://api.sandbox.gemini.com/v1';

  constructor(private http: HttpClient) { }

  // Obtener lista de todos los símbolos
  obtenerTodosLosSimbolos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/symbols`);
  }

  // Obtener detalles de un símbolo específico
  obtenerDetallesSimbolo(simbolo: string): Observable<SimboloDetalle> {
    return this.http.get<SimboloDetalle>(`${this.baseUrl}/symbols/details/${simbolo}`);
  }

  // Obtener lista de precios de todos los símbolos
  obtenerListaPrecios(): Observable<Precio[]> {
    return this.http.get<Precio[]>(`${this.baseUrl}/pricefeed`);
  }

  // Obtener trades de un símbolo específico
  obtenerTrades(simbolo: string, limite?: number): Observable<Trade[]> {
    let url = `${this.baseUrl}/trades/${simbolo}`;
    if (limite) {
      url += `?limit_trades=${limite}`;
    }
    return this.http.get<Trade[]>(url);
  }
}
