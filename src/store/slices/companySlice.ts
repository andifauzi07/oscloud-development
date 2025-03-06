import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api/apiClient";
import { Personnel, Company, Lead, CreateCompanyRequest } from '@/types/company';

// Remove any local type definitions and use the ones from types/company.ts
export type { Company, Personnel };

interface CompanyState {
    companies: Company[];
    selectedCompany: Company | null;
    leads: Lead[];
    loading: boolean;
    error: string | null;
    totalContractValue: any;
}

const initialState: CompanyState = {
    companies: [],
    selectedCompany: null,
    leads: [],
    loading: false,
    error: null,
    totalContractValue: { active: 0, closed: 0 }
};

// Thunks
export const fetchCompanies = createAsyncThunk(
    "company/fetchAll",
    async ({
        workspaceId,
        search,
        filters,
    }: {
        workspaceId: number;
        search?: string;
        filters?: { category?: string };
    }) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (filters?.category) params.append('category', filters.category);

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
        data: CreateCompanyRequest;
    }, { rejectWithValue }) => {
        try {
            // Create a new object with only the required fields
            const requestData = {
                name: data.name,
                logo: data.logo,
                city: data.city,
                product: data.product,
                email: data.email,
                category_group: data.category_group,
                managerid: data.managerid,
                personnel: []
            };

            console.log('Request payload:', JSON.stringify(requestData));

            const response = await apiClient.post(
                `/workspaces/${workspaceId}/crm/companies`,
                requestData
            );
            return response.data;
        } catch (error: any) {
            console.error("API Error:", error.response?.data);
            return rejectWithValue(
                error.response?.data?.detail || 
                error.response?.data?.message || 
                "Failed to create company"
            );
        }
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
            companyid?: number;
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
            companyid: number;
            personnelid: number;
            contractvalue: number;
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
                    (c) => c.companyid === action.payload.companyid
                );
                if (index !== -1) {
                    state.companies[index] = action.payload;
                }
                if (state.selectedCompany?.companyid === action.payload.companyid) {
                    state.selectedCompany = action.payload;
                }
            })
            // Fetch Leads
            .addCase(fetchLeads.fulfilled, (state, action) => {
                state.leads = action.payload.leads;
                state.totalContractValue = action.payload.totalValue;
            })
            // Create Lead
            .addCase(createLead.fulfilled, (state, action) => {
                state.leads.push(action.payload);
            })
            // Update Lead
            .addCase(updateLeadStatus.fulfilled, (state, action) => {
                const index = state.leads.findIndex(
                    (l: any) => l.leadid === action.payload.leadid
                );
                if (index !== -1) {
                    state.leads[index] = action.payload;
                }
            })
            // Delete Company
            .addCase(deleteCompany.fulfilled, (state, action) => {
                state.companies = state.companies.filter(
                    (company) => company.companyid !== action.payload
                );
                if (state.selectedCompany?.companyid === action.payload) {
                    state.selectedCompany = null;
                }
            })
            // Delete Lead
            .addCase(deleteLead.fulfilled, (state, action) => {
                state.leads = state.leads.filter(
                    (lead: any) => lead.leadid !== action.payload
                );
            });
    },
});

export default companySlice.reducer;
