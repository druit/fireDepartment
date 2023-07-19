import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { CalendarComponent } from 'src/app/routes/calendar/calendar.component';
import { DialogService } from 'src/app/services/dialogService/dialog.service';

@Component({
  selector: 'app-announce-button',
  templateUrl: './announce-button.component.html',
  styleUrls: ['./announce-button.component.less']
})
export class AnnounceButtonComponent implements OnInit {

  constructor(private _bottomSheetRef: MatBottomSheetRef<CalendarComponent>, private dialogService: DialogService, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) { }

  ngOnInit(): void {
  }

  openLink(event: MouseEvent, type: string): void {
   
    event.preventDefault();
    switch (type) {
      case 'add':
        this.dialogService.openCreateAnnounce(this.data).subscribe(resp => {
          if(resp) resp.type = type;
            this._bottomSheetRef.dismiss(resp);
        })
        break;
      case 'delete':
      this.dialogService.openDeleteAnnounce(this.data).subscribe(resp => {
        console.log(resp)
        if(resp) resp.type = type;
        this._bottomSheetRef.dismiss(resp);
      })
      break;
      default:
        break;
    }
  }
}
