interface Manager {
    userId: number;
    name: string;
}

interface Company {
    companyId: number;
    name: string;
    logo: string;
}

interface AssignedStaffMember {
    employeeId: number;
    name: string;
    rateType: string;
    rateValue: number;
    breakHours: number;
}

interface Financials {
    totalLabourCost: number;
    totalTransportFee: number;
}

export interface Project {
    projectid: number;
    name: string;
    startdate: string;
    enddate: string;
    managerid: number;
    workspaceid: number;
    companyid: number;
    status: string;
    costs: {
        food?: number;
        break?: number;
        rental?: number;
        revenue?: number;
        other_cost?: number;
        labour_cost?: number;
        manager_fee?: number;
        costume_cost?: number;
        sales_profit?: number;
        transport_cost?: number;
    };
    manager: Manager;
    company: Company;
    assignedStaff: AssignedStaffMember[];
    connectedPersonnel: any[]; // Update this type if you have the structure
    financials: Financials;
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
