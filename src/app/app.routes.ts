import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo : 'categories'
  },
  {
    path : 'categories',
    loadChildren : () => import('./pages/categories/category.routes.js').then(m => m.categoryRoutes)
  }
];
