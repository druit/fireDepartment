import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { EventComponent } from '../event/event.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-select-date-service',
  templateUrl: './select-date-service.component.html',
  styleUrls: ['./select-date-service.component.less']
})
export class SelectDateServiceComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EventComponent>, @Inject(MAT_DIALOG_DATA) public events: any, private _formBuilder: FormBuilder,private _snackBar: MatSnackBar) { }


  selectService = this._formBuilder.group({
    A: false,
    B: false,
    G: false,
    picker: ['', Validators.required],
    message: ['']
  });

  minDate = new Date(moment().add(1, 'days').format('MM/DD/YYYY'));

  ngOnInit(): void {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  send(): void {
    if(this.selectService.controls['picker'].value.length == 0){
      this._snackBar.open("Πρέπει να επιλέξετε ημερομηνία", 'Κλείσιμο');
    }
    else if (this.selectService.controls['A'].value || this.selectService.controls['B'].value || this.selectService.controls['G'].value && !(this.selectService.controls['picker'].value.length == 0)) {
      this.dialogRef.close(this.selectService.value);
    }else {
      this._snackBar.open("Πρέπει να επιλέξετε βάρδια", 'Κλείσιμο');
    }
   
  }
}
