import { Category } from './../../categories/shared/category.model';
import { Component } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { Entry } from '../shared/entry.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../categories/shared/category.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-entry-list',
  imports: [RouterModule, CommonModule],
  templateUrl: './entry-list.component.html',
  styleUrl: './entry-list.component.scss'
})
export class EntryListComponent {
  constructor(private entryService: EntryService,
    private categoryService: CategoryService) { }
  entries: Entry[] = [];
  categories: Category[] = [];

  ngOnInit(): void {

  forkJoin({
  categories: this.categoryService.getAll(),
  entries: this.entryService.getAll()
}).subscribe({
  next: ({ categories, entries }) => {
    this.categories = categories;
     this.entries = entries.map(e => {
      const entry = e;// Object.assign(new Entry(), e);
      entry.category = categories.find(cat => Number(cat.id) === e.categoryId);
      return entry
    });
  },
  error: () => alert('Erro ao carregar')
});
  }

  excluirCategoria(entry?: Entry) {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if (!!mustDelete)
      this.entryService.delete(entry?.id as number).subscribe({
        next: (entries) =>
          (this.entries = this.entries.filter((f) => f != entry)),
        error: () => alert('Erro ao excluir'),
      });
  }
}
