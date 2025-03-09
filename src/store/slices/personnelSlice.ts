import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api/apiClient";
import { Personnel, CreatePersonnelRequest, UpdatePersonnelRequest } from "@/types/personnel";
import { supabase } from "@/backend/supabase/supabaseClient";

interface PersonnelState {
    personnel: Personnel[];
    selectedPersonnel: Personnel | null;
    loading: boolean;
    error: string | null;
}

const initialState: PersonnelState = {
    personnel: [],
    selectedPersonnel: null,
    loading: false,
    error: null,
};

export const fetchPersonnelById = createAsyncThunk(
    "personnel/fetchById",
    async ({ workspaceId, personnelId }: { workspaceId: number; personnelId: number }) => {
        const response = await apiClient.get(
            `/workspaces/${workspaceId}/crm/personnel/${personnelId}`
        );
        return response.data;
    }
);

export const createPersonnel = createAsyncThunk(
    "personnel/create",
    async ({
        workspaceId,
        companyId,
        data
    }: {
        workspaceId: number;
        companyId: number;
        data: CreatePersonnelRequest;
    }) => {
        const response = await apiClient.post(
            `/workspaces/${workspaceId}/crm/companies/${companyId}/personnel`,
            data
        );
        return response.data;
    }
);

export const updatePersonnel = createAsyncThunk(
    "personnel/update",
    async ({
        workspaceId,
        personnelId,
        data
    }: {
        workspaceId: number;
        personnelId: number;
        data: UpdatePersonnelRequest;
    }) => {
        const response = await apiClient.put(
            `/workspaces/${workspaceId}/crm/personnel/${personnelId}`,
            data
        );
        return response.data;
    }
);

export const deletePersonnel = createAsyncThunk(
    "personnel/delete",
    async ({ workspaceId, personnelId }: { workspaceId: number; personnelId: number }) => {
        await apiClient.delete(
            `/workspaces/${workspaceId}/crm/personnel/${personnelId}`
        );
        return personnelId;
    }
);

export const fetchAllPersonnel = createAsyncThunk(
    "personnel/fetchAll",
    async ({ workspaceId }: { workspaceId: number }) => {
        const { data, error } = await supabase
            .from("personnel")
            .select(`
                *,
                lead:leadid (*,
                    company:companyid (*)
                ),
                app_user (
                    userid,
                    email,
                    status,
                    role,
                    image,
                    phone_number,
                    backup_email
                ),
                company:companyid (*)
            `)
            .eq('company.workspaceid', workspaceId);

        if (error) {
            console.error("Supabase error:", error);
            throw error;
        }

        return data || [];
    }
);

const personnelSlice = createSlice({
    name: "personnel",
    initialState,
    reducers: {
        clearSelectedPersonnel: (state) => {
            state.selectedPersonnel = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Personnel
            .addCase(fetchPersonnelById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPersonnelById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPersonnel = action.payload;
            })
            .addCase(fetchPersonnelById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch personnel";
            })
            // Create Personnel
            .addCase(createPersonnel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPersonnel.fulfilled, (state, action) => {
                state.loading = false;
                state.personnel.push(action.payload);
            })
            .addCase(createPersonnel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to create personnel";
            })
            // Update Personnel
            .addCase(updatePersonnel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePersonnel.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPersonnel = action.payload;
            })
            .addCase(updatePersonnel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to update personnel";
            })
            // Delete Personnel
            .addCase(deletePersonnel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePersonnel.fulfilled, (state, action) => {
                state.loading = false;
                state.personnel = state.personnel.filter(
                    (p) => p.personnelId !== action.payload
                );
                if (state.selectedPersonnel?.personnelId === action.payload) {
                    state.selectedPersonnel = null;
                }
            })
            .addCase(deletePersonnel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to delete personnel";
            })
            // Fetch All Personnel
            .addCase(fetchAllPersonnel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllPersonnel.fulfilled, (state, action) => {
                state.loading = false;
                state.personnel = action.payload;
            })
            .addCase(fetchAllPersonnel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            });
    },
});

export const { clearSelectedPersonnel } = personnelSlice.actions;
export default personnelSlice.reducer;
