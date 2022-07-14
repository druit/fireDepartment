import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/compat/database';
import { Customer } from 'src/app/interfaces/customer';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private dbPath = '/users';
  firebaseRef: AngularFireList<Customer>;
  constructor(private db: AngularFireDatabase) {
    this.firebaseRef = db.list(this.dbPath);
  }
  getAll(): AngularFireList<Customer> {
    return this.firebaseRef;
  }
  create(data: Customer): any {
    return this.firebaseRef.push(data);
  }
  update(key: string, value: any): Promise<void> {
    return this.firebaseRef.update(key, value);
  }
  delete(key: string): Promise<void> {
    return this.firebaseRef.remove(key);
  }
  deleteAll(): Promise<void> {
    return this.firebaseRef.remove();
  }
}
