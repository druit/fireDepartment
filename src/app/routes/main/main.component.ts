import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { Customer } from 'src/app/interfaces/customer';
import { RegisterUser } from 'src/app/interfaces/register-user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { EncrDecrService } from 'src/app/services/EncrDecrService/encr-decr-service.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {
  tutorial: Customer = new Customer();
  user: RegisterUser = new RegisterUser();
  submitted = false;
  constructor(private fireService: FirebaseService, private auth: AuthService, private encryptService:EncrDecrService) { }

  saveTutorial(): void {
    this.user = {
      key: '02B126',
      uuid: 'uiyas12kjbwu24',
      fullname: 'Karanikolas Nikolaos',
      email: 'nikolakis95@hotmail.com',
      username: '02B126',
      passwowrd:  this.encryptService.set('123456$#@$^@1ERF', 'pass'),
      level: 0
    }
    this.fireService.createUser(this.user);
    // this.tutorialService.create(this.tutorial).then(() => {
    //  
    //   this.submitted = true;
    // });
  }
  newTutorial(): void {
    this.submitted = false;
    this.tutorial = new Customer();
  }
  ngOnInit(): void { 
    this.fireService.getAllUsers().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      console.log(data);
    });
    console.log();
    this.auth.getProfileAuth().then((resp: any) => {
      this.fireService.setUserLogIn(resp);
    })
  }

}
