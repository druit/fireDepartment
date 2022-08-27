import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loggedInStatus = new BehaviorSubject<boolean>(false);

  constructor(public fireAuth: AngularFireAuth, private router: Router) { }

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
      alert(err.message);
      this.router.navigate(['/login']);
    });
  }

  register(email: string, password: string) {
    this.fireAuth.createUserWithEmailAndPassword(email, password).then(() => {
      alert('Registration Successful');
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
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
      alert(err.message); 
    })
  }

  getAuth(): void {
    if (localStorage.getItem('token')) {
      
      this.fireAuth.authState.subscribe((resp) => {
        console.log(resp?.toJSON())
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


}
