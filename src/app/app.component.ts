import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
   providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]

})
export class AppComponent implements OnInit {
constructor(private primeng: PrimeNG) {}

    ngOnInit() {
        this.primeng.ripple.set(true);
 //       this.translateService.setDefaultLang('pt');
    }


    // translate(lang: string) {
    //     this.translateService.use(lang);
    //     this.translateService.get('primeng').subscribe(res => this.primeng.setTranslation(res));
    // }


  title = 'finansys';
}
