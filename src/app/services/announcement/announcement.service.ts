import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private dbPath = '/announce';
  firebaseRef: AngularFireList<any>

  items!: Observable<any[]>;
  constructor(private db: AngularFireDatabase) { 
    this.firebaseRef = db.list(this.dbPath);
  }

  createAnnounce(announce: any): void {
    const tutRef = this.db.object(this.dbPath + '/');
    tutRef.set(announce);
  }

  async getAnnouncements() {
    const db = this.db.list('announce');
    return await new Promise(resolve => {
      db.snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ data: c.payload.val()})
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

  deleteAnnounce(announces: any) {
    const tutRef = this.db.object(this.dbPath + '/');
    tutRef.set(announces);
  }
}
