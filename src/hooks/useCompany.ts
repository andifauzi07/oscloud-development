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
} from "@/store/slices/companySlice";
import {
    createProjectLead,
    deleteProjectLead,
} from "@/store/slices/projectSlice";
import { useImageUpload } from './useImageUpload';

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
        if (workspaceid) {
            dispatch(
                fetchCompanies({
                    workspaceId: Number(workspaceid),
                    search: filters?.search,
                    category: filters?.category,
                    page: filters?.page,
                    limit: filters?.limit
                })
            );
        }
    }, [dispatch, workspaceid, memoizedFilters]);

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

    const { uploadImage, isUploading: isUploadingLogo } = useImageUpload({
        bucketName: 'companies',
        folderPath: 'company-images',
        maxSizeInMB: 3,
        allowedFileTypes: ['image/jpeg', 'image/png']
    });

    const updateCompanyLogo = useCallback(
        async (companyId: number, file: File) => {
            try {
                if (!workspaceid) throw new Error("No workspace ID available");
                
                const publicUrl = await uploadImage(file);
                
                await updateCompanyDetails(companyId, {
                    logo: publicUrl
                });

                alert('Company logo updated successfully');
                return publicUrl;
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to update company logo';
                alert(message);
                throw error;
            }
        },
        [workspaceid, uploadImage, updateCompanyDetails]
    );

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
        updateCompanyLogo,
        isUploadingLogo,
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
        if (workspaceid) {
            dispatch(
                fetchLeads({
                    workspaceId: Number(workspaceid),
                    status: filters?.status,
                    companyId: filters?.companyId,
                    minValue: filters?.minValue,
                    maxValue: filters?.maxValue
                })
            );
        }
    }, [dispatch, workspaceid, filters]);

    const addLead = useCallback(
        async (projectId: number, leadId: number) => {
            if (!workspaceid) throw new Error("No workspace ID available");
            return dispatch(
                createProjectLead({
                    workspaceId: Number(workspaceid),
                    data: {
                        project_id: projectId,
                        lead_id: leadId
                    }
                })
            ).unwrap();
        },
        [dispatch, workspaceid]
    );

    const updateStatus = useCallback(
        async (projectId: number, leadId: number, status: string) => {
            if (!workspaceid) throw new Error("No workspace ID available");
            // Note: This needs to be implemented in the projectSlice
            throw new Error("updateStatus not implemented");
        },
        [dispatch, workspaceid]
    );

    const removeLead = useCallback(
        async (projectId: number, leadId: number) => {
            if (!workspaceid) throw new Error("No workspace ID available");
            return dispatch(
                deleteProjectLead({
                    workspaceId: Number(workspaceid),
                    projectId,
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
        addLead,
        updateStatus,
        deleteLead: removeLead,
    };
};


