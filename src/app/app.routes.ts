import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    title: 'PAGES.LOGIN',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login),
  },
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        title: 'PAGES.DASHBOARD',
        loadComponent: () => import('./features/dashboard/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'customers/add',
        title: 'PAGES.ADD_CUSTOMER',
        loadComponent: () => import('./features/customers/add-customer/add-customer').then(m => m.AddCustomer),
      },
      {
        path: 'customers/edit/:id',
        title: 'PAGES.EDIT_CUSTOMER',
        loadComponent: () => import('./features/customers/add-customer/add-customer').then(m => m.AddCustomer),
      },
      {
        path: 'customers/search',
        title: 'PAGES.SEARCH_RESULTS',
        loadComponent: () => import('./features/customers/search-results/search-results').then(m => m.SearchResults),
      },
      {
        path: 'customers/:id',
        title: 'PAGES.CUSTOMER_DETAILS',
        loadComponent: () => import('./features/customers/customer-detail/customer-detail').then(m => m.CustomerDetail),
      },
      {
        path: 'customers/:id/tickets/:type',
        title: 'PAGES.CUSTOMER_TICKETS',
        loadComponent: () => import('./features/customers/customer-tickets/customer-tickets').then(m => m.CustomerTickets),
      },
    ],
  },
];
