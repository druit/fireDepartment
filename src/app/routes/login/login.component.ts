import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(private auth: AuthService, private fireService: FirebaseService, private encryptService: EncrDecrService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.auth.getAuth();
  }

  login(): void {
    if (this.email == '') {
      this._snackBar.open('Πληκτρολογήστε τον Α.Δ.Τ.Ε.', 'ΟΚ');
      return;
    };

    if (this.password == '') {
      this._snackBar.open('Πληκτρολογήστε τον κωδικό.', 'ΟΚ');
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
      let thereIs = false;
      data.forEach((user: RegisterUser) => {
        if (user.username == this.email) {
          var encrypted_pass = this.encryptService.set("123456$#@$^@1ERF", this.password);
          var decrypted_pass = this.encryptService.get("123456$#@$^@1ERF", encrypted_pass);
          thereIs = true;
          if (user.email)
            this.auth.login(user.email, decrypted_pass); 
        }
      });
      
      if(thereIs == false) this._snackBar.open('O Α.Δ.Τ.Ε που πληκτρολογήσατε δεν υπάρχει.', 'ΟΚ');
    });
  }
}
