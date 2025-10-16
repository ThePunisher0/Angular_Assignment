import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee, Department, Role } from '../models/employee-model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  // A BehaviorSubject to hold the current list of employees, acting as our in-memory data store.
  private employeesSubject = new BehaviorSubject<Employee[]>([]);

  // Public observable stream for components to subscribe to, receiving employee list updates.
  public employees$: Observable<Employee[]> = this.employeesSubject.asObservable();

  // Readonly array representing available departments, acting as static lookup data.
  private readonly departments: Department[] = [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'Human Resources' },
    { id: 3, name: 'Marketing' },
    { id: 4, name: 'Finance' },
  ];

  // Readonly array representing available roles, acting as static lookup data.
  private readonly roles: Role[] = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Manager' },
    { id: 3, name: 'Employee' },
    { id: 4, name: 'Intern' },
  ];

  constructor() {
    // Initializes the employee list with some sample data when the service is created.
    const sampleEmployees: Employee[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phoneNumber: '+1234567890',
        departmentId: 1, // Engineering
        jobTitle: 'Software Engineer',
        employmentType: 'Full-time',
        joiningDate: '2023-01-15',
        salary: 75000,
        roleId: 3, // Employee
        isActive: true,
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.com',
        phoneNumber: '+1234567891',
        departmentId: 2, // Human Resources
        jobTitle: 'HR Manager',
        employmentType: 'Full-time',
        joiningDate: '2022-03-10',
        salary: 85000,
        roleId: 2, // Manager
        isActive: true,
      },
    ];
    this.employeesSubject.next(sampleEmployees); // Publishes the initial employee data.
  }

  /**
   * Retrieves the current snapshot of the employee list.
   * @returns An array of Employee objects.
   */
  getEmployees(): Employee[] {
    return this.employeesSubject.value;
  }

  /**
   * Finds an employee by their ID.
   * @param id The ID of the employee to find.
   * @returns The Employee object if found, otherwise undefined.
   */
  getEmployeeById(id: number): Employee | undefined {
    return this.employeesSubject.value.find((emp) => emp.id === id);
  }

  /**
   * Adds a new employee to the list.
   * @param employee The employee data (without ID) to add.
   */
  addEmployee(employee: Omit<Employee, 'id'>): void {
    const employees = [...this.employeesSubject.value]; // Create a copy of current employees.
    const newId = Math.max(...employees.map((e) => e.id), 0) + 1; // Generates a new unique ID.

    // Creates a new Employee object, ensuring numeric fields are correctly parsed.
    const newEmployee: Employee = {
      ...employee,
      id: newId,
      departmentId: Number(employee.departmentId),
      roleId: Number(employee.roleId),
      salary: Number(employee.salary),
    };

    employees.push(newEmployee); // Adds the new employee to the list.
    this.employeesSubject.next(employees); // Publishes the updated employee list.
  }

  /**
   * Updates an existing employee's details.
   * @param id The ID of the employee to update.
   * @param employee The updated employee data (without ID).
   */
  updateEmployee(id: number, employee: Omit<Employee, 'id'>): void {
    const employees = [...this.employeesSubject.value]; // Create a copy.
    const index = employees.findIndex((emp) => emp.id === id); // Finds the index of the employee to update.

    if (index !== -1) {
      // Updates the employee object, ensuring numeric fields are correctly parsed.
      employees[index] = {
        ...employee,
        id,
        departmentId: Number(employee.departmentId),
        roleId: Number(employee.roleId),
        salary: Number(employee.salary),
      };
      this.employeesSubject.next(employees); // Publishes the updated employee list.
    }
  }

  /**
   * Deletes an employee from the list.
   * @param id The ID of the employee to delete.
   */
  deleteEmployee(id: number): void {
    const employees = this.employeesSubject.value;
    // Filters out the employee with the matching ID.
    const filteredEmployees = employees.filter((emp) => emp.id !== id);
    this.employeesSubject.next(filteredEmployees); // Publishes the filtered list.
  }

  /**
   * Retrieves the list of all available departments.
   * @returns An array of Department objects.
   */
  getDepartments(): Department[] {
    return [...this.departments]; // Returns a copy to prevent direct modification.
  }

  /**
   * Retrieves the list of all available roles.
   * @returns An array of Role objects.
   */
  getRoles(): Role[] {
    return [...this.roles]; // Returns a copy to prevent direct modification.
  }

  /**
   * Finds a department by its ID. Handles string-to-number conversion for robustness.
   * @param id The ID of the department to find.
   * @returns The Department object if found, otherwise undefined.
   */
  getDepartmentById(id: number): Department | undefined {
    const numId = Number(id); // Ensures the ID is treated as a number for comparison.
    return this.departments.find((dept) => dept.id === numId);
  }

  /**
   * Finds a role by its ID. Handles string-to-number conversion for robustness.
   * @param id The ID of the role to find.
   * @returns The Role object if found, otherwise undefined.
   */
  getRoleById(id: number): Role | undefined {
    const numId = Number(id); // Ensures the ID is treated as a number for comparison.
    return this.roles.find((role) => role.id === numId);
  }
}
