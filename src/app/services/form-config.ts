import { Injectable } from '@angular/core';
import { FormConfig } from '../models/form-config-model';

@Injectable({
  providedIn: 'root',
})
export class FormConfigService {
  constructor() {}

  getFormConfig(): FormConfig {
    return {
      screen_name: 'Create Employee',
      submit_button: {
        label: 'Create',
        color: '#4CAF50',
        api: 'api/v1/employees',
        redirect_url: '/home/hr/employees/list',
      },
      sections: [
        {
          section_name: 'Basic Information',
          fields: [
            {
              label: 'First Name',
              placeholder: 'Enter first name',
              type: 'text',
              control_name: 'first_name',
              required: true,
            },
            {
              label: 'Last Name',
              placeholder: 'Enter last name',
              type: 'text',
              control_name: 'last_name',
              required: true,
            },
            {
              label: 'Email Address',
              placeholder: 'Enter email',
              type: 'email',
              control_name: 'email',
              required: true,
            },
            {
              label: 'Phone Number',
              placeholder: 'Enter phone number',
              type: 'text',
              control_name: 'phone_number',
              required: false,
            },
            {
              label: 'Department',
              placeholder: 'Select department',
              type: 'select',
              control_name: 'department_id',
              api: 'api/v1/departments',
              required: true,
            },
          ],
        },
        {
          section_name: 'Job Details',
          fields: [
            {
              label: 'Job Title',
              placeholder: 'Enter job title',
              type: 'text',
              control_name: 'job_title',
              required: true,
            },
            {
              label: 'Employment Type',
              placeholder: 'Select type',
              type: 'select',
              control_name: 'employment_type',
              options: ['Full-time', 'Part-time', 'Contract', 'Intern'],
              required: true,
            },
            {
              label: 'Joining Date',
              placeholder: 'Select date',
              type: 'date',
              control_name: 'joining_date',
              required: true,
            },
            {
              label: 'Salary',
              placeholder: 'Enter salary',
              type: 'number',
              control_name: 'salary',
              required: true,
            },
          ],
        },
        {
          section_name: 'System Access',
          fields: [
            {
              label: 'Assign System Role',
              placeholder: 'Select role',
              type: 'select',
              control_name: 'role_id',
              api: 'api/v1/roles',
              required: true,
            },
            {
              label: 'Is Active',
              type: 'checkbox',
              control_name: 'is_active',
              default: true,
              placeholder: '',
            },
          ],
        },
      ],
    };
  }

  getMockOptions(api: string): string[] {
    const mockData: { [key: string]: string[] } = {
      'api/v1/departments': ['Engineering', 'Human Resources', 'Marketing', 'Finance'],
      'api/v1/roles': ['Admin', 'Manager', 'Employee', 'Intern'],
    };

    return mockData[api] || [];
  }
}
