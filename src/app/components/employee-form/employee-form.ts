import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, Validators, NonNullableFormBuilder } from '@angular/forms';
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
  // Injects the NonNullableFormBuilder for type-safe reactive forms.
  private fb = inject(NonNullableFormBuilder);
  // Injects the EmployeeService for managing employee data.
  private employeeService = inject(EmployeeService);
  // Injects the Router for navigation.
  private router = inject(Router);
  // Injects the ActivatedRoute to access route parameters (like employee ID for editing).
  private route = inject(ActivatedRoute);

  // The FormGroup that manages all form controls for employee data.
  employeeForm: FormGroup;
  // Flag to determine if the form is in edit mode (true) or add mode (false).
  isEditMode = false;
  // Stores the ID of the employee being edited, or null if adding a new employee.
  employeeId: number | null = null;

  // Readonly array of available departments, fetched from the employee service.
  readonly departments: Department[] = this.employeeService.getDepartments();
  // Readonly array of available roles, fetched from the employee service.
  readonly roles: Role[] = this.employeeService.getRoles();
  // Readonly array of predefined employment types.
  readonly employmentTypes: string[] = ['Full-time', 'Part-time', 'Contract', 'Intern'];

  constructor() {
    // Initializes the employee form structure.
    this.employeeForm = this.createForm();
  }

  ngOnInit(): void {
    // Subscribes to route parameters to check for an employee ID.
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true; // Sets mode to edit.
        this.employeeId = +params['id']; // Converts string ID from route to a number.
        this.loadEmployee(); // Loads existing employee data for editing.
      }
    });
  }

  /**
   * Defines the structure and initial values/validators for the employee form.
   * @returns An Angular FormGroup.
   */
  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]], // First name, required, min 2 chars.
      lastName: ['', [Validators.required, Validators.minLength(2)]], // Last name, required, min 2 chars.
      email: ['', [Validators.required, Validators.email]], // Email, required, valid email format.
      phoneNumber: [''], // Phone number, optional.
      departmentId: [0, [Validators.required, Validators.min(1)]], // Department ID, required, must be > 0.
      jobTitle: ['', Validators.required], // Job title, required.
      employmentType: ['', Validators.required], // Employment type, required.
      joiningDate: ['', Validators.required], // Joining date, required.
      salary: [0, [Validators.required, Validators.min(0)]], // Salary, required, min 0.
      roleId: [0, [Validators.required, Validators.min(1)]], // Role ID, required, must be > 0.
      isActive: [true], // Is active checkbox, defaults to true.
    });
  }

  /**
   * Loads an existing employee's data into the form when in edit mode.
   */
  private loadEmployee(): void {
    if (this.employeeId) {
      const employee = this.employeeService.getEmployeeById(this.employeeId); // Fetches employee by ID.
      if (employee) {
        this.employeeForm.patchValue(employee); // Populates form fields with employee data.
      }
    }
  }

  /**
   * Handles the form submission. Adds new employee or updates existing one.
   */
  onSubmit(): void {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value; // Gets current form values.

      console.log('Form values before submit:', formValue); // Debug log: shows form data.

      if (this.isEditMode && this.employeeId) {
        this.employeeService.updateEmployee(this.employeeId, formValue); // Updates existing employee.
      } else {
        this.employeeService.addEmployee(formValue); // Adds a new employee.
      }

      this.router.navigate(['/employees']); // Navigates back to the employee list.
    } else {
      this.markFormGroupTouched(); // If form is invalid, marks all fields as touched to show errors.
    }
  }

  /**
   * Marks all controls in the form group as 'touched' to trigger validation messages.
   */
  private markFormGroupTouched(): void {
    Object.keys(this.employeeForm.controls).forEach((key) => {
      const control = this.employeeForm.get(key);
      control?.markAsTouched(); // Marks each individual form control.
    });
  }

  /**
   * Navigates back to the employee list without saving changes.
   */
  onCancel(): void {
    this.router.navigate(['/employees']);
  }

  /**
   * Checks if a specific form field is invalid and should display an error message.
   * @param fieldName The name of the form control.
   * @returns True if the field is invalid and has been interacted with.
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched)); // Returns true if invalid and dirty/touched.
  }

  /**
   * Retrieves the appropriate error message for a given form field.
   * @param fieldName The name of the form control.
   * @returns The specific validation error message.
   */
  getFieldError(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} is required`; // Message for required fields.
      if (field.errors['email']) return 'Please enter a valid email address'; // Message for invalid email format.
      if (field.errors['minlength'])
        return `${this.getFieldLabel(fieldName)} must be at least ${
          field.errors['minlength'].requiredLength
        } characters`; // Message for minimum length.
      if (field.errors['min']) return `${this.getFieldLabel(fieldName)} must be greater than 0`; // Message for minimum value.
    }
    return ''; // No error message if valid.
  }

  /**
   * Helper function to get a user-friendly label for a given field name.
   * @param fieldName The internal control name.
   * @returns The display label for the field.
   */
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
    return labels[fieldName] || fieldName; // Returns friendly label or raw field name.
  }
}
