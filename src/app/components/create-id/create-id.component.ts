import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScheduleService } from 'src/app/services/scheduleService/schedule.service';
import { EventComponent } from '../event/event.component';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-id',
  templateUrl: './create-id.component.html',
  styleUrls: ['./create-id.component.less']
})
export class CreateIDComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EventComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder) { }

  formGroup = this._formBuilder.group({
    id:  ['', Validators.required]
  });

  ngOnInit(): void {
 
  }

  formatLabel(value: number) {
    return value;
  }


  cancel(): void {
    this.dialogRef.close(false);
  }

  submit(): void {
    this.dialogRef.close(this.formGroup.controls['id'].value);
  }
}
