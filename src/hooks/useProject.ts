import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useUserData } from "@/hooks/useUserData";
import {
    Project,
    ProjectFilters,
    assignStaffToProject,
    createProject,
    deleteProject,
    fetchProjectById,
    fetchProjects,
    removeStaffFromProject,
    updateProject,
} from "@/store/slices/projectSlice";

export const useProjects = (filters?: ProjectFilters) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { projects, loading, error, total, perPage } = useSelector(
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

    return {
        projects,
        total,
        loading,
        error,
        perPage,
    };
};

export const useProject = (projectId?: number) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { projects, loading, error } = useSelector(
        (state: RootState) => state.project
    );

    const project = useMemo(() => 
        projectId ? projects.find(p => p.projectId === projectId) : undefined,
        [projects, projectId]
    );

    useEffect(() => {
        if (workspaceid && projectId && !project) {
            dispatch(fetchProjectById({
                workspaceId: Number(workspaceid),
                projectId
            }));
        }
    }, [dispatch, workspaceid, projectId, project]);

    const createNewProject = useCallback(async (data: {
        name: string;
        startDate: string;
        endDate: string;
        managerId: number;
        companyId: number;
        status: string;
        city: string;
        product: string;
    }) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(createProject({
            workspaceId: Number(workspaceid),
            data
        })).unwrap();
    }, [dispatch, workspaceid]);

    const updateProjectDetails = useCallback(async (data: Partial<{
        name: string;
        startDate: string;
        endDate: string;
        managerId: number;
        companyId: number;
        status: string;
        city: string;
        product: string;
    }>) => {
        if (!workspaceid || !projectId) throw new Error("Required IDs not available");
        return dispatch(updateProject({
            workspaceId: Number(workspaceid),
            projectId,
            data
        })).unwrap();
    }, [dispatch, workspaceid, projectId]);

    const assignStaff = useCallback(async (staff: Array<{
        employeeId: number;
        rateType: string;
        breakHours: number;
    }>) => {
        if (!workspaceid || !projectId) throw new Error("Required IDs not available");
        return dispatch(assignStaffToProject({
            workspaceId: Number(workspaceid),
            projectId,
            data: { staff }
        })).unwrap();
    }, [dispatch, workspaceid, projectId]);

    return {
        project,
        loading,
        error,
        createProject: createNewProject,
        updateProject: updateProjectDetails,
        assignStaff,
        removeStaff: useCallback(async (employeeIds: number[]) => {
            if (!workspaceid || !projectId) throw new Error("Required IDs not available");
            return dispatch(removeStaffFromProject({
                workspaceId: Number(workspaceid),
                projectId,
                employeeIds
            })).unwrap();
        }, [dispatch, workspaceid, projectId]),
        deleteProject: useCallback(async () => {
            if (!workspaceid || !projectId) throw new Error("Required IDs not available");
            return dispatch(deleteProject({
                workspaceId: Number(workspaceid),
                projectId
            })).unwrap();
        }, [dispatch, workspaceid, projectId]),
        isLoading: loading,
        hasError: !!error,
        errorMessage: error,
    };
};
