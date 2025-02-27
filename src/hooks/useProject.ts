import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { useUserData } from '@/hooks/useUserData';
import {
    fetchProjects,
    createProject,
    assignStaffToProject,
    removeStaffFromProject,
    fetchProjectById
} from '@/store/slices/projectSlice';

export const useProjects = (filters?: {
    managerId?: number;
    startDate?: string;
    endDate?: string;
    view?: 'list' | 'timeline';
    employeeId?: number;
    projectid?: number;
    companyId?: number;
} | null) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { projects, loading, error } = useSelector(
        (state: RootState) => state.project
    );

    // Memoize filters to prevent unnecessary re-renders
    const memoizedFilters = useMemo(() => {
        if (!filters) return null;
        return {
            ...filters,
            // Only include non-empty values
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
        };
    }, [filters]);

    useEffect(() => {
        if (workspaceid && memoizedFilters) {
            dispatch(fetchProjects({
                workspaceid: Number(workspaceid),
                filters: memoizedFilters
            }));
        }
    }, [dispatch, workspaceid, memoizedFilters]);

    const addProject = useCallback(async (data: {
        name: string;
        startDate: string;
        endDate: string;
        managerId: number;
        companyId: number;
        assignedStaff: {
            employeeId: number;
            rateType: string;
            breakHours: number;
        }[];
    }) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(createProject({
            workspaceid: Number(workspaceid),
            data,
        })).unwrap();
    }, [dispatch, workspaceid]);

    const assignStaff = async (projectId: number, data: {
        employeeId: number;
        rateType: string;
        breakHours: number;
    }) => {
        return dispatch(assignStaffToProject({
            workspaceid: Number(workspaceid),
            projectId,
            data
        })).unwrap();
    };

    const removeStaff = async (projectId: number, employeeId: number) => {
        return dispatch(removeStaffFromProject({
            workspaceid: Number(workspaceid),
            projectId,
            employeeId
        })).unwrap();
    };

    return {
        projects,
        loading,
        error,
        addProject,
        assignStaff,
        removeStaff
    };
};

export const useProject = (projectId: number) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { projects, loading, error } = useSelector((state: RootState) => state.project);
    const project = projects.find(p => p.projectId === projectId);

    useEffect(() => {
        if (workspaceid && projectId && !project) {
            dispatch(fetchProjectById({
                projectId,
                workspaceid: Number(workspaceid)
            }));
        }
    }, [dispatch, workspaceid, projectId, project]);

    return { project, loading, error };
};