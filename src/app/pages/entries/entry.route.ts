import { Routes } from '@angular/router';
import { EntryListComponent } from './entry-list/entry-list.component.js';
import { EntryFormComponent } from './entry-form/entry-form.component.js';

export const entryRoutes: Routes = [
  {
    path: '',
    component: EntryListComponent,
  },
  {
    path: ':id/edit',
    component: EntryFormComponent,
  },
  {
    path: 'new',
    component: EntryFormComponent,
  },
];
