import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchUsers, 
    fetchUserById,
    createUser, 
    updateUser, 
    deleteUser,
    clearSelectedUser,
    clearUsers
} from '@/store/slices/userSlice';
import type { RootState, AppDispatch } from '@/store/store';

export const useUsers = (workspaceId: number) => {
	const dispatch = useDispatch<AppDispatch>();
	const { 
		users, 
		selectedUser,
		loading, 
		error 
	} = useSelector((state: RootState) => state.user);

	useEffect(() => {
		if (workspaceId) {
			dispatch(fetchUsers(workspaceId));
		}
		return () => {
			dispatch(clearUsers());
		};
	}, [dispatch, workspaceId]);

	const getUser = useCallback((userId: string) => {
		return dispatch(fetchUserById({ workspaceId, userId }));
	}, [dispatch, workspaceId]);

	const addUser = useCallback((userData: {
		name: string;
		email: string;
		image?: string;
		phone_number?: string;
		backup_email?: string;
	}) => {
		return dispatch(createUser({ workspaceId, userData }));
	}, [dispatch, workspaceId]);

	const editUser = useCallback((userId: string, data: {
		name?: string;
		email?: string;
		image?: string;
		phone_number?: string;
		backup_email?: string;
	}) => {
		return dispatch(updateUser({ workspaceId, userId, data }));
	}, [dispatch, workspaceId]);

	const removeUser = useCallback((userId: string) => {
		return dispatch(deleteUser({ workspaceId, userId }));
	}, [dispatch, workspaceId]);

	const clearUser = useCallback(() => {
		dispatch(clearSelectedUser());
	}, [dispatch]);

	return {
		users,
		selectedUser,
		loading,
		error,
		getUser,
		addUser,
		editUser,
		removeUser,
		clearUser
	};
};
