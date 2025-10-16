import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { EmployeeService } from '../../services/employee-service';
import { Employee } from '../../models/employee-model';
@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.scss'],
})
export class EmployeeListComponent implements OnInit {
  // Injects the EmployeeService to interact with employee data.
  private employeeService = inject(EmployeeService);

  // An observable stream of all employees, updated whenever employee data changes.
  readonly employees$: Observable<Employee[]> = this.employeeService.employees$;

  // Lifecycle hook, called once after component initialization.
  ngOnInit(): void {}

  /**
   * Handles deleting an employee.
   * Prompts for confirmation before calling the service to remove the employee.
   * @param id The ID of the employee to delete.
   */
  onDeleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id);
    }
  }

  /**
   * Retrieves the department name based on its ID.
   * @param departmentId The ID of the department.
   * @returns The name of the department, or 'Unknown' if not found.
   */
  getDepartmentName(departmentId: number): string {
    const department = this.employeeService.getDepartmentById(departmentId);
    return department ? department.name : 'Unknown';
  }

  /**
   * Retrieves the role name based on its ID.
   * @param roleId The ID of the role.
   * @returns The name of the role, or 'Unknown' if not found.
   */
  getRoleName(roleId: number): string {
    const role = this.employeeService.getRoleById(roleId);
    return role ? role.name : 'Unknown';
  }
}
