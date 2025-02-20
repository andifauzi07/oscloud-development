import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchWorkspaces,
    fetchWorkspaceById,
    updateWorkspace,
    Workspace,
} from "@/store/slices/workspaceSlice";
import { RootState, AppDispatch } from "@/store/store";

export const useWorkspaces = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaces, loading, error } = useSelector(
        (state: RootState) => state.workspace
    );

    useEffect(() => {
        dispatch(fetchWorkspaces());
    }, [dispatch]);

    return { workspaces, loading, error };
};

export const useWorkspace = (workspaceId: number) => {
    const dispatch = useDispatch<AppDispatch>();
    const { selectedWorkspace, loading, error } = useSelector(
        (state: RootState) => state.workspace
    );

    useEffect(() => {
        if (workspaceId) {
            dispatch(fetchWorkspaceById(workspaceId));
        }
    }, [dispatch, workspaceId]);

    return {
        selectedWorkspace,
        loading,
        error,
        updateWorkspace: (data: Partial<Workspace>) =>
            dispatch(updateWorkspace({ workspaceId, data })),
    };
};
