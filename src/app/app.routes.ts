import { Routes } from '@angular/router';
import { Home } from './home/home';
import { authGuard } from '../shared/guards/index'

export const routes: Routes = [
    { path: 'home', component: Home, canActivate: [authGuard] },
    { path: 'login', loadComponent: () => import('../app/login/login').then(c => c.Login) },
    { path: 'signup', loadComponent: () => import('../app/registration/registration').then(c => c.Registration) },
    { path: 'profile', loadComponent: () => import('../app/user-profile-form/user-profile-form').then(c => c.UserProfileForm), canActivate: [authGuard] },
    { path: 'user-profile', loadComponent: () => import('../app/user-profile/user-profile').then(c => c.UserProfile), canActivate: [authGuard] },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home' }
];
