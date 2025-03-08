import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { useUserData } from '@/hooks/useUserData';
import {
    fetchDepartments,
    fetchDepartmentById,
    createDepartment as createDepartmentAction,
    updateDepartment as updateDepartmentAction,
    deleteDepartment as deleteDepartmentAction,
    clearCurrentDepartment
} from '@/store/slices/departmentSlice';
import { Department, DepartmentCreateData, DepartmentUpdateData } from '@/types/departments';

export const useDepartments = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser } = useUserData();
    const workspaceid = currentUser?.workspaceid;
    const { departments, loading, error } = useSelector((state: RootState) => state.department);

    useEffect(() => {
        if (workspaceid) {
            dispatch(fetchDepartments(Number(workspaceid)));
        }
    }, [dispatch, workspaceid]);

    const createDepartment = useCallback(async (data: DepartmentCreateData) => {
        if (!workspaceid) throw new Error('No workspace ID available');
        return dispatch(createDepartmentAction({
            workspaceId: Number(workspaceid),
            data
        })).unwrap();
    }, [dispatch, workspaceid]);

    const deleteDepartment = useCallback(async (departmentId: number) => {
        if (!workspaceid) throw new Error('No workspace ID available');
        return dispatch(deleteDepartmentAction({
            workspaceId: Number(workspaceid),
            departmentId
        })).unwrap();
    }, [dispatch, workspaceid]);

    return {
        departments,
        loading,
        error,
        createDepartment,
        deleteDepartment
    };
};

export const useDepartment = (departmentId?: number) => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser } = useUserData();
    const workspaceid = currentUser?.workspaceid;
    const { currentDepartment, loading, error } = useSelector(
        (state: RootState) => state.department
    );

    useEffect(() => {
        if (workspaceid && departmentId) {
            dispatch(fetchDepartmentById({
                workspaceId: Number(workspaceid),
                departmentId
            }));
        }
        return () => {
            dispatch(clearCurrentDepartment());
        };
    }, [dispatch, workspaceid, departmentId]);

    const updateDepartment = useCallback(async (data: DepartmentUpdateData) => {
        if (!workspaceid || !departmentId) throw new Error('Required IDs not available');
        return dispatch(updateDepartmentAction({
            workspaceId: Number(workspaceid),
            departmentId,
            data
        })).unwrap();
    }, [dispatch, workspaceid, departmentId]);

    return {
        department: currentDepartment,
        loading,
        error,
        updateDepartment
    };
};

// Helper hook to get a flat list of departments
export const useFlatDepartmentList = () => {
    const { departments, loading } = useDepartments();

    const flattenDepartments = useCallback((
        departments: Department[],
        results: Department[] = []
    ): Department[] => {
        departments.forEach(dept => {
            results.push(dept);
            if (dept.subDepartments?.length) {
                flattenDepartments(dept.subDepartments, results);
            }
        });
        return results;
    }, []);

    const flatDepartments = useMemo(() => flattenDepartments(departments), [departments, flattenDepartments]);

    return {
        flatDepartments,
        loading
    };
};
