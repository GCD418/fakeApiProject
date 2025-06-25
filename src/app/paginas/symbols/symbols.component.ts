import { Component, inject } from '@angular/core';
import { SymbolComponent } from '../../elementos/symbol/symbol.component';
import { Simbolo } from '../../interfaces/simbolo';
import { SimbolosService } from '../../servicios/simbolos.service';

@Component({
  selector: 'app-symbols',
  imports: [SymbolComponent],
  templateUrl: './symbols.component.html',
  styleUrl: './symbols.component.scss'
})
export class SymbolsComponent {
  listaDeSimbolos: Simbolo[] = [];
  simboloService: SimbolosService = inject(SimbolosService);
  constructor() {
    this.simboloService.obtenerTodosLosSimbolos().subscribe({
      next: (data) => {
        this.listaDeSimbolos = data;
      },
      error: (error) => {
        console.error('Error al obtener los símbolos:', error);
      },
      complete: () => {
        console.log('Carga de símbolos completada');
      }
    });
  }
}
