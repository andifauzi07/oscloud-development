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
        createUser: (userData: {
            name: string;
            email: string;
            image?: string;
            phone_number?: string;
            backup_email?: string;
        }) => dispatch(createUser({ workspaceId, userData })),
        updateUser: (
            userId: number,
            updateData: {
                name?: string;
                email?: string;
                image?: string;
                phone_number?: string;
                backup_email?: string;
            }
        ) => dispatch(updateUser({ workspaceId, userId, updateData })),
        deleteUser: (userId: number) => dispatch(deleteUser({ workspaceId, userId })),
    };
};