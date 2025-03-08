import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useUserData } from "@/hooks/useUserData";
import {
    fetchAvailability,
    fetchAvailabilityById,
    createAvailability,
    updateAvailability,
    deleteAvailability,
    clearSelectedAvailability,
} from "@/store/slices/availabilitySlice";
import type { 
    AvailabilityFilters, 
    CreateAvailabilityData, 
    UpdateAvailabilityData 
} from "@/types/availability";

export const useAvailability = (
    filters?: AvailabilityFilters,
    page?: number,
    limit?: number
) => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser } = useUserData();
    const workspaceid = currentUser?.workspaceid;
    const { 
        availability, 
        selectedAvailability,
        total,
        currentPage,
        limit: itemsPerPage,
        loading, 
        error 
    } = useSelector((state: RootState) => state.availability);

    useEffect(() => {
        if (workspaceid) {
            dispatch(
                fetchAvailability({
                    workspaceId: Number(workspaceid),
                    filters,
                    page,
                    limit,
                })
            );
        }
    }, [dispatch, workspaceid, filters, page, limit]);

    const fetchAvailabilityDetails = useCallback(
        async (availabilityId: number) => {
            if (!workspaceid) throw new Error("No workspace ID available");
            return dispatch(
                fetchAvailabilityById({
                    workspaceId: Number(workspaceid),
                    availabilityId,
                })
            ).unwrap();
        },
        [dispatch, workspaceid]
    );

    const addAvailability = useCallback(
        async (data: CreateAvailabilityData) => {
            if (!workspaceid) throw new Error("No workspace ID available");
            return dispatch(
                createAvailability({
                    workspaceId: Number(workspaceid),
                    data,
                })
            ).unwrap();
        },
        [dispatch, workspaceid]
    );

    const updateAvailabilityDetails = useCallback(
        async (availabilityId: number, data: UpdateAvailabilityData) => {
            if (!workspaceid) throw new Error("No workspace ID available");
            return dispatch(
                updateAvailability({
                    workspaceId: Number(workspaceid),
                    availabilityId,
                    data,
                })
            ).unwrap();
        },
        [dispatch, workspaceid]
    );

    const removeAvailability = useCallback(
        async (availabilityId: number) => {
            if (!workspaceid) throw new Error("No workspace ID available");
            return dispatch(
                deleteAvailability({
                    workspaceId: Number(workspaceid),
                    availabilityId,
                })
            ).unwrap();
        },
        [dispatch, workspaceid]
    );

    const clearSelected = useCallback(() => {
        dispatch(clearSelectedAvailability());
    }, [dispatch]);

    return {
        availability,
        selectedAvailability,
        total,
        currentPage,
        itemsPerPage,
        loading,
        error,
        fetchAvailability: fetchAvailabilityDetails,
        addAvailability,
        updateAvailability: updateAvailabilityDetails,
        deleteAvailability: removeAvailability,
        clearSelectedAvailability: clearSelected,
    };
};