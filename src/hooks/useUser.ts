import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, createUser, updateUser, deleteUser } from "@/store/slices/userSlice";
import { RootState, AppDispatch } from "@/store/store";

export const useUsers = (workspaceId: number) => {
    const dispatch = useDispatch<AppDispatch>();
    const { users, loading, error } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (workspaceId) {
            dispatch(fetchUsers(workspaceId));
        }
    }, [dispatch, workspaceId]);

    return {
        users,
        loading,
        error,
        createUser: (userData: { email: string; role: string; status: string }) => dispatch(createUser({ workspaceId, userData })),
        updateUser: (userId: number, status: string) => dispatch(updateUser({ workspaceId, userId, status })),
        deleteUser: (userId: number) => dispatch(deleteUser({ workspaceId, userId })),
    };
};
