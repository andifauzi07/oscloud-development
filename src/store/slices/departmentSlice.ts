import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api/apiClient";
import { Department, DepartmentCreateData, DepartmentUpdateData } from "@/types/departments";

interface DepartmentState {
    departments: Department[];
    currentDepartment: Department | null;
    loading: boolean;
    error: string | null;
}

// Fetch all departments
export const fetchDepartments = createAsyncThunk<
    { departments: Department[] },
    number
>("department/fetchAll", async (workspaceId, { rejectWithValue }) => {
    try {
        const response = await apiClient.get(`/workspaces/${workspaceId}/departments`);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch departments");
    }
});

// Fetch single department
export const fetchDepartmentById = createAsyncThunk<
    Department,
    { workspaceId: number; departmentId: number }
>("department/fetchById", async ({ workspaceId, departmentId }, { rejectWithValue }) => {
    try {
        const response = await apiClient.get(
            `/workspaces/${workspaceId}/departments/${departmentId}`
        );
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch department");
    }
});

// Create department
export const createDepartment = createAsyncThunk<
    Department,
    { workspaceId: number; data: DepartmentCreateData }
>("department/create", async ({ workspaceId, data }, { rejectWithValue }) => {
    try {
        const response = await apiClient.post(
            `/workspaces/${workspaceId}/departments`,
            data
        );
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to create department");
    }
});

// Update department
export const updateDepartment = createAsyncThunk<
    Department,
    { workspaceId: number; departmentId: number; data: DepartmentUpdateData }
>("department/update", async ({ workspaceId, departmentId, data }, { rejectWithValue }) => {
    try {
        const response = await apiClient.put(
            `/workspaces/${workspaceId}/departments/${departmentId}`,
            data
        );
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to update department");
    }
});

// Delete department
export const deleteDepartment = createAsyncThunk<
    number,
    { workspaceId: number; departmentId: number }
>("department/delete", async ({ workspaceId, departmentId }, { rejectWithValue }) => {
    try {
        await apiClient.delete(`/workspaces/${workspaceId}/departments/${departmentId}`);
        return departmentId;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete department");
    }
});

const departmentSlice = createSlice({
    name: "department",
    initialState: {
        departments: [],
        currentDepartment: null,
        loading: false,
        error: null,
    } as DepartmentState,
    reducers: {
        clearCurrentDepartment: (state) => {
            state.currentDepartment = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Departments
            .addCase(fetchDepartments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.loading = false;
                state.departments = action.payload.departments;
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch Single Department
            .addCase(fetchDepartmentById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDepartmentById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentDepartment = action.payload;
            })
            .addCase(fetchDepartmentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create Department
            .addCase(createDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDepartment.fulfilled, (state, action) => {
                state.loading = false;
                state.departments.push(action.payload);
            })
            .addCase(createDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Department
            .addCase(updateDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDepartment.fulfilled, (state, action) => {
                state.loading = false;
                if (state.currentDepartment?.departmentid === action.payload.departmentid) {
                    state.currentDepartment = action.payload;
                }
            })
            .addCase(updateDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete Department
            .addCase(deleteDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDepartment.fulfilled, (state, action) => {
                state.loading = false;
                state.departments = state.departments.filter(
                    (dept) => dept.departmentid !== action.payload
                );
                if (state.currentDepartment?.departmentid === action.payload) {
                    state.currentDepartment = null;
                }
            })
            .addCase(deleteDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCurrentDepartment } = departmentSlice.actions;
export default departmentSlice.reducer;
