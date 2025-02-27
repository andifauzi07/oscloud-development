import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api/apiClient";
import { ProjectState } from "@/types/performance";

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
        workspaceid,
        filters 
    }: { 
        workspaceid: number;  // Make workspaceid required
        filters?: {
            managerId?: number;
            startDate?: string;
            endDate?: string;
            // status?: string;
            view?: 'list' | 'timeline';
            employeeId?: number;
            projectid?: number;
            companyId?: number;
        };
    }, { rejectWithValue }) => {
        try {
            if (!workspaceid) {
                throw new Error('Workspace ID is required');
            }

            const response = await apiClient.get(`/workspaces/${workspaceid}/projects`, {
                params: {
                    // workspaceid, // Ensure workspaceid is sent as query parameter
                    ...filters,
                    // status: filters?.status || 'active'  // Default to active projects
                }
            });
            console.log(filters)
            console.log(response.data)
            
            if (!response.data) {
                throw new Error('No data received from server');
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                "Failed to fetch projects"
            );
        }
    }
);

export const fetchProjectById = createAsyncThunk(
    "project/fetchById",
    async ({ 
        workspaceid, 
        projectId 
    }: { 
        workspaceid: number;
        projectId: number;
    }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/workspaces/${workspaceid}/projects/${projectId}`
            );
            return response.data.project;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to fetch project");
        }
    }
);

export const createProject = createAsyncThunk(
    "project/create",
    async ({ 
        workspaceid, 
        data 
    }: { 
        workspaceid: number;
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
                `/workspaces/${workspaceid}/projects`,
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
        workspaceid, 
        projectId, 
        data 
    }: { 
        workspaceid: number;
        projectId: number;
        data: {
            employeeId: number;
            rateType: string;
            breakHours: number;
        };
    }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                `/workspaces/${workspaceid}/projects/${projectId}/staff`,
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
        workspaceid, 
        projectId, 
        employeeId 
    }: { 
        workspaceid: number;
        projectId: number;
        employeeId: number;
    }, { rejectWithValue }) => {
        try {
            await apiClient.delete(
                `/workspaces/${workspaceid}/projects/${projectId}/staff/${employeeId}`
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
            })
            // Fetch Project By Id
            .addCase(fetchProjectById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectById.fulfilled, (state, action) => {
                state.loading = false;
                const existingIndex = state.projects.findIndex(
                    p => p.projectId === action.payload.projectId
                );
                if (existingIndex >= 0) {
                    state.projects[existingIndex] = action.payload;
                } else {
                    state.projects.push(action.payload);
                }
            })
            .addCase(fetchProjectById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default projectSlice.reducer;