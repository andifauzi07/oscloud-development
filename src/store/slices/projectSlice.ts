import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api/apiClient";

// Types
interface AssignedStaff {
    employeeId: number;
    name: string;
    rateType: string;
    rateValue: number;
    breakHours: number;
}

interface ProjectManager {
    userId: number;
    name: string;
}

interface ProjectFinancials {
    totalLabourCost: number;
    totalTransportFee: number;
}

export interface Project {
    projectId: number;
    name: string;
    startDate: string;
    endDate: string;
    manager: ProjectManager;
    assignedStaff: AssignedStaff[];
    financials: ProjectFinancials;
}

interface ProjectState {
    projects: Project[];
    loading: boolean;
    error: string | null;
}

// Initial state
const initialState: ProjectState = {
    projects: [],
    loading: false,
    error: null,
};

// Thunks
export const fetchProjects = createAsyncThunk(
    "project/fetchAll",
    async ({ 
        workspaceId,
        filters 
    }: { 
        workspaceId: number;
        filters?: {
            managerId?: number;
            startDate?: string;
            endDate?: string;
            status?: string;
            view?: 'list' | 'timeline';
        };
    }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/workspaces/${workspaceId}/projects`, {
                params: filters
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to fetch projects");
        }
    }
);

export const createProject = createAsyncThunk(
    "project/create",
    async ({ 
        workspaceId, 
        data 
    }: { 
        workspaceId: number;
        data: {
            name: string;
            startDate: string;
            endDate: string;
            managerId: number;
            assignedStaff: {
                employeeId: number;
                rateType: string;
                breakHours: number;
            }[];
        };
    }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                `/workspaces/${workspaceId}/projects`,
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to create project");
        }
    }
);

export const assignStaffToProject = createAsyncThunk(
    "project/assignStaff",
    async ({ 
        workspaceId, 
        projectId, 
        data 
    }: { 
        workspaceId: number;
        projectId: number;
        data: {
            employeeId: number;
            rateType: string;
            breakHours: number;
        };
    }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                `/workspaces/${workspaceId}/projects/${projectId}/staff`,
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to assign staff");
        }
    }
);

export const removeStaffFromProject = createAsyncThunk(
    "project/removeStaff",
    async ({ 
        workspaceId, 
        projectId, 
        employeeId 
    }: { 
        workspaceId: number;
        projectId: number;
        employeeId: number;
    }, { rejectWithValue }) => {
        try {
            await apiClient.delete(
                `/workspaces/${workspaceId}/projects/${projectId}/staff/${employeeId}`
            );
            return { projectId, employeeId };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to remove staff");
        }
    }
);

const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Projects
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload.projects;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create Project
            .addCase(createProject.fulfilled, (state, action) => {
                state.projects.push(action.payload);
            })
            // Assign Staff
            .addCase(assignStaffToProject.fulfilled, (state, action) => {
                const project = state.projects.find(p => p.projectId === action.payload.projectId);
                if (project) {
                    project.assignedStaff = action.payload.assignedStaff;
                }
            })
            // Remove Staff
            .addCase(removeStaffFromProject.fulfilled, (state, action) => {
                const project = state.projects.find(p => p.projectId === action.payload.projectId);
                if (project) {
                    project.assignedStaff = project.assignedStaff.filter(
                        staff => staff.employeeId !== action.payload.employeeId
                    );
                }
            });
    },
});

export default projectSlice.reducer;