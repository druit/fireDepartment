import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateAnnounceComponent } from 'src/app/components/create-announce/create-announce.component';
import { CreateIDComponent } from 'src/app/components/create-id/create-id.component';
import { DeclareServiceLimitsComponent } from 'src/app/components/declare-service-limits/declare-service-limits.component';
import { DeleteAnnounceComponent } from 'src/app/components/delete-announce/delete-announce.component';
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
      height: "90vh",
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
      height: "90vh",
      panelClass:"select-service",
      autoFocus: false,
      data: data
    });

    return dialogRef.afterClosed();
  }

  openDeleteAnnounce(data: any) {
    const dialogRef = this.dialog.open(DeleteAnnounceComponent, {
      maxWidth: "100vw",
      width: "100vw",
      height: "90vh",
      panelClass:"select-service",
      autoFocus: false,
      data: data
    });

    return dialogRef.afterClosed();
  }

  openCreateAnnounce(data:any) {
    const dialogRef = this.dialog.open(CreateAnnounceComponent, {
      maxWidth: "100vw",
      width: "100vw",
      height: "80vh",
      panelClass:"select-service",
      autoFocus: false,
      data: data
    });

    return dialogRef.afterClosed();
  }

  openDeclareServiceLimits(data: any) {
    const dialogRef = this.dialog.open(DeclareServiceLimitsComponent, {
      maxWidth: "100vw",
      width: "100vw",
      height: "40vh",
      panelClass:"select-service",
      autoFocus: false,
      data: data
    });

    return dialogRef.afterClosed();
  }

  openCreateID() {
    const dialogRef = this.dialog.open(CreateIDComponent, {
      maxWidth: "100vw",
      width: "100vw",
      height: "40vh",
      panelClass:"select-service",
      autoFocus: false,
    })

    return dialogRef.afterClosed();
  }
}
