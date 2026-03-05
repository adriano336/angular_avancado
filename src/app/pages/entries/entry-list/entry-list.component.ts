import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Entry } from '../shared/entry.model';
import { CommonModule } from '@angular/common';
import { EntryService } from '../shared/entries.service';

@Component({
  selector: 'app-entry-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './entry-list.component.html',
  styleUrl: './entry-list.component.scss',
})
export class EntryListComponent implements OnInit {
  entries: Entry[] = [];

  constructor(private entryService: EntryService) {}
  ngOnInit(): void {
    this.entryService.getAll().subscribe({
      next: (entry) => (this.entries = entry),
      error: () => console.log('Erro ao carregar'),
    });
  }

  excluirEntry(entry?: Entry) {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if (!!mustDelete)
      this.entryService.delete(entry?.id as number).subscribe({
        next: (entry) =>
          (this.entries = this.entries.filter((f) => f != entry)),
        error: () => alert('Erro ao excluir'),
      });
  }
}
