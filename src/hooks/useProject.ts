import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { useUserData } from '@/hooks/useUserData';
import {
    fetchProjects,
    createProject,
    assignStaffToProject,
    removeStaffFromProject,
    type Project
} from '@/store/slices/projectSlice';

export const useProjects = (filters?: {
    managerId?: number;
    startDate?: string;
    endDate?: string;
    status?: string;
    view?: 'list' | 'timeline';
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { projects, loading, error } = useSelector(
        (state: RootState) => state.project
    );

    useEffect(() => {
        if (workspaceid) {
            dispatch(fetchProjects({ 
                workspaceId: Number(workspaceid),
                filters 
            }));
        }
    }, [dispatch, workspaceid, filters]);

    const addProject = async (data: {
        name: string;
        startDate: string;
        endDate: string;
        managerId: number;
        assignedStaff: {
            employeeId: number;
            rateType: string;
            breakHours: number;
        }[];
    }) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(createProject({ 
            workspaceId: Number(workspaceid),
            data 
        })).unwrap();
    };

    const assignStaff = async (projectId: number, data: {
        employeeId: number;
        rateType: string;
        breakHours: number;
    }) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(assignStaffToProject({ 
            workspaceId: Number(workspaceid),
            projectId,
            data 
        })).unwrap();
    };

    const removeStaff = async (projectId: number, employeeId: number) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(removeStaffFromProject({ 
            workspaceId: Number(workspaceid),
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
    const { projects } = useSelector((state: RootState) => state.project);
    return projects.find(project => project.projectId === projectId);
};