import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import {
    Employee,
    EmployeeFormData,
    EmployeeStatus,
    DEPARTMENTS,
    POSITIONS
} from '../../models/employee.model';
import { listAnimation, fadeAnimation, slideUpAnimation } from '../../animations/dashboard.animations';

type ModalMode = 'create' | 'edit' | 'view' | 'delete' | null;

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    animations: [listAnimation, fadeAnimation, slideUpAnimation]
})
export class DashboardComponent implements OnInit {
    private readonly employeeService = inject(EmployeeService);

    // Service signals
    readonly employees = this.employeeService.employees;
    readonly isLoading = this.employeeService.isLoading;
    readonly error = this.employeeService.error;
    readonly metrics = this.employeeService.metrics;

    // Local UI state
    readonly searchQuery = signal<string>('');
    readonly selectedDepartment = signal<string>('all');
    readonly selectedStatus = signal<EmployeeStatus | 'all'>('all');
    readonly modalMode = signal<ModalMode>(null);
    readonly selectedEmployee = signal<Employee | null>(null);

    // Form data
    readonly formData = signal<EmployeeFormData>({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        birthday: '',
        gender: 'male',
        department: DEPARTMENTS[0],
        position: POSITIONS[0],
        status: 'active',
        city: '',
        country: ''
    });

    // Constants for templates
    readonly departments = DEPARTMENTS;
    readonly positions = POSITIONS;
    readonly statuses: EmployeeStatus[] = ['active', 'on-leave', 'terminated'];

    // Filtered employees
    readonly filteredEmployees = computed(() => {
        let result = this.employees();

        // Apply search filter
        const query = this.searchQuery().toLowerCase();
        if (query) {
            result = result.filter(emp =>
                emp.firstname.toLowerCase().includes(query) ||
                emp.lastname.toLowerCase().includes(query) ||
                emp.email.toLowerCase().includes(query) ||
                emp.department?.toLowerCase().includes(query)
            );
        }

        // Apply department filter
        const dept = this.selectedDepartment();
        if (dept && dept !== 'all') {
            result = result.filter(emp => emp.department === dept);
        }

        // Apply status filter
        const status = this.selectedStatus();
        if (status !== 'all') {
            result = result.filter(emp => emp.status === status);
        }

        return result;
    });

    ngOnInit(): void {
        this.employeeService.loadEmployees();
    }

    // Modal methods
    openCreateModal(): void {
        this.resetForm();
        this.modalMode.set('create');
    }

    openEditModal(employee: Employee): void {
        this.selectedEmployee.set(employee);
        this.formData.set({
            firstname: employee.firstname,
            lastname: employee.lastname,
            email: employee.email,
            phone: employee.phone,
            birthday: employee.birthday,
            gender: employee.gender,
            department: employee.department || DEPARTMENTS[0],
            position: employee.position || POSITIONS[0],
            status: employee.status || 'active',
            city: employee.address.city,
            country: employee.address.country
        });
        this.modalMode.set('edit');
    }

    openViewModal(employee: Employee): void {
        this.selectedEmployee.set(employee);
        this.modalMode.set('view');
    }

    openDeleteModal(employee: Employee): void {
        this.selectedEmployee.set(employee);
        this.modalMode.set('delete');
    }

    closeModal(): void {
        this.modalMode.set(null);
        this.selectedEmployee.set(null);
        this.resetForm();
    }

    private resetForm(): void {
        this.formData.set({
            firstname: '',
            lastname: '',
            email: '',
            phone: '',
            birthday: '',
            gender: 'male',
            department: DEPARTMENTS[0],
            position: POSITIONS[0],
            status: 'active',
            city: '',
            country: ''
        });
    }

    // CRUD operations
    handleSubmit(): void {
        const mode = this.modalMode();
        const data = this.formData();

        if (mode === 'create') {
            this.employeeService.createEmployee(data);
        } else if (mode === 'edit') {
            const emp = this.selectedEmployee();
            if (emp) {
                this.employeeService.updateEmployee(emp.id, data);
            }
        }

        this.closeModal();
    }

    confirmDelete(): void {
        const emp = this.selectedEmployee();
        if (emp) {
            this.employeeService.deleteEmployee(emp.id);
        }
        this.closeModal();
    }

    updateStatus(employee: Employee, status: EmployeeStatus): void {
        this.employeeService.updateStatus(employee.id, status);
    }

    refreshData(): void {
        this.employeeService.loadEmployees();
    }

    // Utility methods
    getStatusClass(status: EmployeeStatus | undefined): string {
        const classes: Record<EmployeeStatus, string> = {
            'active': 'status-active',
            'on-leave': 'status-leave',
            'terminated': 'status-terminated'
        };
        return status ? classes[status] : '';
    }

    getStatusLabel(status: EmployeeStatus | undefined): string {
        const labels: Record<EmployeeStatus, string> = {
            'active': 'Active',
            'on-leave': 'On Leave',
            'terminated': 'Terminated'
        };
        return status ? labels[status] : 'Unknown';
    }

    formatDate(dateString: string): string {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatSalary(salary: number | undefined): string {
        if (!salary) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(salary);
    }

    getEmployeeInitials(employee: Employee): string {
        return `${employee.firstname.charAt(0)}${employee.lastname.charAt(0)}`.toUpperCase();
    }

    updateFormField(field: keyof EmployeeFormData, value: string): void {
        this.formData.update(data => ({ ...data, [field]: value }));
    }

    trackByEmployeeId(index: number, employee: Employee): number {
        return employee.id;
    }
}
