import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { CalendarComponent } from './routes/calendar/calendar.component';
import { LoginComponent } from './routes/login/login.component';
import { MainComponent } from './routes/main/main.component';
import { RegisterComponent } from './routes/register/register.component';
import { TableComponent } from './routes/table/table.component';
import { AuthGuard } from './services/auth/guard/auth';

const routes: Routes = [
  { path: 'dashboard', component: MainComponent, canActivate: [AuthGuard] },
  { path: 'calendar', component: CalendarComponent,canActivate: [AuthGuard] },
  { path: 'table', component: TableComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo:'login', pathMatch:'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent,canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
