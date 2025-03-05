import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api/apiClient";
import { 
    Availability, 
    AvailabilityState, 
    AvailabilityFilters,
    CreateAvailabilityData,
    UpdateAvailabilityData 
} from "@/types/availability";

const initialState: AvailabilityState = {
    availability: [],
    selectedAvailability: null,
    total: 0,
    currentPage: 1,
    limit: 10,
    loading: false,
    error: null,
};

export const fetchAvailability = createAsyncThunk(
    "availability/fetchAll",
    async ({ 
        workspaceId, 
        filters,
        page = 1,
        limit = 10 
    }: {
        workspaceId: number;
        filters?: AvailabilityFilters;
        page?: number;
        limit?: number;
    }) => {
        const params = new URLSearchParams({
            ...(filters?.startDate && { startDate: filters.startDate }),
            ...(filters?.endDate && { endDate: filters.endDate }),
            ...(filters?.employeeId && { employeeId: filters.employeeId.toString() }),
            ...(page && { page: page.toString() }),
            ...(limit && { limit: limit.toString() }),
        });

        const response = await apiClient.get(
            `/workspaces/${workspaceId}/availability?${params}`
        );
        return response.data;
    }
);

export const fetchAvailabilityById = createAsyncThunk(
    "availability/fetchOne",
    async ({ workspaceId, availabilityId }: { workspaceId: number; availabilityId: number }) => {
        const response = await apiClient.get(
            `/workspaces/${workspaceId}/availability/${availabilityId}`
        );
        return response.data;
    }
);

export const createAvailability = createAsyncThunk(
    "availability/create",
    async ({ 
        workspaceId, 
        data 
    }: { 
        workspaceId: number; 
        data: CreateAvailabilityData 
    }) => {
        const response = await apiClient.post(
            `/workspaces/${workspaceId}/availability`,
            data
        );
        return response.data;
    }
);

export const updateAvailability = createAsyncThunk(
    "availability/update",
    async ({ 
        workspaceId, 
        availabilityId, 
        data 
    }: { 
        workspaceId: number; 
        availabilityId: number;
        data: UpdateAvailabilityData;
    }) => {
        const response = await apiClient.patch(
            `/workspaces/${workspaceId}/availability/${availabilityId}`,
            data
        );
        return response.data;
    }
);

export const deleteAvailability = createAsyncThunk(
    "availability/delete",
    async ({ workspaceId, availabilityId }: { workspaceId: number; availabilityId: number }) => {
        await apiClient.delete(
            `/workspaces/${workspaceId}/availability/${availabilityId}`
        );
        return availabilityId;
    }
);

const availabilitySlice = createSlice({
    name: "availability",
    initialState,
    reducers: {
        clearSelectedAvailability: (state) => {
            state.selectedAvailability = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchAvailability.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAvailability.fulfilled, (state, action) => {
                state.loading = false;
                state.availability = action.payload.availability;
                state.total = action.payload.total;
                state.currentPage = action.payload.page;
                state.limit = action.payload.limit;
            })
            .addCase(fetchAvailability.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch availability";
            })
            // Fetch One
            .addCase(fetchAvailabilityById.fulfilled, (state, action) => {
                state.selectedAvailability = action.payload;
            })
            // Create
            .addCase(createAvailability.fulfilled, (state, action) => {
                state.availability.push(action.payload);
            })
            // Update
            .addCase(updateAvailability.fulfilled, (state, action) => {
                const index = state.availability.findIndex(
                    (item) => item.availabilityId === action.payload.availabilityId
                );
                if (index !== -1) {
                    state.availability[index] = action.payload;
                }
                if (state.selectedAvailability?.availabilityId === action.payload.availabilityId) {
                    state.selectedAvailability = action.payload;
                }
            })
            // Delete
            .addCase(deleteAvailability.fulfilled, (state, action) => {
                state.availability = state.availability.filter(
                    (item) => item.availabilityId !== action.payload
                );
                if (state.selectedAvailability?.availabilityId === action.payload) {
                    state.selectedAvailability = null;
                }
            });
    },
});

export const { clearSelectedAvailability } = availabilitySlice.actions;
export default availabilitySlice.reducer;