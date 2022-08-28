import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { CalendarComponent } from 'src/app/routes/calendar/calendar.component';
import { DialogService } from 'src/app/services/dialogService/dialog.service';

@Component({
  selector: 'app-plus-button',
  templateUrl: './plus-button.component.html',
  styleUrls: ['./plus-button.component.less']
})
export class PlusButtonComponent implements OnInit {


  constructor(private _bottomSheetRef: MatBottomSheetRef<CalendarComponent>, private dialogService: DialogService, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) { }

  ngOnInit(): void {
  }

  openLink(event: MouseEvent, type: string): void {
   
    event.preventDefault();
    switch (type) {
      case 'add':
        this.dialogService.openSelectDateDialog({}).subscribe(resp => {
          this._bottomSheetRef.dismiss(resp);
        })
        break;
      case 'delete':
        this.dialogService.openDeletetDateDialog(this.data).subscribe(resp => {
          this._bottomSheetRef.dismiss(resp);
        })
        break;
      default:
        break;
    }

  }
}
