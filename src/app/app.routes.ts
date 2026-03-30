import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login),
  },
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'customers/add',
        loadComponent: () => import('./features/customers/add-customer/add-customer').then(m => m.AddCustomer),
      },
      {
        path: 'customers/search',
        loadComponent: () => import('./features/customers/search-results/search-results').then(m => m.SearchResults),
      },
    ],
  },
];
