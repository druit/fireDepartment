import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EncrDecrService } from 'src/app/services/EncrDecrService/encr-decr-service.service';
import { MatStepper } from '@angular/material/stepper';
import { RegisterUser } from 'src/app/interfaces/register-user';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {

  user: RegisterUser = new RegisterUser();

  firstFormGroup = this._formBuilder.group({
    firstname: ['', [Validators.required,  Validators.minLength(4),  Validators.maxLength(25)]],
    lastname:['', [Validators.required,  Validators.minLength(4),  Validators.maxLength(25)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern("^[0-9]*$"),Validators.minLength(10),  Validators.maxLength(10)]],
  });
  secondFormGroup = this._formBuilder.group({
    username:  ['', Validators.required],
    password:  ['', Validators.required],
  });

  thirdFormGroup = this._formBuilder.group({
    type:  0,
    level:  0,
  });

  selected = '0';

  email: string = '';
  clasicMail: string = '@2ndfiredepartment.com';
  password: string = '';

  constructor(private auth: AuthService,private fireService:FirebaseService, private encryptService:EncrDecrService, private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    var encrypted = this.encryptService.set('123456$#@$^@1ERF', 'pass');
    var decrypted = this.encryptService.get('123456$#@$^@1ERF', encrypted);
    console.log('Encrypted :' + encrypted);
    console.log('Encrypted :' + decrypted);
  }

  register(): void {
    if (this.email == '') {
      alert('Please enter email');
      return;
    };

    if (this.password == '') {
      alert('Please enter password');
      return;
    }
    this.email
    this.auth.register(this.email, this.password);

    this.email = this.password = '';
  }

  goBack(): void {
    location.href = '/login';
  }

  goPrevious(stepper: MatStepper): void {
    stepper.previous();
  }

  goForward(stepper: MatStepper): void {
    stepper.next();
  }
  complete(): void {
    this.user = {
      key: this.secondFormGroup.controls['username'].value,
      // uuid: '',
      firstname: this.firstFormGroup.controls['firstname'].value,
      lastname: this.firstFormGroup.controls['lastname'].value,
      fullname: this.firstFormGroup.controls['firstname'].value + ' ' + this.firstFormGroup.controls['lastname'].value,
      email: this.firstFormGroup.controls['email'].value,
      phone: this.firstFormGroup.controls['phone'].value,
      username: this.secondFormGroup.controls['username'].value,
      passwowrd: this.encryptService.set(this.secondFormGroup.controls['username'].value,this.secondFormGroup.controls['password'].value), //'123456$#@$^@1ERF', 'pass'),
      level: this.thirdFormGroup.controls['level'].value,
      type: this.thirdFormGroup.controls['type'].value,
    }
    var enc = this.encryptService.set("123456$#@$^@1ERF", this.secondFormGroup.controls['password'].value)
    console.log(enc)
    console.log(this.encryptService.get("123456$#@$^@1ERF",enc))
    this.auth.register(this.firstFormGroup.controls['email'].value,this.secondFormGroup.controls['password'].value);
    this.fireService.createUser(this.user);
    // console.log(this.user)
  }
}
