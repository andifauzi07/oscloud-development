import { useEffect, useState } from "react";
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
    const { workspaceid } = useUserData();
    const { templates, loading, error } = useSelector(
        (state: RootState) => state.performance
    );

    useEffect(() => {
        if (workspaceid) {
            dispatch(fetchTemplates(Number(workspaceid)));
        }
    }, [dispatch, workspaceid]);

    const addTemplate = async (data: any) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        try {
            const result = await dispatch(
                createTemplate({
                    workspaceId: Number(workspaceid),
                    data,
                })
            ).unwrap();
            return result;
        } catch (error) {
            throw new Error(
                error instanceof Error ?
                    error.message
                :   "Failed to create template"
            );
        }
    };

    const editTemplate = async (
        templateId: number,
        data: Partial<Template>
    ) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        try {
            const result = await dispatch(
                updateTemplate({
                    workspaceId: Number(workspaceid),
                    templateId,
                    data,
                })
            ).unwrap();
            return result;
        } catch (error) {
            throw new Error(
                error instanceof Error ?
                    error.message
                :   "Failed to update template"
            );
        }
    };

    const getTemplateById = (id: number) => {
        return templates.find((template) => template.templateid === id);
    };

    const getCategoryPoints = (
        templateId: number,
        categoryId: number
    ): Point[] => {
        const template = templates.find((t) => t.templateid === templateId);
        const category = template?.categories.find(
            (c) => c.categoryid === categoryId
        );
        return category?.points || [];
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
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
        null
    );

    useEffect(() => {
        const template = templates.find((t) => t.templateid === templateId);
        if (template) {
            setSelectedTemplate(template);
        }
    }, [templates, templateId]);

    const getTotalWeight = (categoryId: number): number => {
        const category = selectedTemplate?.categories.find(
            (c: any) => c.categoryid === categoryId
        );
        return (
            category?.points.reduce(
                (sum: any, point: any) => sum + point.weight,
                0
            ) || 0
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
    const { workspaceid } = useUserData();
    const { sheets, loading, error } = useSelector((state: RootState) => state.performance);

    useEffect(() => {
        if (!workspaceid) return;

        if (employeeId && sheetId) {
            dispatch(
                fetchSheets({
                    workspaceId: Number(workspaceid),
                    filters: { employeeId, sheetId },
                })
            );
        } else if (employeeId) {
            dispatch(
                fetchSheets({
                    workspaceId: Number(workspaceid),
                    filters: { employeeId },
                })
            );
        }
    }, [dispatch, workspaceid, employeeId, sheetId]);

    let sheet = null;
    if (sheets && sheetId) {
        sheet = sheets.find(s => s.sheetId === sheetId);
    }

    return {
        sheets,
        sheet,
        loading,
        error,
        createSheet: async (data: {
            employeeId: number;
            templateId: number;
            scores: Score[];
        }) => {
            if (!workspaceid) throw new Error("No workspace ID available");
            return dispatch(
                createSheet({
                    workspaceId: Number(workspaceid),
                    data,
                })
            ).unwrap();
        },
    };
};

// Get specific category score
// const score = getCategoryScore({
//     employeePerformance,
//     employeeId: 2,
//     categoryId: 1
// });

// Get all category scores from latest performance
// const allScores = getCategoryScore({
//     employeePerformance,
//     employeeId: 2
// });

// Get specific category score from specific sheet
// const sheetScore = getCategoryScore({
//     employeePerformance,
//     employeeId: 2,
//     categoryId: 1,
//     sheetId: 5
// });

// Get all category scores from specific sheet
// const allSheetScores = getCategoryScore({
//     employeePerformance,
//     employeeId: 2,
//     sheetId: 5
// });

// Define the interface for the parameters
interface GetCategoryScoreParams {
    employeePerformance: EmployeePerformance | null;
    employeeId: number;
    categoryId?: number;
    sheetId?: number;
}

export const getCategoryScore = ({
    employeePerformance,
    employeeId,
    categoryId,
    sheetId,
}: GetCategoryScoreParams):
    | number
    | null
    | { [categoryId: number]: number } => {
    if (
        !employeePerformance ||
        employeePerformance.employee.employeeId !== employeeId
    ) {
        return null;
    }

    const performances = employeePerformance.performances;

    // Filter by sheetId if provided
    const targetPerformance =
        sheetId ?
            performances.find((perf) => perf.sheetId === sheetId)
        :   performances[0]; // Default to first performance if no sheetId

    if (!targetPerformance) return null;

    // If specific categoryId is provided, return that category's score
    if (categoryId !== undefined) {
        const category = targetPerformance.categories.find(
            (category) => category.categoryId === categoryId
        );
        return category?.categoryScore || null;
    }

    // If no categoryId provided, return all categories scores as an object
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
                    filters: {
                        employeeId,
                        templateId,
                    },
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
