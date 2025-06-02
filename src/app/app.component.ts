import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SimbolosService } from './servicios/simbolos.service';
import { SimboloDetalle, Precio, Trade } from './interfaces/simbolo';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  simbolosService: SimbolosService = inject(SimbolosService);
  
  // Datos para la UI
  simbolos: string[] = [];
  simboloSeleccionado: string = '';
  detallesSimbolo: SimboloDetalle | null = null;
  precios: Precio[] = [];
  trades: Trade[] = [];
  
  // Estados de carga
  cargandoSimbolos = false;
  cargandoDetalles = false;
  cargandoPrecios = false;
  cargandoTrades = false;
  
  // Vista activa
  vistaActiva: 'simbolos' | 'detalles' | 'precios' | 'trades' = 'simbolos';

  // Configuración para trades
  limiteTrades = 20;

  constructor() {}

  ngOnInit() {
    this.obtenerSimbolos();
    this.obtenerPrecios();
  }

  cambiarVista(vista: 'simbolos' | 'detalles' | 'precios' | 'trades') {
    this.vistaActiva = vista;
  }

  obtenerSimbolos() {
    this.cargandoSimbolos = true;
    this.simbolosService.obtenerTodosLosSimbolos().subscribe({
      next: (data) => {
        this.simbolos = data;
        this.cargandoSimbolos = false;
        console.log('Símbolos obtenidos:', data);
      },
      error: (error) => {
        console.error('Error al obtener los símbolos:', error);
        this.cargandoSimbolos = false;
      }
    });
  }

  obtenerDetallesSimbolo(simbolo: string) {
    if (!simbolo) return;
    
    this.simboloSeleccionado = simbolo;
    this.cargandoDetalles = true;
    this.simbolosService.obtenerDetallesSimbolo(simbolo).subscribe({
      next: (data) => {
        this.detallesSimbolo = data;
        this.cargandoDetalles = false;
        this.vistaActiva = 'detalles';
        console.log('Detalles del símbolo obtenidos:', data);
      },
      error: (error) => {
        console.error('Error al obtener detalles del símbolo:', error);
        this.cargandoDetalles = false;
      }
    });
  }

  obtenerPrecios() {
    this.cargandoPrecios = true;
    this.simbolosService.obtenerListaPrecios().subscribe({
      next: (data) => {
        this.precios = data;
        this.cargandoPrecios = false;
        console.log('Precios obtenidos:', data);
      },
      error: (error) => {
        console.error('Error al obtener los precios:', error);
        this.cargandoPrecios = false;
      }
    });
  }

  obtenerTrades(simbolo?: string) {
    const simboloAUsar = simbolo || this.simboloSeleccionado;
    if (!simboloAUsar) return;

    this.cargandoTrades = true;
    this.simbolosService.obtenerTrades(simboloAUsar, this.limiteTrades).subscribe({
      next: (data) => {
        this.trades = data;
        this.cargandoTrades = false;
        this.vistaActiva = 'trades';
        console.log('Trades obtenidos:', data);
      },
      error: (error) => {
        console.error('Error al obtener los trades:', error);
        this.cargandoTrades = false;
      }
    });
  }

  formatearFecha(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString();
  }

  formatearPrecio(precio: string): string {
    return parseFloat(precio).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    });
  }

  formatearPorcentaje(porcentaje: string): string {
    const valor = parseFloat(porcentaje) * 100;
    return `${valor >= 0 ? '+' : ''}${valor.toFixed(2)}%`;
  }

  esPositivo(valor: string): boolean {
    return parseFloat(valor) >= 0;
  }
}
