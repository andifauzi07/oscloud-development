import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/backend/supabase/supabaseClient';

interface UserData {
  id: string;
  user_role: string;
  user_status: string;
  workspace_id: string;
  error?: string;
  loading: boolean;
}

export const useUserData = () => {
  const { session } = useAuth();
  const [userData, setUserData] = useState<UserData>({
    id: '',
    user_role: '',
    user_status: '',
    workspace_id: '',
    loading: true
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) {
        setUserData(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, user_role, user_status, workspace_id')
          .eq('id', session.user.id)
          .single();

        if (error) {
          throw error;
        }

        setUserData({
          id: data.id,
          user_role: data.user_role,
          user_status: data.user_status,
          workspace_id: data.workspace_id,
          loading: false
        });
      } catch (error) {
        setUserData(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to fetch user data',
          loading: false
        }));
      }
    };

    fetchUserData();
  }, [session]);

  return userData;
};