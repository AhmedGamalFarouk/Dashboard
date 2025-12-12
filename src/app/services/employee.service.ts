import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, tap } from 'rxjs';
import {
    Employee,
    EmployeesApiResponse,
    EmployeeFormData,
    EmployeeStatus,
    DEPARTMENTS,
    POSITIONS
} from '../models/employee.model';

/**
 * HR Dashboard metrics
 */
export interface HRMetrics {
    totalEmployees: number;
    activeEmployees: number;
    onLeaveEmployees: number;
    terminatedEmployees: number;
    departmentBreakdown: Record<string, number>;
}

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private readonly http = inject(HttpClient);

    private readonly PERSONS_API = 'https://fakerapi.it/api/v1/persons?_quantity=15';

    // Local state management with signals
    private readonly _employees = signal<Employee[]>([]);
    private readonly _isLoading = signal<boolean>(false);
    private readonly _error = signal<string | null>(null);

    // Public readonly signals
    readonly employees = this._employees.asReadonly();
    readonly isLoading = this._isLoading.asReadonly();
    readonly error = this._error.asReadonly();

    // Computed metrics
    readonly metrics = computed<HRMetrics>(() => {
        const emps = this._employees();
        const departmentBreakdown: Record<string, number> = {};

        emps.forEach(emp => {
            const dept = emp.department || 'Unassigned';
            departmentBreakdown[dept] = (departmentBreakdown[dept] || 0) + 1;
        });

        return {
            totalEmployees: emps.length,
            activeEmployees: emps.filter(e => e.status === 'active').length,
            onLeaveEmployees: emps.filter(e => e.status === 'on-leave').length,
            terminatedEmployees: emps.filter(e => e.status === 'terminated').length,
            departmentBreakdown
        };
    });

    /**
     * Fetches employees from FakerAPI and enriches with HR data
     */
    loadEmployees(): void {
        this._isLoading.set(true);
        this._error.set(null);

        this.http.get<EmployeesApiResponse>(this.PERSONS_API).pipe(
            map(response => this.enrichEmployees(response.data)),
            catchError(error => {
                console.error('Error fetching employees:', error);
                this._error.set('Failed to load employees. Please try again.');
                return of([]);
            })
        ).subscribe(employees => {
            this._employees.set(employees);
            this._isLoading.set(false);
        });
    }

    /**
     * Enriches API data with random HR fields
     */
    private enrichEmployees(employees: Employee[]): Employee[] {
        return employees.map((emp, index) => ({
            ...emp,
            department: DEPARTMENTS[index % DEPARTMENTS.length],
            position: POSITIONS[index % POSITIONS.length],
            status: this.getRandomStatus(index),
            hireDate: this.generateHireDate(index),
            salary: this.generateSalary(index)
        }));
    }

    private getRandomStatus(index: number): EmployeeStatus {
        const statuses: EmployeeStatus[] = ['active', 'active', 'active', 'on-leave', 'terminated'];
        return statuses[index % statuses.length];
    }

    private generateHireDate(index: number): string {
        const year = 2020 + (index % 4);
        const month = String((index % 12) + 1).padStart(2, '0');
        const day = String((index % 28) + 1).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    private generateSalary(index: number): number {
        const base = 45000 + (index * 5000);
        return Math.round(base / 1000) * 1000;
    }

    /**
     * Get single employee by ID
     */
    getEmployee(id: number): Employee | undefined {
        return this._employees().find(e => e.id === id);
    }

    /**
     * Create new employee (local only since API is read-only)
     */
    createEmployee(formData: EmployeeFormData): Employee {
        const employees = this._employees();
        const maxId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) : 0;

        const newEmployee: Employee = {
            id: maxId + 1,
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            phone: formData.phone,
            birthday: formData.birthday,
            gender: formData.gender,
            address: {
                id: maxId + 1,
                street: '',
                streetName: '',
                buildingNumber: '',
                city: formData.city,
                zipcode: '',
                country: formData.country,
                country_code: '',
                latitude: 0,
                longitude: 0
            },
            website: '',
            image: `https://api.dicebear.com/7.x/initials/svg?seed=${formData.firstname}${formData.lastname}`,
            department: formData.department,
            position: formData.position,
            status: formData.status,
            hireDate: new Date().toISOString().split('T')[0],
            salary: 50000
        };

        this._employees.update(emps => [newEmployee, ...emps]);
        return newEmployee;
    }

    /**
     * Update existing employee (local only)
     */
    updateEmployee(id: number, formData: Partial<EmployeeFormData>): boolean {
        const index = this._employees().findIndex(e => e.id === id);
        if (index === -1) return false;

        this._employees.update(emps => {
            const updated = [...emps];
            updated[index] = {
                ...updated[index],
                ...formData,
                address: {
                    ...updated[index].address,
                    city: formData.city || updated[index].address.city,
                    country: formData.country || updated[index].address.country
                }
            };
            return updated;
        });

        return true;
    }

    /**
     * Delete employee (local only)
     */
    deleteEmployee(id: number): boolean {
        const exists = this._employees().some(e => e.id === id);
        if (!exists) return false;

        this._employees.update(emps => emps.filter(e => e.id !== id));
        return true;
    }

    /**
     * Update employee status
     */
    updateStatus(id: number, status: EmployeeStatus): boolean {
        return this.updateEmployee(id, { status } as Partial<EmployeeFormData>);
    }

    /**
     * Search employees by name or email
     */
    searchEmployees(query: string): Employee[] {
        const lowerQuery = query.toLowerCase();
        return this._employees().filter(emp =>
            emp.firstname.toLowerCase().includes(lowerQuery) ||
            emp.lastname.toLowerCase().includes(lowerQuery) ||
            emp.email.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Filter employees by department
     */
    filterByDepartment(department: string): Employee[] {
        if (!department || department === 'all') return this._employees();
        return this._employees().filter(emp => emp.department === department);
    }

    /**
     * Filter employees by status
     */
    filterByStatus(status: EmployeeStatus | 'all'): Employee[] {
        if (status === 'all') return this._employees();
        return this._employees().filter(emp => emp.status === status);
    }
}
