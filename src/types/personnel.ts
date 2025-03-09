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
    personnelid: number;
    companyid: number;
    name: string;
    status: 'Active' | 'Inactive';
    email: string | null;
    description: string | null;
    leadid: number | null;
    managerid: string;
    company: {
        city: string | null;
        logo: string;
        name: string;
        email: string | null;
        product: string | null;
        companyid: number;
        managerid: string;
        created_at: string;
        workspaceid: number;
        category_group: string | null;
    };
    lead: {
        name: string;
        leadid: number;
        status: string;
        companyid: number;
        created_at: string;
        personnelid: number;
        workspaceid: number;
        contractvalue: number;
        company: {
            // ... same as above company interface
        };
    } | null;
    app_user: {
        role: string;
        email: string;
        image: string;
        status: string;
        userid: string;
        backup_email: string | null;
        phone_number: string | null;
    };
}

export interface CreatePersonnelRequest {
    name: string;
    email: string;
    status: string;
    description: string;
    companyid: number;
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

export interface PersonnelData {
    id: number;
    name: string;
    email: string;
    manager: string;
    activeLeads: number;
    closedLeads: number;
    status: string;
    addedAt: string;
    company?: Personnel['company'];
}
