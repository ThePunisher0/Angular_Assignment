import { Routes } from '@angular/router';
import { ShoppingCartMainComponent } from './components/shopping-cart-main/shopping-cart-main';
import { EmployeeFormComponent } from './components/employee-form/employee-form';
import { EmployeeListComponent } from './components/employee-list/employee-list';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form';
// Defines the application's routes, mapping URLs to components.
export const routes: Routes = [
  // Default route: redirects to the shopping cart page when no specific path is given.
  { path: '', redirectTo: '/shopping-cart', pathMatch: 'full' },

  // Route for the main shopping cart application.
  { path: 'shopping-cart', component: ShoppingCartMainComponent },

  // Route for displaying the list of employees.
  { path: 'employees', component: EmployeeListComponent },

  // Route for adding a new employee.
  { path: 'employee/add', component: EmployeeFormComponent },

  // Route for editing an existing employee, using a dynamic ID parameter.
  { path: 'employee/edit/:id', component: EmployeeFormComponent },

  // Route for the dynamic form generated from JSON configuration.
  { path: 'dynamic-form', component: DynamicFormComponent },

  // Wildcard route: redirects any unknown paths back to the shopping cart page.
  { path: '**', redirectTo: '/shopping-cart' },
];
