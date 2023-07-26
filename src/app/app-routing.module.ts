import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { CalendarComponent } from './routes/calendar/calendar.component';
import { LoginComponent } from './routes/login/login.component';
import { MainComponent } from './routes/main/main.component';
import { RegisterComponent } from './routes/register/register.component';
import { TableComponent } from './routes/table/table.component';
import { AuthGuard as Guard } from './services/auth/guard/auth/auth.guard';
import { RoleGuard as Role } from './services/auth/guard/role/role.guard';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

const routes: Routes = [
  { path: 'dashboard', component: MainComponent, canActivate: [Guard] },
  { path: 'calendar', component: CalendarComponent,canActivate: [Guard] },
  { path: 'table', component: TableComponent, canActivate: [Role] , data: { expectedRole: 1 } },
  { path: '', redirectTo:'login', pathMatch:'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [Guard] },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
