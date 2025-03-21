import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api/apiClient";
import { UpdateProjectRequest, ProjectsResponse, ProjectResponse } from "@/types/project";

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

export interface Rate {
  type: string;
  value: number;
}

export interface AssignedStaff {
  employeeId: number;
  name: string;
  profileImage: string;
  rateType: string;
  rateValue: number;
  rates: Rate[];
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
  costs: ProjectCosts;
  managerid: string;
  description: string | null;
  requiredstaffnumber: number;
  categoryid: number;
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
  category: {
    categoryId: number;
    name: string;
    parentCategoryId: null;
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
  categoryid: number; // Note: API uses lowercase
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
  categories: ProjectCategory[];
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
  categories: [],
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  limit: 10,
};

export const fetchProjects = createAsyncThunk(
  "project/fetchAll",
  async ({ workspaceId, filters }: { workspaceId: number; filters?: ProjectFilters }) => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key.toLowerCase(), value.toString());
        }
      });
    }
    const response = await apiClient.get<ProjectsResponse>(
      `/workspaces/${workspaceId}/projects${queryParams.toString() ? `?${queryParams}` : ""}`
    );
    return response.data;
  }
);

export const fetchProjectById = createAsyncThunk(
  "project/fetchOne",
  async ({ workspaceId, projectId }: { workspaceId: number; projectId: number }, { rejectWithValue, getState }) => {
    try {
      const response = await apiClient.get(`/workspaces/${workspaceId}/projects/${projectId}`);
      const projectData = response.data.project;

      // If we need category details, get it from the state
      if (projectData.categoryid) {
        try {
          // Get categories from state
          const state = getState() as any;
          const categories = state.project.categories;

          // Find the category in the main categories or their subcategories
          const findCategory = (cats: any[]): any => {
            for (const cat of cats) {
              if (cat.categoryid === projectData.categoryid) {
                return cat;
              }
              if (cat.subCategories?.length) {
                const found = findCategory(cat.subCategories);
                if (found) return found;
              }
            }
            return null;
          };

          const category = findCategory(categories);
          if (category) {
            projectData.category = category;
          }
        } catch (error) {
          console.error("Failed to get category details:", error);
          // Continue execution even if category lookup fails
        }
      }

      return projectData;
    } catch (error: any) {
      // Return a serializable error object
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to fetch project",
        status: error.response?.status,
        data: error.response?.data,
      });
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
  async (
    {
      workspaceId,
      projectId,
      data,
    }: {
      workspaceId: number;
      projectId: number;
      data: Partial<UpdateProjectRequest>;
    },
    { rejectWithValue }
  ) => {
    try {
      console.log("Updating project with data:", data);
      const response = await apiClient.put(`/workspaces/${workspaceId}/projects/${projectId}`, data);

      return response.data.project || response.data;
    } catch (error: any) {
      console.error("Update project error:", error.response?.data || error);
      return rejectWithValue(error.response?.data || "Failed to update project");
    }
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
  async (
    {
      workspaceId,
      projectId,
      employeeId,
      rateType = "A",
      breakHours = 0,
    }: {
      workspaceId: number;
      projectId: number;
      employeeId: number;
      rateType?: string;
      breakHours?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post(`/workspaces/${workspaceId}/projects/${projectId}/staff`, {
        employeeId,
        rateType,
        breakHours,
      });
      return response.data;
    } catch (error: any) {
      console.error("Assign staff error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to assign staff");
    }
  }
);

export const removeStaff = createAsyncThunk(
  "project/removeStaff",
  async ({ workspaceId, projectId, employeeId }: { workspaceId: number; projectId: number; employeeId: number }) => {
    await apiClient.delete(`/workspaces/${workspaceId}/projects/${projectId}/staff/${employeeId}`);
    return { projectId, employeeId };
  }
);

export const fetchProjectLeads = createAsyncThunk("project/fetchLeads", async (workspaceId: number) => {
  const response = await apiClient.get(`/workspaces/${workspaceId}/projects/project-leads`);
  return response.data;
});

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
  async (
    {
      workspaceId,
      categoryId,
      data,
    }: {
      workspaceId: number;
      categoryId: number;
      data: UpdateCategoryRequest;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.put(`/workspaces/${workspaceId}/projects/categories/${categoryId}`, data);
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
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        console.log("fetchProjects.pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        console.log("fetchProjects.fulfilled", action.payload);
        state.loading = false;
        state.projects = action.payload.projects;
        state.total = action.payload.total;
        state.currentPage = action.payload.page;
        state.limit = action.payload.limit;
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        console.log("fetchProjects.rejected", action.error);
        state.loading = false;
        state.error = action.error.message || "Failed to fetch projects";
        state.projects = [];
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
        state.error = action.payload ? (action.payload as { message: string }).message : "Failed to fetch project";
        state.currentProject = null;
      })
      .addCase(fetchProjectCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchProjectCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createProjectCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateProjectCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((cat) => cat.categoryid === action.payload.categoryid);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteProjectCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((cat) => cat.categoryid !== action.payload);
      })
      .addCase(assignStaff.fulfilled, (state, action) => {
        if (state.currentProject) {
          state.currentProject = {
            ...state.currentProject,
            assignedStaff: [...(state.currentProject.assignedStaff || []), action.payload],
          };
        }
      })
      .addCase(removeStaff.fulfilled, (state, action) => {
        if (state.currentProject) {
          state.currentProject = {
            ...state.currentProject,
            assignedStaff:
              state.currentProject.assignedStaff?.filter((staff) => staff.employeeId !== action.payload.employeeId) ||
              [],
          };
        }
      });
  },
});

export const { clearCurrentProject, setCurrentPage, setLimit } = projectSlice.actions;
export default projectSlice.reducer;
