import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { RegisterUser } from 'src/app/interfaces/register-user';
import { CalendarComponent } from 'src/app/routes/calendar/calendar.component';
import { DialogService } from 'src/app/services/dialogService/dialog.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

@Component({
  selector: 'app-plus-button',
  templateUrl: './plus-button.component.html',
  styleUrls: ['./plus-button.component.less']
})
export class PlusButtonComponent implements OnInit {


  constructor(private _bottomSheetRef: MatBottomSheetRef<CalendarComponent>, private dialogService: DialogService, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private firebaseService: FirebaseService) { }
  user!: RegisterUser;
  location: boolean = false;
  ngOnInit(): void {
    this.user = this.firebaseService.getUserLogIn();
    this.location = location.pathname.includes('/table');
  }

  openLink(event: MouseEvent, type: string): void {
   
    event.preventDefault();
    switch (type) {
      case 'add':
        this.dialogService.openSelectDateDialog({}).subscribe(resp => {
          if(resp) resp.type = type;
          this._bottomSheetRef.dismiss(resp);
        })
        break;
      case 'delete':
        this.dialogService.openDeletetDateDialog({ data: this.data, user: this.user }).subscribe(resp => {
          if(resp) resp.type = type;
          this._bottomSheetRef.dismiss(resp);
        })
        break;
      case 'number':
        this.dialogService.openDeclareServiceLimits('').subscribe(resp => {
          if (resp) 
          this._bottomSheetRef.dismiss({type: 'number', resp: resp});
        })
        break;
      case 'addPerson':
        this.dialogService.openCreateID().subscribe(resp => {
          this._bottomSheetRef.dismiss(resp);
        })
        break;
      default:
        break;
    }

  }
}
