import { CommonModule } from '@angular/common';
import {
  AfterContentChecked,
  AfterViewChecked,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-category-form',
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {
  category: Category = {};
  currentAction!: string;
  categoryForm!: FormGroup;
  pageTitle!: string;
  serverErrorMessages: string[] = [];
  submittingForm = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.setCurrentActions();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction == 'new') {
      this.createCategory();
    } else {
      this.updateCategory();
    }
  }

  //Private Methods

  private loadCategory() {
    if (this.currentAction == 'edit') {
      this.route.paramMap
        .pipe(
          switchMap((params) => {
            const idParam = params.get('id');
            if (idParam === null) {
              throw new Error("Parâmetro 'id' ausente na rota.");
            }
            return this.categoryService.getById(+idParam);
          })
        )
        .subscribe({
          next: (category) => {
            this.category = category;
            this.categoryForm.patchValue(category);
          },
          error: () => alert('Ocorreu erro'),
        });
    }
  }

  private buildCategoryForm() {
    this.categoryForm = this.fb.group({
      id: [],
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [null],
    });
  }

  private setCurrentActions() {
    if (this.route.snapshot.url[0].path == 'new') this.currentAction = 'new';
    else this.currentAction = 'edit';
  }

  private setPageTitle() {
    if (this.currentAction == 'edit') {
      const categoryName = this.category.name || '';

      this.pageTitle = 'Editando categoria: ' + categoryName;
      return;
    }

    this.pageTitle =
      this.currentAction == 'new' ? 'Cadastro de nova categoria' : '';
  }

  private updateCategory() {
    const category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.update(category).subscribe({
      next: (category) => {
        this.actionsForSucess(category);
      },
      error: (err) => this.actionsForError(err),
    });
  }

  private createCategory() {
    const category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.create(category).subscribe({
      next: (category) => {
        this.actionsForSucess(category);
      },
      error: (err) => this.actionsForError(err),
    });
  }

  private actionsForError(error: any): void {
    this.toastr.error('Ocorreu um erro ao processar a solicitação');
    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else this.serverErrorMessages = ['Falha na comunicação com o servidor'];
  }

  private actionsForSucess(category: Category) {
    this.toastr.success('Solicitação processada com sucesso');
    this.router
      .navigateByUrl('categories', { skipLocationChange: true })
      .then(() => this.router.navigate(['categories', category.id, 'edit']));
  }
}
