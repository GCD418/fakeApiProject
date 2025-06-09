import { Component, inject,OnInit} from '@angular/core';
import { SimbolosService } from '../../servicios/simbolos.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trades.component.html',
  styleUrl: './trades.component.scss'
})
export class TradesComponent {
  simbolos: any[] = [];
  loading: boolean = true;
  error: String | null = null;
  valor: string[]= [];

  constructor(
    private simbolosService: SimbolosService,
    private router: Router
  ){ }

  ngOnInit(): void{
    this.loadSimbolos();
  }
  
  loadSimbolos(): void{
    this.loading = true;
    this.error = null;
    this.simbolosService.obtenerTodosLosSimbolos().subscribe({
      next: (data) => {
        this.simbolos = Object.values(data);
        this.loading = false;
      },
      error: (error) => {
        console.log('Error fetching symbols feed:', error);
        this.error = 'Error al cargar los datos de simbolos';
        this.loading = false;
      }
    });
  }
 
  goToTrades(simbolo: string): void {
    const cleanSymbol = simbolo.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
    this.router.navigate(['/Trades-Details', cleanSymbol]);
  }
}
