// Define types for the Department module
export interface Department {
    departmentid: number;
    departmentname: string;
    parentdepartmentid: number | null;
    subDepartments: Department[];
    employeeCount: number;
    managerCount: number;
    workspaceid?: number;
  }
  
  export interface DepartmentCreateData {
    departmentName: string;
    parentDepartmentId?: number | null;
  }
  
  export interface DepartmentUpdateData {
    departmentId?: string;
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
  }
  
  export interface UseDepartmentReturn {
    department: Department | null;
    loading: boolean;
    error: string | null;
    updateDepartment: (data: DepartmentUpdateData) => Promise<void>;
  }
  
  // Added to handle flat to hierarchical conversion if needed
  export interface FlatDepartment {
    departmentId: number;
    departmentName: string;
    parentDepartmentId: number | null;
    workspaceId: number;
  }