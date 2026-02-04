import { Routes } from '@angular/router';
import { Catalog } from './features/catalog/catalog';
import { Login } from './features/login/login';
import { Register } from './features/register/register';

export const routes: Routes = [
    { path: '', redirectTo: 'catalog', pathMatch: 'full' },
    { path: 'catalog', component: Catalog },
    { path: 'login', component: Login },
    { path: 'register', component: Register }
];
