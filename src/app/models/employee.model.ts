/**
 * Employee interface matching the FakerAPI persons response structure
 */
export interface Employee {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    birthday: string;
    gender: 'male' | 'female';
    address: EmployeeAddress;
    website: string;
    image: string;
    // Additional HR fields (locally managed)
    department?: string;
    position?: string;
    status?: EmployeeStatus;
    hireDate?: string;
    salary?: number;
}

export interface EmployeeAddress {
    id: number;
    street: string;
    streetName: string;
    buildingNumber: string;
    city: string;
    zipcode: string;
    country: string;
    country_code: string;
    latitude: number;
    longitude: number;
}

export type EmployeeStatus = 'active' | 'on-leave' | 'terminated';

export interface EmployeesApiResponse {
    status: string;
    code: number;
    locale: string;
    seed: string | null;
    total: number;
    data: Employee[];
}

/**
 * Form data for creating/editing employees
 */
export interface EmployeeFormData {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    birthday: string;
    gender: 'male' | 'female';
    department: string;
    position: string;
    status: EmployeeStatus;
    city: string;
    country: string;
}

/**
 * Available departments
 */
export const DEPARTMENTS = [
    'Engineering',
    'Human Resources',
    'Marketing',
    'Sales',
    'Finance',
    'Operations',
    'Legal',
    'Customer Support'
] as const;

/**
 * Available positions
 */
export const POSITIONS = [
    'Junior Developer',
    'Senior Developer',
    'Team Lead',
    'Manager',
    'Director',
    'VP',
    'Analyst',
    'Specialist',
    'Coordinator',
    'Administrator'
] as const;
