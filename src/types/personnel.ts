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
    startdate?: string; // for backward compatibility
    enddate?: string; // for backward compatibility
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
    email: string;
    status: string;
    description?: string;
    createdAt: string | null;
    manager?: {
        userId: string;
        email: string;
        status: string;
        role: string;
    };
    company?: {
        companyId: number;
        name: string;
        logo?: string;
    };
    leads: PersonnelLead[];
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
    workspaceid?: number;
    personnelid?: number;
    name?: string;
    email?: string;
    status?: string;
    description?: string;
}

export interface EditedPersonnel {
    name?: string;
    email?: string;
    status?: string;
    description?: string;
}
