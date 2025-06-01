import { Routes } from '@angular/router';
import { CategoryFormComponent } from './category-form/category-form.component.js';
import { CategoryListComponent } from './category-list/category-list.component.js';

export const categoryRoutes: Routes = [
  {
    path: '',
    component: CategoryListComponent,
  },
  {
    path: ':id/edit',
    component: CategoryFormComponent,
  },
  {
    path: 'new',
    component: CategoryFormComponent,
  },
];
