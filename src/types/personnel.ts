import { Company, Project } from "./company";

export interface Manager {
    userId: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
}

export interface PersonnelProject {
    projectId: number;
    name: string;
    status: string;
    startDate: string;
    endDate: string;
}

export interface PersonnelLead {
    leadId: number;
    name: string | null;
    status: string;
    contractValue: number;
    createdAt: string | null;
    projects: PersonnelProject[];
}

export interface PersonnelStatistics {
    totalLeads: number;
    activeLeads: number;
    totalContractValue: number;
    activeContractValue: number;
    connectedProjects: number;
}

export interface PersonnelCompany {
    companyId: number;
    name: string;
    logo: string;
    categoryGroup: string | null;
}

export interface Personnel {
    personnelId: number;
    name: string;
    email: string | null;
    status: string;
    description: string | null;
    createdAt: string | null;
    manager: Manager | null;
    company: PersonnelCompany;
    leads: PersonnelLead[];
    statistics: PersonnelStatistics;
}

export interface CreatePersonnelRequest {
    name: string;
    email: string;
    status: string;
    description: string;
    leadid?: number;
    managerid?: string;
}

export interface UpdatePersonnelRequest {
    status?: string;
    description?: string;
}
