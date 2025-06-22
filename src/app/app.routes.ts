import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { SymbolsComponent } from './paginas/symbols/symbols.component';
import { FeePromosComponent } from './paginas/fee-promos/fee-promos.component';
import { DetailsComponent } from './paginas/details/details.component';
import { PriceFeedComponent } from './paginas/price-feed/price-feed.component';
import { CandlestickComponent } from './paginas/candlestick/candlestick.component';

export const routes: Routes = [
    {path: 'inicio', component: InicioComponent},
    {path: 'symbols', component: SymbolsComponent},
    {path: 'fee-promos', component: FeePromosComponent},
    {path: 'details/:simbolo', component: DetailsComponent},
    { path: 'precios', component: PriceFeedComponent },
    {path: 'candlestick/:simbolo', component: CandlestickComponent},
    {path: '', redirectTo: '/inicio', pathMatch: 'full'}
]

