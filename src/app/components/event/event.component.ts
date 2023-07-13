import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { ScheduleService } from 'src/app/services/scheduleService/schedule.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.less']
})
export class EventComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EventComponent>, @Inject(MAT_DIALOG_DATA) public events: any, private scheduleService: ScheduleService) { }
  limits: number = 0;
  services = new Array();
  ngOnInit(): void {
    console.log(this.events)
    this.limits = this.scheduleService.getServiceLimits();
    console.log(this.limits);
    this.createTable(this.events.data);
    
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  createTable(volunteers: any): void {
    for (let index = 0; index < this.limits; index++) {
      this.services.push({ name: index+1 , service: new Array({A: false, B: false, G: false}) })
    }
    volunteers.forEach((volunteer: any, i : number) => {
      this.services[i]['service'] = volunteer.service;
    });
  }
}
