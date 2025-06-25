# Tutorial: Desarrollo de una Aplicación de Visualización de Datos Financieros con Angular

Este tutorial detallado te guiará paso a paso en la creación de una aplicación web completa para visualizar datos financieros utilizando Angular, incluyendo gráficos de velas (candlestick charts), feeds de precios y más.

## Índice

1. [Configuración inicial del proyecto](#1-configuración-inicial-del-proyecto)
2. [Estructura del proyecto](#2-estructura-del-proyecto)
3. [Interfaces](#3-interfaces)
4. [Servicios](#4-servicios)
5. [Componentes principales](#5-componentes-principales)
6. [Gráfico de velas (Candlestick)](#6-gráfico-de-velas-candlestick)
7. [Integración con API externa](#7-integración-con-api-externa)
8. [Routing y navegación](#8-routing-y-navegación)
9. [Estilos y diseño responsivo](#9-estilos-y-diseño-responsivo)
10. [Despliegue](#10-despliegue)

## 1. Configuración inicial del proyecto

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (versión 16.x o superior)
- npm (viene con Node.js)

### Instalación de Angular CLI

```bash
npm install -g @angular/cli
```

### Creación del proyecto

```bash
ng new fake-api-project --routing --style=scss
cd fake-api-project
```

Durante la creación del proyecto:
- `--routing`: Agrega el módulo de routing automáticamente
- `--style=scss`: Configura SCSS como preprocesador de CSS

### Instalación de dependencias adicionales

Para los gráficos de velas necesitamos ApexCharts:

```bash
npm install apexcharts ng-apexcharts
```

## 2. Estructura del proyecto

Vamos a organizar nuestro proyecto con la siguiente estructura:

```
src/
  app/
    elementos/         # Componentes reutilizables
      candlestick-chart/
      symbol/
    interfaces/        # Definiciones de tipos
      candlestick.interface.ts
      price-feed.interface.ts
      simbolo.ts
    paginas/           # Componentes de página
      candlestick/
      details/
      fee-promos/
      inicio/
      price-feed/
      symbols/
    servicios/         # Servicios para lógica de negocio y API
      price-feed.service.ts
      simbolos.service.ts
```

### Creación de la estructura básica

```bash
# Creamos las carpetas principales
mkdir -p src/app/elementos
mkdir -p src/app/interfaces
mkdir -p src/app/paginas
mkdir -p src/app/servicios

# Creamos los componentes de páginas
ng generate component paginas/inicio
ng generate component paginas/symbols
ng generate component paginas/details
ng generate component paginas/candlestick
ng generate component paginas/price-feed
ng generate component paginas/fee-promos

# Creamos los componentes reutilizables
ng generate component elementos/symbol
ng generate component elementos/candlestick-chart

# Creamos los servicios
ng generate service servicios/simbolos
ng generate service servicios/price-feed
```

## 3. Interfaces

Las interfaces son fundamentales para mantener un código TypeScript tipado y seguro. Vamos a crear las interfaces principales:

### candlestick.interface.ts

```typescript
export interface Candlestick {
  time: number; // Unix timestamp (segundos)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

type Temporality = '1m' | '5m' | '15m' | '30m' | '1h' | '6h' | '1day';

export type { Temporality };
```

Esta interfaz define la estructura de datos para nuestros gráficos de velas:
- `time`: Timestamp en formato Unix (segundos desde 1970)
- `open`: Precio de apertura
- `high`: Precio máximo durante el período
- `low`: Precio mínimo durante el período
- `close`: Precio de cierre
- `volume`: Volumen de operaciones

También definimos un tipo para las diferentes temporalidades de los gráficos.

### simbolo.ts

```typescript
export interface Simbolo {
  symbol: string;
  base_currency: string;
  quote_currency: string;
  tick_size: number;
  quote_increment: number;
  min_order_size: string;
  status: string;
}

export interface SimboloDetails extends Simbolo {
  instant_order_quote_limit: string;
  min_exchange_rate: string;
  max_exchange_rate: string;
  margin_available: boolean;
  fx_rate: string;
}
```

Esta interfaz define la estructura de los símbolos de trading:
- Interface básica `Simbolo` con propiedades fundamentales
- Interface extendida `SimboloDetails` para información más detallada

### price-feed.interface.ts

```typescript
export interface PriceFeed {
  type: string;
  symbol: string;
  price: string;
  side: 'buy' | 'sell';
  timestamp: number;
}
```

## 4. Servicios

Los servicios encapsulan la lógica de negocio y las llamadas a APIs.

### simbolos.service.ts

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Simbolo, SimboloDetails } from '../interfaces/simbolo';

@Injectable({
  providedIn: 'root'
})
export class SimbolosService {
  private baseUrl = 'https://api.sandbox.gemini.com/v1';

  constructor(private http: HttpClient) { }

  obtenerTodosLosSimbolos(): Observable<Simbolo[]> {
    return this.http.get<Simbolo[]>(`${this.baseUrl}/symbols`);
  }

  obtenerDetallesSimbolo(simbolo: string): Observable<SimboloDetails> {
    return this.http.get<SimboloDetails>(`${this.baseUrl}/symbols/details/${simbolo}`);
  }
}
```

Este servicio se encarga de:
- Obtener la lista completa de símbolos disponibles
- Obtener detalles específicos de un símbolo

### price-feed.service.ts

```typescript
import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { PriceFeed } from '../interfaces/price-feed.interface';

@Injectable({
  providedIn: 'root'
})
export class PriceFeedService {
  constructor() { }

  // Simulamos un feed de precios en tiempo real
  getPriceFeed(symbol: string): Observable<PriceFeed> {
    // Generamos un precio aleatorio cada 2 segundos
    return interval(2000).pipe(
      map(() => {
        const price = 10000 + Math.random() * 2000; // Precio base + variación aleatoria
        const side = Math.random() > 0.5 ? 'buy' : 'sell';
        
        return {
          type: 'trade',
          symbol: symbol,
          price: price.toFixed(2),
          side: side,
          timestamp: Math.floor(Date.now() / 1000)
        };
      })
    );
  }
  
  // Obtener datos históricos para los gráficos de velas
  getCandlestickData(symbol: string, temporality: string): Observable<any[]> {
    // En una aplicación real, esto vendría de una API
    return interval(1000).pipe(
      map(() => {
        // Generamos datos de ejemplo para un gráfico de velas
        const now = Math.floor(Date.now() / 1000);
        const data = [];
        
        // Generamos 30 velas hacia atrás
        for (let i = 30; i > 0; i--) {
          const basePrice = 10000 + Math.random() * 1000;
          const open = basePrice;
          const close = basePrice * (0.998 + Math.random() * 0.004); // +/- 0.2%
          const high = Math.max(open, close) * (1 + Math.random() * 0.002); // +0.2% max
          const low = Math.min(open, close) * (1 - Math.random() * 0.002); // -0.2% max
          
          // Calcular tiempo según temporalidad
          let timeOffset = 0;
          switch (temporality) {
            case '1m': timeOffset = i * 60; break;
            case '5m': timeOffset = i * 60 * 5; break;
            case '15m': timeOffset = i * 60 * 15; break;
            case '1h': timeOffset = i * 60 * 60; break;
            default: timeOffset = i * 60 * 60; break;
          }
          
          data.push({
            time: now - timeOffset,
            open: open,
            high: high,
            low: low,
            close: close,
            volume: Math.floor(Math.random() * 100) + 20
          });
        }
        
        return data;
      })
    );
  }
}
```

Este servicio:
- Simula un feed de precios en tiempo real usando `interval` de RxJS
- Utiliza el operador `map` para transformar cada tick en datos de precio
- Proporciona datos históricos para los gráficos de velas

> **Explicación de `map` en RxJS**: 
> El operador `map` de RxJS es similar al método `map` de los arrays en JavaScript, pero para Observables. Transforma cada valor emitido por un Observable aplicando una función y devolviendo un nuevo Observable con los valores transformados. Es fundamental para manipular datos en flujos reactivos.

## 5. Componentes principales

### app.config.ts

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
};
```

Es importante incluir el `provideHttpClient()` para poder realizar peticiones HTTP.

### app.routes.ts

```typescript
import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { SymbolsComponent } from './paginas/symbols/symbols.component';
import { DetailsComponent } from './paginas/details/details.component';
import { CandlestickComponent } from './paginas/candlestick/candlestick.component';
import { PriceFeedComponent } from './paginas/price-feed/price-feed.component';
import { FeePromosComponent } from './paginas/fee-promos/fee-promos.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'symbols', component: SymbolsComponent },
  { path: 'details/:symbol', component: DetailsComponent },
  { path: 'candlestick/:symbol', component: CandlestickComponent },
  { path: 'price-feed/:symbol', component: PriceFeedComponent },
  { path: 'fee-promos', component: FeePromosComponent },
  { path: '**', redirectTo: '' }
];
```

Este archivo define las rutas de nuestra aplicación:
- Ruta raíz para la página de inicio
- Ruta para ver todos los símbolos
- Rutas con parámetros para detalles de símbolos específicos, gráficos, etc.
- Redirección para rutas no encontradas

### app.component.ts

```typescript
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Crypto Market Data';
}
```

### app.component.html

```html
<div class="container">
  <header>
    <h1>{{ title }}</h1>
    <nav>
      <ul>
        <li><a routerLink="/">Inicio</a></li>
        <li><a routerLink="/symbols">Símbolos</a></li>
        <li><a routerLink="/fee-promos">Comisiones y Promos</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <router-outlet></router-outlet>
  </main>
  
  <footer>
    <p>© 2025 Crypto Market Data | Desarrollado con Angular 19</p>
  </footer>
</div>
```

## 6. Gráfico de velas (Candlestick)

El componente de gráfico de velas es una parte central de nuestra aplicación.

### candlestick-chart.component.ts

```typescript
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
      yaxis: { tooltip: { enabled: true } },
    });
    this.chart.render();
  }
}
```

#### Explicaciones importantes:

1. **OnChanges e AfterViewInit**:
   - `OnChanges`: Este ciclo de vida se ejecuta cuando los inputs del componente cambian
   - `AfterViewInit`: Se ejecuta después de que Angular inicializa la vista

2. **@Input() y @ViewChild**:
   - `@Input()`: Permite pasar datos al componente desde su componente padre
   - `@ViewChild`: Permite acceder a elementos del DOM del componente

3. **map en seriesData**:
   - Utilizamos `map` para transformar nuestros datos de velas al formato que espera ApexCharts
   - Convertimos el timestamp Unix en objeto Date
   - Organizamos los datos de precio en un array `[open, high, low, close]`
   - Usamos `reverse()` para mostrar los datos más antiguos primero

### candlestick-chart.component.html

```html
<div class="chart-container">
  <div #chartContainer></div>
</div>
```

### candlestick.component.ts (Página)

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PriceFeedService } from '../../servicios/price-feed.service';
import { Candlestick, Temporality } from '../../interfaces/candlestick.interface';
import { CandlestickChartComponent } from '../../elementos/candlestick-chart/candlestick-chart.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-candlestick',
  standalone: true,
  imports: [CommonModule, CandlestickChartComponent],
  templateUrl: './candlestick.component.html',
  styleUrl: './candlestick.component.scss'
})
export class CandlestickComponent implements OnInit, OnDestroy {
  symbol: string = '';
  temporalidad: Temporality = '1h';
  candlesticks: Candlestick[] = [];
  temporalidades: Temporality[] = ['1m', '5m', '15m', '30m', '1h', '6h', '1day'];
  private subscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private priceFeedService: PriceFeedService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.symbol = params['symbol'];
      this.cargarDatos();
    });
  }

  cargarDatos() {
    // Cancelar suscripción anterior si existe
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    
    this.subscription = this.priceFeedService
      .getCandlestickData(this.symbol, this.temporalidad)
      .subscribe(data => {
        this.candlesticks = data;
      });
  }

  cambiarTemporalidad(temp: Temporality) {
    this.temporalidad = temp;
    this.cargarDatos();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
```

### candlestick.component.html

```html
<div class="candlestick-page">
  <h2>Gráfico de {{ symbol }}</h2>
  
  <div class="temporality-selector">
    @for (temp of temporalidades; track temp) {
      <button 
        [class.active]="temporalidad === temp"
        (click)="cambiarTemporalidad(temp)">
        {{ temp }}
      </button>
    }
  </div>
  
  <app-candlestick-chart [candlesticks]="candlesticks"></app-candlestick-chart>
</div>
```

## 7. Integración con API externa

Para conectar con la API de Gemini, necesitamos configurar correctamente nuestros servicios HTTP.

### Configuración en app.config.ts

Ya hemos incluido el `provideHttpClient()` en la configuración de la aplicación, lo cual nos permite hacer peticiones HTTP.

### Uso en simbolos.service.ts

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Simbolo, SimboloDetails } from '../interfaces/simbolo';

@Injectable({
  providedIn: 'root'
})
export class SimbolosService {
  private baseUrl = 'https://api.sandbox.gemini.com/v1';

  constructor(private http: HttpClient) { }

  obtenerTodosLosSimbolos(): Observable<Simbolo[]> {
    return this.http.get<Simbolo[]>(`${this.baseUrl}/symbols`);
  }

  obtenerDetallesSimbolo(simbolo: string): Observable<SimboloDetails> {
    return this.http.get<SimboloDetails>(`${this.baseUrl}/symbols/details/${simbolo}`);
  }
}
```

#### Manejo de errores en peticiones HTTP

Es importante manejar los errores en las peticiones HTTP. Podemos mejorar nuestro servicio así:

```typescript
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Simbolo, SimboloDetails } from '../interfaces/simbolo';

@Injectable({
  providedIn: 'root'
})
export class SimbolosService {
  private baseUrl = 'https://api.sandbox.gemini.com/v1';

  constructor(private http: HttpClient) { }

  obtenerTodosLosSimbolos(): Observable<Simbolo[]> {
    return this.http.get<Simbolo[]>(`${this.baseUrl}/symbols`).pipe(
      retry(3), // Reintentar hasta 3 veces
      catchError(this.handleError)
    );
  }

  obtenerDetallesSimbolo(simbolo: string): Observable<SimboloDetails> {
    return this.http.get<SimboloDetails>(`${this.baseUrl}/symbols/details/${simbolo}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
```

## 8. Routing y navegación

Ya hemos definido nuestras rutas en `app.routes.ts`. Ahora veamos cómo implementar la navegación entre componentes.

### symbols.component.ts

```typescript
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SimbolosService } from '../../servicios/simbolos.service';
import { Simbolo } from '../../interfaces/simbolo';
import { SymbolComponent } from '../../elementos/symbol/symbol.component';

@Component({
  selector: 'app-symbols',
  standalone: true,
  imports: [CommonModule, SymbolComponent],
  templateUrl: './symbols.component.html',
  styleUrl: './symbols.component.scss'
})
export class SymbolsComponent implements OnInit {
  simbolos: Simbolo[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private simbolosService: SimbolosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarSimbolos();
  }

  cargarSimbolos() {
    this.loading = true;
    this.simbolosService.obtenerTodosLosSimbolos().subscribe({
      next: (data) => {
        this.simbolos = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los símbolos: ' + err.message;
        this.loading = false;
      }
    });
  }

  verDetalles(symbol: string) {
    this.router.navigate(['/details', symbol]);
  }

  verGrafico(symbol: string) {
    this.router.navigate(['/candlestick', symbol]);
  }

  verPriceFeed(symbol: string) {
    this.router.navigate(['/price-feed', symbol]);
  }
}
```

### symbols.component.html

```html
<div class="symbols-page">
  <h2>Símbolos disponibles</h2>
  
  @if (loading) {
    <p>Cargando símbolos...</p>
  } @else if (error) {
    <div class="error-message">
      {{ error }}
      <button (click)="cargarSimbolos()">Reintentar</button>
    </div>
  } @else {
    <div class="symbols-list">
      @for (simbolo of simbolos; track simbolo.symbol) {
        <app-symbol 
          [simbolo]="simbolo"
          (onDetalles)="verDetalles(simbolo.symbol)"
          (onGrafico)="verGrafico(simbolo.symbol)"
          (onPriceFeed)="verPriceFeed(simbolo.symbol)">
        </app-symbol>
      }
    </div>
    
    @if (simbolos.length === 0) {
      <p>No hay símbolos disponibles.</p>
    }
  }
</div>
```

### symbol.component.ts (elemento reutilizable)

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Simbolo } from '../../interfaces/simbolo';

@Component({
  selector: 'app-symbol',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './symbol.component.html',
  styleUrl: './symbol.component.scss'
})
export class SymbolComponent {
  @Input() simbolo!: Simbolo;
  @Output() onDetalles = new EventEmitter<void>();
  @Output() onGrafico = new EventEmitter<void>();
  @Output() onPriceFeed = new EventEmitter<void>();
  
  verDetalles() {
    this.onDetalles.emit();
  }
  
  verGrafico() {
    this.onGrafico.emit();
  }
  
  verPriceFeed() {
    this.onPriceFeed.emit();
  }
}
```

### symbol.component.html

```html
<div class="symbol-card">
  <div class="symbol-header">
    <h3>{{ simbolo.symbol }}</h3>
    <div class="currencies">
      <span>{{ simbolo.base_currency }}</span> / 
      <span>{{ simbolo.quote_currency }}</span>
    </div>
  </div>
  
  <div class="symbol-details">
    <div class="detail-row">
      <span>Tamaño mínimo:</span>
      <span>{{ simbolo.min_order_size }}</span>
    </div>
    <div class="detail-row">
      <span>Estado:</span>
      <span [class]="simbolo.status">{{ simbolo.status }}</span>
    </div>
  </div>
  
  <div class="symbol-actions">
    <button (click)="verDetalles()">Detalles</button>
    <button (click)="verGrafico()">Gráfico</button>
    <button (click)="verPriceFeed()">Price Feed</button>
  </div>
</div>
```

## 9. Estilos y diseño responsivo

Vamos a crear estilos básicos para nuestra aplicación:

### styles.scss (global)

```scss
/* Variables globales */
:root {
  --color-primary: #3498db;
  --color-secondary: #2ecc71;
  --color-accent: #e74c3c;
  --color-background: #f8f9fa;
  --color-text: #2c3e50;
  --color-text-light: #7f8c8d;
  --color-border: #ecf0f1;
  --border-radius: 8px;
  --box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Reset básico */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', Arial, sans-serif;
  line-height: 1.6;
  color: var(--color-text);
  background-color: var(--color-background);
}

/* Estilos de container */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Estilos para elementos comunes */
h1, h2, h3 {
  margin-bottom: 0.5em;
}

a {
  color: var(--color-primary);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

button {
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: darken(#3498db, 10%);
  }
  
  &.secondary {
    background-color: var(--color-secondary);
    
    &:hover {
      background-color: darken(#2ecc71, 10%);
    }
  }
}

/* Media queries para diseño responsivo */
@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
  
  h1 {
    font-size: 1.8rem;
  }
  
  h2 {
    font-size: 1.4rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 10px;
  }
  
  h1 {
    font-size: 1.6rem;
  }
  
  h2 {
    font-size: 1.3rem;
  }
}
```

### app.component.scss

```scss
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background-color: #ffffff;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  h1 {
    color: var(--color-primary);
    margin-bottom: 1rem;
  }
  
  nav {
    ul {
      display: flex;
      list-style: none;
      gap: 1.5rem;
      
      li {
        a {
          font-weight: 500;
          
          &:hover {
            color: darken(#3498db, 15%);
          }
          
          &.active {
            color: var(--color-secondary);
          }
        }
      }
    }
  }
}

main {
  flex: 1;
  padding: 2rem 0;
}

footer {
  background-color: #f1f1f1;
  padding: 1rem 0;
  text-align: center;
  margin-top: auto;
  
  p {
    color: var(--color-text-light);
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  header {
    nav ul {
      flex-wrap: wrap;
      gap: 1rem;
    }
  }
}
```

### candlestick-chart.component.scss

```scss
.chart-container {
  width: 100%;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1rem;
  margin: 1rem 0;
  
  height: 400px;
  
  @media (max-width: 768px) {
    height: 300px;
  }
}
```

### symbol.component.scss

```scss
.symbol-card {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1rem;
  margin-bottom: 1rem;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-3px);
  }
  
  .symbol-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.8rem;
    
    h3 {
      font-size: 1.2rem;
      margin-bottom: 0;
    }
    
    .currencies {
      font-size: 0.9rem;
      color: var(--color-text-light);
    }
  }
  
  .symbol-details {
    margin-bottom: 1rem;
    
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      
      span:first-child {
        color: var(--color-text-light);
      }
      
      .active {
        color: var(--color-secondary);
      }
      
      .inactive {
        color: var(--color-accent);
      }
    }
  }
  
  .symbol-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    
    button {
      font-size: 0.9rem;
      padding: 6px 12px;
    }
  }
}

@media (max-width: 480px) {
  .symbol-card {
    .symbol-header {
      flex-direction: column;
      align-items: flex-start;
      
      h3 {
        margin-bottom: 0.3rem;
      }
    }
    
    .symbol-actions {
      flex-direction: column;
      align-items: stretch;
    }
  }
}
```

## 10. Despliegue

Para desplegar nuestra aplicación, podemos utilizar varias opciones. La más sencilla es utilizar GitHub Pages.

### Instalación de angular-cli-ghpages

Ya hemos instalado este paquete en nuestras dependencias:

```bash
npm install angular-cli-ghpages --save-dev
```

### Creación de script de despliegue

Añadimos un script en nuestro package.json:

```json
"scripts": {
  "ng": "ng",
  "start": "ng serve",
  "build": "ng build",
  "watch": "ng build --watch --configuration development",
  "test": "ng test",
  "deploy": "ng build --configuration production --base-href=/fakeApiProject/ && npx angular-cli-ghpages --dir=dist/fake-api-project/browser"
}
```

### Despliegue

Para desplegar la aplicación:

```bash
npm run deploy
```

Esto compilará nuestra aplicación y la desplegará en GitHub Pages.

## Resumen

En este tutorial has aprendido a:

1. Configurar un proyecto Angular desde cero
2. Estructurar el proyecto de manera organizada
3. Crear interfaces TypeScript para tipado seguro
4. Implementar servicios para conectarse a APIs externas
5. Crear componentes reutilizables
6. Implementar gráficos de velas usando ApexCharts
7. Configurar el routing y la navegación
8. Crear un diseño responsivo con SCSS
9. Desplegar la aplicación

Este proyecto es una buena base para cualquier aplicación de visualización de datos financieros. Puedes expandirlo con más funcionalidades como:

- Autenticación de usuario
- Guardado de favoritos
- Notificaciones en tiempo real
- Análisis técnico avanzado
- Modo oscuro

¡Feliz desarrollo!