import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SimbolosService } from '../../servicios/simbolos.service';

@Component({
  selector: 'app-crypto-details',
  imports: [CommonModule],
  templateUrl: './crypto-details.component.html',
  styleUrl: './crypto-details.component.scss'
})
export class CryptoDetailsComponent implements OnInit {
  symbol: string = '';
  price: number = 0;
  trades: any[] = [];
  loading: boolean = true;

    constructor(
    private route: ActivatedRoute,
    private simboloService: SimbolosService
  ) {}

  ngOnInit(): void {
    this.symbol = this.route.snapshot.paramMap.get('symbol') || '';

    // Obtener precio actual
    this.simboloService.getTicker(this.symbol).subscribe({
      next: (data) => {
        this.price = parseFloat(data.last);
      },
      error: (err) => console.error('Error al obtener precio:', err)
    });

    // Obtener últimos trades
    this.simboloService.getRecentTrades(this.symbol).subscribe({
      next: (data) => {
        this.trades = (data as any[]).slice(0, 30); 
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener trades:', err);
        this.loading = false;
      }
    });
    
}
trackByTrade(index: number, trade: any): any {
  return trade.timestamp || index;
}
}
