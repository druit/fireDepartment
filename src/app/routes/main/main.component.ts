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
  announcements!: {
    title: string;
    description: string;
    message: string;
    icon: string;
  }[];

  
  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;
  submitted = false;
  constructor(private fireService: FirebaseService, private auth: AuthService, private encryptService: EncrDecrService) {
    
    this.announcements = [
      {
        title: 'Στολές',
        description: 'Έρχεται κακοκαιρία',
        message: "The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was originally bred for hunting.",
        icon: 'attention'
      },
      {
        title: 'Στολές',
        description: 'Έρχεται κακοκαιρία',
        message: "The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was originally bred for hunting.",
        icon: 'announce'
      }
    ]
   }

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
