import { useEffect, useCallback, useMemo, useState } from 'react';
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
	setCurrentUser,
	// Selectors
	selectUsers,
	selectCurrentUser,
	selectSelectedUser,
	selectUserLoading,
	selectUserError,
	selectUsersByRole,
	selectUsersByStatus,
} from '@/store/slices/userSlice';
import { supabase } from '@/backend/supabase/supabaseClient';

export const useUserData = () => {
	const dispatch = useDispatch<AppDispatch>();
	const [isWorkspaceReady, setIsWorkspaceReady] = useState(false);

	const currentUser = useSelector((state: RootState) => selectCurrentUser(state));
	const users = useSelector((state: RootState) => selectUsers(state));
	const selectedUser = useSelector((state: RootState) => selectSelectedUser(state));
	const loading = useSelector((state: RootState) => selectUserLoading(state));
	const error = useSelector((state: RootState) => selectUserError(state));
	const session = useSelector((state: RootState) => state.auth.session);

	// Determine if user is an employee based on session metadata
	const isEmployee = useMemo(() => {
		return session?.user?.user_metadata?.isEmployee === true;
	}, [session]);

	const adminUsers = useSelector((state: RootState) => selectUsersByRole(state, 'Admin'));
	const activeUsers = useSelector((state: RootState) => selectUsersByStatus(state, 'Active'));

	// Primary effect to fetch current user and set workspace ready state
	useEffect(() => {
		const initializeUser = async () => {
			if (session?.user && !currentUser && !loading) {
				try {
					if (isEmployee) {
						// Handle employee data fetching
						const { data: employeeData, error } = await supabase
							.from('employee')
							.select('*')
							.eq('employeeid', session.user.user_metadata.employeeid)
							.single();

						if (error) throw error;
						
						// Dispatch employee data to your store
						// You might need to create a separate action for employee data
						dispatch(setCurrentUser(employeeData));
					} else {
						// Regular user fetch
						await dispatch(fetchCurrentUser()).unwrap();
					}
					setIsWorkspaceReady(true);
				} catch (error) {
					console.error('Failed to fetch current user:', error);
					setIsWorkspaceReady(false);
				}
			}
		};

		initializeUser();
	}, [dispatch, session?.user, currentUser, loading, isEmployee]);

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
		isEmployee,
		isAuthenticated: !!session?.user,
		isWorkspaceReady,

		// Actions
		getUsers,
		getUserById,
		updateUserData,
		removeUser,
		clearUser,
		clearAllUsers,
	};
};
