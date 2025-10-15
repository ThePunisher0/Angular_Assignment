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
  private employeeService = inject(EmployeeService);
  readonly employees$: Observable<Employee[]> = this.employeeService.employees$;
  ngOnInit(): void {}
  onDeleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id);
    }
  }
  getDepartmentName(departmentId: number): string {
    const department = this.employeeService.getDepartmentById(departmentId);
    return department ? department.name : 'Unknown';
  }
  getRoleName(roleId: number): string {
    const role = this.employeeService.getRoleById(roleId);
    return role ? role.name : 'Unknown';
  }
}
