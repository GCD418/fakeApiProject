import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Simbolo, SimboloDetails } from '../interfaces/simbolo';

@Injectable({
  providedIn: 'root'
})
export class SimbolosService {

  private baseUrl = 'https://api.sandbox.gemini.com/v1';

  constructor(private http: HttpClient) { }

  obtenerTodosLosSimbolos():Observable<Simbolo[]> {
    return this.http.get<Simbolo[]>(`${this.baseUrl}/symbols`);
  }

  obtenerDetallesSimbolo(simbolo: string): Observable<SimboloDetails> {
    return this.http.get<SimboloDetails>(`${this.baseUrl}/symbols/details/${simbolo}`);
  }
}
