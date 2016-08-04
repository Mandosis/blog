import { RouterConfig } from '@angular/router';
import { Home } from './home/home.component';
import { Dashboard } from './dashboard/dashboard.component';
import { DashboardHome } from './dashboard/home/home.component';

export const routes: RouterConfig = [
  {
    path: '',
    component: Home
  },

  /**
   * Admin Dashboard
   */
  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      { path: '', component: DashboardHome}
    ]
  },

  /**
   * 404 Page
   */
  {
    path: '**',
    redirectTo: ''
  }
];
