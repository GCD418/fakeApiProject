import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SimbolosService } from '../../servicios/simbolos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trades-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trades-details.component.html',
  styleUrl: './trades-details.component.scss'
})
export class TradesDetailsComponent implements OnInit{
  public simbolo: string='';
  public trades: any[] = [];
  public loading = true;
  public error: string | null = null;
  public extra: string ='';

  constructor(
    private route: ActivatedRoute,
    private simbolosService: SimbolosService
  ){}

  ngOnInit(): void {

    this.extra = this.route.snapshot.paramMap.get('symbol')|| '';
    console.log('simbolo recibido:', this.extra);

    this.route.paramMap.subscribe(params => {
      const symbolParam = params.get('symbol');
          this.simbolo = symbolParam || '';
          this.loadTrades(this.simbolo);
    });
  }

  loadTrades(simbolo: string): void {
    this.loading = true;
    this.error = null;
    this.simbolosService.obtenerTradesPorSimbolo(simbolo).subscribe({
      next: (data) => {
        this.trades = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener los trades:', err);
        this.error = 'No se pudieron cargar los trades';
        this.loading = false;
      }
    });
  }
}