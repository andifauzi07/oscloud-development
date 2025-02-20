// INCOMPLETE.

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "@/store/slices/employeeSlice";
import { RootState, AppDispatch } from "@/store/store";

export const useEmployees = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { employees, loading, error } = useSelector((state: RootState) => state.employee);

    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    return { employees, loading, error };
};
