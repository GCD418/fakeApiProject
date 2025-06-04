import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SimbolosService } from './servicios/simbolos.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'exchange-app';
  // simbolosService: SimbolosService = inject(SimbolosService);
  // constructor() {
  // }
  // obtenerSimbolos() {
  //   this.simbolosService.obtenerTodosLosSimbolos().subscribe(
  //     (data) => {
  //       console.log('Datos de símbolos obtenidos:', data);
  //     },
  //     (error) => {
  //       console.error('Error al obtener los símbolos:', error);
  //     }
  //   );
  // }
}
