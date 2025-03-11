import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchWorkspaces,
    fetchWorkspaceById,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    clearSelectedWorkspace,
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

    const create = useCallback(
        (workspaceData: Partial<Workspace>) => {
            return dispatch(createWorkspace(workspaceData));
        },
        [dispatch]
    );

    const remove = useCallback(
        (workspaceId: number) => {
            return dispatch(deleteWorkspace(workspaceId));
        },
        [dispatch]
    );

    return { workspaces, loading, error, create, remove };
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
        return () => {
            dispatch(clearSelectedWorkspace());
        };
    }, [dispatch, workspaceId]);

    const update = useCallback(
        (data: Partial<Workspace>) => {
            if (workspaceId) {
                return dispatch(updateWorkspace({ workspaceId, data }));
            }
        },
        [dispatch, workspaceId]
    );

    const remove = useCallback(() => {
        if (workspaceId) {
            return dispatch(deleteWorkspace(workspaceId));
        }
    }, [dispatch, workspaceId]);

    return {
        workspace: selectedWorkspace,
        loading,
        error,
        update,
        remove,
    };
};
