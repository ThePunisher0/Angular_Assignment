export interface Employee {
id: number;
firstName: string;
lastName: string;
email: string;
phoneNumber?: string;
departmentId: number;
jobTitle: string;
employmentType: string;
joiningDate: string;
salary: number;
roleId: number;
isActive: boolean;
}
export interface Department {
id: number;
name: string;
}
export interface Role {
id: number;
name: string;
}