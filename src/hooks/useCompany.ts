// src/hooks/useCompany.ts
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useUserData } from "@/hooks/useUserData";
import {
    fetchCompanies,
    fetchCompanyById,
    createCompany,
    updateCompany,
    fetchLeads,
    createLead,
    updateLeadStatus,
    deleteCompany,
    deleteLead,
    type Company,
    type Lead,
} from "@/store/slices/companySlice";

export interface CompanyFilters {
    category?: string;
}

export interface LeadFilters {
    status?: string;
    companyId?: number;
    minValue?: number;
    maxValue?: number;
}

export const useCompanies = (
    filters?: CompanyFilters | null,
    search?: string,
    page?: number,
    limit?: number,
) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { companies, selectedCompany, total, loading, error, currentPage, perPage } =
        useSelector((state: RootState) => state.company);

    const memoizedFilters = useMemo(() => filters, [filters]);

    useEffect(() => {
        if (workspaceid) {
            dispatch(
                fetchCompanies({
                    workspaceId: Number(workspaceid),
                    search,
                    filters: memoizedFilters || undefined,
                    page,
                    limit,
                })
            );
        }
    }, [dispatch, workspaceid, search, memoizedFilters, page, limit]);

    const fetchCompany = useCallback(
        async (companyId: number) => {
            if (!workspaceid) throw new Error("No workspace ID available");
            return dispatch(
                fetchCompanyById({
                    workspaceId: Number(workspaceid),
                    companyId,
                })
            ).unwrap();
        },
        [dispatch, workspaceid]
    );

    const addCompany = useCallback(
        async (data: {
            name: string;
            personnel: { name: string }[];
            city?: string;
            product?: string;
            email?: string;
            category_group?: string;
            logo?: string;
            managerid?: number;
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

    const updateCompanyDetails = useCallback(
        async (companyId: number, data: Partial<Company>) => {
            if (!workspaceid) throw new Error("No workspace ID available");
            return dispatch(
                updateCompany({
                    workspaceId: Number(workspaceid),
                    companyId,
                    data,
                })
            ).unwrap();
        },
        [dispatch, workspaceid]
    );

    const removeCompany = useCallback(
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
        companies,
        selectedCompany,
        total,
        loading,
        error,
        currentPage,
        perPage,
        fetchCompany,
        addCompany,
        updateCompany: updateCompanyDetails,
        deleteCompany: removeCompany,
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
            dispatch(
                fetchLeads({
                    workspaceId: Number(workspaceid),
                    filters,
                })
            ).unwrap();
        }
    }, [dispatch, workspaceid, filters]);

    const addLead = useCallback(
        async (data: {
            companyId: number;
            personnelId: number;
            contractValue: number;
            status: string;
        }) => {
            if (!workspaceid) throw new Error("No workspace ID available");
            return dispatch(
                createLead({
                    workspaceId: Number(workspaceid),
                    data,
                })
            ).unwrap();
        },
        [dispatch, workspaceid]
    );

    const updateStatus = useCallback(
        async (leadId: number, status: string) => {
            if (!workspaceid) throw new Error("No workspace ID available");
            return dispatch(
                updateLeadStatus({
                    workspaceId: Number(workspaceid),
                    leadId,
                    status,
                })
            ).unwrap();
        },
        [dispatch, workspaceid]
    );

    const removeLead = useCallback(
        async (leadId: number) => {
            if (!workspaceid) throw new Error("No workspace ID available");
            return dispatch(
                deleteLead({
                    workspaceId: Number(workspaceid),
                    leadId,
                })
            ).unwrap();
        },
        [dispatch, workspaceid]
    );

    return {
        leads,
        loading,
        error,
        totalValue,
        addLead,
        updateStatus,
        deleteLead: removeLead,
    };
};
