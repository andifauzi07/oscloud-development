// usePayroll.ts
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useUserData } from "@/hooks/useUserData";
import {
    fetchPayrollEmployees,
    fetchPayments,
    createPayment,
    updatePaymentStatus,
    fetchEmployeeProfile,
    fetchEmployeeProjects,
    fetchEmployeePayments,
    clearEmployeeData,
} from "@/store/slices/payrollSlice";

export const usePayrollEmployees = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { employees, loading, error } = useSelector(
        (state: RootState) => state.payroll
    );

    useEffect(() => {
        if (workspaceid) {
            dispatch(fetchPayrollEmployees(Number(workspaceid)));
        }
    }, [dispatch, workspaceid]);

    return { employees, loading, error };
};

export const usePayrollPayments = (filters?: {
    status?: string;
    employeeId?: number;
    startDate?: string;
    endDate?: string;
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { payments, loading, error } = useSelector(
        (state: RootState) => state.payroll
    );

    useEffect(() => {
        if (workspaceid) {
            dispatch(
                fetchPayments({
                    workspaceId: Number(workspaceid),
                    ...filters,
                })
            );
        }
    }, [dispatch, workspaceid, filters]);

    return { payments, loading, error };
};

export const useCreatePayment = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { loading, error } = useSelector((state: RootState) => state.payroll);

    const handleCreatePayment = async (data: any) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(
            createPayment({
                workspaceId: Number(workspaceid),
                createdby: data.createdby,
                data,
            })
        ).unwrap();
    };

    return { createPayment: handleCreatePayment, loading, error };
};

export const useUpdatePaymentStatus = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { loading, error } = useSelector((state: RootState) => state.payroll);

    const handleUpdateStatus = async (paymentId: number, status: string) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(
            updatePaymentStatus({
                workspaceId: Number(workspaceid),
                paymentId,
                status,
            })
        ).unwrap();
    };

    return { updateStatus: handleUpdateStatus, loading, error };
};

export const useEmployeeProfile = (employeeId: number) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { employeeProfile, loading, error } = useSelector(
        (state: RootState) => state.payroll
    );

    useEffect(() => {
        if (workspaceid && employeeId) {
            dispatch(
                fetchEmployeeProfile({
                    workspaceId: Number(workspaceid),
                    employeeId,
                })
            );
        }

        return () => {
            dispatch(clearEmployeeData());
        };
    }, [dispatch, workspaceid, employeeId]);

    return { profile: employeeProfile, loading, error };
};

export const useEmployeeProjects = (employeeId: number) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { employeeProjects, loading, error } = useSelector(
        (state: RootState) => state.payroll
    );

    useEffect(() => {
        if (workspaceid && employeeId) {
            dispatch(
                fetchEmployeeProjects({
                    workspaceId: Number(workspaceid),
                    employeeId,
                })
            );
        }
    }, [dispatch, workspaceid, employeeId]);

    return { projects: employeeProjects, loading, error };
};

export const useEmployeePayments = (employeeId: number) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { employeePayments, loading, error } = useSelector(
        (state: RootState) => state.payroll
    );

    useEffect(() => {
        if (workspaceid && employeeId) {
            dispatch(
                fetchEmployeePayments({
                    workspaceId: Number(workspaceid),
                    employeeId,
                })
            );
        }
    }, [dispatch, workspaceid, employeeId]);

    return { payments: employeePayments, loading, error };
};
