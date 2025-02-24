import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { useUserData } from '@/hooks/useUserData';
import {
    fetchCompanies,
    createCompany,
    fetchLeads,
    createLead,
    updateLeadStatus,
    type Company,
    type Lead
} from '@/store/slices/companySlice';

export const useCompanies = (search?: string) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { companies, total, loading, error } = useSelector(
        (state: RootState) => state.company
    );

    useEffect(() => {
        if (workspaceid) {
            dispatch(fetchCompanies({ 
                workspaceId: Number(workspaceid),
                search 
            }));
        }
    }, [dispatch, workspaceid, search]);

    const addCompany = async (data: Partial<Company>) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(createCompany({ 
            workspaceId: Number(workspaceid),
            data 
        })).unwrap();
    };

    return {
        companies,
        total,
        loading,
        error,
        addCompany
    };
};

export const useLeads = (filters?: {
    status?: string;
    companyId?: number;
    minValue?: number;
    maxValue?: number;
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { leads, loading, error } = useSelector(
        (state: RootState) => state.company
    );

    useEffect(() => {
        if (workspaceid) {
            dispatch(fetchLeads({ 
                workspaceId: Number(workspaceid),
                filters 
            }));
        }
    }, [dispatch, workspaceid, filters]);

    const addLead = async (data: {
        companyId: number;
        personnelId: number;
        contractValue: number;
        status: string;
    }) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(createLead({ 
            workspaceId: Number(workspaceid),
            data 
        })).unwrap();
    };

    const updateStatus = async (leadId: number, status: string) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(updateLeadStatus({ 
            workspaceId: Number(workspaceid),
            leadId,
            status 
        })).unwrap();
    };

    return {
        leads,
        loading,
        error,
        addLead,
        updateStatus
    };
};