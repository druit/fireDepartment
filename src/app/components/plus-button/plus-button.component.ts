import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { CalendarComponent } from 'src/app/routes/calendar/calendar.component';
import { DialogService } from 'src/app/services/dialogService/dialog.service';

@Component({
  selector: 'app-plus-button',
  templateUrl: './plus-button.component.html',
  styleUrls: ['./plus-button.component.less']
})
export class PlusButtonComponent implements OnInit {


  constructor(private _bottomSheetRef: MatBottomSheetRef<CalendarComponent>, private dialogService: DialogService) { }

  ngOnInit(): void {
  }

  openLink(event: MouseEvent, type: string): void {
   
    event.preventDefault();
    this.dialogService.openSelectDateDialog({}).subscribe(resp => {
      this._bottomSheetRef.dismiss(resp);
    })
  }
}
