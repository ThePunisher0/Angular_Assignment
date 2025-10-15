import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  NonNullableFormBuilder,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee-service';
import { Department, Role } from '../../models/employee-model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.html',
  styleUrls: ['./employee-form.scss'],
})
export class EmployeeFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  employeeForm: FormGroup;
  isEditMode = false;
  employeeId: number | null = null;

  readonly departments: Department[] = this.employeeService.getDepartments();
  readonly roles: Role[] = this.employeeService.getRoles();
  readonly employmentTypes: string[] = ['Full-time', 'Part-time', 'Contract', 'Intern'];

  constructor() {
    this.employeeForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.employeeId = +params['id'];
        this.loadEmployee();
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      departmentId: [0, [Validators.required, Validators.min(1)]],
      jobTitle: ['', Validators.required],
      employmentType: ['', Validators.required],
      joiningDate: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      roleId: [0, [Validators.required, Validators.min(1)]],
      isActive: [true],
    });
  }

  private loadEmployee(): void {
    if (this.employeeId) {
      const employee = this.employeeService.getEmployeeById(this.employeeId);
      if (employee) {
        this.employeeForm.patchValue(employee);
      }
    }
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;

      console.log('Form values before submit:', formValue);

      if (this.isEditMode && this.employeeId) {
        this.employeeService.updateEmployee(this.employeeId, formValue);
      } else {
        this.employeeService.addEmployee(formValue);
      }

      this.router.navigate(['/employees']);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.employeeForm.controls).forEach((key) => {
      const control = this.employeeForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/employees']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['minlength'])
        return `${this.getFieldLabel(fieldName)} must be at least ${
          field.errors['minlength'].requiredLength
        } characters`;
      if (field.errors['min']) return `${this.getFieldLabel(fieldName)} must be greater than 0`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      departmentId: 'Department',
      jobTitle: 'Job Title',
      employmentType: 'Employment Type',
      joiningDate: 'Joining Date',
      salary: 'Salary',
      roleId: 'Role',
    };
    return labels[fieldName] || fieldName;
  }
}
