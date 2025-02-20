import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api/apiClient";

interface User {
    userId: number;
    email: string;
    status: string;
    role: string;
}

interface UserState {
    users: User[];
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    loading: false,
    error: null,
};

export const fetchUsers = createAsyncThunk("user/fetchAll", async (workspaceId: number, { rejectWithValue }) => {
    try {
        const response = await apiClient.get(`/workspaces/${workspaceId}/users`);
        return response.data.users;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "An error occurred");
    }
});

export const createUser = createAsyncThunk("user/create", async ({ workspaceId, userData }: { workspaceId: number; userData: { email: string; role: string; status: string } }, { rejectWithValue }) => {
    try {
        const response = await apiClient.post(`/workspaces/${workspaceId}/users`, userData);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "An error occurred");
    }
});

export const updateUser = createAsyncThunk("user/update", async ({ workspaceId, userId, status }: { workspaceId: number; userId: number; status: string }, { rejectWithValue }) => {
    try {
        const response = await apiClient.patch(`/workspaces/${workspaceId}/users/${userId}`, { status });
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "An error occurred");
    }
});

export const deleteUser = createAsyncThunk("user/delete", async ({ workspaceId, userId }: { workspaceId: number; userId: number }, { rejectWithValue }) => {
    try {
        await apiClient.delete(`/workspaces/${workspaceId}/users/${userId}`);
        return userId;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "An error occurred");
    }
});

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.users = state.users.map((user) =>
                    user.userId === action.payload.userId ? action.payload : user
                );
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter((user) => user.userId !== action.payload);
            });
    },
});

export default userSlice.reducer;