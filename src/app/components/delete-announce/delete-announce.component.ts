import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { EventComponent } from '../event/event.component';
import { AnnouncementService } from 'src/app/services/announcement/announcement.service';

@Component({
  selector: 'app-delete-announce',
  templateUrl: './delete-announce.component.html',
  styleUrls: ['./delete-announce.component.less']
})
export class DeleteAnnounceComponent implements OnInit {
  user!: any;
  currentDate!: string;
  selectedOptions=[];
  selectedOption: any;
  list: any = [];
  constructor(public dialogRef: MatDialogRef<EventComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private firebaseService: FirebaseService,private _snackBar: MatSnackBar, private announceService: AnnouncementService) { 
    this.user = this.firebaseService.getUserLogIn();
    this.currentDate = (new Date().getMonth() + 1).toString() + '/' + new Date().getDate().toString() + '/' + new Date().getFullYear().toString();
  }

  ngOnInit(): void {
    this.announceService.getAnnouncements().then((resp: any) =>{
      this.list = resp.map((obj: any) => {
        return obj.data;
      });
    });

  }

  onNgModelChange($event: any){
    this.selectedOption=$event;
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  delete(): void {
    let announcements = this.list;
    this.selectedOption.forEach((option: any) => {
      announcements = announcements.filter((data: any) => {
        return data.id != option.id;
      })
    });
    this.dialogRef.close({ data: announcements });
  }

}
