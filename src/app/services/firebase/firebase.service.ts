import { newArray } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/compat/database';
import { BehaviorSubject, map } from 'rxjs';
import { Customer } from 'src/app/interfaces/customer';
import { RegisterUser } from 'src/app/interfaces/register-user';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  user!: any;
  public userType = new BehaviorSubject<number>(0);

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

  async setUserLogIn(userLog: RegisterUser): Promise<any> {
    return await new Promise(resolve => {
      this.getAllUsers().snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe(data => {
        data.forEach((user: RegisterUser) => {
          if (user.email == userLog?.email) {
            if(user.type)
              this.userType.next(user.type);
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
            resolve(this.user);
          }
        });
      })     
    });
  }

  async getIDs() {
    const db = this.db.list('IDs');
    return await new Promise(resolve => {
      db.snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ id: c.payload.val()})
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

  async getRegisterUsers() {
    const db = this.db.list('users');
    return await new Promise(resolve => {
      db.snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key})
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

  async getUsers() {
    const db = this.db.list('users');
    return await new Promise(resolve => {
      db.snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ user : c.payload.val() })
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

  getUserLogIn(): RegisterUser {
    return this.user;
  }

  getLvl(lvl: any): string {
    return "firefighter_lvl_"+lvl.toString();
  }

  async createID(id: string): Promise<boolean> {
    return await new Promise(resolve => {
      const db = this.db.list('IDs');
      db.snapshotChanges().pipe(
        map(changes => changes.map(c =>
          ({ id: c.payload.val() })
        )
        )).subscribe(data => {
          let find = false;
          data.forEach(obj => {
            if (obj.id == id) {
              find = true;
            }
          });
          if (find) {
            // Show already in list
            resolve(false);
          } else {
            db.set((data.length).toString(), id);
            resolve(true)
          }
        })
    });
  }
}
