// src/hooks/useCompany.ts
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { useUserData } from '@/hooks/useUserData';
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
} from '@/store/slices/companySlice';
import { createProjectLead, deleteProjectLead } from '@/store/slices/projectSlice';
import { useImageUpload } from './useImageUpload';
import { CreateLeadRequest, UpdateLeadRequest } from '@/types/company';
import { CreatePersonnelRequest, UpdatePersonnelRequest } from '@/types/personnel';

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

interface UseCompaniesParams {
	page?: number;
	limit?: number;
}

export function useCompanies(filters: CompanyFilters = {}) {
	const dispatch = useDispatch<AppDispatch>();
	const { currentUser } = useUserData();
	const workspaceid = currentUser?.workspaceid;

	// Pisahkan selector untuk menghindari re-render yang tidak perlu
	const companies = useSelector((state: RootState) => state.company.companies);
	const loading = useSelector((state: RootState) => state.company.loading);
	const error = useSelector((state: RootState) => state.company.error);
	const pagination = useSelector((state: RootState) => state.company.pagination);

	// Stabilkan filters
	const stableFilters = useMemo(
		() => ({
			search: filters.search,
			page: filters.page || 1,
			limit: filters.limit || 10,
		}),
		[filters.search, filters.page, filters.limit]
	);

	useEffect(() => {
		if (!workspaceid) return;

		dispatch(
			fetchCompanies({
				workspaceId: Number(workspaceid),
				...stableFilters,
			})
		);
	}, [workspaceid, stableFilters]);

	const fetchCompany = useCallback(
		async (companyId: number) => {
			return dispatch(
				fetchCompanyById({
					workspaceId: Number(workspaceid),
					companyId,
				})
			).unwrap();
		},
		[workspaceid]
	);

	const addCompany = useCallback(
		async (data: { name: string; personnel: { name: string }[] }) => {
			if (!workspaceid) throw new Error('No workspace ID available');
			return dispatch(
				createCompany({
					workspaceId: Number(workspaceid),
					data,
				})
			).unwrap();
		},
		[workspaceid]
	);

	const updateCompanyDetails = useCallback(
		async (companyId: number, data: any) => {
			if (!workspaceid) throw new Error('No workspace ID available');
			return dispatch(
				updateCompany({
					workspaceId: Number(workspaceid),
					companyId,
					data,
				})
			).unwrap();
		},
		[workspaceid]
	);

	const removeCompany = useCallback(
		async (companyid: number) => {
			if (!workspaceid) throw new Error('No workspace ID available');
			return dispatch(
				deleteCompany({
					workspaceId: Number(workspaceid),
					companyid,
				})
			).unwrap();
		},
		[workspaceid]
	);

	const clearCompany = useCallback(() => {
		dispatch(clearSelectedCompany());
	}, [dispatch]);

	return {
		companies,
		loading,
		error,
		total: pagination?.total || 0,
		addCompany,
		updateCompany: updateCompanyDetails,
		deleteCompany: removeCompany,
		clearCompany,
		workspaceid,
		fetchCompany,
	};
}

export const useLeads = (filters?: LeadFilters) => {
	const dispatch = useDispatch<AppDispatch>();
	const { currentUser } = useUserData();
	const workspaceid = currentUser?.workspaceid;
	const { leads, loading, error, totalValue } = useSelector((state: RootState) => state.company);

	useEffect(() => {
		if (!workspaceid) return;

		dispatch(
			fetchLeads({
				workspaceId: Number(workspaceid),
				status: filters?.status,
				companyId: filters?.companyId,
				minValue: filters?.minValue,
				maxValue: filters?.maxValue,
			})
		);
	}, [dispatch, workspaceid, filters]);

	const createNewLead = useCallback(
		async (data: CreateLeadRequest) => {
			if (!workspaceid) throw new Error('No workspace ID available');
			return dispatch(
				createLead({
					workspaceId: Number(workspaceid),
					data,
				})
			).unwrap();
		},
		[dispatch, workspaceid]
	);

	const updateLeadStatus = useCallback(
		async (leadId: number, data: UpdateLeadRequest) => {
			if (!workspaceid) throw new Error('No workspace ID available');
			return dispatch(
				updateLead({
					workspaceId: Number(workspaceid),
					leadId,
					data,
				})
			).unwrap();
		},
		[dispatch, workspaceid]
	);

	const removeLead = useCallback(
		async (leadId: number) => {
			if (!workspaceid) throw new Error('No workspace ID available');
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
	const { personnel, selectedPersonnel, loadingPersonnel, errorPersonnel } = useSelector((state: RootState) => state.company);

	const fetchCompanyPersonnelList = useCallback(async () => {
		if (!workspaceid || !companyId) return;

		try {
			await dispatch(
				fetchCompanyPersonnel({
					workspaceId: Number(workspaceid),
					companyId,
				})
			).unwrap();
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
		refetchPersonnel: fetchCompanyPersonnelList,
	};
};
