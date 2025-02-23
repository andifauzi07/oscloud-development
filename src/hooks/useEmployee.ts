import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useUserData } from "@/hooks/useUserData";
import {
    fetchWorkspaceEmployees,
    // fetchEmployeeCategories,
    createEmployee,
    updateEmployee,
    // type Employee,
} from "@/store/slices/employeeSlice";

interface Employee {
    employeeid: number;
    name: string;
    email: string;
    profileimage: string;
    employeecategoryid: number;
    departmentid: number;
    workspaceid: number;
    employeeCategory: {
        categoryid: number;
        categoryname: string;
        parentcategoryid: number;
    };
    department: {
        departmentid: number;
        departmentname: string;
        parentdepartmentid: number | null;
    };
}

// Update the EmployeeFilters interface
interface EmployeeFilters {
    department?: number;
    category?: number;
    search?: string;
    page?: number;
    limit?: number;
    id?: number; // Add this to support single employee fetching
}
export const useWorkspaceEmployees = (filters?: EmployeeFilters) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { employees, total, currentPage, limit, loading, error } = useSelector(
        (state: RootState) => state.employee
    );

    useEffect(() => {
        if (workspaceid) {
            dispatch(fetchWorkspaceEmployees({ 
                workspaceId: Number(workspaceid), 
                filters: {
                    page: currentPage,
                    limit,
                    workspaceid: Number(workspaceid), // Add workspaceId to filters
                    ...filters
                }
            }));
        }
    }, [dispatch, workspaceid, currentPage, limit, filters]);

    const addEmployee = async (data: any) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(createEmployee({ workspaceId: Number(workspaceid), data })).unwrap();
    };

    const editEmployee = async (employeeId: number, data: any) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        return dispatch(updateEmployee({ workspaceId: Number(workspaceid), employeeId, data })).unwrap();
    };

    return {
        employees: employees.filter(emp => emp.workspaceid === Number(workspaceid)), // Filter by workspace
        total,
        currentPage,
        limit,
        loading,
        error,
        addEmployee,
        editEmployee,
    };
};

// export const useEmployeeCategories = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const { workspaceid } = useUserData();
//     const { categories, loading, error } = useSelector(
//         (state: RootState) => state.employee
//     );

//     useEffect(() => {
//         if (workspaceid) {
//             dispatch(fetchEmployeeCategories(Number(workspaceid)));
//         }
//     }, [dispatch, workspaceid]);

//     return {
//         categories,
//         loading,
//         error,
//     };
// };

export const usePaginatedEmployees = (pageSize = 10) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { employees, total, currentPage, loading, error } = useSelector(
        (state: RootState) => state.employee
    );

    const setPage = (page: number) => {
        if (workspaceid) {
            dispatch(fetchWorkspaceEmployees({ 
                workspaceId: Number(workspaceid), 
                filters: { 
                    page, 
                    limit: pageSize,
                    workspaceid: Number(workspaceid)
                } 
            }));
        }
    };

    useEffect(() => {
        if (workspaceid) {
            dispatch(fetchWorkspaceEmployees({ 
                workspaceId: Number(workspaceid), 
                filters: { 
                    page: 1, 
                    limit: pageSize,
                    workspaceid: Number(workspaceid)
                } 
            }));
        }
    }, [dispatch, workspaceid, pageSize]);

    return {
        employees: employees.filter(emp => emp.workspaceid === Number(workspaceid)),
        total,
        currentPage,
        pageSize,
        loading,
        error,
        setPage,
        totalPages: Math.ceil(total / pageSize),
    };
};

export const useEmployee = (employeeId: number) => {
    const dispatch = useDispatch<AppDispatch>();
    const { workspaceid } = useUserData();
    const { employees, loading, error } = useSelector((state: RootState) => state.employee);
    const [employee, setEmployee] = useState<Employee | null>(null);
    
    useEffect(() => {
        const foundEmployee = employees.find(
            emp => emp.employeeid === employeeId && emp.workspaceid === Number(workspaceid)
        );
        
        if (foundEmployee) {
            setEmployee(foundEmployee);
        } else if (workspaceid) {
            dispatch(fetchWorkspaceEmployees({ 
                workspaceId: Number(workspaceid),
                filters: { 
                    page: 1, 
                    limit: 1,
                    workspaceid: Number(workspaceid)
                }
            }));
        }
    }, [dispatch, workspaceid, employeeId, employees]);

    const updateEmployeeData = async (data: Partial<Employee>) => {
        if (!workspaceid) throw new Error("No workspace ID available");
        try {
            const result = await dispatch(updateEmployee({ 
                workspaceId: Number(workspaceid), 
                employeeId,
                data 
            })).unwrap();
            setEmployee(result);
            return result;
        } catch (error) {
            throw error;
        }
    };

    return {
        employee,
        loading,
        error,
        updateEmployee: updateEmployeeData
    };
};
