import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { Customer } from 'src/app/interfaces/customer';
import { RegisterUser } from 'src/app/interfaces/register-user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { EncrDecrService } from 'src/app/services/EncrDecrService/encr-decr-service.service';
import { CreateAnnounceComponent } from 'src/app/components/create-announce/create-announce.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AnnounceButtonComponent } from 'src/app/components/announce-button/announce-button.component';
import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
import { ScheduleService } from 'src/app/services/scheduleService/schedule.service';

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
    date: string;
    message: string;
    icon: string;
  }[];


  submitted = false;
  fullData: any;
  firebaseService: any;
  constructor(private scheduleService: ScheduleService,private fireService: FirebaseService,private announcementService: AnnouncementService, private auth: AuthService, private encryptService: EncrDecrService, private _bottomSheet: MatBottomSheet) { }

  // saveTutorial(): void {
  //   this.user = {
  //     key: '02B126',
  //     uuid: 'uiyas12kjbwu24',
  //     fullname: 'Karanikolas Nikolaos',
  //     email: 'nikolakis95@hotmail.com',
  //     username: '02B126',
  //     passwowrd:  this.encryptService.set('123456$#@$^@1ERF', 'pass'),
  //     level: 0
  //   }
  //   this.fireService.createUser(this.user);
  // }
  // newTutorial(): void {
  //   this.submitted = false;
  //   this.tutorial = new Customer();
  // }
  ngOnInit(): void { 
    this.scheduleService.setServiceLimits();
    this.announcementService.getAnnouncements().then((data: any) => {
      this.user = this.fireService.getUserLogIn();
      this.announcements = data.map((obj: any) => {
        return obj.data;
      })
    });
  }

  openBottomSheet(): void {
    const bottomSheetRef = this._bottomSheet.open(AnnounceButtonComponent, { data: this.announcements})
    bottomSheetRef.afterDismissed().subscribe((resp: any) => {

      if (resp && resp.type == 'add')
        this.announcementService.createAnnounce(resp.data);
      else if (resp && resp.type == 'delete') {
        this.announcements = resp.data;
        this.announcementService.deleteAnnounce(resp.data);
      }
      
    });

  }

}
