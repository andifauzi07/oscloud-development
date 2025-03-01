// src/store/slices/companySlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api/apiClient";

// Interfaces
export interface Personnel {
    personnelId: number;
    name: string;
}

export interface Company {
    companyId: number;
    name: string;
    logo?: string;
    personnel: Personnel[];
    activeLeads: number;
    totalContractValue: number;
    city: string;
    category_group: string;
    email: string;
    product: string;
    created_at?: string | null; // Change this to string | null
    managerid: number;
}

export interface Lead {
    leadId: number;
    company: {
        companyId: number;
        name: string;
    };
    status: string;
    contractValue: number;
    personnel: {
        personnelId: number;
        name: string;
    };
}
export interface TotalValue {
    active: number,
    closed: number
}

interface CompanyState {
    companies: Company[];
    leads: Lead[];
    total: number;
    loading: boolean;
    error: string | null;
    currentPage: number;
    perPage: number;
    totalValue : TotalValue
}

const initialState: CompanyState = {
    companies: [],
    leads: [],
    total: 0,
    loading: false,
    error: null,
    currentPage: 1,
    perPage: 10,
    totalValue:{active:0, closed: 0}
};

// Thunks
export const fetchCompanies = createAsyncThunk(
    "company/fetchAll",
    async ({
        workspaceId,
        search,
        filters,
        page,
        limit,
    }: {
        workspaceId: number;
        search?: string;
        filters?: { category?: string };
        page?: number;
        limit?: number;
    }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/workspaces/${workspaceId}/crm/companies`,
                {
                    params: { search, ...filters, page, limit },
                }
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to fetch companies"
            );
        }
    }
);

export const createCompany = createAsyncThunk(
    "company/create",
    async ({
        workspaceId,
        data,
    }: {
        workspaceId: number;
        data: {
            name: string;
            personnel: Personnel[];
            city: string;
            managerid: number;
            product: string;
            email: string;
            category_group: string;
            logo?: string;
            project: {
                name: string;
                startdate: string;
                enddate: string;
                managerid: number;
                assignedStaff: {
                    employeeId: number;
                    rateType: string;
                    rateValue: number;
                }[];
            }
        };
    }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                `/workspaces/${workspaceId}/crm/companies`,
                { company: { ...data }, project: data.project, personnel: data.personnel }
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to create company"
            );
        }
    }
);

export const fetchLeads = createAsyncThunk(
    "company/fetchLeads",
    async ({
        workspaceId,
        filters,
    }: {
        workspaceId: number;
        filters?: {
            status?: string;
            companyId?: number;
            minValue?: number;
            maxValue?: number;
        };
    }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/workspaces/${workspaceId}/crm/leads`,
                {
                    params: filters,
                }
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to fetch leads"
            );
        }
    }
);

export const createLead = createAsyncThunk(
    "company/createLead",
    async ({
        workspaceId,
        data,
    }: {
        workspaceId: number;
        data: {
            companyId: number;
            personnelId: number;
            contractValue: number;
            status: string;
        };
    }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                `/workspaces/${workspaceId}/crm/leads`,
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to create lead"
            );
        }
    }
);

export const updateLeadStatus = createAsyncThunk(
    "company/updateLeadStatus",
    async ({
        workspaceId,
        leadId,
        status,
    }: {
        workspaceId: number;
        leadId: number;
        status: string;
    }, { rejectWithValue }) => {
        try {
            const response = await apiClient.patch(
                `/workspaces/${workspaceId}/crm/leads/${leadId}`,
                { status }
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to update lead"
            );
        }
    }
);

export const deleteCompany = createAsyncThunk(
    "company/delete",
    async ({
        workspaceId,
        companyId,
    }: {
        workspaceId: number;
        companyId: number;
    }, { rejectWithValue }) => {
        try {
            await apiClient.delete(
                `/workspaces/${workspaceId}/crm/companies/${companyId}`
            );
            return companyId;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to delete company"
            );
        }
    }
);
export const deleteLead = createAsyncThunk(
    "company/deleteLead",
    async ({
        workspaceId,
        leadId,
    }: {
        workspaceId: number;
        leadId: number;
    }, { rejectWithValue }) => {
        try {
            await apiClient.delete(
                `/workspaces/${workspaceId}/crm/leads/${leadId}`
            );
            return leadId;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to delete lead"
            );
        }
    }
);

const companySlice = createSlice({
    name: "company",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Companies
            .addCase(fetchCompanies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompanies.fulfilled, (state, action) => {
                state.loading = false;
                state.companies = action.payload.companies;
                state.total = action.payload.total;
                state.currentPage = action.payload.page;
                state.perPage = action.payload.limit;
            })
            .addCase(fetchCompanies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create Company
            .addCase(createCompany.fulfilled, (state, action) => {
                state.companies.unshift(action.payload); //add the new one to the top.
            })
            // Fetch Leads
            .addCase(fetchLeads.fulfilled, (state, action) => {
                state.leads = action.payload.leads;
                state.totalValue = action.payload.totalValue;
            })
            // Create Lead
            .addCase(createLead.fulfilled, (state, action) => {
                state.leads.push(action.payload);
            })
            // Update Lead
            .addCase(updateLeadStatus.fulfilled, (state, action) => {
                const index = state.leads.findIndex(
                    (l) => l.leadId === action.payload.leadId
                );
                if (index !== -1) {
                    state.leads[index] = action.payload;
                }
            })
            // Delete Company
            .addCase(deleteCompany.fulfilled, (state, action) => {
                state.companies = state.companies.filter(
                    (c) => c.companyId !== action.payload
                );
            })
            // Delete Lead
            .addCase(deleteLead.fulfilled, (state, action) => {
                state.leads = state.leads.filter(
                    (l) => l.leadId !== action.payload
                );
            });
    },
});

export default companySlice.reducer;

