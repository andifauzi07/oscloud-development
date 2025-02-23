import { fetchPayments } from "@/store/slices/payrollSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// function usePayroll({ workspaceId, employeeId }: { workspaceId: number; employeeId: string }) {

export const usePayroll = ({
    workspaceId,
    status,
    employeeId,
}: {
    workspaceId: number;
    status?: string;
    employeeId?: string;
}): { payments: any; loading: boolean; error: any } => {
    const dispatch = useDispatch<AppDispatch>();
    const { payments, loading, error } = useSelector(
        (state: RootState) => state.payroll
    );

    useEffect(() => {
        dispatch(
            fetchPayments({
                workspaceId: workspaceId,
                status: status,
                employeeId: Number(employeeId),
            })
        );
    }, [dispatch, workspaceId, status, employeeId]);

    return { payments, loading, error };
};
