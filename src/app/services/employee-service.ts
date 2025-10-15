import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee, Department, Role } from '../models/employee-model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  public employees$: Observable<Employee[]> = this.employeesSubject.asObservable();

  private readonly departments: Department[] = [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'Human Resources' },
    { id: 3, name: 'Marketing' },
    { id: 4, name: 'Finance' },
  ];

  private readonly roles: Role[] = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Manager' },
    { id: 3, name: 'Employee' },
    { id: 4, name: 'Intern' },
  ];

  constructor() {
    const sampleEmployees: Employee[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phoneNumber: '+1234567890',
        departmentId: 1,
        jobTitle: 'Software Engineer',
        employmentType: 'Full-time',
        joiningDate: '2023-01-15',
        salary: 75000,
        roleId: 3,
        isActive: true,
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.com',
        phoneNumber: '+1234567891',
        departmentId: 2,
        jobTitle: 'HR Manager',
        employmentType: 'Full-time',
        joiningDate: '2022-03-10',
        salary: 85000,
        roleId: 2,
        isActive: true,
      },
    ];
    this.employeesSubject.next(sampleEmployees);
  }

  getEmployees(): Employee[] {
    return this.employeesSubject.value;
  }

  getEmployeeById(id: number): Employee | undefined {
    return this.employeesSubject.value.find((emp) => emp.id === id);
  }

  addEmployee(employee: Omit<Employee, 'id'>): void {
    const employees = [...this.employeesSubject.value];
    const newId = Math.max(...employees.map((e) => e.id), 0) + 1;

    const newEmployee: Employee = {
      ...employee,
      id: newId,
      departmentId: Number(employee.departmentId),
      roleId: Number(employee.roleId),
      salary: Number(employee.salary),
    };

    employees.push(newEmployee);
    this.employeesSubject.next(employees);
  }

  updateEmployee(id: number, employee: Omit<Employee, 'id'>): void {
    const employees = [...this.employeesSubject.value];
    const index = employees.findIndex((emp) => emp.id === id);

    if (index !== -1) {
      employees[index] = {
        ...employee,
        id,
        departmentId: Number(employee.departmentId),
        roleId: Number(employee.roleId),
        salary: Number(employee.salary),
      };
      this.employeesSubject.next(employees);
    }
  }

  deleteEmployee(id: number): void {
    const employees = this.employeesSubject.value;
    const filteredEmployees = employees.filter((emp) => emp.id !== id);
    this.employeesSubject.next(filteredEmployees);
  }

  getDepartments(): Department[] {
    return [...this.departments];
  }

  getRoles(): Role[] {
    return [...this.roles];
  }

  getDepartmentById(id: number): Department | undefined {
    const numId = Number(id);
    return this.departments.find((dept) => dept.id === numId);
  }

  getRoleById(id: number): Role | undefined {
    const numId = Number(id);
    return this.roles.find((role) => role.id === numId);
  }
}
