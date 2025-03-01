// src/hooks/useCompany.ts
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useUserData } from "@/hooks/useUserData";
import {
    fetchCompanies,
    createCompany,
    fetchLeads,
    createLead,
    updateLeadStatus,
    deleteCompany,
    type Company,
    type Lead,
    Personnel,
    deleteLead,
} from "@/store/slices/companySlice";
import { LeadFilters } from "@/types/company";

export const useCompanies = (
    filters?: {
        category?: string;
        // Add other filter options if needed
    } | null,
    search?: string,
    page?: number,
    limit?: number,
) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { companies, total, loading, error, currentPage, perPage } =
        useSelector((state: RootState) => state.company);

    // Memoize filters to prevent unnecessary re-renders
    const memoizedFilters = useMemo(() => {
        if (!filters) return null;
        return {
            ...filters,
            // Only include non-empty values
            category: filters.category || undefined,
        };
    }, [filters?.category]); //Add the correct dependency

    useEffect(() => {
        if (workspaceid) {
            dispatch(
                fetchCompanies({
                    workspaceId: Number(workspaceid),
                    search,
                    // filters: memoizedFilters,
                    page: page,
                    limit: limit,
                })
            );
        }
    }, [dispatch, workspaceid, search, memoizedFilters, page, limit]);

    const addCompany = useCallback(
        async (data: {
            name: string;
            personnel: Personnel[];
            city: string;
            managerid: number;
            product: string;
            email: string;
            category_group: string;
            logo?: string;
            project: {
                name: string;
                startdate: string;
                enddate: string;
                managerid: number;
                assignedStaff: {
                    employeeId: number;
                    rateType: string;
                    rateValue: number;
                }[];
            };
        }) => {
            if (!workspaceid) throw new Error("No workspace ID available");
            return dispatch(
                createCompany({
                    workspaceId: Number(workspaceid),
                    data,
                })
            ).unwrap();
        },
        [dispatch, workspaceid]
    );

    const deleteComp = useCallback(
        async (companyId: number) => {
            if (!workspaceid) throw new Error("No workspace ID available");
            return dispatch(
                deleteCompany({
                    workspaceId: Number(workspaceid),
                    companyId,
                })
            ).unwrap();
        },
        [dispatch, workspaceid]
    );

    return {
        companies: companies as Company[],
        total,
        loading,
        error,
        addCompany,
        deleteCompany: deleteComp,
        currentPage,
        perPage,
    };
};

export const useLeads = (filters?: LeadFilters) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { leads, loading, error, totalValue } = useSelector(
        (state: RootState) => state.company
    );

    useEffect(() => {
        if (workspaceid) {
            dispatch(fetchLeads({ workspaceId: Number(workspaceid), filters }))
                .unwrap()
                .catch((err) => console.error("Failed to fetch leads:", err));
        }
    }, [dispatch, workspaceid, filters]);

    const addLead = async (data: {
        companyId: number;
        personnelId: number;
        contractValue: number;
        status: string;
    }) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(
            createLead({ workspaceId: Number(workspaceid), data })
        ).unwrap();
    };

    const updateStatus = async (leadId: number, status: string) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(
            updateLeadStatus({
                workspaceId: Number(workspaceid),
                leadId,
                status,
            })
        ).unwrap();
    };

    const deleteL = async (leadId: number) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(
            deleteLead({
                workspaceId: Number(workspaceid),
                leadId,
            })
        ).unwrap();
    };

    return {
        leads: leads as Lead[],
        loading,
        error,
        addLead,
        updateStatus,
        deleteLead: deleteL,
        totalValue,
    };
};
