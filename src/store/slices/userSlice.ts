import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import type { UserRole, UserStatus } from '@/types/user';
import apiClient from '@/api/apiClient';
import { supabase } from '@/backend/supabase/supabaseClient';

interface AppUser {
    id: string;
    name: string;
    email: string;
    workspaceid: number;
    image: string | null;
    phone_number: string | null;
    backup_email: string | null;
}

interface UserState {
    users: AppUser[];
    currentUser: AppUser | null;
    selectedUser: AppUser | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    currentUser: null,
    selectedUser: null,
    loading: false,
    error: null,
};

export const fetchUsers = createAsyncThunk(
    'user/fetchAll',
    async (workspaceId: number) => {
        const response = await apiClient.get(`/workspaces/${workspaceId}/users`);
        return response.data.users;
    }
);

export const fetchUserById = createAsyncThunk(
    'user/fetchOne',
    async ({ workspaceId, userId }: { workspaceId: number; userId: string }) => {
        const response = await apiClient.get(`/workspaces/${workspaceId}/users/${userId}`);
        return response.data;
    }
);

export const createUser = createAsyncThunk(
    'user/create',
    async ({ workspaceId, userData }: { 
        workspaceId: number; 
        userData: {
            name: string;
            email: string;
            image?: string;
            phone_number?: string;
            backup_email?: string;
        }
    }) => {
        const response = await apiClient.post(`/workspaces/${workspaceId}/users`, userData);
        return response.data;
    }
);

export const updateUser = createAsyncThunk(
    'user/update',
    async ({ workspaceId, userId, data }: { 
        workspaceId: number; 
        userId: string;
        data: Partial<AppUser>
    }) => {
        const response = await apiClient.patch(`/workspaces/${workspaceId}/users/${userId}`, data);
        return response.data;
    }
);

export const deleteUser = createAsyncThunk(
    'user/delete',
    async ({ workspaceId, userId }: { workspaceId: number; userId: string }) => {
        await apiClient.delete(`/workspaces/${workspaceId}/users/${userId}`);
        return userId;
    }
);

export const fetchCurrentUser = createAsyncThunk(
    'user/fetchCurrent',
    async (_, { getState }) => {
        const state = getState() as RootState;
        const userId = state.auth.session?.user?.id;
        if (!userId) throw new Error('No authenticated user');
        
        const { data, error } = await supabase
            .from('app_user')
            .select('*')
            .eq('userid', userId)
            .single();

        if (error) throw error;
        return data;
    }
);

// Add selectors
export const selectUsers = (state: RootState) => state.user.users;
export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectSelectedUser = (state: RootState) => state.user.selectedUser;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;

// Memoized selectors for filtered lists
export const selectUsersByRole = createSelector(
    [selectUsers, (state: RootState, role: UserRole) => role],
    (users, role) => users.filter(user => user.role === role)
);

export const selectUsersByStatus = createSelector(
    [selectUsers, (state: RootState, status: UserStatus) => status],
    (users, status) => users.filter(user => user.status === status)
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearSelectedUser: (state) => {
            state.selectedUser = null;
        },
        clearUsers: (state) => {
            state.users = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                state.loading = false;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch users';
            })
            // Fetch single user
            .addCase(fetchUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.selectedUser = action.payload;
                state.loading = false;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch user';
            })
            // Create user
            .addCase(createUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
            })
            // Update user
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                if (state.selectedUser?.id === action.payload.id) {
                    state.selectedUser = action.payload;
                }
            })
            // Delete user
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user.id !== action.payload);
                if (state.selectedUser?.id === action.payload) {
                    state.selectedUser = null;
                }
            })
            // Fetch current user
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.currentUser = action.payload;
                state.loading = false;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch current user';
            });
    },
});

export const { clearSelectedUser, clearUsers } = userSlice.actions;
export default userSlice.reducer;
