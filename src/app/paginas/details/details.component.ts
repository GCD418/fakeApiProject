import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SimbolosService } from '../../servicios/simbolos.service';
import { SimboloDetails } from '../../interfaces/simbolo';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  simboloDetails: SimboloDetails | null = null;
  loading: boolean = true;
  error: string | null = null;
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private simbolosService = inject(SimbolosService);

  ngOnInit() {
    const simboloNombre = this.route.snapshot.paramMap.get('simbolo');
    
    if (simboloNombre) {
      this.obtenerDetallesSimbolo(simboloNombre);
    } else {
      this.error = 'No se proporcionó un símbolo válido';
      this.loading = false;
    }
  }

  private obtenerDetallesSimbolo(simbolo: string) {
    this.simbolosService.obtenerDetallesSimbolo(simbolo).subscribe({
      next: (data) => {
        this.simboloDetails = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener los detalles del símbolo:', error);
        this.error = 'Error al cargar los detalles del símbolo';
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/symbols']);
  }
}
