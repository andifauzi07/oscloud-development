import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api/apiClient";

interface Employee {
    employeeId: number;
    name: string;
    email: string;
    profileImage: string;
}

interface EmployeeState {
    employees: Employee[];
    loading: boolean;
    error: string | null;
}

const initialState: EmployeeState = {
    employees: [],
    loading: false,
    error: null,
};

export const fetchEmployees = createAsyncThunk(
    "employee/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get("/workspaces/1/employees");
            return response.data.employees;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

export const fetchWorkspaceEmployees = createAsyncThunk(
    "employee/fetchByWorkspace",
    async (workspaceId: string | number, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/workspaces/${workspaceId}/employees`
            );
            return response.data.employees;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

const employeeSlice = createSlice({
    name: "employee",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.employees = action.payload;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchWorkspaceEmployees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWorkspaceEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.employees = action.payload;
            })
            .addCase(fetchWorkspaceEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default employeeSlice.reducer;
