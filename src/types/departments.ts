// Define types for the Department module
export interface Department {
    departmentId: number;
    departmentName: string;
    parentDepartmentId: number | null;
    subDepartments: Department[];
    employeeCount: number;
    managerCount: number;
    workspaceId?: number;
  }
  
  export interface DepartmentCreateData {
    departmentName: string;
    parentDepartmentId?: number | null;
  }
  
  export interface DepartmentUpdateData {
    departmentName?: string;
    parentDepartmentId?: number | null;
  }
  
  export interface DepartmentState {
    departments: Department[];
    currentDepartment: Department | null;
    loading: boolean;
    error: string | null;
  }
  
  export interface UseDepartmentsReturn {
    departments: Department[];
    loading: boolean;
    error: string | null;
    getDepartmentById: (id: number) => Department | undefined;
    createDepartment: (data: DepartmentCreateData) => Promise<Department>;
    updateDepartment: (departmentId: number, data: DepartmentUpdateData) => Promise<Department>;
  }
  
  export interface UseDepartmentReturn {
    department: Department | null;
    loading: boolean;
    error: string | null;
  }
  
  // Added to handle flat to hierarchical conversion if needed
  export interface FlatDepartment {
    departmentId: number;
    departmentName: string;
    parentDepartmentId: number | null;
    workspaceId: number;
  }