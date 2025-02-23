import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Payment, PaymentsResponse } from "@/types/payroll";
import axios from "axios";
import apiClient from "@/api/apiClient";

interface PayrollState {
    payments: Payment[];
    loading: boolean;
    error: string | null;
}

const initialState: PayrollState = {
    payments: [],
    loading: false,
    error: null,
};

export const fetchPayments = createAsyncThunk(
    "payroll/fetchPayments",
    async ({
        workspaceId,
        status,
        employeeId,
    }: {
        workspaceId: number;
        status?: string;
        employeeId?: number;
    }) => {
        const params = new URLSearchParams();
        if (status) params.append("status", status);
        if (employeeId) params.append("employeeId", employeeId.toString());

        const url = `workspaces/${workspaceId}/payroll/payments?${params.toString()}`;
        const response = await apiClient.get(url);
        return response.data.payments;
    }
);

const payrollSlice = createSlice({
    name: "payroll",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPayments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPayments.fulfilled, (state, action) => {
                state.loading = false;
                state.payments = action.payload;
            })
            .addCase(fetchPayments.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message || "Failed to fetch payments";
            });
    },
});

export default payrollSlice.reducer;
