import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useUserData } from "@/hooks/useUserData";
import {
    fetchDepartments,
    fetchDepartmentById,
    createDepartment as createDepartmentAction,
    updateDepartment as updateDepartmentAction,
    clearCurrentDepartment,
} from "@/store/slices/departmentSlice";
import {
    Department,
    DepartmentCreateData,
    DepartmentUpdateData,
    UseDepartmentReturn,
    UseDepartmentsReturn,
} from "@/types/departments";

// Hook for managing departments (listing, creating, updating)
export const useDepartments = (): UseDepartmentsReturn => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { departments, loading, error } = useSelector(
        (state: RootState) => state.department
    );

    useEffect(() => {
        if (workspaceid) {
            dispatch(fetchDepartments(Number(workspaceid)));
        }
    }, [dispatch, workspaceid]);

    const getDepartmentById = (id: number) => {
        // Helper function to find a department in the tree
        const findDepartment = (
            departments: Department[],
            id: number
        ): Department | undefined => {
            for (const dept of departments) {
                if (dept.departmentId === id) {
                    return dept;
                }
                if (dept.subDepartments?.length) {
                    const found = findDepartment(dept.subDepartments, id);
                    if (found) return found;
                }
            }
            return undefined;
        };

        return findDepartment(departments, id);
    };

    const createDepartment = async (data: DepartmentCreateData) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        try {
            const result = await dispatch(
                createDepartmentAction({
                    workspaceId: Number(workspaceid),
                    data,
                })
            ).unwrap();

            // Refetch departments to get the updated tree
            await dispatch(fetchDepartments(Number(workspaceid)));

            return result;
        } catch (error) {
            throw new Error(
                error instanceof Error ?
                    error.message
                :   "Failed to create department"
            );
        }
    };

    const updateDepartment = async (
        departmentId: number,
        data: DepartmentUpdateData
    ) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        try {
            const result = await dispatch(
                updateDepartmentAction({
                    workspaceId: Number(workspaceid),
                    departmentId,
                    data,
                })
            ).unwrap();

            // Refetch departments to get the updated tree
            await dispatch(fetchDepartments(Number(workspaceid)));

            return result;
        } catch (error) {
            throw new Error(
                error instanceof Error ?
                    error.message
                :   "Failed to update department"
            );
        }
    };

    return {
        departments,
        loading,
        error,
        getDepartmentById,
        createDepartment,
        updateDepartment,
    };
};

// Hook for accessing a single department by ID
export const useDepartment = (departmentId?: number): UseDepartmentReturn => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { currentDepartment, loading, error } = useSelector(
        (state: RootState) => state.department
    );

    useEffect(() => {
        if (workspaceid && departmentId) {
            dispatch(
                fetchDepartmentById({
                    workspaceId: Number(workspaceid),
                    departmentId,
                })
            );
        }

        return () => {
            // Clean up current department when unmounting
            dispatch(clearCurrentDepartment());
        };
    }, [dispatch, workspaceid, departmentId]);

    return {
        department: currentDepartment,
        loading,
        error,
    };
};

// Helper hook to get a flat list of departments from the tree
export const useFlatDepartmentList = () => {
    const { departments } = useDepartments();

    // Function to flatten the department tree
    const flattenDepartments = (
        departments: Department[],
        results: Department[] = []
    ): Department[] => {
        for (const dept of departments) {
            results.push(dept);
            if (dept.subDepartments?.length) {
                flattenDepartments(dept.subDepartments, results);
            }
        }
        return results;
    };

    return {
        flatDepartments: flattenDepartments(departments),
    };
};
