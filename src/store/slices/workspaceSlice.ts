import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api/apiClient";

export interface Workspace {
    workspaceId: number;
    name: string;
    logo: string;
    createdBy: number;
    users?: any[];
}

interface WorkspaceState {
    workspaces: Workspace[];
    selectedWorkspace: Workspace | null;
    loading: boolean;
    error: string | null;
}

const initialState: WorkspaceState = {
    workspaces: [],
    selectedWorkspace: null,
    loading: false,
    error: null,
};

export const fetchWorkspaces = createAsyncThunk("workspace/fetchAll", async (_, { rejectWithValue }) => {
    try {
        const response = await apiClient.get("/workspaces");
        return response.data.workspaces;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "An error occurred");
    }
});

export const fetchWorkspaceById = createAsyncThunk("workspace/fetchById", async (workspaceId: number, { rejectWithValue }) => {
    try {
        const response = await apiClient.get(`/workspaces/${workspaceId}`);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "An error occurred");
    }
});

export const updateWorkspace = createAsyncThunk("workspace/update", async ({ workspaceId, data }: { workspaceId: number; data: Partial<Workspace> }, { rejectWithValue }) => {
    try {
        const response = await apiClient.put(`/workspaces/${workspaceId}`, data);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "An error occurred");
    }
});

const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWorkspaces.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWorkspaces.fulfilled, (state, action) => {
                state.loading = false;
                state.workspaces = action.payload;
            })
            .addCase(fetchWorkspaces.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchWorkspaceById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWorkspaceById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedWorkspace = action.payload;
            })
            .addCase(fetchWorkspaceById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateWorkspace.fulfilled, (state, action) => {
                state.selectedWorkspace = action.payload;
            });
    },
});

export default workspaceSlice.reducer;