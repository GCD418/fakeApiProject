import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SimbolosService {

  constructor(private http: HttpClient) { }

  obtenerTodosLosSimbolos() {
    return this.http.get<any[]>('https://api.gemini.com/v1/symbols');
  }
}
