// Personnel interface
export interface Personnel {
    personnelid: number;
    companyid: number;
    name: string;
    status: 'Active' | 'Inactive' | 'Blocked';
    email: string;
    leadid?: number;
    managerid?: string;  // Changed to string to match the API
    description?: string;
    detail?: any;
    actions?: any;
}

// Lead interface
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

// Project interface
export interface Project {
    projectid: number;
    name: string;
    startdate: string;
    enddate: string;
    managerid: string;  // Changed to string to match the API
    workspaceid: number;
    companyid: number;
    status: string;
    costs: ProjectCosts;
}

export interface Manager {
    userId: string;
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
    managerid: string;  // Changed to string to match the API
    workspaceid: number;
    companyid: number;
    status: string;
    costs: ProjectCosts;
    manager: Manager;
    company: Company;
    assignedStaff: StaffMember[];
    connectedPersonnel: any[]; // Define type if needed
    financials: Financials;
    detail: any;
    actions: any;
}

export interface ProjectResponse {
    projects: ProjectDisplay[];
    total: number;
    page: number;
    limit: number;
}

export interface CompanyLead {
    leadId: number;
    contractValue: string | number;  // Can be either string or number
}

export interface CompanyPersonnel {
    personnelid: number;
    companyid: number;
    name: string;
    status: 'Active' | 'Inactive' | 'Blocked';
    email: string;
    description?: string;
    leadid?: number;
    managerid: string;  // Changed to string to match the API
}

export interface CompanyManager {
    userId: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
    image: string | null;
    phoneNumber: string | null;
}

export interface CompanyStats {
    totalLeads: number;
    activeLeads: number;
    totalContractValue: number;
    activeContractValue: number;
    personnelCount: number;
}

// Company Response interface
export interface CompanyResponse {
    companyId: number;
    workspaceId: number;
    name: string;
    logo: string | null;
    city: string | null;
    product: string | null;
    email: string | null;
    categoryGroup: string | null;
    createdAt: string;
    manager: CompanyManager | null;
    personnel: CompanyPersonnel[];
    stats: CompanyStats;
}

// For internal state management (if needed)
export interface Company {
    companyid: number;
    name: string;
    logo: string | null;
    workspaceid: number;
    createdAt?: string;
    city: string | null;
    product: string | null;
    email: string | null;
    category_group: string | null;
    managerid: string | null;
    personnel: CompanyPersonnel[];
    activeLeads: number;
    totalContractValue: number;
    detail?: any;
    manager?: CompanyManager | null
}

export interface CompanyUpdate {
    name?: string;
    logo?: string;
    city?: string;
    product?: string;
    email?: string;
    categoryGroup?: string;
    managerId?: string | null;
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
    managerid: string;  // Keep as required string
    personnel: never[];
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

// Remove or comment out the duplicate Company interface that extends CompanyId
// export interface Company extends CompanyId { ... }

export interface CompanyUpdateResponse {
    companyId: number;
    name: string;
    logo?: string;
    city?: string;
    product?: string;
    email?: string;
    category_group?: string;
    managerid?: string;
}

export interface CompanyUpdate {
    name?: string;
    logo?: string;
    city?: string;
    product?: string;
    email?: string;
    category_group?: string;
    managerid?: string;  // Changed to string to match the API
}

export interface CompaniesResponse {
    companies: Company[];
    total: number;
    page: number;
    limit: number;
}
