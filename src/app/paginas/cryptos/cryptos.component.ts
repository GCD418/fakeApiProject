import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Simbolo } from '../../interfaces/simbolo';
import { SimbolosService } from '../../servicios/simbolos.service';

@Component({
  selector: 'app-cryptos',
  imports: [CommonModule,RouterLink,HttpClientModule],
  templateUrl: './cryptos.component.html',
  styleUrl: './cryptos.component.scss'
})
export class CryptosComponent implements OnInit{
  cryptos:{symbol: string, price: number}[] = [];
  loading: boolean = true;
  error: boolean = false;

  constructor(private simboloServicce:SimbolosService) {}

  ngOnInit(): void {

     this.simboloServicce.getCryptos().subscribe({
      next: (data) => {
        const sealeadSymbols = data

        sealeadSymbols.forEach((symbol: string) => {
          this.simboloServicce.getTicker(symbol).subscribe({
            next: (tickerData) => {
              this.cryptos.push({symbol, price: parseFloat(tickerData.last)});
            },
          error: (error) => {
              console.error(`Error al obtener el ticker para ${symbol}:`, error)
          }
          });
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener los símbolos:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

}

