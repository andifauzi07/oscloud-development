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
} from "@/store/slices/personnelSlice";
import type { CreatePersonnelRequest, UpdatePersonnelRequest } from "@/types/personnel";

export const usePersonnel = (personnelId?: number) => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser } = useUserData();
    const workspaceid = currentUser?.workspaceid;
    
    const { selectedPersonnel, loading, error } = useSelector(
        (state: RootState) => state.personnel
    );

    const fetchPersonnel = useCallback(async () => {
        if (!workspaceid || !personnelId) return;
        return dispatch(
            fetchPersonnelById({
                workspaceId: Number(workspaceid),
                personnelId
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
            fetchPersonnel();
        }
        return () => {
            dispatch(clearSelectedPersonnel());
        };
    }, [personnelId, fetchPersonnel, dispatch]);

    return {
        personnel: selectedPersonnel,
        loading,
        error,
        fetchPersonnel,
        addPersonnel,
        updatePersonnel: updatePersonnelDetails,
        deletePersonnel: removePersonnel,
    };
};