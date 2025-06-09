import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive} from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SimbolosService } from './servicios/simbolos.service';
import { PriceFeedService } from './servicios/price-feed.service';
import { PriceFeedComponent } from './paginas/price-feed/price-feed.component';
import { TradesComponent } from './paginas/trades/trades.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, PriceFeedComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  simbolosService: SimbolosService = inject(SimbolosService);
  priceFeedService: PriceFeedService = inject(PriceFeedService);
  
  constructor() {
  }
}
