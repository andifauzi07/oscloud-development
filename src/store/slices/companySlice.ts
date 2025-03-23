import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '@/api/apiClient';
import { Company, CompaniesResponse } from '@/types/company';

interface PersonnelManager {
	userId: string;
	email: string;
	firstName: string | null;
	lastName: string | null;
	role: string;
}

interface PersonnelProject {
	projectId: number;
	name: string;
	status: string;
	startDate: string;
	endDate: string;
}

interface PersonnelLead {
	leadId: number;
	status: string;
	contractValue: number;
	createdAt: string | null;
	projects: PersonnelProject[];
}

interface PersonnelStatistics {
	totalLeads: number;
	activeLeads: number;
	totalContractValue: number;
	activeContractValue: number;
	connectedProjects: number;
}

interface Personnel {
	personnelid: number;
	companyid: number;
	name: string;
	status: string;
	email: string;
	leadid?: number;
	managerid?: number;
	description?: string;
}

interface Lead {
	leadId: number;
	companyId: number;
	personnelId: number;
	contractValue: number;
	status: string;
}

interface CreateLeadRequest {
	companyId: number;
	personnelId: number;
	contractValue: number;
	status: string;
}

interface UpdateLeadRequest {
	status: string;
	name?: string;
	contract_value?: number;
	company_id?: number;
}

interface CreatePersonnelRequest {
	name: string;
	email: string;
	status: 'Active' | 'Inactive' | 'Blocked';
	description?: string;
	managerId: string; // Changed to string to match the API
}

interface UpdatePersonnelRequest {
	name?: string;
	email?: string;
	status?: 'Active' | 'Inactive' | 'Blocked';
	description?: string;
	managerId?: string; // Changed to string to match the API
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
	personnel: Personnel[];
	selectedPersonnel: Personnel | null;
	loadingPersonnel: boolean;
	errorPersonnel: string | null;
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
		limit: 10,
	},
	totalValue: {
		active: 0,
		closed: 0,
	},
	personnel: [],
	selectedPersonnel: null,
	loadingPersonnel: false,
	errorPersonnel: null,
};

interface FetchCompaniesParams {
	workspaceId: number;
	search?: string;
	category?: string;
	page?: number;
	limit?: number;
}
interface CompanyStats {
	totalLeads: number;
	activeLeads: number;
	totalContractValue: number;
	activeContractValue: number;
	personnelCount: number;
}
interface CompanyListItem {
	companyid: number;
	name: string;
	logo: string | null;
	workspaceid: number;
	created_at: string;
	city: string | null;
	product: string | null;
	email: string | null;
	category_group: string | null;
	managerid: string | null;
	personnel: {
		personnelid: number;
		companyid: number;
		name: string;
		status: string;
		email: string | null;
		description: string | null;
		leadid: number | null;
		managerid: string | null;
	}[];
	activeLeads: number;
	totalContractValue: number;
}
interface CompaniesResponse {
	companies: CompanyListItem[];
	total: number;
	page: number;
	limit: number;
}
interface CompanyDetail {
	companyId: number;
	workspaceId: number;
	name: string;
	logo: string | null;
	city: string | null;
	product: string | null;
	email: string | null;
	categoryGroup: string | null;
	createdAt: string;
	manager: any | null; // Update this type based on manager structure if available
	personnel: Personnel[];
	stats: CompanyStats;
}
interface FetchCompaniesResponse {
	companies: CompanyListItem[];
	total: number;
	page: number;
	limit: number;
}
export const fetchCompanies = createAsyncThunk<CompaniesResponse, FetchCompaniesParams>('company/fetchAll', async ({ workspaceId, search, category, page, limit }) => {
	const response = await apiClient.get(`/workspaces/${workspaceId}/crm/companies`, {
		params: { search, category, page, limit },
	});
	return response.data;
});
export const fetchCompanyById = createAsyncThunk<Company, { workspaceId: number; companyId: number }>('company/fetchOne', async ({ workspaceId, companyId }) => {
	const response = await apiClient.get<Company>(`/workspaces/${workspaceId}/crm/companies/${companyId}`);
	return response.data;
});

interface CreateCompanyRequest {
	name: string;
	personnel: { name: string }[];
}

export const createCompany = createAsyncThunk('company/create', async ({ workspaceId, data }: { workspaceId: number; data: CreateCompanyRequest }) => {
	const response = await apiClient.post(`/workspaces/${workspaceId}/crm/companies`, data);
	return response.data;
});

interface UpdateCompanyRequest {
	city?: string;
	product?: string;
	email?: string;
	categoryGroup?: string;
	logo?: string;
	name?: string;
	personnel?: { name: string }[];
}

export const updateCompany = createAsyncThunk('company/update', async ({ workspaceId, companyId, data }: { workspaceId: number; companyId: number; data: UpdateCompanyRequest }) => {
	const response = await apiClient.patch(`/workspaces/${workspaceId}/crm/companies/${companyId}`, data);
	return response.data;
});

export const deleteCompany = createAsyncThunk('company/delete', async ({ workspaceId, companyId }: { workspaceId: number; companyId: number }) => {
	await apiClient.delete(`/workspaces/${workspaceId}/crm/companies/${companyId}`);
	return companyId;
});

interface FetchLeadsParams {
	workspaceId: number;
	status?: string;
	companyId?: number;
	minValue?: number;
	maxValue?: number;
}

export const fetchLeads = createAsyncThunk('company/fetchLeads', async (params: FetchLeadsParams) => {
	const queryParams = new URLSearchParams();
	if (params.status) queryParams.append('status', params.status);
	if (params.companyId) queryParams.append('companyId', params.companyId.toString());
	if (params.minValue !== undefined) queryParams.append('minValue', params.minValue.toString());
	if (params.maxValue !== undefined) queryParams.append('maxValue', params.maxValue.toString());

	const response = await apiClient.get(`/workspaces/${params.workspaceId}/crm/leads${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
	return response.data;
});

export const createLead = createAsyncThunk('company/createLead', async ({ workspaceId, data }: { workspaceId: number; data: CreateLeadRequest }) => {
	const response = await apiClient.post(`/workspaces/${workspaceId}/crm/leads`, data);
	return response.data;
});

export const updateLead = createAsyncThunk('company/updateLead', async ({ workspaceId, leadId, data }: { workspaceId: number; leadId: number; data: UpdateLeadRequest }) => {
	try {
		const response = await apiClient.patch(`/workspaces/${workspaceId}/crm/leads/${leadId}`, data);
		return response.data;
	} catch (error) {
		throw error;
	}
});

export const deleteLead = createAsyncThunk('company/deleteLead', async ({ workspaceId, leadId }: { workspaceId: number; leadId: number }) => {
	await apiClient.delete(`/workspaces/${workspaceId}/crm/leads/${leadId}`);
	return leadId;
});

export const fetchCompanyPersonnel = createAsyncThunk('company/fetchCompanyPersonnel', async ({ workspaceId, companyId }: { workspaceId: number; companyId: number }) => {
	const response = await apiClient.get(`/workspaces/${workspaceId}/crm/companies/${companyId}/personnel`);
	return response.data;
});

export const fetchPersonnelById = createAsyncThunk('company/fetchPersonnelById', async ({ workspaceId, personnelId }: { workspaceId: number; personnelId: number }) => {
	const response = await apiClient.get(`/workspaces/${workspaceId}/crm/personnel/${personnelId}`);
	return response.data;
});

// Update the interface for create personnel payload
interface CreatePersonnelPayload {
	workspaceId: number;
	companyId: number;
	data: CreatePersonnelRequest;
}

export const createPersonnel = createAsyncThunk<Personnel, CreatePersonnelPayload>('company/createPersonnel', async ({ workspaceId, companyId, data }) => {
	const response = await apiClient.post(`/workspaces/${workspaceId}/crm/companies/${companyId}/personnel`, data);
	return response.data;
});

export const updatePersonnel = createAsyncThunk('company/updatePersonnel', async ({ workspaceId, personnelId, data }: { workspaceId: number; personnelId: number; data: UpdatePersonnelRequest }) => {
	const response = await apiClient.patch(`/workspaces/${workspaceId}/crm/companies/${personnelId}/personnel`, data);
	return response.data;
});

export const deletePersonnel = createAsyncThunk('company/deletePersonnel', async ({ workspaceId, personnelId }: { workspaceId: number; personnelId: number }) => {
	await apiClient.delete(`/workspaces/${workspaceId}/crm/personnel/${personnelId}`);
	return personnelId;
});

const companySlice = createSlice({
	name: 'company',
	initialState,
	reducers: {
		clearSelectedCompany: (state) => {
			state.selectedCompany = null;
		},
		clearSelectedPersonnel: (state) => {
			state.selectedPersonnel = null;
		},
	},
	extraReducers: (builder) => {
		builder
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
					limit: action.payload.limit,
				};
			})
			.addCase(fetchCompanies.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || null;
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
				state.error = action.error.message || 'Failed to fetch company';
			})
			// Create Company
			.addCase(createCompany.fulfilled, (state, action) => {
				state.companies.push(action.payload);
			})

			// Update Company
			.addCase(updateCompany.fulfilled, (state, action) => {
				const updatedCompany = action.payload as Company;
				const index = state.companies.findIndex((company) => company.companyid === updatedCompany.companyid);
				if (index !== -1) {
					state.companies[index] = updatedCompany;
				}
				if (state.selectedCompany?.companyid === updatedCompany.companyid) {
					state.selectedCompany = updatedCompany;
				}
			})

			// Delete Company
			.addCase(deleteCompany.fulfilled, (state, action) => {
				state.companies = state.companies.filter((company) => company.companyid !== action.payload);
				if (state.selectedCompany?.companyid === action.payload) {
					state.selectedCompany = null;
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
				// Update total values
				if (action.payload.status.toLowerCase() === 'active') {
					state.totalValue.active += action.payload.contractvalue;
				} else if (action.payload.status.toLowerCase() === 'closed') {
					state.totalValue.closed += action.payload.contractvalue;
				}
			})

			// Update Lead
			.addCase(updateLead.fulfilled, (state, action) => {
				if (!state.leads) {
					state.leads = [];
					return;
				}

				const index = state.leads.findIndex(
					(lead) => lead.leadId === action.payload.leadId // Make sure property names match
				);

				if (index !== -1) {
					// Adjust total values based on status change
					const oldLead = state.leads[index];
					if (oldLead.status !== action.payload.status) {
						// Update totals only if status changed
						if (oldLead.status.toLowerCase() === 'active') {
							state.totalValue.active -= oldLead.contractValue;
						} else if (oldLead.status.toLowerCase() === 'completed') {
							state.totalValue.closed -= oldLead.contractValue;
						}

						if (action.payload.status.toLowerCase() === 'active') {
							state.totalValue.active += action.payload.contractValue;
						} else if (action.payload.status.toLowerCase() === 'completed') {
							state.totalValue.closed += action.payload.contractValue;
						}
					}
					state.leads[index] = action.payload;
				}
			})

			// Delete Lead
			.addCase(deleteLead.fulfilled, (state, action) => {
				const deletedLead = state.leads.find((lead) => lead.leadId === action.payload);
				if (deletedLead) {
					// Adjust total values
					if (deletedLead.status.toLowerCase() === 'active') {
						state.totalValue.active -= deletedLead.contractValue;
					} else if (deletedLead.status.toLowerCase() === 'closed') {
						state.totalValue.closed -= deletedLead.contractValue;
					}
				}
				state.leads = state.leads.filter((lead) => lead.leadId !== action.payload);
			})

			// Personnel reducers
			.addCase(fetchCompanyPersonnel.pending, (state) => {
				state.loadingPersonnel = true;
				state.errorPersonnel = null;
			})
			.addCase(fetchCompanyPersonnel.fulfilled, (state, action) => {
				state.personnel = action.payload;
				state.loadingPersonnel = false;
			})
			.addCase(fetchCompanyPersonnel.rejected, (state, action) => {
				state.loadingPersonnel = false;
				state.errorPersonnel = action.error.message || 'Failed to fetch personnel';
			})
			.addCase(fetchPersonnelById.pending, (state) => {
				state.loadingPersonnel = true;
				state.errorPersonnel = null;
			})
			.addCase(fetchPersonnelById.fulfilled, (state, action) => {
				state.selectedPersonnel = action.payload;
				state.loadingPersonnel = false;
			})
			.addCase(fetchPersonnelById.rejected, (state, action) => {
				state.loadingPersonnel = false;
				state.errorPersonnel = action.error.message || 'Failed to fetch personnel';
			})
			.addCase(createPersonnel.pending, (state) => {
				state.loadingPersonnel = true;
				state.errorPersonnel = null;
			})
			.addCase(createPersonnel.fulfilled, (state, action) => {
				state.personnel.push(action.payload);
				state.loadingPersonnel = false;
			})
			.addCase(createPersonnel.rejected, (state, action) => {
				state.loadingPersonnel = false;
				state.errorPersonnel = action.error.message || 'Failed to create personnel';
			})
			.addCase(updatePersonnel.pending, (state) => {
				state.loadingPersonnel = true;
				state.errorPersonnel = null;
			})
			.addCase(updatePersonnel.fulfilled, (state, action) => {
				const index = state.personnel.findIndex((p) => p.personnelid === action.payload.personnelId);
				if (index !== -1) {
					state.personnel[index] = action.payload;
				}
				if (state.selectedPersonnel?.personnelid === action.payload.personnelId) {
					state.selectedPersonnel = action.payload;
				}
				state.loadingPersonnel = false;
			})
			.addCase(updatePersonnel.rejected, (state, action) => {
				state.loadingPersonnel = false;
				state.errorPersonnel = action.error.message || 'Failed to update personnel';
			})
			.addCase(deletePersonnel.pending, (state) => {
				state.loadingPersonnel = true;
				state.errorPersonnel = null;
			})
			.addCase(deletePersonnel.fulfilled, (state, action) => {
				state.personnel = state.personnel.filter((p) => p.personnelid !== action.payload);
				if (state.selectedPersonnel?.personnelid === action.payload) {
					state.selectedPersonnel = null;
				}
				state.loadingPersonnel = false;
			})
			.addCase(deletePersonnel.rejected, (state, action) => {
				state.loadingPersonnel = false;
				state.errorPersonnel = action.error.message || 'Failed to delete personnel';
			});
	},
});

export const { clearSelectedCompany, clearSelectedPersonnel } = companySlice.actions;
export default companySlice.reducer;
