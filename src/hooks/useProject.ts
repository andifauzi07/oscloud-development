// src/hooks/useProject.ts
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useUserData } from "@/hooks/useUserData";
import {
    fetchProjects,
    createProject,
    assignStaffToProject,
    removeStaffFromProject,
    fetchProjectById,
    deleteProject,
    type Project,
} from "@/store/slices/projectSlice";
import { fetchLeads, Lead } from "@/store/slices/companySlice";
import { LeadFilters } from "@/types/company";

export const useProjects = (
    filters?: {
        managerId?: number;
        startDate?: string;
        endDate?: string;
        status?: string;
        view?: "list" | "timeline";
        employeeId?: number;
        projectid?: number;
        companyId?: number;
    } | null,
    page?: number,
    pageSize?: number,
) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { projects, loading, error, total, currentPage, perPage } = useSelector(
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
            status: filters.status || undefined,
        };
    }, [filters]);

    useEffect(() => {
        if (workspaceid) {
            dispatch(
                fetchProjects({
                    workspaceid: Number(workspaceid),
                    // filters: memoizedFilters,
                    page,
                    page_size: pageSize,
                })
            );
        }
    }, [dispatch, workspaceid, memoizedFilters, page, pageSize]);

    const addProject = useCallback(
        async (data: {
            name: string;
            startDate: string;
            endDate: string;
            managerId: number;
            companyId: number;
            status: string;
            city: string;
            product: string;
            costs: {
                food: number;
                break: number;
                rental: number;
                revenue: number;
                other_cost: number;
                labour_cost: number;
                manager_fee: number;
                costume_cost: number;
                sales_profit: number;
                transport_cost: number;
            };
            assignedStaff: {
                employeeId: number;
                rateType: string;
                breakHours: number;
                rateValue?: number; // Add the rateValue
            }[];
        }) => {
            if (!workspaceid) throw new Error("No workspace ID available");
            return dispatch(
                createProject({
                    workspaceid: Number(workspaceid),
                    data,
                })
            ).unwrap();
        },
        [dispatch, workspaceid]
    );

    const assignStaff = useCallback(
        async (
            projectId: number,
            data: {
                staff: {
                    employeeId: number;
                    rateType: string;
                    breakHours: number;
                }[];
            }
        ) => {
            return dispatch(
                assignStaffToProject({
                    workspaceid: Number(workspaceid),
                    projectId,
                    data,
                })
            ).unwrap();
        },
        [dispatch, workspaceid]
    );

    const removeStaff = useCallback(
        async (projectId: number, employeeIds: number[]) => {
            return dispatch(
                removeStaffFromProject({
                    workspaceid: Number(workspaceid),
                    projectId,
                    employeeIds,
                })
            ).unwrap();
        },
        [dispatch, workspaceid]
    );
    const deleteProj = useCallback(
        async (projectId: number) => {
            return dispatch(
                deleteProject({
                    workspaceid: Number(workspaceid),
                    projectId,
                })
            ).unwrap();
        },
        [dispatch, workspaceid]
    );

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
    //Add it here
    return {
        projects: projects as Project[], // Assert projects as Project[]
        total, // added total
        loading,
        error,
        addProject,
        assignStaff,
        removeStaff,
        fetchActiveLeadsForProject, // Add it here
        fetchOtherLeadsForProject,
        deleteProject: deleteProj,
        currentPage,
        perPage
    };
};

export const useProject = (projectId: number) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { projects, loading, error } = useSelector(
        (state: RootState) => state.project
    );
    const project = projects.find((p) => p.projectId === projectId);

    useEffect(() => {
        if (workspaceid && projectId && !project) {
            dispatch(
                fetchProjectById({
                    projectId,
                    workspaceid: Number(workspaceid),
                })
            );
        }
    }, [dispatch, workspaceid, projectId, project]);

    return { project, loading, error };
};
