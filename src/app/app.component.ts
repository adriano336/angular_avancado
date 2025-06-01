import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
//import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
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
