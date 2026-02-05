
import { Routes } from '@angular/router';
import { Catalog } from './features/catalog/catalog';
import { Login } from './features/login/login';
import { Register } from './features/register/register';
import { Cart } from './features/cart/cart';
import { AddProduct } from './features/add-product/add-product';
import { About } from './about';
import { Contact } from './features/contact/contact';
import { Faq } from './features/faq/faq';
import { Legal } from './features/legal/legal';
import { Profile } from './features/profile/profile';


export const routes: Routes = [
    { path: '', redirectTo: 'catalog', pathMatch: 'full' },
    { path: 'catalog', component: Catalog },
    { path: 'about', component: About },
    { path: 'contact', component: Contact },
    { path: 'faq', component: Faq },
    { path: 'legal', component: Legal },
    { path: 'profile', component: Profile },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'cart', component: Cart },
    { path: 'add-product', component: AddProduct }
];
