import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api/apiClient";

export interface ProjectCosts {
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

export interface AssignedStaff {
    employeeId: number;
    name: string;
    rateType: string;
    rateValue: number;
    breakHours: number;
}

export interface ConnectedPersonnel {
    personnelId: number;
    name: string;
    email: string | null;
    status: string;
    company: {
        companyId: number;
        name: string;
        logo: string;
    };
    lead: {
        leadId: number;
        status: string;
        contractValue: number;
    };
}

export interface Project {
    projectId: number;
    projectid: number; // API returns lowercase
    name: string;
    startDate: string;
    startdate: string; // API returns lowercase
    endDate: string;
    enddate: string; // API returns lowercase
    managerId: number;
    managerid: number; // API returns lowercase
    workspaceId: number;
    workspaceid: number; // API returns lowercase
    companyId: number;
    companyid: number; // API returns lowercase
    status: string;
    city?: string;
    product?: string;
    costs: ProjectCosts;
    manager: {
        userId: number;
        name: string;
    };
    company: {
        companyId: number;
        name: string;
        logo?: string;
    };
    assignedStaff: AssignedStaff[];
    connectedPersonnel: ConnectedPersonnel[];
    financials: {
        totalLabourCost: number;
        totalTransportFee: number;
    };
}

export interface ProjectLead {
    project_lead_id: number;
    projectid: number;
    leadid: number;
}

export interface ProjectFilters {
    managerId?: number;
    startDate?: string;
    endDate?: string;
    status?: string;
    employeeId?: number;
    companyId?: number;
    search?: string;
    page?: number;
    limit?: number;
}

export interface CreateProjectRequest {
    name: string;
    startDate: string;
    endDate: string;
    managerid: number;
    companyid: number;
    workspaceid: number;
    status: string;
    city?: string;
    product?: string;
    assignedStaff: {
        employeeId: number;
        rateType: string;
        breakHours: number;
    }[];
    connectedPersonnel: {
        personnelId: number;
    }[];
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
}

export interface AssignStaffRequest {
    staff: {
        employeeId: number;
        rateType: string;
        breakHours: number;
    }[];
}

export interface CreateProjectLeadRequest {
    project_id: number;
    lead_id: number;
}

interface ProjectState {
    projects: Project[];
    currentProject: Project | null;
    projectLeads: ProjectLead[];
    loading: boolean;
    error: string | null;
    total: number;
    page: number;
    limit: number;
}

const initialState: ProjectState = {
    projects: [],
    currentProject: null,
    projectLeads: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    limit: 10
};

export const fetchProjects = createAsyncThunk(
    "project/fetchAll",
    async ({ workspaceId, filters }: { workspaceId: number; filters?: ProjectFilters }) => {
        const queryParams = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryParams.append(key.toLowerCase(), value.toString());
            });
        }
        const response = await apiClient.get(`/workspaces/${workspaceId}/projects/?${queryParams}`);
        return response.data;
    }
);

export const fetchProjectById = createAsyncThunk(
    "project/fetchOne",
    async ({ workspaceId, projectId }: { workspaceId: number; projectId: number }) => {
        const response = await apiClient.get(`/workspaces/${workspaceId}/projects/${projectId}`);
        return response.data.project;
    }
);

export const createProject = createAsyncThunk(
    "project/create",
    async ({ workspaceId, data }: { workspaceId: number; data: CreateProjectRequest }) => {
        const response = await apiClient.post(`/workspaces/${workspaceId}/projects`, data);
        return response.data;
    }
);

export const updateProject = createAsyncThunk(
    "project/update",
    async ({ workspaceId, projectId, data }: { 
        workspaceId: number; 
        projectId: number; 
        data: Partial<CreateProjectRequest> 
    }) => {
        const response = await apiClient.post(`/workspaces/${workspaceId}/projects/${projectId}`, data);
        return response.data;
    }
);

export const deleteProject = createAsyncThunk(
    "project/delete",
    async ({ workspaceId, projectId }: { workspaceId: number; projectId: number }) => {
        await apiClient.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
        return projectId;
    }
);

export const assignStaff = createAsyncThunk(
    "project/assignStaff",
    async ({ workspaceId, projectId, data }: { workspaceId: number; projectId: number; data: AssignStaffRequest }) => {
        const response = await apiClient.post(`/workspaces/${workspaceId}/projects/${projectId}/staff`, data);
        return response.data;
    }
);

export const removeStaff = createAsyncThunk(
    "project/removeStaff",
    async ({ workspaceId, projectId, employeeIds }: { workspaceId: number; projectId: number; employeeIds: number[] }) => {
        await apiClient.delete(`/workspaces/${workspaceId}/projects/${projectId}/staff?employeeIds=${employeeIds.join(',')}`);
        return { projectId, employeeIds };
    }
);

export const fetchProjectLeads = createAsyncThunk(
    "project/fetchLeads",
    async (workspaceId: number) => {
        const response = await apiClient.get(`/workspaces/${workspaceId}/projects/project-leads`);
        return response.data;
    }
);

export const createProjectLead = createAsyncThunk(
    "project/createLead",
    async ({ workspaceId, data }: { workspaceId: number; data: CreateProjectLeadRequest }) => {
        const response = await apiClient.post(`/workspaces/${workspaceId}/projects/project-leads`, data);
        return response.data;
    }
);

export const deleteProjectLead = createAsyncThunk(
    "project/deleteLead",
    async ({ workspaceId, projectId, leadId }: { workspaceId: number; projectId: number; leadId: number }) => {
        await apiClient.delete(`/workspaces/${workspaceId}/projects/project-leads/${projectId}/${leadId}`);
        return { projectId, leadId };
    }
);

const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        clearCurrentProject: (state) => {
            state.currentProject = null;
        },
    },
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
                state.page = action.payload.page;
                state.limit = action.payload.limit;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch projects";
            })
            // Fetch Single Project
            .addCase(fetchProjectById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProject = action.payload;
            })
            .addCase(fetchProjectById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch project";
            })
            // Create Project
            .addCase(createProject.fulfilled, (state, action) => {
                state.projects.push(action.payload);
            })
            // Update Project
            .addCase(updateProject.fulfilled, (state, action) => {
                const index = state.projects.findIndex(p => p.projectid === action.payload.projectid);
                if (index !== -1) {
                    state.projects[index] = action.payload;
                }
                if (state.currentProject?.projectid === action.payload.projectid) {
                    state.currentProject = action.payload;
                }
            })
            // Delete Project
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.projects = state.projects.filter(p => p.projectid !== action.payload);
                if (state.currentProject?.projectid === action.payload) {
                    state.currentProject = null;
                }
            })
            // Project Leads
            .addCase(fetchProjectLeads.fulfilled, (state, action) => {
                state.projectLeads = action.payload;
            });
    },
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
