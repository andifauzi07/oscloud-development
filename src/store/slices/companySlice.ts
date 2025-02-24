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

interface CompanyState {
    companies: Company[];
    leads: Lead[];
    total: number;
    loading: boolean;
    error: string | null;
}

const initialState: CompanyState = {
    companies: [],
    leads: [],
    total: 0,
    loading: false,
    error: null,
};

// Thunks
export const fetchCompanies = createAsyncThunk(
    "company/fetchAll",
    async ({ 
        workspaceId, 
        search 
    }: { 
        workspaceId: number; 
        search?: string;
    }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/workspaces/${workspaceId}/crm/companies`, {
                params: { search }
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to fetch companies");
        }
    }
);

export const createCompany = createAsyncThunk(
    "company/create",
    async ({ 
        workspaceId, 
        data 
    }: { 
        workspaceId: number; 
        data: Partial<Company>;
    }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                `/workspaces/${workspaceId}/crm/companies`,
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to create company");
        }
    }
);

export const fetchLeads = createAsyncThunk(
    "company/fetchLeads",
    async ({ 
        workspaceId, 
        filters 
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
            const response = await apiClient.get(`/workspaces/${workspaceId}/crm/leads`, {
                params: filters
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to fetch leads");
        }
    }
);

export const createLead = createAsyncThunk(
    "company/createLead",
    async ({ 
        workspaceId, 
        data 
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
            return rejectWithValue(error.response?.data || "Failed to create lead");
        }
    }
);

export const updateLeadStatus = createAsyncThunk(
    "company/updateLeadStatus",
    async ({ 
        workspaceId, 
        leadId, 
        status 
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
            return rejectWithValue(error.response?.data || "Failed to update lead");
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
            })
            .addCase(fetchCompanies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create Company
            .addCase(createCompany.fulfilled, (state, action) => {
                state.companies.push(action.payload);
            })
            // Fetch Leads
            .addCase(fetchLeads.fulfilled, (state, action) => {
                state.leads = action.payload.leads;
            })
            // Create Lead
            .addCase(createLead.fulfilled, (state, action) => {
                state.leads.push(action.payload);
            })
            // Update Lead
            .addCase(updateLeadStatus.fulfilled, (state, action) => {
                const index = state.leads.findIndex(l => l.leadId === action.payload.leadId);
                if (index !== -1) {
                    state.leads[index] = action.payload;
                }
            });
    },
});

export default companySlice.reducer;
