import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { supabase } from "@/backend/supabase/supabaseClient";
import type { AppUser, CreateUserData, UpdateUserData, UserFilters } from "@/types/user";
import type { RootState } from "@/store/store";

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

// Selectors
const selectUserState = (state: RootState) => state.user;

export const selectUsers = createSelector(
    selectUserState,
    (state) => state.users
);

export const selectCurrentUser = createSelector(
    selectUserState,
    (state) => state.currentUser
);

export const selectSelectedUser = createSelector(
    selectUserState,
    (state) => state.selectedUser
);

export const selectUserLoading = createSelector(
    selectUserState,
    (state) => state.loading
);

export const selectUserError = createSelector(
    selectUserState,
    (state) => state.error
);

export const selectUsersByRole = createSelector(
    selectUsers,
    (_: RootState, role: string) => role,
    (users, role) => users.filter(user => user.role === role)
);

export const selectUsersByStatus = createSelector(
    selectUsers,
    (_: RootState, status: string) => status,
    (users, status) => users.filter(user => user.status === status)
);

// Thunks
export const fetchCurrentUser = createAsyncThunk(
    "user/fetchCurrent",
    async (_, { rejectWithValue }) => {
        try {
            const session = await supabase.auth.getSession();
            if (!session?.data.session?.user?.id) {
                throw new Error("No authenticated user found");
            }

            const { data, error } = await supabase
                .from("app_user")
                .select("*")
                .eq("userid", session.data.session.user.id)
                .single();

            if (error) throw error;
            return data as AppUser;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    },
    {
        condition: (_, { getState }) => {
            const state = getState() as RootState;
            const { loading, currentUser } = state.user;
            // Don't fetch if already loading or if we already have the current user
            return !loading && !currentUser;
        }
    }
);

export const fetchUsers = createAsyncThunk(
    "user/fetchAll",
    async ({ workspaceId, filters }: { workspaceId: number, filters?: UserFilters }, { rejectWithValue }) => {
        try {
            let query = supabase
                .from("app_user")
                .select("*")
                .eq("workspaceid", workspaceId);

            if (filters?.role) {
                query = query.eq("role", filters.role);
            }
            if (filters?.status) {
                query = query.eq("status", filters.status);
            }
            if (filters?.search) {
                query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data as AppUser[];
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    },
    {
        condition: (_, { getState }) => {
            const state = getState() as RootState;
            return !state.user.loading;
        }
    }
);

export const fetchUserById = createAsyncThunk(
    "user/fetchOne",
    async ({ workspaceId, userId }: { workspaceId: number, userId: string }, { rejectWithValue, getState }) => {
        try {
            // Check if user already exists in state
            const state = getState() as RootState;
            const existingUser = state.user.users.find(u => u.userid === userId);
            if (existingUser) {
                return existingUser;
            }

            const { data, error } = await supabase
                .from("app_user")
                .select("*")
                .eq("workspaceid", workspaceId)
                .eq("userid", userId)
                .single();

            if (error) throw error;
            return data as AppUser;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    },
    {
        condition: ({ userId }, { getState }) => {
            const state = getState() as RootState;
            // Don't fetch if already loading or if the selected user is the same
            return !state.user.loading && state.user.selectedUser?.userid !== userId;
        }
    }
);

export const updateUser = createAsyncThunk(
    "user/update",
    async (
        { workspaceId, userId, data }: 
        { workspaceId: number, userId: string, data: UpdateUserData },
        { rejectWithValue }
    ) => {
        try {
            const { data: updatedUser, error } = await supabase
                .from("app_user")
                .update(data)
                .eq("workspaceid", workspaceId)
                .eq("userid", userId)
                .single();

            if (error) throw error;
            return updatedUser as AppUser;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteUser = createAsyncThunk(
    "user/delete",
    async (
        { workspaceId, userId }: { workspaceId: number, userId: string },
        { rejectWithValue }
    ) => {
        try {
            const { error } = await supabase
                .from("app_user")
                .delete()
                .eq("workspaceid", workspaceId)
                .eq("userid", userId);

            if (error) throw error;
            return userId;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: "user",
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
                state.error = action.payload as string;
                state.loading = false;
            })
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
                state.error = action.payload as string;
                state.loading = false;
            })
            // Fetch user by ID
            .addCase(fetchUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.selectedUser = action.payload;
                // Update user in users array if exists
                const index = state.users.findIndex(u => u.userid === action.payload.userid);
                if (index !== -1) {
                    state.users[index] = action.payload;
                } else {
                    state.users.push(action.payload);
                }
                state.loading = false;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            // Update user
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const updatedUser = action.payload;
                state.users = state.users.map(user => 
                    user.userid === updatedUser.userid ? updatedUser : user
                );
                if (state.selectedUser?.userid === updatedUser.userid) {
                    state.selectedUser = updatedUser;
                }
                if (state.currentUser?.userid === updatedUser.userid) {
                    state.currentUser = updatedUser;
                }
                state.loading = false;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            // Delete user
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user.userid !== action.payload);
                if (state.selectedUser?.userid === action.payload) {
                    state.selectedUser = null;
                }
                state.loading = false;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            });
    },
});

export const { clearSelectedUser, clearUsers } = userSlice.actions;
export default userSlice.reducer;
