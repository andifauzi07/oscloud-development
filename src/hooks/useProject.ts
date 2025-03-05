// src/hooks/useProject.ts
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useUserData } from "@/hooks/useUserData";
import { LeadFilters } from "@/types/company";
import {
    assignStaffToProject,
    createProject,
    deleteProject,
    fetchProjectById,
    fetchProjects,
    removeStaffFromProject,
    updateProject,
} from "@/store/slices/projectSlice";
import { fetchLeads } from "@/store/slices/companySlice";
import { Lead } from "@/components/companyPersonnelLeadsListDataTable";

interface ProjectFilters {
    managerId?: number;
    startDate?: string;
    endDate?: string;
    status?: string;
    view?: "list" | "timeline";
    employeeId?: number;
    projectId?: number;
    companyId?: number;
}

export const useProjects = (
    filters?: ProjectFilters | null,
    page?: number,
    pageSize?: number
) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { projects, loading, error, total, currentPage, perPage } =
        useSelector((state: RootState) => state.project);

    // Memoize filters to prevent unnecessary re-renders
    const memoizedFilters = useMemo(() => {
        if (!filters) return undefined;
        return Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== undefined)
        );
    }, [filters]);

    useEffect(() => {
        if (workspaceid) {
            dispatch(
                fetchProjects({
                    workspaceId: Number(workspaceid),
                    filters: memoizedFilters,
                    page,
                    pageSize: pageSize,
                })
            );
        }
    }, [dispatch, workspaceid, memoizedFilters, page, pageSize]);

    // Function to fetch active leads for a given project.
    const fetchActiveLeadsForProject = useCallback(
        async (companyId: number): Promise<Lead[]> => {
            if (!workspaceid) {
                throw new Error("No workspace ID available");
            }

            const activeLeadFilters: LeadFilters = {
                companyId: companyId, // Filter by the specific companyId
                status: "Active", // Assuming 'Active' is the status for active leads
            };

            try {
                const result = await dispatch(
                    fetchLeads({
                        workspaceId: Number(workspaceid),
                        filters: activeLeadFilters,
                    })
                ).unwrap();
                return result;
            } catch (error) {
                console.error("Failed to fetch active leads:", error);
                return [];
            }
        },
        [dispatch, workspaceid]
    );
    // Function to get all the other leads in the same company.
    const fetchOtherLeadsForProject = useCallback(
        async (companyId: number): Promise<Lead[]> => {
            if (!workspaceid) {
                throw new Error("No workspace ID available");
            }
            const otherLeadFilters: LeadFilters = {
                companyId: companyId,
            };
            try {
                const result = await dispatch(
                    fetchLeads({
                        workspaceId: Number(workspaceid),
                        filters: otherLeadFilters,
                    })
                ).unwrap();
                return result;
            } catch (error) {
                console.error("Failed to fetch other leads:", error);
                return [];
            }
        },
        [dispatch, workspaceid]
    );

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


    //Add it here
    return {
        projects: projects, // Assert projects as Project[]
        total, // added total
        loading,
        error,
        perPage,
        createProject: createNewProject,
        fetchActiveLeadsForProject,
        fetchOtherLeadsForProject,
    };

};

export const useProject = (projectId: number) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { projects, loading, error } = useSelector(
        (state: RootState) => state.project
    );

    const project = useMemo(() => 
        projects.find(p => p.projectId === projectId),
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
        if (!workspaceid) throw new Error("No workspace ID available");
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
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(assignStaffToProject({
            workspaceId: Number(workspaceid),
            projectId,
            data: { staff }
        })).unwrap();
    }, [dispatch, workspaceid, projectId]);

    const removeStaff = useCallback(async (employeeIds: number[]) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(removeStaffFromProject({
            workspaceId: Number(workspaceid),
            projectId,
            employeeIds
        })).unwrap();
    }, [dispatch, workspaceid, projectId]);


    const deleteProjectById = useCallback(async () => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(deleteProject({
            workspaceId: Number(workspaceid),
            projectId
        })).unwrap();
    }, [dispatch, workspaceid, projectId]);

    const refresh = useCallback(async () => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(fetchProjectById({
            workspaceId: Number(workspaceid),
            projectId
        })).unwrap();
    }, [dispatch, workspaceid, projectId]);

    return {
        project,
        loading,
        error,
        updateProject: updateProjectDetails,
        assignStaff: assignStaff,
        removeStaff: removeStaff,
        deleteProject: deleteProjectById,
        refreshProject: refresh,
        isLoading: loading,
        hasError: !!error,
        errorMessage: error,
    };
};
