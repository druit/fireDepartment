import { Component } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from './services/auth/auth.service';
import { FirebaseService } from './services/firebase/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'fireDepartment';
  constructor(private translate: TranslateService,private authService: AuthService) {
    translate.setDefaultLang('el');
    translate.use('el');
  }

  ngOnInit(): void { 
    this.authService.getAuth();
  }
}
