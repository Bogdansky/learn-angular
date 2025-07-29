import { Routes } from '@angular/router';
import { Home } from './home/home';
import { authGuard } from '../shared/guards/index'

export const routes: Routes = [
    { path: 'home', component: Home, canActivate: [authGuard] },
    { path: 'login', loadComponent: () => import('../app/login/login').then(c => c.Login) },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home' }
];
