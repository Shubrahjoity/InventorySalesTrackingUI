import { Routes } from '@angular/router';
import { Googlelogin } from './googlelogin/googlelogin/googlelogin';
import { LayoutComponent } from './googlelogin/layout/layout.component';
import { DashboardComponent } from './googlelogin/dashboard/dashboard.component';
import { authGuard } from './googlelogin/auth.guard'; // ✅ import the guard
import { SalesEntryComponent } from './googlelogin/sales-entry/sales-entry.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Googlelogin,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard], // ✅ protect it
      },
      {
        path: 'salesentry',
        component: SalesEntryComponent,
        canActivate: [authGuard], // ✅ protect it
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
