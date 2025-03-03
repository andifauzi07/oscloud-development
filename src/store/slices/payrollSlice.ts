// payrollSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api/apiClient";
import { AppDispatch, RootState } from "@/store/store";
import { EmployeeProfile, EmployeeProject, EmployeePayment } from "@/types/payroll";
import { ResponsiveContainer } from "recharts";

interface PayrollState {
  employees: any[];
  payments: any[];
  employeeProfile: EmployeeProfile | null;
  employeeProjects: EmployeeProject[];
  employeePayments: EmployeePayment[];
  loading: boolean;
  error: string | null;
}

const initialState: PayrollState = {
	employees: [],
	payments: [],
	employeeProfile: null,
	employeeProjects: [],
	employeePayments: [],
	loading: false,
	error: null,
};

// Async Thunks
export const fetchPayrollEmployees = createAsyncThunk(
  "payroll/fetchEmployees",
  async (workspaceId: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/workspaces/${workspaceId}/payroll/employees`);
      return response.data.employees;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch employees");
    }
  }
);

export const fetchPayments = createAsyncThunk(
  "payroll/fetchPayments",
  async (
    { workspaceId, filters }: { workspaceId: number; filters?: Record<string, any> },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get(`/workspaces/${workspaceId}/payroll/payments`, {
        params: filters,
      });
      return response.data.payments;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch payments");
    }
  }
);

export const createPayment = createAsyncThunk(
  "payroll/createPayment",
  async (
    { workspaceId, data }: { workspaceId: number; data: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post(
        `/workspaces/${workspaceId}/payroll/payments`,
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to create payment");
    }
  }
);

export const updatePaymentStatus = createAsyncThunk(
  "payroll/updatePaymentStatus",
  async (
    { workspaceId, paymentId, status }: { workspaceId: number; paymentId: number; status: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.patch(
        `/workspaces/${workspaceId}/payroll/payments/${paymentId}`,
        { status }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update payment");
    }
  }
);

export const fetchEmployeeProfile = createAsyncThunk(
  "payroll/fetchEmployeeProfile",
  async (
    { workspaceId, employeeId }: { workspaceId: number; employeeId: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get(
        `/workspaces/${workspaceId}/payroll/employees/${employeeId}/profile`
      );
      console.log(response.data)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch profile");
    }
  }
);

export const fetchEmployeeProjects = createAsyncThunk(
  "payroll/fetchEmployeeProjects",
  async (
    { workspaceId, employeeId }: { workspaceId: number; employeeId: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get(
        `/workspaces/${workspaceId}/payroll/employees/${employeeId}/projects`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch projects");
    }
  }
);

export const fetchEmployeePayments = createAsyncThunk(
  "payroll/fetchEmployeePayments",
  async (
    { workspaceId, employeeId }: { workspaceId: number; employeeId: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get(
        `/workspaces/${workspaceId}/payroll/employees/${employeeId}/payments`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch payments");
    }
  }
);

const payrollSlice = createSlice({
	name: 'payroll',
	initialState,
	reducers: {
		clearEmployeeData: (state) => {
			state.employeeProfile = null;
			state.employeeProjects = [];
			state.employeePayments = [];
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch Employees
			.addCase(fetchPayrollEmployees.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchPayrollEmployees.fulfilled, (state, action) => {
				state.loading = false;
				state.employees = action.payload;
			})
			.addCase(fetchPayrollEmployees.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			// Fetch Payments
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
				state.error = action.payload as string;
			})
			// Create Payment
			.addCase(createPayment.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createPayment.fulfilled, (state, action) => {
				state.loading = false;
				state.payments.push(action.payload);
			})
			.addCase(createPayment.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			// Update Payment Status
			.addCase(updatePaymentStatus.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updatePaymentStatus.fulfilled, (state, action) => {
				state.loading = false;
				const index = state.payments.findIndex((p) => p.paymentId === action.payload.paymentId);
				if (index !== -1) {
					state.payments[index] = action.payload;
				}
			})
			.addCase(updatePaymentStatus.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			// Fetch Employee Profile
			.addCase(fetchEmployeeProfile.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchEmployeeProfile.fulfilled, (state, action) => {
				state.loading = false;
				state.employeeProfile = action.payload;
			})
			.addCase(fetchEmployeeProfile.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			// Fetch Employee Projects
			.addCase(fetchEmployeeProjects.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchEmployeeProjects.fulfilled, (state, action) => {
				state.loading = false;
				state.employeeProjects = action.payload;
			})
			.addCase(fetchEmployeeProjects.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			// Fetch Employee Payments
			.addCase(fetchEmployeePayments.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchEmployeePayments.fulfilled, (state, action) => {
				state.loading = false;
				state.employeePayments = action.payload;
			})
			.addCase(fetchEmployeePayments.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export const { clearEmployeeData } = payrollSlice.actions;
export default payrollSlice.reducer;
