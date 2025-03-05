// src/store/slices/projectSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api/apiClient";

export interface Project {
    projectId: number;
    name: string;
    startDate: string;
    endDate: string;
    managerId: number;
    workspaceId: number;
    companyId: number;
    status: string | null;
    city?: string;
    product?: string;
    costs: {
        food: number;
        break: number;
        rental: number;
        revenue: number;
        other_cost: number;
        labour_cost: number;
        manager_fee: number;
        costume_cost: number;
        sales_profit: number;
        transport_cost: number;
    };
    manager: {
        userId: number;
        name: string;
    };
    company: {
        companyId: number;
        name: string;
        logo?: string;
    };
    assignedStaff: {
        employeeId: number;
        name: string;
        rateType: string;
        rateValue: number;
        breakHours: number;
    }[];
    financials: {
        totalLabourCost: number;
        totalTransportFee: number;
    };
}

interface ProjectState {
    projects: Project[];
    loading: boolean;
    error: string | null;
    total: number;
    currentPage: number;
    perPage: number;
}

export interface ProjectFilters {
    managerId?: number;
    startDate?: string;
    endDate?: string;
    status?: string;
    employeeId?: number;
    companyId?: number;
    search?: string;
}

// Update API response types
interface ProjectsResponse {
    projects: Project[];
    total: number;
    page: number;
    limit: number;
}

interface SingleProjectResponse {
    project: Project;
}

export const fetchProjects = createAsyncThunk<
    ProjectsResponse,
    {
        workspaceId: number;
        filters?: ProjectFilters;
        page?: number;
        pageSize?: number;
    }
>("project/fetchAll", async ({ workspaceId, filters, page = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
        const response = await apiClient.get<ProjectsResponse>(`/v1/workspaces/${workspaceId}/projects/`, {
            params: {
                workspaceid: workspaceId,
                ...filters,
                page,
                limit: pageSize
            }
        });
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch projects");
    }
});

export const fetchProjectById = createAsyncThunk(
    "project/fetchById",
    async ({ workspaceId, projectId }: { workspaceId: number; projectId: number }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/workspaces/${workspaceId}/projects/${projectId}`);
            return response.data.project;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch project");
        }
    }
);

interface CreateProjectData {
    name: string;
    startDate: string;
    endDate: string;
    managerId: number;
    companyId: number;
    status: string;
    city: string;
    product: string;
}

export const createProject = createAsyncThunk(
    "project/create",
    async ({ workspaceId, data }: { workspaceId: number; data: CreateProjectData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(`/workspaces/${workspaceId}/projects`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to create project");
        }
    }
);

export const updateProject = createAsyncThunk(
    "project/update",
    async ({ workspaceId, projectId, data }: { 
        workspaceId: number; 
        projectId: number; 
        data: Partial<CreateProjectData>;
    }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(`/workspaces/${workspaceId}/projects/${projectId}`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update project");
        }
    }
);

interface AssignStaffData {
    staff: Array<{
        employeeId: number;
        rateType: string;
        breakHours: number;
    }>;
}

export const assignStaffToProject = createAsyncThunk(
    "project/assignStaff",
    async ({ workspaceId, projectId, data }: {
        workspaceId: number;
        projectId: number;
        data: AssignStaffData;
    }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                `/workspaces/${workspaceId}/projects/${projectId}/staff`,
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to assign staff");
        }
    }
);

export const removeStaffFromProject = createAsyncThunk(
    "project/removeStaff",
    async ({ workspaceId, projectId, employeeIds }: {
        workspaceId: number;
        projectId: number;
        employeeIds: number[];
    }, { rejectWithValue }) => {
        try {
            await apiClient.delete(`/workspaces/${workspaceId}/projects/${projectId}/staff`, {
                params: { employeeIds }
            });
            return { projectId, employeeIds };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to remove staff");
        }
    }
);

export const deleteProject = createAsyncThunk(
    "project/delete",
    async ({ workspaceId, projectId }: { workspaceId: number; projectId: number }, { rejectWithValue }) => {
        try {
            await apiClient.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
            return { projectId };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete project");
        }
    }
);

const projectSlice = createSlice({
    name: "project",
    initialState: {
        projects: [],
        loading: false,
        error: null,
        total: 0,
        currentPage: 1,
        perPage: 10
    } as ProjectState,
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
                state.total = action.payload.total;
                state.currentPage = action.payload.page;
                state.perPage = action.payload.limit;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch Project By Id
            .addCase(fetchProjectById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectById.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.projects.findIndex(p => p.projectId === action.payload.projectId);
                if (index !== -1) {
                    state.projects[index] = action.payload;
                } else {
                    state.projects.push(action.payload);
                }
            })
            .addCase(fetchProjectById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create Project
            .addCase(createProject.fulfilled, (state, action) => {
                state.projects.push(action.payload);
            })
            // Update Project
            .addCase(updateProject.fulfilled, (state, action) => {
                const index = state.projects.findIndex(p => p.projectId === action.payload.projectId);
                if (index !== -1) {
                    state.projects[index] = { ...state.projects[index], ...action.payload };
                }
            })
            // Assign Staff
            .addCase(assignStaffToProject.fulfilled, (state, action) => {
                const index = state.projects.findIndex(p => p.projectId === action.payload.projectId);
                if (index !== -1) {
                    state.projects[index] = action.payload;
                }
            })
            // Remove Staff
            .addCase(removeStaffFromProject.fulfilled, (state, action) => {
                const project = state.projects.find(p => p.projectId === action.payload.projectId);
                if (project) {
                    project.assignedStaff = project.assignedStaff.filter(
                        staff => !action.payload.employeeIds.includes(staff.employeeId)
                    );
                }
            })
            // Delete Project
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.projects = state.projects.filter(p => p.projectId !== action.payload.projectId);
            });
    },
});

export default projectSlice.reducer;
