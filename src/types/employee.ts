export interface Employee {
	employeeid: number;
	name: string;
	email: string;
	profileimage: string;
	employeecategoryid: number;
	departmentid: number;
	workspaceid: number;
	status: string;
	employeeCategory: {
		categoryid: number;
		categoryname: string;
		parentcategoryid: number;
	};
	department: {
		departmentid: number;
		departmentname: string;
		parentdepartmentid: number | null;
	};
	actions?: any;
}

export interface EmployeeFilters {
	department?: number;
	category?: number;
	search?: string;
	page?: number;
	limit?: number;
	id?: number; // Add this to support single employee fetching
}

type EmployeeProfile = {
	employeeId: number;
	name: string;
	department: string;
	category: string;
	joinedDate: string;
	rates: Array<{
		type: string;
		ratevalue: number;
	}>;
};

type EmployeeProject = {
	projectId: number;
	projectName: string;
	startDate: string;
	endDate: string;
	hourlyRate: number;
	totalFee: number;
};

type EmployeePayment = {
	paymentId: number;
	status: string;
	totalPayment: number;
	created_at: string;
	details: Array<{
		projectName: string;
		hoursWorked: number;
		transportFee: number;
	}>;
};

export type EmployeeCategory = {
	categoryid: number;
	categoryname: string;
	parentcategoryid?: number | null;
	subCategories?: EmployeeCategory[];
};
