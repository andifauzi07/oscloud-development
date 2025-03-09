import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useUserData } from "@/hooks/useUserData";
import {
    fetchPersonnelById,
    createPersonnel,
    updatePersonnel,
    deletePersonnel,
    clearSelectedPersonnel,
    fetchAllPersonnel,
} from "@/store/slices/personnelSlice";
import type { CreatePersonnelRequest, UpdatePersonnelRequest, Personnel } from "@/types/personnel";

export const usePersonnel = (personnelId?: number) => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser } = useUserData();
    const workspaceid = currentUser?.workspaceid;
    
    const { selectedPersonnel, personnel, loading, error } = useSelector(
        (state: RootState) => state.personnel
    );

    const fetchAllWorkspacePersonnel = useCallback(async () => {
        if (!workspaceid) return;
        return dispatch(
            fetchAllPersonnel({
                workspaceId: Number(workspaceid)
            })
        ).unwrap();
    }, [dispatch, workspaceid]);

    const fetchPersonnel = useCallback(async ({ workspaceId, personnelId }: { workspaceId: number; personnelId: number }) => {
        if (!workspaceId || !personnelId) return;
        return dispatch(
            fetchPersonnelById({
                workspaceId: Number(workspaceId),
                personnelId: Number(personnelId)
            })
        ).unwrap();
    }, [dispatch, workspaceid, personnelId]);

    const addPersonnel = useCallback(
        async (companyId: number, data: CreatePersonnelRequest) => {
            if (!workspaceid) return;
            return dispatch(
                createPersonnel({
                    workspaceId: Number(workspaceid),
                    companyId,
                    data,
                })
            ).unwrap();
        },
        [dispatch, workspaceid]
    );

    const updatePersonnelDetails = useCallback(
        async (data: UpdatePersonnelRequest) => {
            if (!workspaceid || !personnelId) return;
            return dispatch(
                updatePersonnel({
                    workspaceId: Number(workspaceid),
                    personnelId,
                    data,
                })
            ).unwrap();
        },
        [dispatch, workspaceid, personnelId]
    );

    const removePersonnel = useCallback(async () => {
        if (!workspaceid || !personnelId) return;
        return dispatch(
            deletePersonnel({
                workspaceId: Number(workspaceid),
                personnelId,
            })
        ).unwrap();
    }, [dispatch, workspaceid, personnelId]);

    useEffect(() => {
        if (personnelId) {
            fetchPersonnel({ workspaceId: Number(workspaceid), personnelId: Number(personnelId) });
        } else {
            fetchAllWorkspacePersonnel();
        }
        return () => {
            dispatch(clearSelectedPersonnel());
        };
    }, [personnelId, workspaceid, dispatch, fetchPersonnel, fetchAllWorkspacePersonnel]);

    return {
        selectedPersonnel,
        personnel,
        loading,
        error,
        fetchPersonnel,
        fetchAllPersonnel: fetchAllWorkspacePersonnel,
        addPersonnel,
        updatePersonnel: updatePersonnelDetails,
        deletePersonnel: removePersonnel,
    };
};
