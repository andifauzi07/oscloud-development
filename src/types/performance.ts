import { Personnel } from "@/store/slices/companySlice";

export interface Point {
    pointid: number; // Changed from pointId
    categoryid: number; // Added
    pointname: string; // Changed from name
    weight: number;
}

export interface Category {
    categoryid: number; // Changed from categoryId
    templateid: number; // Added
    categoryname: string; // Changed from name
    points: Point[];
}

export interface Template {
    templateid: number; // Changed from templateId
    templatename: string; // Changed from templateName
    workspaceid: number; // Added
    categories: Category[];
}

export interface Score {
    pointId: number; // Changed from pointId
    score: number;
}

export interface PerformanceSheet {
    sheetId: number;
    employee: {
        employeeid: number; // Changed from employeeId
        name: string;
    };
    template: {
        templateid: number; // Changed from templateId
        name: string; // Changed from name
    };
    createdDate: string;
    scores: Score[];
    totalScore: number;
}

export interface UsePerformanceTemplatesReturn {
    templates: Template[];
    loading: boolean;
    error: string | null;
    addTemplate: (data: Partial<Template>) => Promise<Template>;
    editTemplate: (
        templateId: number,
        data: Partial<Template>
    ) => Promise<Template>;
    getTemplateById: (id: number) => Template | undefined;
    getCategoryPoints: (templateId: number, categoryId: number) => Point[];
}

export interface EmployeePerformance {
    employee: {
        employeeId: number;
        name: string;
    };
    performances: {
        sheetId: number;
        templateName: string;
        createdDate: string;
        categories: {
            categoryId: number;
            name: string;
            points: {
                pointId: number;
                name: string;
                weight: number;
                score: number;
            }[];
            categoryScore: number;
        }[];
        totalScore: number;
    }[];
}

export interface PerformanceResponse {
  employee: {
    employeeId: number;
    name: string;
  };
  performances: Array<{
    sheetId: number;
    templateName: string;
    createdDate: string;
    categories: Array<{
      categoryId: number;
      name: string;
      points: Array<{
        pointId: number;
        name: string;
        weight: number;
        score: number;
      }>;
      categoryScore: number;
    }>;
    totalScore: number;
  }>;
}

export interface PerformanceState {
    templates: Template[];
    sheets: PerformanceSheet[];
    currentSheet: PerformanceSheet | null; // Add this
    employeePerformances: { [key: number]: PerformanceResponse };
    loading: boolean;
    error: string | null;
}

export interface PerformanceFilters {
    employeeId?: number;
    templateId?: number;
    startDate?: string;
    endDate?: string;
    search?: string;
}

export interface PerformanceScore {
    pointId: number;
    categoryId: number;
    score: number;
}

export interface AssignedStaff {
    employeeId: number;
    name: string;
    rateType: string;
    rateValue: number;
    breakHours: number;
}

export interface ProjectManager {
    userId: number;
    name: string;
}

export interface ProjectFinancials {
    totalLabourCost: number;
    totalTransportFee: number;
}

export interface Company {
    companyid: number;
    name: string;
    logo: string;
    workspaceid: number;
    created_at: string;
    managerid: number;
    city: string;
    product: string;
    email: string;
    category_group: string;
    personnel: Personnel[];
    activeLeads: number;
    totalContractValue: number;
}

export interface Project {
    projectId: number;
    name: string;
    startDate: string;
    endDate: string;
    projectid: number;
    startdate: string;
    enddate: string;
    managerid: number;
    workspaceid: number;
    companyid: number;
    manager: ProjectManager;
    company: Company;
    assignedStaff: AssignedStaff[];
    financials: ProjectFinancials;
}

export interface ProjectState {
    projects: Project[];
    loading: boolean;
    error: string | null;
}
