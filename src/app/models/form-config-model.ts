export interface FormField {
  label: string;
  placeholder: string;
  type: string;
  control_name: string;
  required?: boolean;
  options?: string[];
  api?: string;
  default?: any;
}
export interface FormSection {
  section_name: string;
  fields: FormField[];
}
export interface SubmitButton {
  label: string;
  color: string;
  api: string;
  redirect_url: string;
}
export interface FormConfig {
  screen_name: string;
  submit_button: SubmitButton;
  sections: FormSection[];
}
