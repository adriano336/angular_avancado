import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo : 'categories'
  },
  {
    path : 'categories',
    loadChildren : () => import('./pages/categories/category.routes.js')
    .then(m => m.categoryRoutes)
  },
  {
    path: 'entries',
    loadChildren : () => import('./pages/entries/entries.routes.js')
    .then(r => r.entryRoutes)
  }
];
