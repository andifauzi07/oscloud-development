import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchManager } from '@/store/slices/managerSlice';
import { useUserData } from './useUserData';

export function useManagers() {
	const dispatch = useDispatch<AppDispatch>();
	const { currentUser } = useUserData();
	const workspaceId = Number(currentUser?.workspaceid!);
	const { manager, loading, error } = useSelector((state: RootState) => state.manager);

	useEffect(() => {
		if (!workspaceId) return;
		dispatch(fetchManager({ workspaceId }));
	}, [workspaceId, dispatch]);

	return { manager, loading, error };
}
