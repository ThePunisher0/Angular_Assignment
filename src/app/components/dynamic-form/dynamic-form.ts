import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  NonNullableFormBuilder,
} from '@angular/forms';
import { FormConfigService } from '../../services/form-config';
import { FormConfig, FormField } from '../../models/form-config-model';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.html',
  styleUrls: ['./dynamic-form.scss'],
})
export class DynamicFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private formConfigService = inject(FormConfigService);

  formConfig: FormConfig | null = null;
  dynamicForm: FormGroup;
  mockOptions: { [key: string]: string[] } = {};
  showSuccessMessage = false;

  constructor() {
    this.dynamicForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.loadFormConfig();
  }

  private loadFormConfig(): void {
    this.formConfig = this.formConfigService.getFormConfig();
    this.buildForm();
    this.loadMockOptions();
  }

  private buildForm(): void {
    if (!this.formConfig) return;

    const formControls: { [key: string]: any } = {};

    this.formConfig.sections.forEach((section) => {
      section.fields.forEach((field) => {
        const validators = this.getValidators(field);
        const defaultValue =
          field.default !== undefined ? field.default : this.getDefaultValue(field.type);
        formControls[field.control_name] = [defaultValue, validators];
      });
    });

    this.dynamicForm = this.fb.group(formControls);
  }

  private getValidators(field: FormField): any[] {
    const validators = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    if (field.type === 'email') {
      validators.push(Validators.email);
    }

    if (field.type === 'number') {
      validators.push(Validators.min(0));
    }

    return validators;
  }

  private getDefaultValue(type: string): any {
    switch (type) {
      case 'checkbox':
        return false;
      case 'number':
        return 0;
      default:
        return '';
    }
  }

  private loadMockOptions(): void {
    if (!this.formConfig) return;

    this.formConfig.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.api) {
          this.mockOptions[field.control_name] = this.formConfigService.getMockOptions(field.api);
        }
      });
    });
  }

  onSubmit(): void {
    if (this.dynamicForm.valid) {
      console.log('Form Values:', this.dynamicForm.value);
      this.showSuccessMessage = true;

      // Hide success message after 3 seconds
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 3000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.dynamicForm.controls).forEach((key) => {
      const control = this.dynamicForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(controlName: string): boolean {
    const field = this.dynamicForm.get(controlName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(field: FormField): string {
    const control = this.dynamicForm.get(field.control_name);
    if (control?.errors) {
      if (control.errors['required']) return `${field.label} is required`;
      if (control.errors['email']) return 'Please enter a valid email address';
      if (control.errors['min']) return `${field.label} must be greater than 0`;
    }
    return '';
  }

  getFieldOptions(field: FormField): string[] {
    if (field.options) {
      return field.options;
    }
    if (field.api && this.mockOptions[field.control_name]) {
      return this.mockOptions[field.control_name];
    }
    return [];
  }
}
