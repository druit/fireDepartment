import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private dbPath = '/schedule';
  firebaseRef: AngularFireList<any>
  serviceLimitsNumber: number = 6;

  items!: Observable<any[]>;
  constructor(private db: AngularFireDatabase) { 
    this.firebaseRef = db.list(this.dbPath);
  }


  createSchedule(schedule: any): void {
    console.log(schedule);
    const tutRef = this.db.object(this.dbPath + '/');
    tutRef.set(schedule.fullData);
  }

  getAllSchedule(): AngularFireList<any> {
    return this.firebaseRef;
  }

  deleteSchedule(key: number, schedule: any) {
    const tutRef = this.db.object(this.dbPath + '/');
    tutRef.set(schedule);
  }

  async getDecrationServiceLimits() {
    const db = this.db.list('declaration');
    return await new Promise(resolve => {
      db.snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ service: c.payload.val()})
          )
        )
      ).subscribe(data => {
        if (data)
          resolve(data);
        else
          resolve(false);
      });
    });
  }

  setServiceLimits() {
    this.getDecrationServiceLimits().then((resp: any) => {
      this.serviceLimitsNumber = resp[0].service;
    })
  }

  getServiceLimits(): number {
    return this.serviceLimitsNumber;
  }


  updateDeclaration(key: string, value: any): Promise<void> {
    const db = this.db.list('declaration');
    return db.set(key, value);
  }

}
