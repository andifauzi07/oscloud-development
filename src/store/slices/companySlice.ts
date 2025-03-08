import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/api/apiClient";

interface Personnel {
    personnelId: number;
    name: string;
}

interface Company {
    companyId: number;
    name: string;
    logo: string | null;
    city: string | null;
    product: string | null;
    email: string | null;
    category_group: string | null;
    created_at: string;
    managerid: number;
    personnel: Personnel[];
    activeLeads: number;
    totalContractValue: number;
}

interface Lead {
    leadId: number;
    companyId: number;
    personnelId: number;
    contractValue: number;
    status: string;
}

interface CompanyState {
    companies: Company[];
    selectedCompany: Company | null;
    leads: Lead[];
    loading: boolean;
    error: string | null;
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
    totalValue: {
        active: number;
        closed: number;
    };
}

const initialState: CompanyState = {
    companies: [],
    selectedCompany: null,
    leads: [],
    loading: false,
    error: null,
    pagination: {
        total: 0,
        page: 1,
        limit: 10
    },
    totalValue: {
        active: 0,
        closed: 0
    }
};

interface FetchCompaniesParams {
    workspaceId: number;
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
}

export const fetchCompanies = createAsyncThunk(
    "company/fetchAll",
    async ({ workspaceId, search, category, page, limit }: FetchCompaniesParams) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category) params.append('category', category);
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

interface CreateCompanyRequest {
    name: string;
    personnel: { name: string }[];
}

export const createCompany = createAsyncThunk(
    "company/create",
    async ({ workspaceId, data }: { workspaceId: number; data: CreateCompanyRequest }) => {
        const response = await apiClient.post(`/workspaces/${workspaceId}/crm/companies`, data);
        return response.data;
    }
);

interface UpdateCompanyRequest {
    city?: string;
    product?: string;
    email?: string;
    category_group?: string;
    logo?: string;
    name?: string;
    personnel?: { name: string }[];
}

export const updateCompany = createAsyncThunk(
    "company/update",
    async ({ workspaceId, companyId, data }: { workspaceId: number; companyId: number; data: UpdateCompanyRequest }) => {
        const response = await apiClient.patch(`/workspaces/${workspaceId}/crm/companies/${companyId}`, data);
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

interface FetchLeadsParams {
    workspaceId: number;
    status?: string;
    companyId?: number;
    minValue?: number;
    maxValue?: number;
}

export const fetchLeads = createAsyncThunk(
    "company/fetchLeads",
    async (params: FetchLeadsParams) => {
        const queryParams = new URLSearchParams();
        if (params.status) queryParams.append('status', params.status);
        if (params.companyId) queryParams.append('companyId', params.companyId.toString());
        if (params.minValue !== undefined) queryParams.append('minValue', params.minValue.toString());
        if (params.maxValue !== undefined) queryParams.append('maxValue', params.maxValue.toString());

        const response = await apiClient.get(
            `/workspaces/${params.workspaceId}/crm/leads${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
        );
        return response.data;
    }
);

const companySlice = createSlice({
    name: "company",
    initialState,
    reducers: {
        clearSelectedCompany: (state) => {
            state.selectedCompany = null;
        },
    },
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
                state.pagination = {
                    total: action.payload.total,
                    page: action.payload.page,
                    limit: action.payload.limit
                };
            })
            .addCase(fetchCompanies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch companies";
            })

            // Fetch Single Company
            .addCase(fetchCompanyById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompanyById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCompany = action.payload;
            })
            .addCase(fetchCompanyById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch company";
            })

            // Create Company
            .addCase(createCompany.fulfilled, (state, action) => {
                state.companies.push(action.payload);
            })

            // Update Company
            .addCase(updateCompany.fulfilled, (state, action) => {
                const index = state.companies.findIndex(
                    (company) => company.companyId === action.payload.companyId
                );
                if (index !== -1) {
                    state.companies[index] = action.payload;
                }
                if (state.selectedCompany?.companyId === action.payload.companyId) {
                    state.selectedCompany = action.payload;
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

            // Fetch Leads
            .addCase(fetchLeads.fulfilled, (state, action) => {
                state.leads = action.payload.leads;
                state.totalValue = action.payload.totalValue;
            });
    },
});

export const { clearSelectedCompany } = companySlice.actions;
export default companySlice.reducer;
