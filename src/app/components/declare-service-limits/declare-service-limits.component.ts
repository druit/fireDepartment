import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { ScheduleService } from 'src/app/services/scheduleService/schedule.service';
import { EventComponent } from '../event/event.component';

@Component({
  selector: 'app-declare-service-limits',
  templateUrl: './declare-service-limits.component.html',
  styleUrls: ['./declare-service-limits.component.less']
})
export class DeclareServiceLimitsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EventComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private scheduleService: ScheduleService,private _snackBar: MatSnackBar) { }

  value = 0;

  ngOnInit(): void {
    this.scheduleService.getDecrationServiceLimits().then((resp: any) => {
      console.log(resp);
      if (resp) {
        this.value = resp[0].service;
      }
    })
  }

  formatLabel(value: number) {
    return value;
  }


  cancel(): void {
    this.dialogRef.close(false);
  }

  submit(): void {
    this.dialogRef.close(this.value);
  }

}
