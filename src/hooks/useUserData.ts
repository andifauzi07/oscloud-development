import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/backend/supabase/supabaseClient';

interface UserData {
	userid: string;
	role: string;
	status: string;
	workspaceid: string;
	error?: string;
	loading: boolean;
}

export const useUserData = () => {
	const { session } = useAuth();
	const [userData, setUserData] = useState<UserData>({
		userid: '',
		role: '',
		status: '',
		workspaceid: '',
		loading: true,
	});

	useEffect(() => {
		const fetchUserData = async () => {
			if (!session?.user?.id) {
				setUserData((prev) => ({ ...prev, loading: false }));
				return;
			}

			try {
				// console.log(session.user.id)
				// USER ID
				// is not auth dynamic yet.

				const { data, error } = await supabase.from('app_user').select('userid, role, status, workspaceid').single();

				console.log('USERS DATA DI ATASNYA ==>', data);
				if (error) {
					throw error;
				}

				setUserData({
					userid: data.userid,
					role: data.role,
					status: data.status,
					workspaceid: data.workspaceid,
					loading: false,
				});
			} catch (error) {
				setUserData((prev) => ({
					...prev,
					error: error instanceof Error ? error.message : 'Failed to fetch user data',
					loading: false,
				}));
			}
		};

		fetchUserData();
	}, [session]);

	// const [userData, setUserData] = useState<UserData>({
	//     userid: '1',
	//     role: 'Admin',
	//     status: 'Active',
	//     workspaceid: '1',
	//     loading: false,
	// });
	console.log('INI USERS DATA ==>', userData);

	return userData;
};

// import { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { AppDispatch, RootState } from '@/store/store';
// import { fetchUsers } from '@/store/slices/userSlice';
// import { useAuth } from '@/context/AuthContext';

// interface UserData {
// 	userid: string;
// 	role: string;
// 	status: string;
// 	workspaceid: number;
// 	loading: boolean;
// 	error?: string | null;
// }

// export const useUserData = (): UserData => {
// 	const { session } = useAuth();
// 	const dispatch = useDispatch<AppDispatch>();
// 	const { users, loading, error } = useSelector((state: RootState) => state.user);

// 	useEffect(() => {
// 		const workspaceid = 1;
// 		if (workspaceid) {
// 			dispatch(fetchUsers(workspaceid));
// 		}
// 	}, [session, dispatch]);

// 	const currentUser = users.find((user) => user.userid === session?.user?.id);

// 	return {
// 		userid: currentUser?.userid || '',
// 		role: currentUser?.role || '',
// 		status: currentUser?.status || '',
// 		workspaceid: currentUser?.workspaceid || 0,
// 		loading,
// 		error,
// 	};
// };
