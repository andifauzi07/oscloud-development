import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchHourlyRates,
    fetchHourlyRateByEmployee,
    createHourlyRate,
    updateHourlyRate,
    deleteHourlyRate
} from '@/store/slices/hourlyRateSlice';
import { AppDispatch, RootState } from '@/store/store';

export const useHourlyRates = (workspaceId: number) => {
    const dispatch = useDispatch<AppDispatch>();
    const { rates, loading, error } = useSelector((state: RootState) => state.hourlyRate);

    const getAllRates = useCallback(async () => {
        try {
            const result = await dispatch(fetchHourlyRates({ workspaceId })).unwrap();
            return result;
        } catch (error) {
            console.error('Failed to fetch all rates:', error);
            throw error;
        }
    }, [dispatch, workspaceId]);

    const getEmployeeRates = useCallback(async (employeeId: number) => {
        try {
            const result = await dispatch(fetchHourlyRateByEmployee({ 
                workspaceId, 
                employeeId 
            })).unwrap();
            return result;
        } catch (error) {
            console.error('Failed to fetch employee rates:', error);
            throw error;
        }
    }, [dispatch, workspaceId]);

    const createRate = useCallback(async (data: {
        employeeId: number;
        type: string;
        ratevalue: number;
    }) => {
        try {
            const result = await dispatch(createHourlyRate({ 
                workspaceId, 
                data 
            })).unwrap();
            return result;
        } catch (error) {
            console.error('Failed to create rate:', error);
            throw error;
        }
    }, [dispatch, workspaceId]);

    const updateRate = useCallback(async (
        employeeId: number,
        type: string,
        value: number
    ) => {
        try {
            const result = await dispatch(updateHourlyRate({
                workspaceId,
                employeeId,
                type,
                value
            })).unwrap();
            return result;
        } catch (error) {
            console.error('Failed to update rate:', error);
            throw error;
        }
    }, [dispatch, workspaceId]);

    const deleteRate = useCallback(async (employeeId: number, type: string) => {
        try {
            await dispatch(deleteHourlyRate({
                workspaceId,
                employeeId,
                type
            })).unwrap();
        } catch (error) {
            console.error('Failed to delete rate:', error);
            throw error;
        }
    }, [dispatch, workspaceId]);

    return {
        rates,
        loading,
        error,
        getAllRates,
        getEmployeeRates,
        createRate,
        updateRate,
        deleteRate
    };
};