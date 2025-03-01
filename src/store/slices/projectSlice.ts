// src/store/slices/projectSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api/apiClient";

export interface Manager {
    userId: number | null;
    name: string;
}

export interface Company {
    companyId: number | null;
    name: string;
    logo?: string | null;
}

export interface AssignedStaff {
    employeeId: number;
    name: string;
    rateType: string;
    rateValue: number;
    breakHours: number;
}
export interface Financials {
    totalLabourCost: number;
    totalTransportFee: number;
}

export interface Costs {
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
}

export interface Project {
    projectId: number;
    name: string;
    startDate: string;
    endDate: string;
    status: string;
    manager: Manager;
    company: Company;
    assignedStaff: AssignedStaff[];
    financials: Financials;
    city?: string;
    product?: string;
    costs?: Costs;
}

interface ProjectState {
    projects: Project[];
    loading: boolean;
    error: string | null;
    total: number;
    currentPage: number;
    perPage: number;
}

// Initial state
const initialState: ProjectState = {
    projects: [],
    loading: false,
    error: null,
    total: 0,
    currentPage: 1,
    perPage: 50
};

// Thunks
export const fetchProjects = createAsyncThunk(
    "project/fetchAll",
    async (
        {
            workspaceid,
            filters,
            page,
            page_size
        }: {
            workspaceid: number;
            filters?: {
                managerId?: number;
                startDate?: string;
                endDate?: string;
                status?: string;
                view?: "list" | "timeline";
                employeeId?: number;
                projectid?: number;
                companyId?: number;
            };
            page?: number;
            page_size?: number;
        },
        { rejectWithValue }
    ) => {
        try {
            if (!workspaceid) {
                throw new Error("Workspace ID is required");
            }

            const response = await apiClient.get(
                `/workspaces/${workspaceid}/projects`,
                {
                    params: {
                        ...filters,
                        page,
                        page_size
                    },
                }
            );

            if (!response.data) {
                throw new Error("No data received from server");
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
    async (
        {
            workspaceid,
            projectId,
        }: {
            workspaceid: number;
            projectId: number;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.get(
                `/workspaces/${workspaceid}/projects/${projectId}`
            );
            return response.data.project;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to fetch project"
            );
        }
    }
);

export const createProject = createAsyncThunk(
    "project/create",
    async (
        {
            workspaceid,
            data,
        }: {
            workspaceid: number;
            data: {
                name: string;
                startDate: string;
                endDate: string;
                managerId: number;
                companyId: number;
                status: string;
                city: string;
                product: string;
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
                assignedStaff: {
                    employeeId: number;
                    rateType: string;
                    breakHours: number;
                    rateValue?: number;
                }[];
            };
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.post(
                `/workspaces/${workspaceid}/projects`,
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to create project"
            );
        }
    }
);

export const assignStaffToProject = createAsyncThunk(
    "project/assignStaff",
    async (
        {
            workspaceid,
            projectId,
            data,
        }: {
            workspaceid: number;
            projectId: number;
            data: {
                staff: {
                    employeeId: number;
                    rateType: string;
                    breakHours: number;
                }[];
            };
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.post(
                `/workspaces/${workspaceid}/projects/${projectId}/staff`,
                data
            );
            return response.data.project;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to assign staff"
            );
        }
    }
);

export const removeStaffFromProject = createAsyncThunk(
    "project/removeStaff",
    async (
        {
            workspaceid,
            projectId,
            employeeIds,
        }: {
            workspaceid: number;
            projectId: number;
            employeeIds: number[];
        },
        { rejectWithValue }
    ) => {
        try {
            await apiClient.delete(
                `/workspaces/${workspaceid}/projects/${projectId}/staff`,
                {
                    params: { employeeIds }
                }
            );
            return { projectId, employeeIds };
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to remove staff"
            );
        }
    }
);

export const deleteProject = createAsyncThunk(
    "project/delete",
    async (
        {
            workspaceid,
            projectId
        }: {
            workspaceid: number;
            projectId: number;
        },
        { rejectWithValue }
    ) => {
        try {
            await apiClient.delete(
                `/workspaces/${workspaceid}/projects/${projectId}`
            );
            return {projectId};
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to delete project"
            );
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
                state.total = action.payload.pagination.total;
                state.currentPage = action.payload.pagination.page;
                state.perPage = action.payload.pagination.page_size;
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
                const projectIndex = state.projects.findIndex(
                    (p) => p.projectId === action.payload.projectId
                );
                if (projectIndex !== -1) {
                    state.projects[projectIndex] = action.payload;
                }
            })
            // Remove Staff
            .addCase(removeStaffFromProject.fulfilled, (state, action) => {
                const project = state.projects.find(
                    (p) => p.projectId === action.payload.projectId
                );
                if (project) {
                    project.assignedStaff = project.assignedStaff.filter(
                        (staff) =>
                            !action.payload.employeeIds.includes(staff.employeeId)
                    );
                }
            })
             // Delete project
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.projects = state.projects.filter(
                    (p) => p.projectId !== action.payload.projectId
                );
            })
            // Fetch Project By Id
            .addCase(fetchProjectById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectById.fulfilled, (state, action) => {
                state.loading = false;
                const existingIndex = state.projects.findIndex(
                    (p) => p.projectId === action.payload.projectId
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
