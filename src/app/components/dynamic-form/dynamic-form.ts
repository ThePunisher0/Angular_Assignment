import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
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
  // Injects the form builder for creating reactive forms.
  private fb = inject(NonNullableFormBuilder);
  // Injects the service responsible for providing form configurations.
  private formConfigService = inject(FormConfigService);

  // Holds the loaded form configuration data.
  formConfig: FormConfig | null = null;
  // The Angular FormGroup that manages all form controls.
  dynamicForm: FormGroup;
  // Stores mock options for dropdowns, fetched based on API definitions.
  mockOptions: { [key: string]: string[] } = {};
  // Controls the visibility of the success message after submission.
  showSuccessMessage = false;

  constructor() {
    // Initializes the dynamic form as an empty group.
    this.dynamicForm = this.fb.group({});
  }

  ngOnInit(): void {
    // Kicks off the process of loading and building the form when the component starts.
    this.loadFormConfig();
  }

  /**
   * Fetches the form configuration and then builds the form and loads mock options.
   */
  private loadFormConfig(): void {
    this.formConfig = this.formConfigService.getFormConfig();
    this.buildForm();
    this.loadMockOptions();
  }

  /**
   * Constructs the reactive form group based on the loaded JSON configuration.
   */
  private buildForm(): void {
    if (!this.formConfig) return; // Exit if no config is loaded.

    const formControls: { [key: string]: any } = {};

    // Iterates through each section and field to create form controls dynamically.
    this.formConfig.sections.forEach((section) => {
      section.fields.forEach((field) => {
        const validators = this.getValidators(field); // Gets validators for the current field.
        const defaultValue =
          field.default !== undefined ? field.default : this.getDefaultValue(field.type); // Sets default value.
        formControls[field.control_name] = [defaultValue, validators]; // Adds control to the form.
      });
    });

    this.dynamicForm = this.fb.group(formControls); // Builds the final form group.
  }

  /**
   * Determines the appropriate validators for a given form field.
   * @param field The field configuration.
   * @returns An array of validators.
   */
  private getValidators(field: FormField): any[] {
    const validators = [];

    if (field.required) {
      validators.push(Validators.required); // Adds required validator if specified.
    }

    if (field.type === 'email') {
      validators.push(Validators.email); // Adds email validator for email type fields.
    }

    if (field.type === 'number') {
      validators.push(Validators.min(0)); // Ensures number fields are not negative.
    }

    return validators;
  }

  /**
   * Provides a default value based on the field type.
   * @param type The type of the form field.
   * @returns The default value.
   */
  private getDefaultValue(type: string): any {
    switch (type) {
      case 'checkbox':
        return false; // Checkboxes default to false.
      case 'number':
        return 0; // Number inputs default to 0.
      default:
        return ''; // Other types default to an empty string.
    }
  }

  /**
   * Populates mock options for dropdowns that specify an 'api'.
   */
  private loadMockOptions(): void {
    if (!this.formConfig) return; // Exit if no config.

    // Iterates through fields to find those needing mock API options.
    this.formConfig.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.api) {
          // Fetches mock options using the form config service.
          this.mockOptions[field.control_name] = this.formConfigService.getMockOptions(field.api);
        }
      });
    });
  }

  /**
   * Handles the form submission logic.
   * Logs values, shows success message, or marks fields as touched for validation feedback.
   */
  onSubmit(): void {
    if (this.dynamicForm.valid) {
      console.log('Form Values:', this.dynamicForm.value); // Logs all valid form data to console.
      this.showSuccessMessage = true; // Displays a success notification.

      // Hides the success message after a short delay.
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 3000); // Hides after 3 seconds.
    } else {
      this.markFormGroupTouched(); // Highlights invalid fields.
    }
  }

  /**
   * Marks all form controls as 'touched' to display validation errors.
   */
  private markFormGroupTouched(): void {
    Object.keys(this.dynamicForm.controls).forEach((key) => {
      const control = this.dynamicForm.get(key);
      control?.markAsTouched(); // Marks each control as touched.
    });
  }

  /**
   * Checks if a specific form field is invalid and should display an error.
   * @param controlName The name of the form control.
   * @returns True if the field is invalid and touched/dirty.
   */
  isFieldInvalid(controlName: string): boolean {
    const field = this.dynamicForm.get(controlName);
    return !!(field && field.invalid && (field.dirty || field.touched)); // Returns true if invalid and user interacted.
  }

  /**
   * Retrieves the specific error message for a given field.
   * @param field The field configuration.
   * @returns The relevant error message.
   */
  getFieldError(field: FormField): string {
    const control = this.dynamicForm.get(field.control_name);
    if (control?.errors) {
      if (control.errors['required']) return `${field.label} is required`; // Message for required fields.
      if (control.errors['email']) return 'Please enter a valid email address'; // Message for invalid email format.
      if (control.errors['min']) return `${field.label} must be greater than 0`; // Message for minimum value error.
    }
    return ''; // No error message if valid.
  }

  /**
   * Provides the options for select dropdowns, either from config or mock API.
   * @param field The field configuration.
   * @returns An array of string options.
   */
  getFieldOptions(field: FormField): string[] {
    if (field.options) {
      return field.options; // Uses options directly from field config.
    }
    if (field.api && this.mockOptions[field.control_name]) {
      return this.mockOptions[field.control_name]; // Uses mock options if an API is specified.
    }
    return []; // Returns an empty array if no options are found.
  }
}
