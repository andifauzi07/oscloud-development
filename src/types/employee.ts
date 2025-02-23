export interface Employee {
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

export interface EmployeeFilters {
    department?: number;
    category?: number;
    search?: string;
    page?: number;
    limit?: number;
    id?: number; // Add this to support single employee fetching
}