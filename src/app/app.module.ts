import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './routes/main/main.component';
import { LoginComponent } from './routes/login/login.component';
// Import the libs you need
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './routes/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './components/profile/profile.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
// material icons
import { MatIconModule } from '@angular/material/icon';
import { FirstLoginComponent } from './components/first-login/first-login.component';
// material forms
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// material tab
import { MatTabsModule } from '@angular/material/tabs';
// material stepper
import {MatStepperModule} from '@angular/material/stepper';
// material select
import { MatSelectModule } from '@angular/material/select';
// material button
import { MatButtonModule } from '@angular/material/button';
// Import Encrypt
import { EncrDecrService } from '../app/services/EncrDecrService/encr-decr-service.service';
// Import Bottom Sheet
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
// Import Mat List
import { MatListModule } from '@angular/material/list';
// Import Date Picker
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
// Import Check Box
import { MatCheckboxModule } from '@angular/material/checkbox';
// Import card 
import { MatCardModule } from '@angular/material/card';
// Import Snack-bar 
import { MatSnackBarModule } from '@angular/material/snack-bar';
// Import Slider
import { MatSliderModule } from '@angular/material/slider';
// Import Table
import { MatTableModule } from '@angular/material/table';
// Import Paginator
import { MatPaginatorModule } from '@angular/material/paginator';
// ReactiveForms
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarComponent } from './routes/calendar/calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
// Dialog
import { MatDialogModule } from '@angular/material/dialog';
import { EventComponent } from './components/event/event.component';
import { PlusButtonComponent } from './components/plus-button/plus-button.component';
import { SelectDateServiceComponent } from './components/select-date-service/select-date-service.component';
import { DeleteDateServiceComponent } from './components/delete-date-service/delete-date-service.component';
import { CreateAnnounceComponent } from './components/create-announce/create-announce.component';
import { AnnounceButtonComponent } from './components/announce-button/announce-button.component';
import { DeclareServiceLimitsComponent } from './components/declare-service-limits/declare-service-limits.component';
import { TableComponent } from './routes/table/table.component';
import { DeleteAnnounceComponent } from './components/delete-announce/delete-announce.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    NavBarComponent,
    FirstLoginComponent,
    CalendarComponent,
    EventComponent,
    PlusButtonComponent,
    SelectDateServiceComponent,
    DeleteDateServiceComponent,
    CreateAnnounceComponent,
    AnnounceButtonComponent,
    DeclareServiceLimitsComponent,
    TableComponent,
    DeleteAnnounceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAnalyticsModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    MatStepperModule,
    MatSelectModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    FormsModule,
    MatCardModule,
    MatSnackBarModule,
    MatSliderModule,
    MatTableModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
     // ngx-translate and the loader module
     HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'el',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
     }),
     CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    ReactiveFormsModule,
    NgbModalModule,
    MatDialogModule
  ],
  providers: [EncrDecrService, {provide: MAT_DATE_LOCALE, useValue: 'el-GB'} ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(httpClient: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

