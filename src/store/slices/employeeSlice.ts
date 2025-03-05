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
            `/v1/workspaces/${workspaceId}/employees${params.toString() ? `?${params}` : ''}`
        );
        return response.data;
    }
);

export const fetchEmployeeById = createAsyncThunk(
    "employee/fetchOne",
    async ({ workspaceId, employeeId }: { workspaceId: number; employeeId: number }) => {
        const response = await apiClient.get(`/v1/workspaces/${workspaceId}/employees/${employeeId}`);
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
        const response = await apiClient.post(`/v1/workspaces/${workspaceId}/employees`, data);
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
            `/v1/workspaces/${workspaceId}/employees/${employeeId}`, 
            data
        );
        return response.data;
    }
);

export const deleteEmployee = createAsyncThunk(
    "employee/delete",
    async ({ workspaceId, employeeId }: { workspaceId: number; employeeId: number }) => {
        await apiClient.delete(`/v1/workspaces/${workspaceId}/employees/${employeeId}`);
        return employeeId;
    }
);

export const fetchEmployeeCategories = createAsyncThunk(
    "employee/fetchCategories",
    async (workspaceId: number) => {
        const response = await apiClient.get(
            `/v1/workspaces/${workspaceId}/employees/employee-categories`
        );
        return response.data.categories;
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
            });
    },
});

export const { clearSelectedEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
