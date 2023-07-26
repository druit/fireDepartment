import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.less']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder, private afAuth: AngularFireAuth) { }

  showMessage: boolean = false;
  
  firstFormGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit(): void { }

  send(): void {
    const email = this.firstFormGroup.controls['email'].value;
    this.afAuth.sendPasswordResetEmail(email).then((resp: any) => {
      this.showMessage = true;
    }),
    (err: any) => {
      console.log(err)
    };    
  }

  goBack(): void {
    location.href = '/login';
  }
}
