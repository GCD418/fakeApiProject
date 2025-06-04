import { Component, inject } from '@angular/core';
import { SimbolosService } from './servicios/simbolos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  simbolosService = inject(SimbolosService);
  simbolos: string[] = [];
  libro: any[] = [];
  libroSymbol: string = '';

  obtenerSimbolos() {
    this.simbolosService.obtenerTodosLosSimbolos().subscribe({
      next: (data) => {
        this.simbolos = data;
        console.log('Símbolos:', data);
      },
      error: (error) => {
        console.error('Error al obtener los símbolos:', error);
      }
    });
  }

  verLibro(simbolo: string) {
    this.simbolosService.obtenerTradesPorSimbolo(simbolo).subscribe({
      next: (data) => {
        this.libro = data;
        this.libroSymbol = simbolo;
        console.log('Trades recientes:', data);
      },
      error: (error) => {
        console.error('Error al obtener los trades:', error);
      }
    });
  }
}




