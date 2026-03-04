import { Routes } from '@angular/router';
import { EntriesComponent } from './entries.component';
import { EntryListComponent } from './entry-list/entry-list.component';
import { EntryFormComponent } from './entry-form/entry-form.component';

export const entryRoutes: Routes = [
  {
    path: '',
    component: EntryListComponent,
  },
  {
    path: 'new',
    component: EntryFormComponent,
  },
  {
    path: ':id/edit',
    component: EntryFormComponent,
  },
];
