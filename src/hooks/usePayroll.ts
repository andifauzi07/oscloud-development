import { useEffect, useMemo } from "react";
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
    const { currentUser } = useUserData();
    const workspaceid = currentUser?.workspaceid;
    const { employees, loading, error } = useSelector(
        (state: RootState) => state.payroll
    );

    useEffect(() => {
        if (!workspaceid) return;
        
        const fetchEmployees = async () => {
            try {
                await dispatch(fetchPayrollEmployees(Number(workspaceid))).unwrap();
            } catch (error) {
                console.error('Error fetching payroll employees:', error);
            }
        };

        fetchEmployees();
    }, [dispatch, workspaceid]);

    // Filter employees by workspace ID
    const workspaceEmployees = useMemo(() => {
        if (!workspaceid || !employees) return [];
        return employees.filter(employee => employee.workspaceid === Number(workspaceid));
    }, [employees, workspaceid]);

    return { 
        employees: workspaceEmployees, 
        loading, 
        error 
    };
};

export const usePayments = (filters?: Record<string, any>) => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser } = useUserData();
    const workspaceid = currentUser?.workspaceid;
    const { payments, loading, error } = useSelector(
        (state: RootState) => state.payroll
    );

    // Memoize the filters object to prevent infinite re-renders
    const memoizedFilters = useMemo(() => filters, [
        // Explicitly list all filter properties that should trigger a re-fetch
        filters?.startDate,
        filters?.endDate,
        filters?.status,
        filters?.page,
        filters?.limit,
        // Add any other filter properties that should trigger a re-fetch
    ]);

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            if (!workspaceid || !mounted) return;

            try {
                await dispatch(
                    fetchPayments({ 
                        workspaceId: Number(workspaceid), 
                        filters: memoizedFilters 
                    })
                );
            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        };

        fetchData();

        return () => {
            mounted = false;
        };
    }, [dispatch, workspaceid, memoizedFilters]); // Use memoizedFilters instead of filters

    return { payments, loading, error };
};

export const useCreatePayment = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser } = useUserData();
    const workspaceid = currentUser?.workspaceid;
    const { loading, error } = useSelector((state: RootState) => state.payroll);

    const handleCreatePayment = async (data: any) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(
            createPayment({ workspaceId: Number(workspaceid), data })
        ).unwrap();
    };

    return { createPayment: handleCreatePayment, loading, error };
};

export const useEmployeeProfile = (employeeId: number) => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser } = useUserData();
    const workspaceid = currentUser?.workspaceid;
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
    const { currentUser } = useUserData();
    const workspaceid = currentUser?.workspaceid;
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
    const { currentUser } = useUserData();
    const workspaceid = currentUser?.workspaceid;
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

export const useUpdatePaymentStatus = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser } = useUserData();
    const workspaceid = currentUser?.workspaceid;
    const { loading, error } = useSelector((state: RootState) => state.payroll);

    const handleUpdatePaymentStatus = async (paymentId: number, data: any) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(
            updatePaymentStatus({
                workspaceId: Number(workspaceid),
                paymentId,
                data,
            })
        ).unwrap();
    };

    return { updatePaymentStatus: handleUpdatePaymentStatus, loading, error };
};
