import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useUserData } from "@/hooks/useUserData";
import {
    Project,
    ProjectFilters,
    CreateProjectRequest,
    CreateProjectLeadRequest,
    AssignStaffRequest,
    assignStaff,
    createProject,
    deleteProject,
    fetchProjectById,
    fetchProjects,
    removeStaff,
    updateProject,
    fetchProjectLeads,
    createProjectLead,
    deleteProjectLead,
    clearCurrentProject,
} from "@/store/slices/projectSlice";

export const useProjects = (filters?: {
    keyword?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    page?: number;
    limit?: number;
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { projects, loading, error, total, page, limit } = useSelector(
        (state: RootState) => state.project
    );

    useEffect(() => {
        if (workspaceid) {
            dispatch(fetchProjects({
                workspaceId: Number(workspaceid),
                filters: {
                    ...filters,
                    page: filters?.page || 1,
                    limit: filters?.limit || 10
                }
            }));
        }
    }, [dispatch, workspaceid, filters]);

    return {
        projects,
        loading,
        error,
        total,
        page,
        limit
    };
};

export const useProject = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();

    const {
        projects,
        currentProject,
        projectLeads,
        loading,
        error,
    } = useSelector((state: RootState) => state.project);

    const getProjects = useCallback(
        (filters?: ProjectFilters) => {
            return dispatch(fetchProjects({ workspaceId: Number(workspaceid), filters }));
        },
        [dispatch, workspaceid]
    );

    const getProjectById = useCallback(
        (projectId: number) => {
            return dispatch(fetchProjectById({ workspaceId: Number(workspaceid), projectId }));
        },
        [dispatch, workspaceid]
    );

    const addProject = useCallback(
        (data: CreateProjectRequest) => {
            return dispatch(createProject({ workspaceId: Number(workspaceid), data }));
        },
        [dispatch, workspaceid]
    );

    const editProject = useCallback(async ({ projectId, data }: { projectId: number; data: Partial<CreateProjectRequest> }) => {
        if (!workspaceid) throw new Error('Workspace ID is required');
        return dispatch(updateProject({ workspaceId: Number(workspaceid), projectId, data })).unwrap();
    }, [dispatch, workspaceid]);

    const removeProject = useCallback(
        (projectId: number) => {
            return dispatch(deleteProject({ workspaceId: Number(workspaceid), projectId }));
        },
        [dispatch, workspaceid]
    );

    const assignProjectStaff = useCallback(
        (projectId: number, data: AssignStaffRequest) => {
            return dispatch(assignStaff({ workspaceId: Number(workspaceid), projectId, data }));
        },
        [dispatch, workspaceid]
    );

    const removeProjectStaff = useCallback(
        (projectId: number, employeeIds: number[]) => {
            return dispatch(removeStaff({ workspaceId: Number(workspaceid), projectId, employeeIds }));
        },
        [dispatch, workspaceid]
    );
    const getProjectLeads = useCallback(
        () => {
            return dispatch(fetchProjectLeads(Number(workspaceid)));
        },
        [dispatch, workspaceid]
    );

    const addProjectLead = useCallback(
        (data: CreateProjectLeadRequest) => {
            return dispatch(createProjectLead({ workspaceId: Number(workspaceid), data }));
        },
        [dispatch, workspaceid]
    );

    const removeProjectLead = useCallback(
        (projectId: number, leadId: number) => {
            return dispatch(deleteProjectLead({ 
                workspaceId: Number(workspaceid), 
                projectId, 
                leadId 
            }));
        },
        [dispatch, workspaceid]
    );

    const clearProject = useCallback(
        () => {
            dispatch(clearCurrentProject());
        },
        [dispatch]
    );

    return {
        // State
        projects,
        currentProject,
        projectLeads,
        loading,
        error,

        // Actions
        getProjects,
        getProjectById,
        addProject,
        editProject,
        removeProject,
        assignProjectStaff,
        removeProjectStaff,
        getProjectLeads,
        addProjectLead,
        removeProjectLead,
        clearProject,
    };
};
