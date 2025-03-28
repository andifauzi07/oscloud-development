import type { Manager } from '@/types/manager';
import apiClient from '@/api/apiClient';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface UsersState {
	manager: Manager[];
	loading: boolean;
	error: string | null;
}

const initialState: UsersState = {
	manager: [],
	loading: false,
	error: null,
};

export const fetchManager = createAsyncThunk<Manager[], { workspaceId: number }>('manager/fetchAll', async ({ workspaceId }, { rejectWithValue }) => {
	try {
		const response = await apiClient.get(`/workspaces/${workspaceId}/crm/managers`);
		return response.data;
	} catch (error: any) {
		return rejectWithValue(error.message);
	}
});

const managerSlice = createSlice({
	name: 'manager',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchManager.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchManager.fulfilled, (state, action) => {
				state.loading = false;
				state.manager = action.payload;
			})
			.addCase(fetchManager.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export default managerSlice.reducer;
