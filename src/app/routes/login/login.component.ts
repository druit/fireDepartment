import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { RegisterUser } from 'src/app/interfaces/register-user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EncrDecrService } from 'src/app/services/EncrDecrService/encr-decr-service.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';

  constructor(private auth: AuthService, private fireService: FirebaseService, private encryptService: EncrDecrService) { }

  ngOnInit(): void {
    this.auth.getAuth();
  }

  login(): void {
    if (this.email == '') {
      alert('Please enter email');
      return;
    };

    if (this.password == '') {
      alert('Please enter password');
      return;
    }
    // new login
    this.fireService.getAllUsers().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      data.forEach((user: RegisterUser) => {
        
        if (user.username == this.email) {
          var encrypted_pass = this.encryptService.set("123456$#@$^@1ERF", this.password);
          var decrypted_pass = this.encryptService.get("123456$#@$^@1ERF", encrypted_pass);
          console.log(user)
          console.log(decrypted_pass)
          if (user.email)
            this.auth.login(user.email, decrypted_pass);
          
        }
     });
    });

    // OLD login
    // this.auth.login(this.email, this.password);

    // this.email = this.password = '';
  }
}
