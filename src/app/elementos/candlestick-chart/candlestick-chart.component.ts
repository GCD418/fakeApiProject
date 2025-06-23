import { Component, Input, OnChanges, SimpleChanges, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Candlestick } from '../../interfaces/candlestick.interface';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-candlestick-chart',
  imports: [],
  templateUrl: './candlestick-chart.component.html',
  styleUrl: './candlestick-chart.component.scss'
})
export class CandlestickChartComponent implements OnChanges, AfterViewInit {
  @Input() candlesticks: Candlestick[] = [];
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  chart: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['candlesticks'] && this.candlesticks && this.candlesticks.length > 0) {
      this.renderChart();
    }
  }

  ngAfterViewInit() {
    if (this.candlesticks && this.candlesticks.length > 0) {
      this.renderChart();
    }
  }

  renderChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    const seriesData = this.candlesticks.map(c => ({
      x: new Date(c.time * 1000),
      y: [c.open, c.high, c.low, c.close]
    })).reverse();
    this.chart = new ApexCharts(this.chartContainer.nativeElement, {
      chart: { type: 'candlestick', height: 350 },
      series: [{ data: seriesData }],
      xaxis: { type: 'datetime' },
      yaxis: { tooltip: { enabled: true } }
    });
    this.chart.render();
  }
}
