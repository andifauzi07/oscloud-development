import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useUserData } from "@/hooks/useUserData";
import {
    fetchTemplates,
    createTemplate,
    updateTemplate,
    type Template,
    type Point,
    type Category,
    fetchSheets,
    Score,
    createSheet,
    PerformanceSheet
} from "@/store/slices/performanceSlice";

interface UsePerformanceTemplatesReturn {
    templates: Template[];
    loading: boolean;
    error: string | null;
    addTemplate: (data: Partial<Template>) => Promise<Template>;
    editTemplate: (templateId: number, data: Partial<Template>) => Promise<Template>;
    getTemplateById: (id: number) => Template | undefined;
    getCategoryPoints: (templateId: number, categoryId: number) => Point[];
}

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
            const result = await dispatch(createTemplate({ 
                workspaceId: Number(workspaceid), 
                data 
            })).unwrap();
            return result;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to create template");
        }
    };

    const editTemplate = async (templateId: number, data: Partial<Template>) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        try {
            const result = await dispatch(updateTemplate({ 
                workspaceId: Number(workspaceid),
                templateId,
                data 
            })).unwrap();
            return result;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to update template");
        }
    };

    const getTemplateById = (id: number) => {
        return templates.find(template => template.templateid === id);
    };

    const getCategoryPoints = (templateId: number, categoryId: number): Point[] => {
        const template = templates.find(t => t.templateid === templateId);
        const category = template?.categories.find(c => c.categoryid === categoryId);
        return category?.points || [];
    };

    return {
        templates,
        loading,
        error,
        addTemplate,
        editTemplate,
        getTemplateById,
        getCategoryPoints
    };
};

export const usePerformanceTemplate = (templateId: number) => {
    const { templates, loading } = useSelector((state: RootState) => state.performance);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

    useEffect(() => {
        const template = templates.find(t => t.templateid === templateId);
        if (template) {
            setSelectedTemplate(template);
        }
    }, [templates, templateId]);

    const getTotalWeight = (categoryId: number): number => {
        const category = selectedTemplate?.categories.find(c => c.categoryid === categoryId);
        return category?.points.reduce((sum, point) => sum + point.weight, 0) || 0;
    };

    return {
        template: selectedTemplate,
        categories: selectedTemplate?.categories || [],
        loading,
        getTotalWeight
    };
};

export const usePerformanceSheets = (filters?: {
    employeeId?: number;
    templateId?: number;
    startDate?: string;
    endDate?: string;
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { sheets, loading, error } = useSelector(
        (state: RootState) => state.performance
    );

    useEffect(() => {
        if (workspaceid) {
            dispatch(fetchSheets({ 
                workspaceId: Number(workspaceid),
                filters 
            }));
        }
    }, [dispatch, workspaceid, filters]);

    const createNewSheet = async (data: {
        employeeId: number;
        templateId: number;
        scores: Score[];
    }) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(createSheet({ 
            workspaceId: Number(workspaceid),
            data 
        })).unwrap();
    };

    return {
        sheets,
        loading,
        error,
        createSheet: createNewSheet
    };
};

// Add getPerformanceScore implementation
export const getPerformanceScore = (sheets: PerformanceSheet[], employeeId: number, categoryId: number) => {
    const employeeSheets = sheets.filter(sheet => 
        sheet.employee.employeeid === employeeId
    );
    
    if (employeeSheets.length === 0) return null;
    
    // Get the latest sheet
    const latestSheet = employeeSheets.reduce((latest, current) => 
        new Date(current.createdDate) > new Date(latest.createdDate) ? current : latest
    );

    return latestSheet.totalScore;
};