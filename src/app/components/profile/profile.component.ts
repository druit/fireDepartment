import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { RegisterUser } from 'src/app/interfaces/register-user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {
  user: any;
  version: number;
  constructor(private auth: AuthService, private fireService: FirebaseService) { 
    this.version = environment.appVersion;
    
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
      this.fireService.getAllUsers().snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe(data => {
        data.forEach((user: RegisterUser) => {
          if (user.email ==  this.user?.email) {
            this.user = {
              id_card: user.username,
              firstname: user.firstname,
              lastname: user.lastname,
              type: user.type,
              level: user.level ? this.getLvl(user.level) : this.getLvl(0),
              number: user.phone,
              imgLvl: user.level? user.level : 0,
              email: user?.email,
              photo: user.avatar? user.avatar : ''
            }
          }
        });
      })
    });

     
  }

  ngOnInit(): void { }

  logout(): void {
    this.auth.logout();
  }
  
  getLvl(lvl: any): string {
    return "firefighter_lvl_"+lvl.toString();
  }
}
