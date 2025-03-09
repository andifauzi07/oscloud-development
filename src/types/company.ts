export interface Personnel {
    personnelid: number;
    companyid: number;
    name: string;
    status: 'Active' | 'Inactive' | 'Blocked';
    email: string;
    leadid?: number;
    managerid?: number;
    description?: string;
}

export interface Lead {
    leadId: number;
    name: string;
    status: string;
    contractValue: number;
    createdAt: string;
    company: {
        companyId: number;
        name: string;
        logo: string;
        city: string;
        product: string;
        email: string;
        categoryGroup: string | null;
        createdAt: string | null;
    };
    personnel: {
        personnelId: number;
        name: string;
        email: string;
        status: string;
        description: string;
        manager: any | null;
    };
    projects: {
        projectId: number;
        name: string;
        status: string;
        startDate: string;
        endDate: string;
    }[];
}

export interface ProjectCosts {
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

export interface Project {
    projectid: number;
    name: string;
    startdate: string;
    enddate: string;
    managerid: number;
    workspaceid: number;
    companyid: number;
    status: string;
    costs: ProjectCosts;
}

export interface Manager {
    userId: number;
    name: string;
}

export interface StaffMember {
    employeeId: number;
    name: string;
    rateType: string;
    rateValue: number;
    breakHours: number;
}

export interface Financials {
    totalLabourCost: number;
    totalTransportFee: number;
}

export interface ProjectDisplay {
    projectid: number;
    name: string;
    startdate: string;
    enddate: string;
    managerid: number;
    workspaceid: number;
    companyid: number;
    status: string;
    costs: ProjectCosts;
    manager: Manager;
    company: Company;
    assignedStaff: StaffMember[];
    connectedPersonnel: any[]; // Define type if needed
    financials: Financials;
}

export interface ProjectResponse {
    projects: ProjectDisplay[];
    total: number;
    page: number;
    limit: number;
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
    personnel?: Personnel[];
    projects?: Project[];
    leads?: Lead[];
}

// For display purposes in the UI
export interface CompanyDisplay {
    companyid: number;
    name: string;
    logo?: string;
    email?: string;
    city?: string;
    product?: string;
    category_group?: string;
    created_at?: string;
    managerid?: number;
    workspaceid?: number;
    personnel?: Personnel[];
    activeLeads?: number;
    totalContractValue?: number;
    detail: any;
}

// API Response interfaces
export interface CompanyResponse {
    data: Company;
    message: string;
    status: number;
}

export interface LeadResponse {
    data: Lead[];
    message: string;
    status: number;
}

// Request interfaces
export interface CreateCompanyRequest {
    name: string;
    logo: string;
    city: string;
    product: string;
    email: string;
    category_group: string;
    managerid: number;
    personnel: never[];  // Empty array with no type
}

export interface UpdateCompanyRequest {
    name?: string;
    logo?: string;
    city?: string;
    product?: string;
    email?: string;
    category_group?: string;
}

export interface CreateLeadRequest {
    companyId: number;
    personnelId: number;
    contractValue: number;
    status: string;
}

export interface UpdateLeadRequest {
    status: string;
}

export type CompanyId = {
    companyId?: number;
    companyid?: number;
}

export interface Company extends CompanyId {
    name: string;
    logo: string;
    // ... other fields
}

export interface CompanyUpdateResponse {
    companyId: number;
    name: string;
    logo?: string;
    city?: string;
    product?: string;
    email?: string;
    category_group?: string;
    managerid?: number;
}

export interface CompanyUpdate {
    name?: string;
    logo?: string;
    city?: string;
    product?: string;
    email?: string;
    category_group?: string;
    managerid?: number;
}
