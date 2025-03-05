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
    city: string | null;
    category_group: string | null;
    email: string;
    product: string | null;
    created_at: string | null;
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
    active: number;
    closed: number;
}

interface CompanyState {
    companies: Company[];
    selectedCompany: Company | null;
    leads: Lead[];
    total: number;
    loading: boolean;
    error: string | null;
    currentPage: number;
    perPage: number;
    totalValue: TotalValue;
}

const initialState: CompanyState = {
    companies: [],
    selectedCompany: null,
    leads: [],
    total: 0,
    loading: false,
    error: null,
    currentPage: 1,
    perPage: 10,
    totalValue: { active: 0, closed: 0 }
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
    }) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (filters?.category) params.append('category', filters.category);
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());

        const response = await apiClient.get(
            `/workspaces/${workspaceId}/crm/companies${params.toString() ? `?${params.toString()}` : ''}`
        );
        return response.data;
    }
);

export const fetchCompanyById = createAsyncThunk(
    "company/fetchOne",
    async ({ workspaceId, companyId }: { workspaceId: number; companyId: number }) => {
        const response = await apiClient.get(`/workspaces/${workspaceId}/crm/companies/${companyId}`);
        return response.data;
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
            personnel: { name: string }[];
            city?: string;
            product?: string;
            email?: string;
            category_group?: string;
            logo?: string;
            managerid?: number;
        };
    }) => {
        const response = await apiClient.post(
            `/workspaces/${workspaceId}/crm/companies`,
            data
        );
        return response.data;
    }
);

export const updateCompany = createAsyncThunk(
    "company/update",
    async ({
        workspaceId,
        companyId,
        data,
    }: {
        workspaceId: number;
        companyId: number;
        data: Partial<Company>;
    }) => {
        const response = await apiClient.patch(
            `/workspaces/${workspaceId}/crm/companies/${companyId}`,
            data
        );
        return response.data;
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
    }) => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined) params.append(key, value.toString());
            });
        }
        const response = await apiClient.get(
            `/workspaces/${workspaceId}/crm/leads${params.toString() ? `?${params.toString()}` : ''}`
        );
        return response.data;
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
    }) => {
        const response = await apiClient.post(
            `/workspaces/${workspaceId}/crm/leads`,
            data
        );
        return response.data;
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
    }) => {
        const response = await apiClient.patch(
            `/workspaces/${workspaceId}/crm/leads/${leadId}`,
            { status }
        );
        return response.data;
    }
);

export const deleteCompany = createAsyncThunk(
    "company/delete",
    async ({ workspaceId, companyId }: { workspaceId: number; companyId: number }) => {
        await apiClient.delete(`/workspaces/${workspaceId}/crm/companies/${companyId}`);
        return companyId;
    }
);

export const deleteLead = createAsyncThunk(
    "company/deleteLead",
    async ({ workspaceId, leadId }: { workspaceId: number; leadId: number }) => {
        await apiClient.delete(`/workspaces/${workspaceId}/crm/leads/${leadId}`);
        return leadId;
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
                state.error = action.error.message || "Failed to fetch companies";
            })
            // Fetch Single Company
            .addCase(fetchCompanyById.fulfilled, (state, action) => {
                state.selectedCompany = action.payload;
            })
            // Create Company
            .addCase(createCompany.fulfilled, (state, action) => {
                state.companies.unshift(action.payload);
            })
            // Update Company
            .addCase(updateCompany.fulfilled, (state, action) => {
                const index = state.companies.findIndex(
                    (c) => c.companyId === action.payload.companyId
                );
                if (index !== -1) {
                    state.companies[index] = action.payload;
                }
                if (state.selectedCompany?.companyId === action.payload.companyId) {
                    state.selectedCompany = action.payload;
                }
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
                    (company) => company.companyId !== action.payload
                );
                if (state.selectedCompany?.companyId === action.payload) {
                    state.selectedCompany = null;
                }
            })
            // Delete Lead
            .addCase(deleteLead.fulfilled, (state, action) => {
                state.leads = state.leads.filter(
                    (lead) => lead.leadId !== action.payload
                );
            });
    },
});

export default companySlice.reducer;

