import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Simbolo } from '../interfaces/simbolo';

@Injectable({
  providedIn: 'root'
})
export class SimbolosService {

  constructor(private http: HttpClient) { }

  obtenerTodosLosSimbolos():Observable<Simbolo[]> {
    return this.http.get<Simbolo[]>('https://api.gemini.com/v1/symbols');
  }
}
