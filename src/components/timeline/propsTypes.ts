export interface Employee {
	employeeId: number;
	name: string;
	rateType: string;
	rateValue: number;
	breakHours: number;
}

export interface Manager {
	userId: number;
	name: string;
}

export interface Financials {
	totalLabourCost: number;
	totalTransportFee: number;
}

export interface Project {
	projectId: number;
	name: string;
	startDate: string;
	endDate: string;
	manager: Manager;
	assignedStaff: Employee[];
	financials: Financials;
}
