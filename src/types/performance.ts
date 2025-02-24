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
    pointid: number; // Changed from pointId
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
        templatename: string; // Changed from name
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