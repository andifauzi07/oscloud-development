export interface Personnel {
    personnelid: number;
    companyid: number;
    name: string;
    status: string;
    email: string;
}

export interface Lead {
    leadid: number;
    companyid: number;
    status: string;
    contractvalue: number;
    personnelid: number;
    workspaceid: number;
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
    companyid: number;
    personnelid: number;
    contractvalue: number;
    status: string;
}

export interface UpdateLeadRequest {
    status: string;
}
