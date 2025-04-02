import { Company, Lead, Project } from './company';
import { AppUser } from './user';

export interface PersonnelManager {
	userId: string;
	email: string;
	status: string;
	role: string;
	image: string | null;
	phoneNumber: string | null;
	backupEmail: string | null;
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
	name: string;
	status: string;
	contractValue: number;
	createdAt: string;
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
	status: 'Active' | 'Inactive' | 'Blocked';
	email: string;
	description: string;
	leadid: number;
	managerid: string;
	company: Company;
	lead: Lead;
	app_user: AppUser;
}

// export interface Personnel {
// 	personnelid: number;
// 	name: string;
// 	email: string;
// 	status: 'Active' | 'Inactive' | 'Blocked';
// 	description: string | null;
// 	manager: PersonnelManager;
// 	leads: PersonnelLead[];
// 	statistics: PersonnelStatistics;
// 	createdAt: string | null;
// }

export interface CreatePersonnelRequest {
	name: string;
	email: string;
	status: 'Active' | 'Inactive' | 'Blocked';
	description?: string;
	managerId: string;
}

export interface UpdatePersonnelRequest {
	workspaceId?: number;
	personnelId?: number;
	name?: string;
	email?: string;
	status?: 'Active' | 'Inactive' | 'Blocked';
	description?: string;
	managerId?: string;
}

export interface EditedPersonnel {
	name?: string;
	email?: string;
	status?: string;
	description?: string;
	managerid?: string;
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
	company?: PersonnelCompany;
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

export interface CompanyPersonnel {
	personnelId: number;
	name: string;
	email: string;
	status: 'Active' | 'Inactive' | 'Blocked';
	description: string | null;
	createdAt: string | null;
}

export interface CompanyStats {
	totalLeads: number;
	activeLeads: number;
	totalContractValue: number;
	activeContractValue: number;
	personnelCount: number;
}

export interface CompanyResponse {
	companyId: number;
	workspaceId: number;
	name: string;
	logo: string;
	city: string;
	product: string;
	email: string;
	categoryGroup: string | null;
	createdAt: string;
	manager: CompanyManager;
	personnel: CompanyPersonnel[];
	stats: CompanyStats;
}
