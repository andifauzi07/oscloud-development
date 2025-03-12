import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api/apiClient";
import { UpdateProjectRequest,  ProjectsResponse, ProjectResponse } from "@/types/project";

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
    profileImage: string;
    rateType: string;
    rateValue: number;
    breakHours: number;
    availability: string;
    totalEarnings: number;
    averagePerformance: number | null;
    currentProjects: number;
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
    projectid: number;
    name: string;
    startdate: string;
    enddate: string;
    workspaceid: number;
    companyid: number;
    status: string | null;
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
    managerid: string;
    description: string | null;
    requiredstaffnumber: number;
    manager: {
        userId: string;
        name: string;
    };
    company: {
        companyId: number;
        name: string;
        logo: string;
    };
    assignedStaff: AssignedStaff[];
    personnel: any[];
    requiredStaffNumber: number;
    currentStaffCount: number;
    financials: {
        totalLabourCost: number;
        totalTransportFee: number;
    };
    categoryid: number;
    category: {
        categoryId: number;
        name: string;
        parentCategoryId: number | null;
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

export interface ProjectCategory {
    categoryid: number;
    categoryname: string;
    workspaceid: number;
    parentcategoryid: number | null;
    created_at: string;
    subCategories: ProjectCategory[];
}

export interface CreateCategoryRequest {
    categoryName: string;
    parentCategoryId?: number | null;
}

export interface UpdateCategoryRequest {
    categoryName?: string;
    parentCategoryId?: number | null;
}

interface ProjectState {
    projects: Project[];
    currentProject: Project | null;
    projectLeads: any[]; // Define proper type if available
    loading: boolean;
    error: string | null;
    total: number;
    currentPage: number;
    limit: number;
}

const initialState: ProjectState = {
    projects: [],
    currentProject: null,
    projectLeads: [],
    loading: false,
    error: null,
    total: 0,
    currentPage: 1,
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
        const response = await apiClient.get<ProjectsResponse>(`/workspaces/${workspaceId}/projects/?${queryParams}`);
        return response.data;
    }
);

export const fetchProjectById = createAsyncThunk(
    "project/fetchOne",
    async ({ workspaceId, projectId }: { workspaceId: number; projectId: number }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/workspaces/${workspaceId}/projects/${projectId}`);
            const projectData = response.data.project;

            // Return the data exactly as it comes from the API
            return {
                projectid: projectData.projectid,
                name: projectData.name,
                startdate: projectData.startdate,
                enddate: projectData.enddate,
                workspaceid: projectData.workspaceid,
                companyid: projectData.companyid,
                status: projectData.status,
                costs: projectData.costs,
                managerid: projectData.managerid,
                description: projectData.description,
                requiredstaffnumber: projectData.requiredstaffnumber,
                manager: {
                    userId: projectData.manager.userId,
                    name: projectData.manager.name
                },
                company: {
                    companyId: projectData.company.companyId,
                    name: projectData.company.name,
                    logo: projectData.company.logo
                },
                assignedStaff: projectData.assignedStaff.map((staff: AssignedStaff) => ({
                    employeeId: staff.employeeId,
                    name: staff.name,
                    profileImage: staff.profileImage,
                    rateType: staff.rateType,
                    rateValue: staff.rateValue,
                    breakHours: staff.breakHours,
                    availability: staff.availability,
                    totalEarnings: staff.totalEarnings,
                    averagePerformance: staff.averagePerformance,
                    currentProjects: staff.currentProjects
                })),
                personnel: projectData.personnel,
                requiredStaffNumber: projectData.requiredStaffNumber,
                currentStaffCount: projectData.currentStaffCount,
                financials: {
                    totalLabourCost: projectData.financials.totalLabourCost,
                    totalTransportFee: projectData.financials.totalTransportFee
                }
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to fetch project');
        }
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
        data: Partial<UpdateProjectRequest> 
    }) => {
        const response = await apiClient.put(`/workspaces/${workspaceId}/projects/${projectId}`, data);
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

export const fetchProjectCategories = createAsyncThunk(
    "project/fetchCategories",
    async (workspaceId: number, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/workspaces/${workspaceId}/projects/categories`);
            return response.data.categories;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to fetch categories");
        }
    }
);

export const createProjectCategory = createAsyncThunk(
    "project/createCategory",
    async ({ workspaceId, data }: { workspaceId: number; data: CreateCategoryRequest }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(`/workspaces/${workspaceId}/projects/categories`, data);
            return response.data.category;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to create category");
        }
    }
);

export const updateProjectCategory = createAsyncThunk(
    "project/updateCategory",
    async ({ 
        workspaceId, 
        categoryId, 
        data 
    }: { 
        workspaceId: number; 
        categoryId: number; 
        data: UpdateCategoryRequest 
    }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/workspaces/${workspaceId}/projects/categories/${categoryId}`, 
                data
            );
            return response.data.category;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to update category");
        }
    }
);

export const deleteProjectCategory = createAsyncThunk(
    "project/deleteCategory",
    async ({ workspaceId, categoryId }: { workspaceId: number; categoryId: number }, { rejectWithValue }) => {
        try {
            await apiClient.delete(`/workspaces/${workspaceId}/projects/categories/${categoryId}`);
            return categoryId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to delete category");
        }
    }
);

const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        clearCurrentProject: (state) => {
            state.currentProject = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload.projects;
                state.total = action.payload.total;
                state.currentPage = action.payload.page;
                state.limit = action.payload.limit;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            })
            .addCase(fetchProjectById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProject = action.payload;
                state.error = null;
            })
            .addCase(fetchProjectById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to fetch project';
            });

    },
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
