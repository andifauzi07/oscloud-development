import {createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Session, User } from "@supabase/supabase-js";
import { nullable } from "zod";

interface AuthState {
    session: Session | null;
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    session: null,
    user: null,
    loading: true,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setSession: (state, action: PayloadAction<Session | null>) => {
            state.session = action.payload;
            state.user = action.payload ? action.payload.user : null;
            state.loading = false;
        },
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        logout: (state) => {
            state.session = null;
            state.user = null;
            state.loading = false;
        }
    }
})

export const { setSession, setUser, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;