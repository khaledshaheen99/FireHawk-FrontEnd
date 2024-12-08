import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddCarComponent } from './add-car/add-car.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'add-car', component: AddCarComponent },
];
