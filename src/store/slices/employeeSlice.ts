import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api/apiClient";
import { Employee, EmployeeFilters, EmployeeCategory } from "@/types/employee";

interface EmployeeState {
    employees: Employee[];
    categories: EmployeeCategory[];
    selectedEmployee: Employee | null;
    total: number;
    currentPage: number;
    limit: number;
    loading: boolean;
    error: string | null;
}

const initialState: EmployeeState = {
    employees: [],
    categories: [],
    selectedEmployee: null,
    total: 0,
    currentPage: 1,
    limit: 10,
    loading: false,
    error: null,
};

export const fetchWorkspaceEmployees = createAsyncThunk(
    "employee/fetchByWorkspace",
    async ({ workspaceId, filters }: { workspaceId: number; filters?: EmployeeFilters }) => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, value.toString());
                }
            });
        }
        const response = await apiClient.get(
            `/workspaces/${workspaceId}/employees${params.toString() ? `?${params}` : ''}`
        );
        return response.data;
    }
);

export const fetchEmployeeById = createAsyncThunk(
    "employee/fetchOne",
    async ({ workspaceId, employeeId }: { workspaceId: number; employeeId: number }) => {
        const response = await apiClient.get(`/workspaces/${workspaceId}/employees/${employeeId}`);
        return response.data;
    }
);

export const createEmployee = createAsyncThunk(
    "employee/create",
    async ({ workspaceId, data }: { 
        workspaceId: number; 
        data: { 
            name: string; 
            email: string; 
            employeeCategoryId: number; 
            departmentId: number;
            profileImage?: string;
        } 
    }) => {
        const response = await apiClient.post(`/workspaces/${workspaceId}/employees`, data);
        return response.data;
    }
);

export const updateEmployee = createAsyncThunk(
    "employee/update",
    async ({ workspaceId, employeeId, data }: { 
        workspaceId: number; 
        employeeId: number; 
        data: Partial<Employee>;
    }) => {
        const response = await apiClient.put(
            `/workspaces/${workspaceId}/employees/${employeeId}`, 
            data
        );
        return response.data;
    }
);

export const deleteEmployee = createAsyncThunk(
    "employee/delete",
    async ({ workspaceId, employeeId }: { workspaceId: number; employeeId: number }) => {
        await apiClient.delete(`/workspaces/${workspaceId}/employees/${employeeId}`);
        return employeeId;
    }
);

export const fetchEmployeeCategories = createAsyncThunk(
    "employee/fetchCategories",
    async (workspaceId: number) => {
        const response = await apiClient.get(
            `/workspaces/${workspaceId}/employees/employee-categories`
        );
        return response.data.categories;
    }
);

export const createEmployeeCategory = createAsyncThunk(
    "employee/createCategory",
    async ({ workspaceId, data }: { 
        workspaceId: number; 
        data: { 
            categoryName: string;
            parentCategoryId?: number;
        } 
    }) => {
        const response = await apiClient.post(
            `/workspaces/${workspaceId}/employees/employee-categories`,
            data
        );
        return response.data.category;
    }
);

export const updateEmployeeCategory = createAsyncThunk(
    "employee/updateCategory",
    async ({ workspaceId, categoryId, data }: { 
        workspaceId: number;
        categoryId: number;
        data: {
            categoryName?: string;
            parentCategoryId?: number;
        }
    }) => {
        const response = await apiClient.put(
            `/workspaces/${workspaceId}/employees/employee-categories/${categoryId}`,
            data
        );
        return response.data.category;
    }
);

export const deleteEmployeeCategory = createAsyncThunk(
    "employee/deleteCategory",
    async ({ workspaceId, categoryId }: { 
        workspaceId: number;
        categoryId: number;
    }) => {
        await apiClient.delete(
            `/workspaces/${workspaceId}/employees/employee-categories/${categoryId}`
        );
        return categoryId;
    }
);

const employeeSlice = createSlice({
    name: "employee",
    initialState,
    reducers: {
        clearSelectedEmployee: (state) => {
            state.selectedEmployee = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch employees
            .addCase(fetchWorkspaceEmployees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWorkspaceEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.employees = action.payload.employees;
                state.total = action.payload.total;
                state.currentPage = action.payload.page;
                state.limit = action.payload.limit;
            })
            .addCase(fetchWorkspaceEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch employees";
            })
            // Fetch single employee
            .addCase(fetchEmployeeById.fulfilled, (state, action) => {
                state.selectedEmployee = action.payload;
                const index = state.employees.findIndex(
                    emp => emp.employeeid === action.payload.employeeid
                );
                if (index !== -1) {
                    state.employees[index] = action.payload;
                }
            })
            // Create employee
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.employees.push(action.payload);
            })
            // Update employee
            .addCase(updateEmployee.fulfilled, (state, action) => {
                const index = state.employees.findIndex(
                    emp => emp.employeeid === action.payload.employeeid
                );
                if (index !== -1) {
                    state.employees[index] = action.payload;
                }
                if (state.selectedEmployee?.employeeid === action.payload.employeeid) {
                    state.selectedEmployee = action.payload;
                }
            })
            // Delete employee
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.employees = state.employees.filter(
                    emp => emp.employeeid !== action.payload
                );
                if (state.selectedEmployee?.employeeid === action.payload) {
                    state.selectedEmployee = null;
                }
            })
            // Fetch categories
            .addCase(fetchEmployeeCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            })
            // Create category
            .addCase(createEmployeeCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload);
            })
            // Update category
            .addCase(updateEmployeeCategory.fulfilled, (state, action) => {
                const index = state.categories.findIndex(
                    cat => cat.categoryid === action.payload.categoryid
                );
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            // Delete category
            .addCase(deleteEmployeeCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(
                    cat => cat.categoryid !== action.payload
                );
            });
    },
});

export const { clearSelectedEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
