import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';
import { error } from 'console';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) {}
  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => (this.categories = categories),
      error: () => alert('Erro ao carregar'),
    });
  }

  excluirCategory(category?: Category) {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if (!!mustDelete)
      this.categoryService.delete(category?.id as number).subscribe({
        next: (categories) =>
          (this.categories = this.categories.filter((f) => f != category)),
        error: () => alert('Erro ao excluir'),
      });
  }
}
