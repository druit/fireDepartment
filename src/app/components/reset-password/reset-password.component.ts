import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { EncrDecrService } from 'src/app/services/EncrDecrService/encr-decr-service.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder, private route: ActivatedRoute, private authService: AuthService, private _snackBar: MatSnackBar) { }

  secondFormGroup = this._formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    confirmPassword:['', [Validators.required]],
  });

  ngOnInit(): void { }

  confirm(): void {
    const code = this.route.snapshot.queryParams['oobCode'];
    if (this.secondFormGroup.controls['password'].value != this.secondFormGroup.controls['confirmPassword'].value) {
      this._snackBar.open('Ο κωδικός πρόσβασης πρέπει να είναι ίδιος με τον κωδικό επιβεβαίωσης.', 'ΟΚ');
      return;
    }
      
    
    this.authService.resetPassword(code, this.secondFormGroup.controls['password'].value, this.secondFormGroup.controls['username'].value);
  }

  goBack(): void {
    location.href = '/login';
  }

}
