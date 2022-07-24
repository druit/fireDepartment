// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  firebaseConfig: {
    apiKey: "AIzaSyBbM7zj79kFtsEhlGXUlVIRFlT6Uffr-1Y",
    authDomain: "firedepartment-2e206.firebaseapp.com",
    databaseURL: "https://firedepartment-2e206-default-rtdb.firebaseio.com",
    projectId: "firedepartment-2e206",
    storageBucket: "firedepartment-2e206.appspot.com",
    messagingSenderId: "147328316352",
    appId: "1:147328316352:web:c7ff8f2c1e0a63a5198e25",
    measurementId: "G-XWN4NCHD23"
  },
  menu: {
    admin: ['calendar','home','profile'],
    secretariat: ['calendar','home','profile'],
    user: ['calendar','home','profile']
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
