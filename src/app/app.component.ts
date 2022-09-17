import { Component } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { map, Observable } from 'rxjs';
import { RegisterUser } from './interfaces/register-user';
import { AuthService } from './services/auth/auth.service';
import { FirebaseService } from './services/firebase/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  isLoggedIn$?: Observable<boolean>;
  user!: RegisterUser;
  constructor(private translate: TranslateService,private authService: AuthService, private fireService: FirebaseService) {
    translate.setDefaultLang('el');
    translate.use('el');
  }

  ngOnInit(): void { 
    this.isLoggedIn$ = this.authService.isLoggedIn();
    this.isLoggedIn$.subscribe(resp => {
      if (resp) {
        this.fireService.getAllUsers().snapshotChanges().pipe(
          map(changes =>
            changes.map(c =>
              ({ key: c.payload.key, ...c.payload.val() })
            )
          )
        ).subscribe(data => {
        });
        this.authService.getProfileAuth().then((resp: any) => {
          this.fireService.setUserLogIn(resp).then(user => {
            this.user = user;
          });
        })
      }
    })
  }
  
}
