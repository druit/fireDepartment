import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {

  email: string = '';
  password: string = '';

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
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

    this.auth.register(this.email, this.password);

    this.email = this.password = '';
  }

}
