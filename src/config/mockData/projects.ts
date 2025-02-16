// Define the type for the staff assigned to a project
export type AssignedStaff = {
	id: number; // Unique identifier for the staff member
	name: string; // Name of the staff member
	image: string;
	status: string; // Status (e.g., Active, Inactive)
	money: number; // First monetary value
	money2: number; // Second monetary value
	grade: string; // Grade or performance rating
};

export type PaymentStaff = {
	id: string;
	image: string;
	name: string;
	break: number;
	duration: number;
	hour_rate: number;
	transport_fee: number;
	cost_a: number;
	cost_b: number;
	costum_fee: number;
	total_fee: number;
};

export const mockAssignedStaff: AssignedStaff[] = [
	{
		id: 1,
		image: '/public/vite.svg',
		name: 'John Doe',
		status: 'Active',
		money: 5000.75,
		money2: 3000.5,
		grade: 'A',
	},
	{
		id: 2,
		image: '/public/vite.svg',
		name: 'Jane Smith',
		status: 'Inactive',
		money: 4500.25,
		money2: 2500.0,
		grade: 'B',
	},
	{
		id: 3,
		image: '/public/vite.svg',
		name: 'Alice Johnson',
		status: 'Active',
		money: 6000.0,
		money2: 3500.75,
		grade: 'A+',
	},
	{
		id: 4,
		image: '/public/vite.svg',
		name: 'Michael Brown',
		status: 'Active',
		money: 5500.5,
		money2: 2800.25,
		grade: 'A-',
	},
	{
		id: 5,
		image: '/public/vite.svg',
		name: 'Emily Davis',
		status: 'Inactive',
		money: 4000.0,
		money2: 2200.0,
		grade: 'C',
	},
];

export const mockPaymentStaff: PaymentStaff[] = [
	{
		id: '1',
		image: '/public/vite.svg',
		name: 'John Doe',
		break: 30,
		duration: 8.5,
		hour_rate: 20,
		transport_fee: 15,
		cost_a: 50,
		cost_b: 30,
		costum_fee: 10,
		total_fee: 225,
	},
	{
		id: '2',
		image: '/public/vite.svg',
		name: 'Jane Smith',
		break: 45,
		duration: 7.2,
		hour_rate: 22,
		transport_fee: 10,
		cost_a: 40,
		cost_b: 20,
		costum_fee: 5,
		total_fee: 204,
	},
	{
		id: '3',
		image: '/public/vite.svg',
		name: 'Michael Johnson',
		break: 20,
		duration: 9.1,
		hour_rate: 18,
		transport_fee: 20,
		cost_a: 60,
		cost_b: 35,
		costum_fee: 15,
		total_fee: 257,
	},
	{
		id: '4',
		image: '/public/vite.svg',
		name: 'Emily Davis',
		break: 30,
		duration: 6.9,
		hour_rate: 25,
		transport_fee: 12,
		cost_a: 55,
		cost_b: 28,
		costum_fee: 8,
		total_fee: 200,
	},
	{
		id: '5',
		image: '/public/vite.svg',
		name: 'Chris Brown',
		break: 40,
		duration: 8.5,
		hour_rate: 19,
		transport_fee: 18,
		cost_a: 45,
		cost_b: 25,
		costum_fee: 12,
		total_fee: 232,
	},
];
