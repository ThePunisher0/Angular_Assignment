import { Routes } from '@angular/router';
import { ShoppingCartMainComponent } from './components/shopping-cart-main/shopping-cart-main';
import { EmployeeFormComponent } from './components/employee-form/employee-form';
import { EmployeeListComponent } from './components/employee-list/employee-list';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form';
export const routes: Routes = [
  { path: '', redirectTo: '/shopping-cart', pathMatch: 'full' },
  { path: 'shopping-cart', component: ShoppingCartMainComponent },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employee/add', component: EmployeeFormComponent },
  { path: 'employee/edit/:id', component: EmployeeFormComponent },
  { path: 'dynamic-form', component: DynamicFormComponent },
  { path: '**', redirectTo: '/shopping-cart' },
];
