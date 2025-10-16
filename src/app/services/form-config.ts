import { Injectable } from '@angular/core';
import { FormConfig } from '../models/form-config-model';

@Injectable({
  providedIn: 'root',
})
export class FormConfigService {
  constructor() {}

  /**
   * Provides the static JSON configuration for building the dynamic employee form.
   * This configuration defines the form's structure, fields, and validation rules.
   * @returns A FormConfig object.
   */
  getFormConfig(): FormConfig {
    return {
      screen_name: 'Create Employee', // The title displayed at the top of the form.
      submit_button: {
        label: 'Create', // Text for the submit button.
        color: '#4CAF50', // Background color for the submit button.
        api: 'api/v1/employees', // Mock API endpoint for submission (not actually called).
        redirect_url: '/home/hr/employees/list', // URL to navigate to after successful submission.
      },
      sections: [
        {
          section_name: 'Basic Information', // Section title for basic employee details.
          fields: [
            {
              label: 'First Name',
              placeholder: 'Enter first name',
              type: 'text',
              control_name: 'first_name',
              required: true, // This field is mandatory.
            },
            {
              label: 'Last Name',
              placeholder: 'Enter last name',
              type: 'text',
              control_name: 'last_name',
              required: true, // This field is mandatory.
            },
            {
              label: 'Email Address',
              placeholder: 'Enter email',
              type: 'email',
              control_name: 'email',
              required: true, // This field is mandatory and expects email format.
            },
            {
              label: 'Phone Number',
              placeholder: 'Enter phone number',
              type: 'text',
              control_name: 'phone_number',
              required: false, // This field is optional.
            },
            {
              label: 'Department',
              placeholder: 'Select department',
              type: 'select',
              control_name: 'department_id',
              api: 'api/v1/departments', // Indicates that options for this dropdown come from a mock API.
              required: true, // This field is mandatory.
            },
          ],
        },
        {
          section_name: 'Job Details', // Section title for employment-related information.
          fields: [
            {
              label: 'Job Title',
              placeholder: 'Enter job title',
              type: 'text',
              control_name: 'job_title',
              required: true, // This field is mandatory.
            },
            {
              label: 'Employment Type',
              placeholder: 'Select type',
              type: 'select',
              control_name: 'employment_type',
              options: ['Full-time', 'Part-time', 'Contract', 'Intern'], // Direct options provided for this dropdown.
              required: true, // This field is mandatory.
            },
            {
              label: 'Joining Date',
              placeholder: 'Select date',
              type: 'date',
              control_name: 'joining_date',
              required: true, // This field is mandatory.
            },
            {
              label: 'Salary',
              placeholder: 'Enter salary',
              type: 'number',
              control_name: 'salary',
              required: true, // This field is mandatory and expects a number.
            },
          ],
        },
        {
          section_name: 'System Access', // Section title for user access and roles.
          fields: [
            {
              label: 'Assign System Role',
              placeholder: 'Select role',
              type: 'select',
              control_name: 'role_id',
              api: 'api/v1/roles', // Indicates that options for this dropdown come from a mock API.
              required: true, // This field is mandatory.
            },
            {
              label: 'Is Active',
              type: 'checkbox',
              control_name: 'is_active',
              default: true, // This checkbox defaults to checked.
              placeholder: '', // Placeholder is not relevant for checkboxes.
            },
          ],
        },
      ],
    };
  }

  /**
   * Provides mock options for dropdowns that are configured to fetch data from an "API".
   * This simulates API calls without making actual network requests.
   * @param api The mock API endpoint string (e.g., 'api/v1/departments').
   * @returns An array of string options for the dropdown.
   */
  getMockOptions(api: string): string[] {
    const mockData: { [key: string]: string[] } = {
      'api/v1/departments': ['Engineering', 'Human Resources', 'Marketing', 'Finance'],
      'api/v1/roles': ['Admin', 'Manager', 'Employee', 'Intern'],
    };

    return mockData[api] || []; // Returns mock data for the given API, or an empty array if not found.
  }
}
