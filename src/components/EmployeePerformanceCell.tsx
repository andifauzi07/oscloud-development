import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchEmployeePerformance } from "@/store/slices/performanceSlice";

export const EmployeePerformanceCell = React.memo(({
    workspaceId,
    employeeId,
    templateId,
    categoryId,
}: {
    workspaceId: number;
    employeeId: number;
    templateId?: number;
    categoryId?: number;
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const performance = useSelector((state: RootState) => 
        state.performance.employeePerformances[employeeId]
    );
    const loading = useSelector((state: RootState) => 
        state.performance.loading
    );

    useEffect(() => {
        // Only fetch if we don't already have the data
        if (workspaceId && employeeId && templateId && !performance) {
            dispatch(
                fetchEmployeePerformance({
                    workspaceId,
                    filters: {
                        employeeId,
                        templateId,
                    },
                })
            );
        }
    }, [dispatch, workspaceId, employeeId, templateId, performance]);

    const categoryScore = performance?.performances?.[0]?.categories?.find(
        (cat) => cat.categoryId === categoryId
    )?.categoryScore;

    if (loading && !performance) {
        return <span>Loading...</span>;
    }

    return <span>{categoryScore !== undefined ? `${categoryScore}%` : "N/A"}</span>;
});

export default EmployeePerformanceCell;