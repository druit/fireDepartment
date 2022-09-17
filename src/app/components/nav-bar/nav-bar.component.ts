import { Component, Input, OnInit } from '@angular/core';
import { RegisterUser } from 'src/app/interfaces/register-user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.less']
})
export class NavBarComponent implements OnInit {

  constructor(private auth: AuthService, private firebaseService: FirebaseService) { }
  @Input('user') user!: RegisterUser;
  
  ngOnInit(): void { }
}
