import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDateServiceComponent } from 'src/app/components/delete-date-service/delete-date-service.component';
import { EventComponent } from 'src/app/components/event/event.component';
import { SelectDateServiceComponent } from 'src/app/components/select-date-service/select-date-service.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openEventDialog(data: any) {
    const dialogRef = this.dialog.open(EventComponent, {
      maxWidth: "100vw",
      width: "100vw",
      height: "50vh",
      panelClass: "events-container",
      autoFocus: false,
      data: data
    });

    return dialogRef.afterClosed();

  };

  openSelectDateDialog(data: any) {
    const dialogRef = this.dialog.open(SelectDateServiceComponent, {
      maxWidth: "100vw",
      width: "100vw",
      height: "50vh",
      panelClass:"select-service",
      autoFocus: false,
      data: data
    });

    return dialogRef.afterClosed();
  }

  openDeletetDateDialog(data: any) {
    const dialogRef = this.dialog.open(DeleteDateServiceComponent, {
      maxWidth: "100vw",
      width: "100vw",
      height: "50vh",
      panelClass:"select-service",
      autoFocus: false,
      data: data
    });

    return dialogRef.afterClosed();
  }
}
