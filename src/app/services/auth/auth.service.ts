import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { EncrDecrService } from '../EncrDecrService/encr-decr-service.service';
import { FirebaseService } from '../firebase/firebase.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loggedInStatus = new BehaviorSubject<boolean>(false);

  constructor(public fireAuth: AngularFireAuth, private router: Router, private _snackBar: MatSnackBar, private encryptService: EncrDecrService, private realDataBase: FirebaseService) { }

  login(email: string, password: string) {
    this.fireAuth.signInWithEmailAndPassword(email, password).then((resp) => {
    
      resp.user?.getIdToken().then((token: string) => {
        localStorage.setItem('token', token);
      })
      const uid = resp.user?.uid;
      localStorage.setItem('userUID', JSON.stringify(uid));
      this.loggedInStatus.next(true);
      this.router.navigate(['dashboard']);
    }, err => {
      this._snackBar.open('Tα στοιχεία που πληκτρολογήσατε είναι λάθος', 'ΟΚ');
      this.router.navigate(['/login']);
    })
  }

  register(email: string, password: string) {
    this.fireAuth.createUserWithEmailAndPassword(email, password).then(() => {
      this._snackBar.open('Εγγραφήκατε με επιτυχία!', 'ΟΚ');
      this.login(email,password);
      this.router.navigate(['/login']);
    }, err => {
      this._snackBar.open(err.message, 'ΟΚ');
      this.router.navigate(['/register'])
    })
  }

  logout() {
    this.fireAuth.signOut().then((_resp) => {
      localStorage.removeItem('token');
      localStorage.removeItem('userUID');
      
      setTimeout(() => {
        this.router.navigate(['/login']);
        this.loggedInStatus.next(false);
      }, 200);
      
    }, err => {
      this._snackBar.open(err.message, 'ΟΚ');
    })
  }

  resetPassword(code: any, password: string, id: string): void {
   
    this.fireAuth.confirmPasswordReset(code, password)
      .then((resp) => {
        this.realDataBase.getAllUsers().snapshotChanges().pipe(
          map(changes =>
            changes.map(c =>
              ({ key: c.payload.key, ...c.payload.val() })
            )
          )
        ).subscribe(data => {
          data.forEach((user: any) => {
            if (user.username == id) {
              user['passwowrd'] = this.encryptService.set("123456$#@$^@1ERF", password);
              this.realDataBase.createUser(user);
            }
          });
        })
        this.router.navigate(['/login']);
      })
      .catch(err => {
        const errorMessage = err.code;
        console.log(errorMessage)
    })
  }

  getAuth(): void {
    if (localStorage.getItem('token')) {
      this.fireAuth.authState.subscribe((resp) => {
        this.loggedInStatus.next(true);
        setTimeout(() => {
          this.router.navigate(['dashboard']);
        });
        // this.updateProfile({username:'Nikos,Karanikolas,0,0,6987123456', photo: 'https://qph.cf2.quoracdn.net/main-qimg-0af6790cf4e77c8f11496c8ac81cfe9c-lq'});
      });
    }
    // this.fireAuth.onAuthStateChanged((user) => {
    //   if (user) console.log(user);
    // })
  }

  isLoggedIn(): Observable<boolean> {
    localStorage.getItem('token') && !location.href.includes('login') ? this.loggedInStatus.next(true) : this.loggedInStatus.next(false);
    return this.loggedInStatus.asObservable();
  }

  updateProfile(data: any): void {
    const profile = {
      displayName: data.username,//data.username,
      photoURL: data.photo,
    }
    this.fireAuth.authState.subscribe((resp) => {
      resp?.updateProfile(profile);
      // resp?.updatePhoneNumber(profile.phoneNumber);
    })
  }

  getProfileAuth(): any {
    return new Promise((res, rej) => {
      this.fireAuth.authState.subscribe((resp) => {
        res(resp?.toJSON());
      })
    }) 
  }

  checkVersioning(): void {
    const ver = localStorage.getItem('version');
    if (ver) {
      if (ver != environment.appVersion) {
        localStorage.clear();
        localStorage.setItem('version', environment.appVersion);
      }
    } else {
      localStorage.setItem('version', environment.appVersion);
    }
  }


}
