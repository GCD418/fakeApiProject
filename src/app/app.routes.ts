import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { SymbolsComponent } from './paginas/symbols/symbols.component';
import { FeePromosComponent } from './paginas/fee-promos/fee-promos.component';
import { DetailsComponent } from './paginas/details/details.component';
import { LoginComponent } from './paginas/login/login.component';
import { RegisterComponent } from './paginas/register/register.component';
import { PriceFeedComponent } from './paginas/price-feed/price-feed.component';
import { CandlestickComponent } from './paginas/candlestick/candlestick.component';
import { AboutComponent } from './paginas/about/about.component';
import { CryptosComponent } from './paginas/cryptos/cryptos.component';
import { CryptoDetailsComponent } from './paginas/crypto-details/crypto-details.component';

export const routes: Routes = [
    {path: 'inicio', component: InicioComponent},
    {path: 'symbols', component: SymbolsComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'details/:simbolo', component: DetailsComponent},
    { path: 'precios', component: PriceFeedComponent },
    {path: 'candlestick/:simbolo', component: CandlestickComponent},

    {path: 'cryptos', component: CryptosComponent},
    {path: 'cryptos/:symbol', component: CryptoDetailsComponent},
    {path: 'about', component: AboutComponent},
    {path: '', redirectTo: '/inicio', pathMatch: 'full'},
    {path: '**', redirectTo: '/inicio'}
]

