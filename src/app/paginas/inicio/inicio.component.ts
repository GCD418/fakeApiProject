import { Component, OnInit } from '@angular/core';
import { SimbolosService } from '../../servicios/simbolos.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule,RouterModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {
  cryptos: string[] = [];
  loading: boolean = true;

  constructor(private simbolo:SimbolosService) {}

  ngOnInit(): void {
      this.simbolo.getCryptos().subscribe({
        next: (data: string[]) => {
          this.cryptos = data;
          this.loading = false;
        },
          error: (error) => {
            console.error('Error al obtener los símbolos:', error);
            this.loading = false;
          }
        });
    }
  
  }
