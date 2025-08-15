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
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';
import { DatePickerModule } from 'primeng/datepicker';
import { IMaskModule } from "angular-imask";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-entry-form',
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    DatePickerModule,
    IMaskModule,
    BrowserAnimationsModule,
    BrowserModule
  ],
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
  imaskConfig : any = {
    mask: Number,
    scale: 2,
    thousandSeparator: '',
    padDractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  }
  ptBr = {
  firstDayOfWeek: 0,
  dayNames: [
    'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'
  ],
  dayNamesShort: [
    'dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'
  ],
  dayNamesMin: [
    'D', 'S', 'T', 'Q', 'Q', 'S', 'S'
  ],
  monthNames: [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ],
  monthNamesShort: [
    'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
    'jul', 'ago', 'set', 'out', 'nov', 'dez'
  ],
  today: 'Hoje',
  clear: 'Limpar',
  dateFormat: 'dd/mm/yy',
  weekHeader: 'Sem'
};

  constructor(
    private fb: FormBuilder,
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

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
      id: [],
      name: ['', [Validators.required, Validators.minLength(2)]],
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

      this.pageTitle = 'Editando categoria: ' + entryName;
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
      .navigateByUrl('categories', { skipLocationChange: true })
      .then(() => this.router.navigate(['categories', entry.id, 'edit']));
  }
}
