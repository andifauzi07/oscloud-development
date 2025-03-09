import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import type { UpdateUserData, UserFilters } from '@/types/user';
import {
	fetchCurrentUser,
	fetchUsers,
	fetchUserById,
	updateUser,
	deleteUser,
	clearSelectedUser,
	clearUsers,
	// Selectors
	selectUsers,
	selectCurrentUser,
	selectSelectedUser,
	selectUserLoading,
	selectUserError,
	selectUsersByRole,
	selectUsersByStatus,
} from '@/store/slices/userSlice';

export const useUserData = () => {
	const dispatch = useDispatch<AppDispatch>();

	// Fix the selector types by explicitly typing state as RootState
	const users = useSelector((state: RootState) => selectUsers(state));
	const currentUser = useSelector((state: RootState) => selectCurrentUser(state));
	const selectedUser = useSelector((state: RootState) => selectSelectedUser(state));
	const loading = useSelector((state: RootState) => selectUserLoading(state));
	const error = useSelector((state: RootState) => selectUserError(state));
	const session = useSelector((state: RootState) => state.auth.session);

	// Memoize complex computations
	const activeUsers = useMemo(() => users.filter((user) => user.status === 'Active'), [users]);

	const adminUsers = useSelector((state: RootState) => selectUsersByRole(state, 'Admin'));

	// Effect for fetching current user
	useEffect(() => {
		if (session?.user && !currentUser && !loading) {
			dispatch(fetchCurrentUser());
		}
	}, [dispatch, session?.user, currentUser, loading]);

	// Memoized action creators
	const getUsers = useCallback(
		(workspaceId: number, filters?: UserFilters) => {
			return dispatch(fetchUsers({ workspaceId, filters })).unwrap();
		},
		[dispatch]
	);

	const getUserById = useCallback(
		(workspaceId: number, userId: string) => {
			return dispatch(fetchUserById({ workspaceId, userId })).unwrap();
		},
		[dispatch]
	);

	const updateUserData = useCallback(
		(workspaceId: number, userId: string, data: UpdateUserData) => {
			return dispatch(updateUser({ workspaceId, userId, data })).unwrap();
		},
		[dispatch]
	);

	const removeUser = useCallback(
		(workspaceId: number, userId: string) => {
			return dispatch(deleteUser({ workspaceId, userId })).unwrap();
		},
		[dispatch]
	);

	const clearUser = useCallback(() => {
		dispatch(clearSelectedUser());
	}, [dispatch]);

	const clearAllUsers = useCallback(() => {
		dispatch(clearUsers());
	}, [dispatch]);

	return {
		// State
		currentUser,
		users,
		selectedUser,
		activeUsers,
		adminUsers,
		loading,
		error,
		isAuthenticated: !!session?.user,

		// Actions
		getUsers,
		getUserById,
		updateUserData,
		removeUser,
		clearUser,
		clearAllUsers,
	};
};
