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
    deleteCompany,
    clearSelectedCompany,
    updatePersonnel,
    deletePersonnel,
    createPersonnel,
    fetchPersonnelById,
    fetchCompanyPersonnel,
    createLead,
    updateLead,
    deleteLead,
} from "@/store/slices/companySlice";
import {
    createProjectLead,
    deleteProjectLead,
} from "@/store/slices/projectSlice";
import { useImageUpload } from './useImageUpload';
import { CreateLeadRequest, UpdateLeadRequest } from "@/types/company";
import { CreatePersonnelRequest, UpdatePersonnelRequest } from "@/types/personnel";

export interface CompanyFilters {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface LeadFilters {
    status?: string;
    companyId?: number;
    minValue?: number;
    maxValue?: number;
}

export const useCompanies = (filters?: CompanyFilters) => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser } = useUserData();
    const workspaceid = currentUser?.workspaceid;
    const { companies, selectedCompany, loading, error, pagination } =
        useSelector((state: RootState) => state.company);

    const memoizedFilters = useMemo(() => filters, [filters]);

    useEffect(() => {
        if (!workspaceid) return; // Early return if no workspace ID

        dispatch(
            fetchCompanies({
                workspaceId: Number(workspaceid),
                search: filters?.search,
                category: filters?.category,
                page: filters?.page,
                limit: filters?.limit
            })
        );
    }, [dispatch, workspaceid, memoizedFilters]);

    const fetchCompany = useCallback(
        async (companyId: number) => {
            if (!workspaceid) {
                throw new Error("No workspace ID available");
            }
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
        async (data: { name: string; personnel: { name: string }[] }) => {
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
        async (companyId: number, data: {
            city?: string;
            product?: string;
            email?: string;
            category_group?: string;
            logo?: string;
            name?: string;
        }) => {
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

    const clearCompany = useCallback(() => {
        dispatch(clearSelectedCompany());
    }, [dispatch]);

    return {
        companies,
        selectedCompany,
        loading,
        error,
        pagination,
        fetchCompany,
        addCompany,
        updateCompany: updateCompanyDetails,
        deleteCompany: removeCompany,
        clearCompany,
        workspaceid, // Expose workspaceid in the return object
    };
};

export const useLeads = (filters?: LeadFilters) => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser } = useUserData();
    const workspaceid = currentUser?.workspaceid;
    const { leads, loading, error, totalValue } = useSelector(
        (state: RootState) => state.company
    );

    useEffect(() => {
        if (!workspaceid) return;

        dispatch(
            fetchLeads({
                workspaceId: Number(workspaceid),
                status: filters?.status,
                companyId: filters?.companyId,
                minValue: filters?.minValue,
                maxValue: filters?.maxValue
            })
        );
    }, [dispatch, workspaceid, filters]);

    const createNewLead = useCallback(
        async (data: CreateLeadRequest) => {
            if (!workspaceid) throw new Error("No workspace ID available");
            return dispatch(
                createLead({
                    workspaceId: Number(workspaceid),
                    data
                })
            ).unwrap();
        },
        [dispatch, workspaceid]
    );

    const updateLeadStatus = useCallback(
        async (leadId: number, data: UpdateLeadRequest) => {
            if (!workspaceid) throw new Error("No workspace ID available");
            return dispatch(
                updateLead({
                    workspaceId: Number(workspaceid),
                    leadId,
                    data
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
                    leadId
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
        createLead: createNewLead,
        updateLead: updateLeadStatus,
        deleteLead: removeLead,
        workspaceid,
    };
};

export const useCompanyPersonnel = (companyId?: number) => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser } = useUserData();
    const workspaceid = currentUser?.workspaceid;
    const { personnel, selectedPersonnel, loadingPersonnel, errorPersonnel } = 
        useSelector((state: RootState) => state.company);

    const fetchCompanyPersonnelList = useCallback(async () => {
        if (!workspaceid || !companyId) return;
        
        try {
            await dispatch(fetchCompanyPersonnel({ 
                workspaceId: Number(workspaceid), 
                companyId 
            })).unwrap();
        } catch (error) {
            console.error('Failed to fetch personnel list:', error);
        }
    }, [dispatch, workspaceid, companyId]);

    useEffect(() => {
        if (workspaceid && companyId) {
            fetchCompanyPersonnelList();
        }
    }, [workspaceid, companyId, fetchCompanyPersonnelList]);

    const fetchPersonnel = useCallback(
        async (personnelId: number) => {
            if (!workspaceid) return;
            return dispatch(
                fetchPersonnelById({
                    workspaceId: Number(workspaceid),
                    personnelId,
                })
            ).unwrap();
        },
        [dispatch, workspaceid]
    );

    const addPersonnel = useCallback(
        async (data: CreatePersonnelRequest) => {
            if (!workspaceid || !companyId) return;
            return dispatch(
                createPersonnel({
                    workspaceId: Number(workspaceid),
                    companyId,
                    data,
                })
            ).unwrap();
        },
        [dispatch, workspaceid, companyId]
    );

    const updatePersonnelDetails = useCallback(
        async (personnelId: number, data: UpdatePersonnelRequest) => {
            if (!workspaceid) return;
            return dispatch(
                updatePersonnel({
                    workspaceId: Number(workspaceid),
                    personnelId,
                    data,
                })
            ).unwrap();
        },
        [dispatch, workspaceid]
    );

    const removePersonnel = useCallback(
        async (personnelId: number) => {
            if (!workspaceid) return;
            return dispatch(
                deletePersonnel({
                    workspaceId: Number(workspaceid),
                    personnelId,
                })
            ).unwrap();
        },
        [dispatch, workspaceid]
    );

    return {
        personnel,
        selectedPersonnel,
        loading: loadingPersonnel,
        error: errorPersonnel,
        fetchPersonnel,
        addPersonnel,
        updatePersonnel: updatePersonnelDetails,
        deletePersonnel: removePersonnel,
        refetchPersonnel: fetchCompanyPersonnelList
    };
};


