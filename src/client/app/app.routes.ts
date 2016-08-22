import { RouterConfig } from '@angular/router';

// Authentication Guard
import { AuthGuard } from './auth.guard';

// Public Site Components
import { HomeComponent } from './home/home.component';

// Dashboard Site Components
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { EditorComponent } from './editor/editor.component';
import { LoginComponent } from './login/login.component';

export const routes: RouterConfig = [

  /**
   * App root
   */
  {
    path: '',
    component: HomeComponent
  },

  /**
   * Admin Dashboard
   */
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardHomeComponent},
      { path: 'editor', component: EditorComponent }
    ]
  },

  /**
   * Login Page
   */
   {
     path: 'login',
     component: LoginComponent
   },

  /**
   * 404 Page
   */
  {
    path: '**',
    redirectTo: ''
  }
];
