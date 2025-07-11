import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PriceFeedService } from '../../servicios/price-feed.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-price-feed',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './price-feed.component.html',
  styleUrl: './price-feed.component.scss'
})
export class PriceFeedComponent implements OnInit {
  priceFeedData: any[] = [];
  filteredData: any[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private priceFeedService: PriceFeedService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPriceFeed();
  }

  loadPriceFeed(): void {
    this.loading = true;
    this.error = null;
    
    this.priceFeedService.getPriceFeed().subscribe({
      next: (data) => {
        // Convertir el objeto en un array para poder iterarlo en el template
        this.priceFeedData = Object.values(data);
        this.filterData(); // Aplicar filtro inicial
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching price feed:', error);
        this.error = 'Error al cargar los datos de precios';
        this.loading = false;
      }
    });
  }

  formatPrice(price: string): string {
    const numPrice = parseFloat(price);
    return numPrice.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  }

  formatPercentage(percentage: string): number {
    return parseFloat(percentage);
  }

  isPositiveChange(percentage: string): boolean {
    return parseFloat(percentage) >= 0;
  }

  goToDetails(pair: string): void {
    const cleanSymbol = pair.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
    
    this.router.navigate(['/details', cleanSymbol]);
  }

  goToCandlestick(pair: string): void {
    const cleanSymbol = pair.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
    this.router.navigate(['/candlestick', cleanSymbol]);
  }
  
  filterData(): void {
    if (!this.searchTerm.trim()) {
      // Si no hay término de búsqueda, mostrar todos los datos
      this.filteredData = [...this.priceFeedData];
      return;
    }
    
    const searchTermLower = this.searchTerm.toLowerCase().trim();
    
    // Filtrar los datos que contienen el término de búsqueda en el nombre del par
    this.filteredData = this.priceFeedData.filter(item => 
      item.pair.toLowerCase().includes(searchTermLower)
    );
  }
  
  onSearch(): void {
    this.filterData();
  }
}
