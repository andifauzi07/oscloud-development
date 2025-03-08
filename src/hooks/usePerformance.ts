import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useUserData } from "@/hooks/useUserData";
import {
    fetchTemplates,
    createTemplate,
    updateTemplate,
    fetchSheets,
    createSheet,
    fetchEmployeePerformance,
    fetchSheetById,
    clearCurrentSheet,
} from "@/store/slices/performanceSlice";
import {
    EmployeePerformance,
    PerformanceFilters,
    Point,
    Score,
    Template,
    UsePerformanceTemplatesReturn,
} from "@/types/performance";

export const usePerformanceTemplates = (): UsePerformanceTemplatesReturn => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser } = useUserData();
    const workspaceid = currentUser?.workspaceid;
    const { templates, loading, error } = useSelector(
        (state: RootState) => state.performance
    );

    useEffect(() => {
        if (workspaceid && templates.length === 0) {
            dispatch(fetchTemplates(Number(workspaceid)));
        }
    }, [dispatch, workspaceid, templates.length]); // Prevent unnecessary re-fetching

    const getTemplateById = useMemo(
        () => (id: number) => templates.find((t) => t.templateid === id),
        [templates]
    );

    const getCategoryPoints = useMemo(
        () =>
            (templateId: number, categoryId: number): Point[] => {
                const template = templates.find(
                    (t) => t.templateid === templateId
                );
                return (
                    template?.categories.find(
                        (c) => c.categoryid === categoryId
                    )?.points || []
                );
            },
        [templates]
    );

    const addTemplate = async (data: any) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(
            createTemplate({ workspaceId: Number(workspaceid), data })
        ).unwrap();
    };

    const editTemplate = async (
        templateId: number,
        data: Partial<Template>
    ) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(
            updateTemplate({
                workspaceId: Number(workspaceid),
                templateId,
                data,
            })
        ).unwrap();
    };

    return {
        templates,
        loading,
        error,
        addTemplate,
        editTemplate,
        getTemplateById,
        getCategoryPoints,
    };
};

export const usePerformanceTemplate = (templateId: number) => {
    const { templates, loading } = useSelector(
        (state: RootState) => state.performance
    );

    const selectedTemplate = useMemo(
        () => templates.find((t) => t.templateid === templateId) || null,
        [templates, templateId]
    );

    const getTotalWeight = (categoryId: number): number => {
        return (
            selectedTemplate?.categories
                .find((c) => c.categoryid === categoryId)
                ?.points.reduce((sum, point) => sum + point.weight, 0) || 0
        );
    };

    return {
        template: selectedTemplate,
        categories: selectedTemplate?.categories || [],
        loading,
        getTotalWeight,
    };
};

export const usePerformanceSheets = ({
    employeeId,
    sheetId,
}: {
    employeeId?: number;
    sheetId?: number;
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser } = useUserData();
    const workspaceid = currentUser?.workspaceid;
    const { sheets, currentSheet, loading, error } = useSelector(
        (state: RootState) => ({
            sheets: state.performance.sheets,
            currentSheet: state.performance.currentSheet,
            loading: state.performance.loading,
            error: state.performance.error,
        })
    );

    useEffect(() => {
        if (!workspaceid) return;

        if (sheetId) {
            dispatch(
                fetchSheetById({ workspaceId: Number(workspaceid), sheetId })
            );
        } else if (employeeId) {
            dispatch(
                fetchSheets({
                    workspaceId: Number(workspaceid),
                    filters: { employeeId },
                })
            );
        }

        return () => {
            dispatch(clearCurrentSheet());
        };
    }, [dispatch, workspaceid, employeeId, sheetId]);

    const createNewSheet = async (data: {
        employeeId: number;
        templateId: number;
        scores: Score[];
    }) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(
            createSheet({ workspaceId: Number(workspaceid), data })
        ).unwrap();
    };

    return {
        sheets,
        sheet: sheetId ? currentSheet : null,
        loading,
        error,
        createSheet: createNewSheet,
    };
};

export const getCategoryScore = ({
    employeePerformance,
    employeeId,
    categoryId,
    sheetId,
}: {
    employeePerformance: EmployeePerformance | null;
    employeeId: number;
    categoryId?: number;
    sheetId?: number;
}): number | null | { [categoryId: number]: number } => {
    if (
        !employeePerformance ||
        employeePerformance.employee.employeeId !== employeeId
    ) {
        return null;
    }

    const performances = employeePerformance.performances;
    const targetPerformance =
        sheetId ?
            performances.find((perf) => perf.sheetId === sheetId)
        :   performances[0]; // Default to first performance

    if (!targetPerformance) return null;

    if (categoryId !== undefined) {
        return (
            targetPerformance.categories.find(
                (c) => c.categoryId === categoryId
            )?.categoryScore || null
        );
    }

    return targetPerformance.categories.reduce(
        (scores, category) => ({
            ...scores,
            [category.categoryId]: category.categoryScore,
        }),
        {}
    );
};

export const useEmployeePerformance = ({
    workspaceId,
    employeeId,
    templateId,
}: {
    workspaceId: number;
    employeeId?: number;
    templateId?: number;
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { employeePerformances, loading, error } = useSelector(
        (state: RootState) => state.performance
    );

    useEffect(() => {
        if (workspaceId && employeeId !== undefined) {
            dispatch(
                fetchEmployeePerformance({
                    workspaceId,
                    filters: { employeeId, templateId },
                })
            );
        }
    }, [dispatch, workspaceId, employeeId, templateId]);

    return {
        performanceData: employeePerformances,
        loading,
        error,
    };
};
