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

import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';
import { EntryService } from '../shared/entries.service';
import { Entry } from '../shared/entry.model';

@Component({
  selector: 'app-entry-form',
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './entry-form.component.html',
  styleUrl: './entry-form.component.scss',
})
export class EntryFormComponent implements OnInit, AfterContentChecked {
  entry: Entry = new Entry();
  currentAction!: string;
  entryForm!: FormGroup;
  pageTitle!: string;
  serverErrorMessages: string[] = [];
  submittingForm = false;

  constructor(
    private fb: FormBuilder,
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.setCurrentActions();
    this.buildEntryForm();
    this.loadEntry();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction == 'new') {
      this.createEntry();
    } else {
      this.updateEntry();
    }
  }

  //Private Methods

  private loadEntry() {
    if (this.currentAction == 'edit') {
      this.route.paramMap
        .pipe(
          switchMap((params) => {
            const idParam = params.get('id');
            if (idParam === null) {
              throw new Error("Parâmetro 'id' ausente na rota.");
            }
            return this.entryService.getById(+idParam);
          })
        )
        .subscribe({
          next: (entry) => {
            this.entry = entry;
            this.entryForm.patchValue(entry);
          },
          error: () => alert('Ocorreu erro'),
        });
    }
  }

  private buildEntryForm() {
    this.entryForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }

  private setCurrentActions() {
    if (this.route.snapshot.url[0].path == 'new') this.currentAction = 'new';
    else this.currentAction = 'edit';
  }

  private setPageTitle() {
    if (this.currentAction == 'edit') {
      const entryName = this.entry.name || '';

      this.pageTitle = 'Editando lanlamento: ' + entryName;
      return;
    }

    this.pageTitle =
      this.currentAction == 'new' ? 'Cadastro de nova categoria' : '';
  }

  private updateEntry() {
    const entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.update(entry).subscribe({
      next: (entry) => {
        this.actionsForSucess(entry);
      },
      error: (err) => this.actionsForError(err),
    });
  }

  private createEntry() {
    const entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.create(entry).subscribe({
      next: (entry) => {
        this.actionsForSucess(entry);
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

  private actionsForSucess(entry: Entry) {
    this.toastr.success('Solicitação processada com sucesso');
    this.router
      .navigateByUrl('entries', { skipLocationChange: true })
      .then(() => this.router.navigate(['entries', entry.id, 'edit']));
  }
}
