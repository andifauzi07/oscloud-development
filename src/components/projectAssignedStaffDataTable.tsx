import { ColumnDef } from '@tanstack/react-table';
import { Button } from './ui/button';
import { Link } from '@tanstack/react-router';

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

// Define the columns for the table
export const assignedStaffColumns: ColumnDef<AssignedStaff>[] = [
	{
		accessorKey: 'image',
		header: 'Image',
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
	{
		accessorKey: 'money',
		header: 'Money',
		cell: ({ row }) => `$${row.original.money.toFixed(2)}`, // Format as currency
	},
	{
		accessorKey: 'money2',
		header: 'Money2',
		cell: ({ row }) => `$${row.original.money2.toFixed(2)}`, // Format as currency
	},
	{
		accessorKey: 'grade',
		header: 'Grade',
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => (
			<Button variant="outline">
				{/* Example action: View details of the staff member */}
				<Link to={`/`}>View</Link>
				<h1>{row.original.id}</h1>
			</Button>
		),
	},
];

// Define the columns for the table payment
export const paymentStaff: ColumnDef<PaymentStaff>[] = [
	{
		accessorKey: 'image',
		header: 'Image',
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'break',
		header: 'Break',
	},
	{
		accessorKey: 'duration',
		header: 'Duration',
		cell: ({ row }) => `$${row.original.duration}`, // Format as currency
	},
	{
		accessorKey: 'hour_rate',
		header: 'Hour rate',
		cell: ({ row }) => `$${row.original.hour_rate}`, // Format as currency
	},
	{
		accessorKey: 'transport_fee',
		header: 'Transport fee',
		cell: ({ row }) => `$${row.original.transport_fee}`,
	},
	{
		accessorKey: 'cost_a',
		header: 'Cost A',
		cell: ({ row }) => `$${row.original.cost_a}`,
	},
	{
		accessorKey: 'cost_b',
		header: 'Cost B',
		cell: ({ row }) => `$${row.original.cost_b}`,
	},
	{
		accessorKey: 'costum_fee',
		header: 'Costum fee',
		cell: ({ row }) => `$${row.original.costum_fee}`,
	},
	{
		accessorKey: 'total_fee',
		header: 'Total fee',
		cell: ({ row }) => `$${row.original.total_fee}`,
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			return (
				<Button variant="outline">
					{/* Example action: View details of the staff member */}
					<Link to={`/`}>Edit</Link>
					<h1>{row.original.id}</h1>
				</Button>
			);
		},
	},
];
