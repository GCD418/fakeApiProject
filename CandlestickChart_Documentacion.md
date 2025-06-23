# Documentación Detallada: Gráfica de Velas (Candlestick) con Gemini API y ApexCharts en Angular

## 1. Preconfiguración y Creación del Proyecto

### 1.1. Crear un nuevo proyecto Angular
```bash
ng new fakeApiProject --routing --style=scss
cd fakeApiProject
```
- `--routing`: Incluye configuración de rutas desde el inicio.
- `--style=scss`: Usa SCSS para estilos.

### 1.2. Instalar dependencias necesarias
```bash
npm install apexcharts ng-apexcharts --force
```
- `apexcharts`: Librería de gráficos JS.
- `ng-apexcharts`: Wrapper Angular para ApexCharts.
- `--force`: Permite instalar aunque haya advertencias de dependencias (útil si Angular y ng-apexcharts no coinciden en versión).

### 1.3. Crear la estructura de carpetas y componentes

#### Componentes principales:
```bash
ng generate component paginas/price-feed --standalone
ng generate component paginas/candlestick --standalone
ng generate component elementos/candlestick-chart --standalone
```
- `--standalone`: Hace que el componente no dependa de un NgModule, más moderno y flexible.

#### Servicio:
```bash
ng generate service servicios/price-feed
```

#### Interfaces:
Crea manualmente el archivo `src/app/interfaces/candlestick.interface.ts` para definir la estructura de los datos.

### 1.4. Configuración de rutas
Edita `src/app/app.routes.ts` para agregar las rutas necesarias:
```typescript
import { Routes } from '@angular/router';
import { PriceFeedComponent } from './paginas/price-feed/price-feed.component';
import { CandlestickComponent } from './paginas/candlestick/candlestick.component';

export const routes: Routes = [
  { path: 'precios', component: PriceFeedComponent },
  { path: 'candlestick/:simbolo', component: CandlestickComponent },
  { path: '', redirectTo: '/precios', pathMatch: 'full' }
];
```
- Así, `/precios` muestra el feed y `/candlestick/:simbolo` la gráfica de velas para un símbolo.

## 2. Implementación Paso a Paso y Explicaciones

### 2.1. Interfaz para los datos de velas
Archivo: `src/app/interfaces/candlestick.interface.ts`
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
- **¿Por qué?** Así tipamos los datos y evitamos errores al manipularlos.

### 2.2. Servicio para consumir la API de Gemini
Archivo: `src/app/servicios/price-feed.service.ts`
```typescript
getCandlestickData(symbol: string, temporality: Temporality): Observable<Candlestick[]> {
  const url = `https://api.gemini.com/v2/candles/${symbol}/${temporality}`;
  return this.http.get<any[]>(url).pipe(
    map(data => {
      // Gemini devuelve arrays: [timestamp, open, close, high, low, volume]
      // Usamos map para transformar cada array en un objeto tipado
      const mapped = data.map(item => ({
        time: item[0],
        open: item[1],
        close: item[2],
        high: item[3],
        low: item[4],
        volume: item[5],
      }));
      // Filtramos solo los últimos 10 días y máximo 500 velas
      const now = Math.floor(Date.now() / 1000);
      const tenDaysAgo = now - 10 * 24 * 60 * 60;
      const filtered = mapped.filter(c => c.time >= tenDaysAgo);
      return filtered.slice(0, 500);
    })
  );
}
```
- **¿Por qué usamos `map`?**
  - El método `map` de RxJS permite transformar la respuesta de la API (un array de arrays) en un array de objetos `Candlestick`, mucho más fácil de usar en Angular.
  - También permite filtrar y limitar los datos antes de que lleguen al componente, optimizando el rendimiento.

### 2.3. Componente de la gráfica de velas
Archivo: `src/app/elementos/candlestick-chart/candlestick-chart.component.ts`
```typescript
@Input() candlesticks: Candlestick[] = [];
@ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

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
```
- **¿Por qué usamos `@Input`?** Permite que el componente reciba los datos desde el padre.
- **¿Por qué usamos `ViewChild`?** Para obtener una referencia al div donde se renderiza el gráfico.
- **¿Por qué `.reverse()`?** Gemini devuelve los datos del más reciente al más antiguo, pero ApexCharts espera del más antiguo al más reciente.

### 2.4. Página de la gráfica de velas
Archivo: `src/app/paginas/candlestick/candlestick.component.ts`
- Obtiene el símbolo de la ruta con `ActivatedRoute`.
- Permite seleccionar la temporalidad con un `<select>`.
- Llama al servicio y pasa los datos al componente de la gráfica.
- Filtra los datos para mostrar solo los últimos 10 días.

### 2.5. Botón para ver la gráfica desde el feed de precios
Archivo: `src/app/paginas/price-feed/price-feed.component.html`
```html
<button class="chart-button" (click)="goToCandlestick(item.pair)">
  Ver Gráfica
</button>
```
Y en el TS:
```typescript
goToCandlestick(pair: string): void {
  const cleanSymbol = pair.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  this.router.navigate(['/candlestick', cleanSymbol]);
}
```
- **¿Por qué limpiar el símbolo?** Para que coincida con el formato esperado por la API de Gemini.

## 3. Consejos y Notas Finales
- Si la carga es lenta, usa temporalidades mayores (por ejemplo, '1h' o '1day').
- El filtrado se hace en el frontend porque la API de Gemini no permite limitar la cantidad de datos descargados.
- El parámetro `--force` en la instalación de npm es seguro en este contexto, pero revisa si hay problemas en producción.

## 4. Recursos
- [Documentación de Gemini API](https://docs.gemini.com/rest-api/)
- [ApexCharts.js](https://apexcharts.com/docs/)
- [ng-apexcharts](https://apexcharts.com/docs/angular-charts/)

---

**Autor:** Tu equipo de desarrollo
**Fecha:** Junio 2025
