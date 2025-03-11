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

export const fetchWorkspaces = createAsyncThunk("workspace/fetchAll", 
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get("/workspaces");
            return response.data.workspaces;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

export const fetchWorkspaceById = createAsyncThunk(
    "workspace/fetchById", 
    async (workspaceId: number, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/workspaces/${workspaceId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

export const createWorkspace = createAsyncThunk(
    "workspace/create",
    async (workspaceData: Partial<Workspace>, { rejectWithValue }) => {
        try {
            const response = await apiClient.post("/workspaces", workspaceData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

export const updateWorkspace = createAsyncThunk(
    "workspace/update", 
    async ({ workspaceId, data }: { workspaceId: number; data: Partial<Workspace> }, 
    { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`/workspaces/${workspaceId}`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

export const deleteWorkspace = createAsyncThunk(
    "workspace/delete",
    async (workspaceId: number, { rejectWithValue }) => {
        try {
            await apiClient.delete(`/workspaces/${workspaceId}`);
            return workspaceId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        clearSelectedWorkspace: (state) => {
            state.selectedWorkspace = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Workspaces
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
            // Fetch Workspace by ID
            .addCase(fetchWorkspaceById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWorkspaceById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedWorkspace = action.payload;
            })
            .addCase(fetchWorkspaceById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create Workspace
            .addCase(createWorkspace.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createWorkspace.fulfilled, (state, action) => {
                state.loading = false;
                state.workspaces.push(action.payload);
            })
            .addCase(createWorkspace.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Workspace
            .addCase(updateWorkspace.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateWorkspace.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedWorkspace = action.payload;
                const index = state.workspaces.findIndex(w => w.workspaceId === action.payload.workspaceId);
                if (index !== -1) {
                    state.workspaces[index] = action.payload;
                }
            })
            .addCase(updateWorkspace.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete Workspace
            .addCase(deleteWorkspace.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteWorkspace.fulfilled, (state, action) => {
                state.loading = false;
                state.workspaces = state.workspaces.filter(w => w.workspaceId !== action.payload);
                if (state.selectedWorkspace?.workspaceId === action.payload) {
                    state.selectedWorkspace = null;
                }
            })
            .addCase(deleteWorkspace.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearSelectedWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;
