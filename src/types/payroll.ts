export interface Employee {
	employeeId: number;
	name: string;
	category: string;
	rates: { type: string; ratevalue: number }[];
	totalPayment: number;
	numberOfPayments: number;
	joinedDate: Date;
	profileimage: string;
	employeecategory?: {
		categoryid?: number;
		categoryname?: string;
	};
}

export interface User {
	id: string;
	name: string;
	email: string;
	workspaceid: number;
	image: string | null;
	phone_number: string | null;
	backup_email: string | null;
	role?: string;
	status?: string;
}

// Define types
export interface PaymentDetail {
	detailId: number;
	projectId: number;
	projectName: string;
	hoursWorked: number;
	transportFee: number;
	totalAmount: number;
}

export interface Payment {
	paymentid: number;
	employeeid: number;
	employeename: string;
	status: string;
	details: PaymentDetail[];
	totalPayment: number;
	createdby: {
		userid: number;
		name: string;
	};
	created_at: string;
}

export interface PayrollResponse {
	payments: Payment[];
	employees: Employee[];
}

export interface PaymentDetailCreate {
	projectid: number;
	hoursworked: number;
	transportfee: number;
}

export interface PaymentCreate {
	employeeid: number;
	details: PaymentDetailCreate[];
}

export interface PaymentUpdate {
	status: string;
}

export interface EmployeePaymentResponse {
	paymentId: number;
	employeeId: number;
	employeeName: string;
	status: string;
	details: PaymentDetailResponse[];
	totalPayment: number;
	createdBy: {
		userid: number;
		name: string;
	};
	createdDate: string;
}
export interface PaymentDetailResponse {
	detailId: number;
	projectId: number;
	projectName: string;
	hoursWorked: number;
	transportFee: number;
	totalAmount: number;
}

export interface EmployeeProfile {
	employeeId: number;
	name: string;
	profileimage: string;
	joinedDate: string;
	category: string;
	department: string;
	rates: Array<{
		type: string;
		ratevalue: number;
	}>;
}

export interface EmployeeProject {
	projectId: number;
	projectName: string;
	startDate: string;
	endDate: string;
	break_hours: number;
	duration: number;
	hourlyRate: number;
	transportFee: number;
	totalFee: number;
}
export interface EmployeePayment {
	paymentId: number;
	employeeId: number;
	employeeName: string;
	profileimage: string;
	status: string;
	details: PaymentDetail[];
	totalPayment: number;
	createdBy: {
		userid: number;
		name: string;
	};
	createdDate: string;
}
