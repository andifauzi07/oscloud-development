import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/api/apiClient';

interface Rate {
    type: string;
    value: number;
}

interface EmployeeRate {
    employeeId: number;
    employeeName: string;
    rates: Rate[];
}

interface HourlyRateState {
    rates: EmployeeRate[];
    loading: boolean;
    error: string | null;
}

const initialState: HourlyRateState = {
    rates: [],
    loading: false,
    error: null,
};

interface HourlyRate {
    id: number;
    employeeId: number;
    type: string;
    value: number;
}

export const fetchHourlyRates = createAsyncThunk(
    'hourlyRate/fetch',
    async ({ workspaceId }: { workspaceId: number }) => {
        const response = await apiClient.get(`/workspaces/${workspaceId}/hourly-rates`);
        return response.data.rates;
    }
);

export const fetchHourlyRateByEmployee = createAsyncThunk(
    'hourlyRate/fetchByEmployee',
    async ({ workspaceId, employeeId }: { 
        workspaceId: number;
        employeeId: number;
    }) => {
        const response = await apiClient.get(
            `/workspaces/${workspaceId}/hourly-rates/${employeeId}`
        );
        return response.data;
    }
);

export const createHourlyRate = createAsyncThunk(
    'hourlyRate/create',
    async ({ 
        workspaceId,
        data 
    }: { 
        workspaceId: number;
        data: {
            employeeId: number;
            type: string;
            ratevalue: number;
        }
    }) => {
        const response = await apiClient.post(
            `/workspaces/${workspaceId}/hourly-rates`,
            {
                employeeId: data.employeeId,
                type: data.type,
                ratevalue: data.ratevalue
            }
        );
        return response.data;
    }
);

export const updateHourlyRate = createAsyncThunk(
    'hourlyRate/update',
    async ({ 
        workspaceId,
        employeeId,
        type,
        value 
    }: { 
        workspaceId: number;
        employeeId: number;
        type: string;
        value: number;
    }) => {
        const response = await apiClient.put(
            `/workspaces/${workspaceId}/hourly-rates/${employeeId}/${type}`,
            { value }
        );
        return response.data;
    }
);

export const deleteHourlyRate = createAsyncThunk(
    'hourlyRate/delete',
    async ({ 
        workspaceId,
        employeeId,
        type 
    }: { 
        workspaceId: number;
        employeeId: number;
        type: string;
    }) => {
        await apiClient.delete(
            `/workspaces/${workspaceId}/hourly-rates/${employeeId}/${type}`
        );
        return { employeeId, type };
    }
);

const hourlyRateSlice = createSlice({
    name: 'hourlyRate',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHourlyRates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHourlyRates.fulfilled, (state, action) => {
                state.loading = false;
                state.rates = action.payload;
            })
            .addCase(fetchHourlyRates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch rates';
            })
            // Handle other actions similarly...
    },
});

export default hourlyRateSlice.reducer;