import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useUserData } from "@/hooks/useUserData";
import {
    fetchWorkspaceEmployees,
    fetchEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    fetchEmployeeCategories,
    clearSelectedEmployee
} from "@/store/slices/employeeSlice";
import { Employee, EmployeeFilters } from "@/types/employee";

export const useWorkspaceEmployees = (filters?: EmployeeFilters) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { employees, total, currentPage, limit, loading, error } = useSelector((state: RootState) => state.employee);

    useEffect(() => {
        if (workspaceid) {
            dispatch(
                fetchWorkspaceEmployees({
                    workspaceId: Number(workspaceid),
                    filters: {
                        page: currentPage,
                        limit,
                        ...filters,
                    },
                })
            );
        }
    }, [dispatch, workspaceid, currentPage, limit, filters]);

    const addEmployee = useCallback(async (data: {
        name: string;
        email: string;
        employeeCategoryId: number;
        departmentId: number;
        profileImage?: string;
    }) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(
            createEmployee({ workspaceId: Number(workspaceid), data })
        ).unwrap();
    }, [dispatch, workspaceid]);

    const removeEmployee = useCallback(async (employeeId: number) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(
            deleteEmployee({ workspaceId: Number(workspaceid), employeeId })
        ).unwrap();
    }, [dispatch, workspaceid]);

    const updateEmployeeData = useCallback(async (employeeId: number, data: Partial<Employee>) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(
            updateEmployee({
                workspaceId: Number(workspaceid),
                employeeId,
                data
            })
        ).unwrap();
    }, [dispatch, workspaceid, employees]);

   
    return {
        employees,
        total,
        currentPage,
        limit,
        loading,
        error,
        updateEmployeeData,
        addEmployee,
        removeEmployee
    };
};

export const useEmployee = (employeeId: number) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { selectedEmployee, loading, error } = useSelector(
        (state: RootState) => state.employee
    );

    useEffect(() => {
        if (workspaceid && employeeId) {
            dispatch(
                fetchEmployeeById({
                    workspaceId: Number(workspaceid),
                    employeeId
                })
            );
        }
        return () => {
            dispatch(clearSelectedEmployee());
        };
    }, [dispatch, workspaceid, employeeId]);

    const updateEmployeeData = useCallback(async (employeeId: number, data: Partial<Employee>) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(
            updateEmployee({
                workspaceId: Number(workspaceid),
                employeeId,
                data
            })
        ).unwrap();
    }, [dispatch, workspaceid, selectedEmployee]);



    return {
        employee: selectedEmployee,
        loading,
        error,
        updateEmployeeData,
    };
};

export const useEmployeeCategories = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { categories, loading, error } = useSelector(
        (state: RootState) => state.employee
    );

    useEffect(() => {
        if (workspaceid) {
            dispatch(fetchEmployeeCategories(Number(workspaceid)));
        }
    }, [dispatch, workspaceid]);

    const getCategoryById = useCallback((categoryId: number) => {
        const findCategory = (categories: any[]): any | undefined => {
            for (const category of categories) {
                if (category.categoryId === categoryId) return category;
                if (category.subCategories) {
                    const found = findCategory(category.subCategories);
                    if (found) return found;
                }
            }
        };
        return findCategory(categories);
    }, [categories]);

    return {
        categories,
        loading,
        error,
        getCategoryById
    };
};
