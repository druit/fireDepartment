import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private dbPath = '/schedule';
  firebaseRef: AngularFireList<any>
  constructor(private db: AngularFireDatabase) { 
    this.firebaseRef = db.list(this.dbPath);
  }


  createSchedule(schedule:any): void {
    const tutRef = this.db.object(this.dbPath + '/');
    tutRef.set(schedule);
  }

  getAllSchedule(): AngularFireList<any> {
    return this.firebaseRef;
  }

}
