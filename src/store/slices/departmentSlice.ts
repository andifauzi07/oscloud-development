import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api/apiClient";
import { DepartmentCreateData, DepartmentState, DepartmentUpdateData } from "@/types/departments";


const initialState: DepartmentState = {
    departments: [],
    currentDepartment: null,
    loading: false,
    error: null,
};

// Fetch all departments
export const fetchDepartments = createAsyncThunk(
    "department/fetchDepartments",
    async (workspaceId: number, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/workspaces/${workspaceId}/departments`
            );
            return response.data.departments;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to fetch departments"
            );
        }
    }
);

// Fetch department by ID
export const fetchDepartmentById = createAsyncThunk(
    "department/fetchDepartmentById",
    async (
        {
            workspaceId,
            departmentId,
        }: {
            workspaceId: number;
            departmentId: number;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.get(
                `/workspaces/${workspaceId}/departments/${departmentId}`
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to fetch department"
            );
        }
    }
);

// Create department
export const createDepartment = createAsyncThunk(
    "department/createDepartment",
    async (
        {
            workspaceId,
            data,
        }: {
            workspaceId: number;
            data: DepartmentCreateData;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.post(
                `/workspaces/${workspaceId}/departments`,
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to create department"
            );
        }
    }
);

// Update department
export const updateDepartment = createAsyncThunk(
    "department/updateDepartment",
    async (
        {
            workspaceId,
            departmentId,
            data,
        }: {
            workspaceId: number;
            departmentId: number;
            data: DepartmentUpdateData;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.put(
                `/workspaces/${workspaceId}/departments/${departmentId}`,
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to update department"
            );
        }
    }
);

const departmentSlice = createSlice({
    name: "department",
    initialState,
    reducers: {
        clearCurrentDepartment: (state) => {
            state.currentDepartment = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch departments
            .addCase(fetchDepartments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.loading = false;
                state.departments = action.payload;
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch department by ID
            .addCase(fetchDepartmentById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // .addCase(fetchDepartmentById.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.currentDepartment = action.payload;
            //     // Also update departments array if needed
            //     const index = state.departments.findIndex(
            //         (d: any) => d.departmentId === action.payload.departmentId
            //     );
            //     if (index !== -1) {
            //         state.departments[index] = action.payload;
            //     }
            // })
            .addCase(fetchDepartmentById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentDepartment = action.payload;
            })
            .addCase(fetchDepartmentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create department
            .addCase(createDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDepartment.fulfilled, (state, action) => {
                state.loading = false;
                state.currentDepartment = action.payload;
                // Don't add to departments array here because the tree structure might be complex
                // It's better to refetch the departments
            })
            .addCase(createDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update department
            .addCase(updateDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDepartment.fulfilled, (state, action) => {
                state.loading = false;
                state.currentDepartment = action.payload;
                // Don't update departments array here because the tree structure might be complex
                // It's better to refetch the departments
            })
            .addCase(updateDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCurrentDepartment } = departmentSlice.actions;

export default departmentSlice.reducer;
