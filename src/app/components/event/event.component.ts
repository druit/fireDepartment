import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { ScheduleService } from 'src/app/services/scheduleService/schedule.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.less']
})
export class EventComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EventComponent>, @Inject(MAT_DIALOG_DATA) public events: any, private scheduleService: ScheduleService, private firebaseService: FirebaseService) { }
  limits: number = 0;
  services = new Array();
  A = new Array();
  B = new Array();
  G = new Array();
  type: number = 0;
  ngOnInit(): void {
    this.limits = this.scheduleService.getServiceLimits();
    this.createTable(this.events.data);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  createTable(volunteers: any): void {
    // If Admin
    if(this.firebaseService.getUserLogIn().type == 1){
      volunteers.forEach((volunteer: any, i : number) => {
        this.services.push(volunteer);
      });
      this.type = 1;
    // If user
    }else{
      this.type = 0;
      for (let index = 0; index < this.limits; index++) {
        this.services.push({ name: index+1 , service: new Array({A: false, B: false, G: false}) })
      }
    
    volunteers.forEach((person: any) => {
      console.log(person);
      if(person.service[0]['A']){
        this.A.push(true)
      }
      if(person.service[0]['B']){
        this.B.push(true)
      }
      if(person.service[0]['G']){
        this.G.push(true)
      }
    });

    this.services.forEach(resp => {
      if(this.A.length > 0){
        resp.service[0]['A'] = this.A[0];
        this.A.pop();
      }

      if(this.B.length > 0){
        resp.service[0]['B'] = this.B[0];
        this.B.pop();
      }

      if(this.G.length > 0){
        resp.service[0]['G'] = this.G[0];
        this.G.pop();
      }      
    });
  }
  }
}
