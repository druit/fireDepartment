import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {
  user: any;
  constructor(private auth: AuthService) { 
    this.user = this.auth.fireAuth.authState.subscribe((user) => {
      this.user = {
        firstname: user?.displayName ? user?.displayName.split(',')[0] : '',
        lastname: user?.displayName ? user?.displayName.split(',')[1] : '',
        type: user?.displayName ? user?.displayName.split(',')[2] : '',
        level: this.getLvl(user?.displayName ? user?.displayName.split(',')[3] : ''),
        number: user?.displayName ? user?.displayName.split(',')[4] : '',
        imgLvl: user?.displayName ? user?.displayName.split(',')[3] : '',
        email: user?.email,
        photo: user?.photoURL
      }
    });
  }

  ngOnInit(): void {
    
    setTimeout(() => {
      console.log(this.user)
    }, 1000);
    
  }

  logout(): void {
    this.auth.logout();
  }
  
  getLvl(lvl: string): string {
    return "firefighter_lvl_"+lvl;
  }



}
