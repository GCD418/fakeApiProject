import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PriceFeedService } from '../../servicios/price-feed.service';
import { Candlestick, Temporality } from '../../interfaces/candlestick.interface';
import { CommonModule } from '@angular/common';
import { CandlestickChartComponent } from '../../elementos/candlestick-chart/candlestick-chart.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-candlestick',
  standalone: true,
  imports: [CommonModule, CandlestickChartComponent, FormsModule],
  templateUrl: './candlestick.component.html',
  styleUrl: './candlestick.component.scss'
})
export class CandlestickComponent implements OnInit {
  symbol: string = '';
  temporalities: Temporality[] = ['1m', '5m', '15m', '30m', '1h', '6h', '1day'];
  selectedTemporality: Temporality = '5m';
  candlesticks: Candlestick[] = [];
  loading = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private priceFeedService: PriceFeedService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.symbol = params.get('simbolo') || '';
      this.fetchCandlesticks();
    });
  }

  onTemporalityChange(): void {
    this.fetchCandlesticks();
  }

  fetchCandlesticks(): void {
    if (!this.symbol) return;
    this.loading = true;
    this.error = null;
    this.priceFeedService.getCandlestickData(this.symbol, this.selectedTemporality).subscribe({
      next: (data) => {
        this.candlesticks = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los datos de la gráfica';
        this.loading = false;
      }
    });
  }
}
