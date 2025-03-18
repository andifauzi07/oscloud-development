import { useCallback, useEffect, useMemo } from "react";
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
    CreateCategoryRequest,
    UpdateCategoryRequest,
    fetchProjectCategories,
    createProjectCategory,
    updateProjectCategory,
    deleteProjectCategory,
} from "@/store/slices/projectSlice";
import { UpdateProjectRequest } from "@/types/project";

export const useProjects = (filters?: {
    keyword?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    page?: number;
    limit?: number;
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser } = useUserData();
    const workspaceid = currentUser?.workspaceid;
    
    const memoizedFilters = useMemo(() => filters, [
        filters?.keyword,
        filters?.startDate,
        filters?.endDate,
        filters?.status,
        filters?.page,
        filters?.limit
    ]);

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            if (!workspaceid) return;

            try {
                await dispatch(fetchProjects({
                    workspaceId: Number(workspaceid),
                    filters: memoizedFilters
                })).unwrap();
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchData();

        return () => {
            mounted = false;
        };
    }, [dispatch, workspaceid, memoizedFilters]);

    const state = useSelector((state: RootState) => ({
        projects: state.project.projects,
        loading: state.project.loading,
        error: state.project.error,
        total: state.project.total,
        page: state.project.currentPage,
        limit: state.project.limit
    }));

    console.log('useProjects state:', state);

    return state;
};

export const useProject = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser } = useUserData();
    const workspaceid = currentUser?.workspaceid;

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
        async (projectId: number) => {
            if (!workspaceid) {
                throw new Error('Workspace ID is required');
            }
            const workspaceIdNum = Number(workspaceid);
            if (isNaN(workspaceIdNum)) {
                throw new Error('Invalid Workspace ID');
            }
            console.log('Dispatching fetchProjectById:', { workspaceId: workspaceIdNum, projectId });
            return await dispatch(fetchProjectById({ 
                workspaceId: workspaceIdNum, 
                projectId 
            })).unwrap();
        },
        [dispatch, workspaceid]
    );

    const addProject = useCallback(
        (data: CreateProjectRequest) => {
            return dispatch(createProject({ workspaceId: Number(workspaceid), data }));
        },
        [dispatch, workspaceid]
    );

    const editProject = useCallback(
        async ({ projectId, data }: { projectId: number; data: Partial<UpdateProjectRequest> }) => {
            if (!workspaceid) {
                throw new Error('Workspace ID is required');
            }
            
            console.log('Editing project with data:', { workspaceId: Number(workspaceid), projectId, data });
            
            return await dispatch(updateProject({ 
                workspaceId: Number(workspaceid), 
                projectId, 
                data 
            })).unwrap();
        },
        [dispatch, workspaceid]
    );

    const removeProject = useCallback(
        (projectId: number) => {
            return dispatch(deleteProject({ workspaceId: Number(workspaceid), projectId }));
        },
        [dispatch, workspaceid]
    );

    const assignProjectStaff = useCallback(
        (projectId: number, employeeId: number) => {
            return dispatch(assignStaff({ 
                workspaceId: Number(workspaceid), 
                projectId,
                employeeId
            }));
        },
        [dispatch, workspaceid]
    );

    const removeProjectStaff = useCallback(
        (projectId: number, employeeId: number) => {
            return dispatch(removeStaff({ 
                workspaceId: Number(workspaceid), 
                projectId,
                employeeId
            }));
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

    const getProjectCategories = useCallback(async () => {
        if (!workspaceid) throw new Error('Workspace ID is required');
        return dispatch(fetchProjectCategories(Number(workspaceid))).unwrap();
    }, [dispatch, workspaceid]);

    const createCategory = useCallback(async (data: CreateCategoryRequest) => {
        if (!workspaceid) throw new Error('Workspace ID is required');
        return dispatch(createProjectCategory({ 
            workspaceId: Number(workspaceid), 
            data 
        })).unwrap();
    }, [dispatch, workspaceid]);

    const updateCategory = useCallback(async (categoryId: number, data: UpdateCategoryRequest) => {
        if (!workspaceid) throw new Error('Workspace ID is required');
        return dispatch(updateProjectCategory({ 
            workspaceId: Number(workspaceid), 
            categoryId, 
            data 
        })).unwrap();
    }, [dispatch, workspaceid]);

    const deleteCategory = useCallback(async (categoryId: number) => {
        if (!workspaceid) throw new Error('Workspace ID is required');
        return dispatch(deleteProjectCategory({ 
            workspaceId: Number(workspaceid), 
            categoryId 
        })).unwrap();
    }, [dispatch, workspaceid]);

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
        getProjectCategories,
        createCategory,
        updateCategory,
        deleteCategory,
    };
};
