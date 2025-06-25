import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { SymbolsComponent } from './paginas/symbols/symbols.component';
import { FeePromosComponent } from './paginas/fee-promos/fee-promos.component';
import { DetailsComponent } from './paginas/details/details.component';
import { LoginComponent } from './paginas/login/login.component';
import { RegisterComponent } from './paginas/register/register.component';

export const routes: Routes = [
    {path: 'inicio', component: InicioComponent},
    {path: 'symbols', component: SymbolsComponent},
    {path: 'fee-promos', component: FeePromosComponent},
    {path: 'details', component: DetailsComponent},
    {path: '', redirectTo: '/inicio', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},

];
