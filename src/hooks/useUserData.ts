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

				const { data, error } = await supabase
					.from('app_user')
					.select('userid, role, status, workspaceid')
					// .eq("userid", session.user.id)
					.eq('userid', 1)
					.single();

				// console.log(data)
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
	return userData;
};
