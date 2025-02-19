import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSession } from "@/store/slices/authSlice";
import { supabase } from "@/backend/supabase/supabaseClient";
import { RootState } from "@/store/store";

export function AuthListener() {
    const dispatch = useDispatch();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            dispatch(setSession(session));
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            dispatch(setSession(session));
        });

        return () => subscription.unsubscribe();
    }, [dispatch]);

    return null;
}

// Hook to access auth state in components
export const useAuth = () => useSelector((state: RootState) => state.auth);
