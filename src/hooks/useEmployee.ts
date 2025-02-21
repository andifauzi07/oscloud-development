import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchEmployees,
    fetchWorkspaceEmployees,
} from "@/store/slices/employeeSlice";
import { RootState, AppDispatch } from "@/store/store";
import { useUserData } from "@/hooks/useUserData";

export const useEmployees = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { employees, loading, error } = useSelector(
        (state: RootState) => state.employee
    );

    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    return { employees, loading, error };
};

export const useWorkspaceEmployees = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userData = useUserData();
    console.log(userData)
    const workspaceid = 1
    console.log(workspaceid)
    const { employees, loading, error } = useSelector(
        (state: RootState) => state.employee
    );

    useEffect(() => {
        if (workspaceid) {
            dispatch(fetchWorkspaceEmployees(Number(workspaceid)));
        }
    }, [dispatch, workspaceid]);

    return { employees, loading, error };
};
