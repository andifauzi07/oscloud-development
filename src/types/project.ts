export interface Project {
    projectId: number;
    name: string;
    startDate: string;
    endDate: string;
    status: string | null;
    projectid: number; // duplicated projectId
    startdate: string; // duplicated startDate
    enddate: string; // duplicated endDate
    managerid: number;
    workspaceid: number;
    companyid: number;
    city: string | null;
    product: string | null;
    manager: {
        userId: number;
        name: string;
    };
    company: {
        companyId: number;
        name: string;
        logo: string;
    };
    assignedStaff: {
        employeeId: number;
        name: string;
        rateType: string;
        rateValue: number;
        breakHours: number;
    }[];
    financials: {
        totalLabourCost: number;
        totalTransportFee: number;
    };
}