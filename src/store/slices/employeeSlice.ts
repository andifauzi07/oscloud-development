import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api/apiClient";

interface EmployeeCategory {
    categoryId: number;
    name: string;
    parentCategoryId: number | null;
    subCategories?: EmployeeCategory[];
}

interface Department {
    id: number;
    name: string;
}

interface Employee {
    employeeid: number;
    name: string;
    email: string;
    profileimage: string;
    employeecategoryid: number;
    departmentid: number;
    workspaceid: number;
    employeeCategory: {
        categoryid: number;
        categoryname: string;
        parentcategoryid: number;
    };
    department: {
        departmentid: number;
        departmentname: string;
        parentdepartmentid: number | null;
        workspaceid: number;
    };
}

interface EmployeeFilters {
    department?: number;
    category?: number;
    search?: string;
    page?: number;
    limit?: number;
    workspaceid?: number;
}

interface EmployeeResponse {
    employees: Employee[];
    total: number;
    page: number;
    limit: number;
}

interface EmployeeState {
    employees: Employee[];
    categories: EmployeeCategory[];
    total: number;
    currentPage: number;
    limit: number;
    loading: boolean;
    error: string | null;
}

const initialState: EmployeeState = {
    employees: [],
    categories: [],
    total: 0,
    currentPage: 1,
    limit: 10,
    loading: false,
    error: null,
};

export const fetchWorkspaceEmployees = createAsyncThunk(
    "employee/fetchByWorkspace",
    async ({ workspaceId, filters }: { workspaceId: number; filters?: EmployeeFilters }, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams();
            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined) {
                        queryParams.append(key, value.toString());
                    }
                });
            }
            
            const url = `/workspaces/${workspaceId}/employees${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            const response = await apiClient.get(url);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to fetch employees");
        }
    }
);

interface CreateEmployeeData {
    name: string;
    email: string;
    profileImage: string;
    employeeCategoryId: number;
    departmentId: number;
}

export const createEmployee = createAsyncThunk(
    "employee/create",
    async ({ workspaceId, data }: { workspaceId: number; data: CreateEmployeeData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(`/workspaces/${workspaceId}/employees`, data);
            return response.data as Employee;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to create employee");
        }
    }
);

interface UpdateEmployeeData {
    name?: string;
    email?: string;
    profileImage?: string;
    employeeCategoryId?: number;
    departmentId?: number;
}

export const updateEmployee = createAsyncThunk(
    "employee/update",
    async ({ workspaceId, employeeId, data }: { 
        workspaceId: number; 
        employeeId: number; 
        data: UpdateEmployeeData 
    }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`/workspaces/${workspaceId}/employees/${employeeId}`, data);
            return response.data as Employee;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to update employee");
        }
    }
);

// Fetch employee categories
// export const fetchEmployeeCategories = createAsyncThunk(
//     "employee/fetchCategories",
//     async (workspaceId: number, { rejectWithValue }) => {
//         try {
//             const response = await apiClient.get(`/workspaces/${workspaceId}/employee-categories`);
//             return response.data.categories;
//         } catch (error: any) {
//             return rejectWithValue(error.response?.data || "Failed to fetch categories");
//         }
//     }
// );

const employeeSlice = createSlice({
    name: "employee",
    initialState,
    reducers: {},
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
                state.error = action.payload as string;
            })
            // Create employee
            .addCase(createEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.employees.push(action.payload);
                state.total += 1;
            })
            .addCase(createEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update employee
            .addCase(updateEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.employees.findIndex(emp => emp.employeeid === action.payload.employeeid);
                if (index !== -1) {
                    state.employees[index] = action.payload;
                }
            })
            .addCase(updateEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // // Fetch employee categories
            // .addCase(fetchEmployeeCategories.pending, (state) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            // .addCase(fetchEmployeeCategories.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.categories = action.payload;
            // })
            // .addCase(fetchEmployeeCategories.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.payload as string;
            // });
    },
});

export default employeeSlice.reducer;
