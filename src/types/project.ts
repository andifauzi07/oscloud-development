interface Company {
    companyId: number;
    name: string;
    logo: string | null;
    categoryGroup?: string | null;
}

interface Lead {
    leadId: number;
    name: string;
    status: string;
    contractValue: number;
}

interface Personnel {
    personnelId: number;
    name: string;
    email: string;
    status: string;
    description: string | null;
    company: Company;
    lead: Lead;
}

interface AssignedStaff {
    employeeId: number;
    name: string;
    profileImage: string;
    rateType: string;
    rateValue: number;
    breakHours: number;
    availability: string;
    totalEarnings: number;
    averagePerformance: number | null;
    currentProjects: number;
}

interface Manager {
    userId: string;
    name: string;
}

interface ProjectCosts {
    food: number;
    break: number;
    rental: number;
    revenue: number;
    other_cost: number;
    labour_cost: number;
    manager_fee: number;
    costume_cost: number;
    sales_profit: number;
    transport_cost: number;
}

interface ProjectFinancials {
    totalLabourCost: number;
    totalTransportFee: number;
}

export interface Project {
    projectid: number;
    name: string;
    startdate: string;
    enddate: string;
    workspaceid: number;
    companyid: number;
    status: string | null;
    costs: {
        food: number;
        break: number;
        rental: number;
        revenue: number;
        other_cost: number;
        labour_cost: number;
        manager_fee: number;
        costume_cost: number;
        sales_profit: number;
        transport_cost: number;
    };
    managerid: string;
    description: string | null;
    requiredstaffnumber: number;
    manager: {
        userId: string;
        name: string;
    };
    company: {
        companyId: number;
        name: string;
        logo: string;
    };
    assignedStaff: AssignedStaff[];
    personnel: any[];
    requiredStaffNumber: number;
    currentStaffCount: number;
    financials: {
        totalLabourCost: number;
        totalTransportFee: number;
    };
}

export interface CreateProjectRequest {
    name: string;
    startdate: string;
    enddate: string;
    status: string;
    managerid: number;
    workspaceid: number;
    companyid: number;
    costs: Project['costs'];
}

export interface UpdateProjectRequest {
    name?: string;
    startdate?: string;
    enddate?: string;
    status?: string;
}

export interface ProjectsResponse {
    projects: Project[];
    total: number;
    page: number;
    limit: number;
}

export interface ProjectResponse {
    project: Project;
}
