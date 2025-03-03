import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api/apiClient";

interface User {
    userid: number;
    name: string;
    email: string;
    status: string;
    role: string;
    workspaceid: number;
    image?: string;
    phone_number?: string;
    backup_email?: string;
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

export const fetchUsers = createAsyncThunk(
    "user/fetchAll",
    async (workspaceId: number, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/workspaces/${workspaceId}/users`);
            return response.data.users;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

export const createUser = createAsyncThunk(
    "user/create",
    async (
        {
            workspaceId,
            userData,
        }: {
            workspaceId: number;
            userData: {
                name: string;
                email: string;
                image?: string;
                phone_number?: string;
                backup_email?: string;
            };
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.post(
                `/workspaces/${workspaceId}/users`,
                userData
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

export const updateUser = createAsyncThunk(
    "user/update",
    async (
        {
            workspaceId,
            userId,
            updateData,
        }: {
            workspaceId: number;
            userId: number;
            updateData: {
                name?: string;
                email?: string;
                image?: string;
                phone_number?: string;
                backup_email?: string;
            };
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.patch(
                `/workspaces/${workspaceId}/users/${userId}`,
                updateData
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

export const deleteUser = createAsyncThunk(
    "user/delete",
    async (
        { workspaceId, userId }: { workspaceId: number; userId: number },
        { rejectWithValue }
    ) => {
        try {
            await apiClient.delete(`/workspaces/${workspaceId}/users/${userId}`);
            return userId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

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
                const index = state.users.findIndex(
                    (user) => user.userid === action.payload.userid
                );
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(
                    (user) => user.userid !== action.payload
                );
            });
    },
});

export default userSlice.reducer;