import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs';
import { Customer } from 'src/app/interfaces/customer';
import { RegisterUser } from 'src/app/interfaces/register-user';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  user!: any;

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

  createUser(user: RegisterUser): any {
    const tutRef = this.db.object(this.dbPath + '/' + user.key);
    tutRef.set(user);
    // return tutRef.valueChanges;
    // return this.firebaseRef.push(user);
  }
  getAllUsers(): AngularFireList<RegisterUser> {
    return this.firebaseRef;
  }

  setUserLogIn(userLog: RegisterUser): void {

    this.getAllUsers().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      data.forEach((user: RegisterUser) => {
        console.log(user)
        if (user.email == userLog?.email) {
          this.user = {
            id_card: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            type: user.type,
            level: user.level ? this.getLvl(user.level) : this.getLvl(0),
            number: user.phone,
            imgLvl: user.level ? user.level : 0,
            email: user?.email,
            photo: user.avatar ? user.avatar : ''
          }
        }
      });
    });
  }

  getUserLogIn(): RegisterUser {
    return this.user;
  }

  getLvl(lvl: any): string {
    return "firefighter_lvl_"+lvl.toString();
  }
}
