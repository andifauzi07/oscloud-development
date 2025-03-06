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

export const useProjects = (filters?: ProjectFilters) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { projects, loading, error, total,  } = useSelector(
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
    };
};

export const useProject = (workspaceId?: number) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const effectiveWorkspaceId = workspaceId || Number(workspaceid);
    
    const {
        projects,
        currentProject,
        projectLeads,
        loading,
        error,
        total,
        page,
        limit,
    } = useSelector((state: RootState) => state.project);

    const getProjects = useCallback(
        (filters?: ProjectFilters) => {
            return dispatch(fetchProjects({ workspaceId: effectiveWorkspaceId, filters }));
        },
        [dispatch, effectiveWorkspaceId]
    );

    const getProjectById = useCallback(
        (projectId: number) => {
            return dispatch(fetchProjectById({ workspaceId: effectiveWorkspaceId, projectId }));
        },
        [dispatch, effectiveWorkspaceId]
    );

    const addProject = useCallback(
        (data: CreateProjectRequest) => {
            return dispatch(createProject({ workspaceId: effectiveWorkspaceId, data }));
        },
        [dispatch, effectiveWorkspaceId]
    );

    const editProject = useCallback(
        (projectId: number, data: Partial<CreateProjectRequest>) => {
            return dispatch(updateProject({ workspaceId: effectiveWorkspaceId, projectId, data }));
        },
        [dispatch, effectiveWorkspaceId]
    );

    const removeProject = useCallback(
        (projectId: number) => {
            return dispatch(deleteProject({ workspaceId: effectiveWorkspaceId, projectId }));
        },
        [dispatch, effectiveWorkspaceId]
    );

    const assignProjectStaff = useCallback(
        (projectId: number, data: AssignStaffRequest) => {
            return dispatch(assignStaff({ workspaceId: effectiveWorkspaceId, projectId, data }));
        },
        [dispatch, effectiveWorkspaceId]
    );

    const removeProjectStaff = useCallback(
        (projectId: number, employeeIds: number[]) => {
            return dispatch(removeStaff({ workspaceId: effectiveWorkspaceId, projectId, employeeIds }));
        },
        [dispatch, effectiveWorkspaceId]
    );

    const getProjectLeads = useCallback(
        () => {
            return dispatch(fetchProjectLeads(effectiveWorkspaceId));
        },
        [dispatch, effectiveWorkspaceId]
    );

    const addProjectLead = useCallback(
        (data: CreateProjectLeadRequest) => {
            return dispatch(createProjectLead({ workspaceId: effectiveWorkspaceId, data }));
        },
        [dispatch, effectiveWorkspaceId]
    );

    const removeProjectLead = useCallback(
        (projectId: number, leadId: number) => {
            return dispatch(deleteProjectLead({ 
                workspaceId: effectiveWorkspaceId, 
                projectId, 
                leadId 
            }));
        },
        [dispatch, effectiveWorkspaceId]
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
        total,
        page,
        limit,

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
