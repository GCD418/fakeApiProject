# Documentación: Implementación de Gráfica de Velas (Candlestick) con Gemini API y ApexCharts en Angular

## 1. Requisitos previos
- Node.js y npm instalados
- Angular CLI instalado globalmente (`npm install -g @angular/cli`)
- Proyecto Angular ya creado y funcionando

## 2. Instalación de dependencias necesarias

### Instalar ApexCharts y ng-apexcharts
```bash
npm install apexcharts ng-apexcharts --force
```
> **Nota:** Se usa `--force` porque puede haber conflictos de dependencias con la versión de Angular. Esto permite instalar igualmente los paquetes necesarios para la gráfica.

## 3. Estructura de Archivos Relevantes
- `src/app/paginas/price-feed/price-feed.component.*` — Página principal de precios
- `src/app/paginas/candlestick/candlestick.component.*` — Página de la gráfica de velas
- `src/app/elementos/candlestick-chart/candlestick-chart.component.*` — Componente que dibuja la gráfica
- `src/app/servicios/price-feed.service.ts` — Servicio para consumir la API de Gemini
- `src/app/interfaces/candlestick.interface.ts` — Interfaz para los datos de velas

## 4. Implementación Paso a Paso

### 4.1. Crear la interfaz para los datos de velas
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

### 4.2. Servicio para obtener datos de velas de Gemini
Archivo: `src/app/servicios/price-feed.service.ts`
```typescript
getCandlestickData(symbol: string, temporality: Temporality): Observable<Candlestick[]> {
  const url = `https://api.gemini.com/v2/candles/${symbol}/${temporality}`;
  return this.http.get<any[]>(url).pipe(
    map(data => {
      const mapped = data.map(item => ({
        time: item[0],
        open: item[1],
        close: item[2],
        high: item[3],
        low: item[4],
        volume: item[5],
      }));
      // Solo los últimos 10 días y máximo 500 velas
      const now = Math.floor(Date.now() / 1000);
      const tenDaysAgo = now - 10 * 24 * 60 * 60;
      const filtered = mapped.filter(c => c.time >= tenDaysAgo);
      return filtered.slice(0, 500);
    })
  );
}
```

### 4.3. Página de la gráfica de velas
Archivo: `src/app/paginas/candlestick/candlestick.component.ts`
- Obtiene el símbolo de la ruta, permite seleccionar temporalidad y muestra la gráfica.
- Filtra los datos para mostrar solo los últimos 10 días.

### 4.4. Componente de la gráfica
Archivo: `src/app/elementos/candlestick-chart/candlestick-chart.component.ts`
- Recibe los datos por `@Input()` y dibuja la gráfica usando ApexCharts.

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

### 4.5. Agregar botón para ver gráfica en la página de precios
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

## 5. Notas y Consejos
- La API de Gemini no permite limitar la cantidad de datos descargados, por lo que el filtrado se hace en el frontend.
- Si la carga es lenta, prueba con temporalidades mayores (por ejemplo, '1h' o '1day').
- El parámetro `--force` en la instalación de npm es seguro en este contexto, pero revisa si hay problemas en producción.

## 6. Recursos
- [Documentación de Gemini API](https://docs.gemini.com/rest-api/)
- [ApexCharts.js](https://apexcharts.com/docs/)
- [ng-apexcharts](https://apexcharts.com/docs/angular-charts/)

---

**Autor:** Tu equipo de desarrollo
**Fecha:** Junio 2025
