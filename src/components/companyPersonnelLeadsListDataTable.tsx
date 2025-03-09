import { Heading1 } from 'lucide-react';
import { Button } from './ui/button';
import { DataTable } from './ui/data-table';

// Define the type for a Lead
export interface Lead {
	id: number;
	projectName: string;
	manager: string;
	companyName: string;
	personnelName: string;
	status: string;
	startDate: string;
	value: string;
}

// Column definitions for the new DataTable
export const leadsColumns = [
	{
		header: () => <h1 className="pl-8">ID</h1>,
		accessorKey: 'leadId',
		cell: ({ row }: any) => <h1 className="py-2 pl-8">{row.original.id}</h1>,
	},
	{
		header: 'Contract Name',
		accessorKey: 'name',
		cell: ({ row }: any) => <span>{row.original.name || `Lead ${row.original.id}`}</span>,
	},
	{
		header: 'Manager',
		accessorKey: 'manager',
	},
	{
		header: 'Company Name',
		accessorKey: 'companyName',
	},
	{
		header: 'Personnel',
		accessorKey: 'personnelName',
	},
	{
		header: 'Status',
		accessorKey: 'status',
	},
	{
		header: 'Start Date',
		accessorKey: 'createdAt',
        cell: ({ row }: any) => {
            const project = row.original.createdAt || row.original.createdat || row.original.created_at
            return <span>{project?.split('T')[0] || 'No start date'}</span>;
        },
	},
	{
		header: 'Contract Value',
		accessorKey: 'contractValue',
		cell: ({ row }: any) => (
			<span>
				{row.original.contractValue?.toLocaleString()}
			</span>
		),
	},
	{
		header: '',
		id: 'actions',
		cell: () => (
			<div className="flex justify-end w-full">
				<Button
					variant="outline"
					className="border-t-0 border-b-0 border-r-0">
					View
				</Button>
			</div>
		),
	},
];

export const personnelColumns = [
	{
		header: () => <h1 className="pl-8">ID</h1>,
		accessorKey: 'personnelid',
		cell: ({ row }: any) => <h1 className="pl-8">{row.original.personnelid}</h1>,
	},
	{
		header: 'Name',
		accessorKey: 'name',
	},
	{
		header: 'Status',
		accessorKey: 'status',
	},
	{
		header: 'Email',
		accessorKey: 'email',
	},
	{
		header: 'Description',
		accessorKey: 'description',
	}
];

// Component to render the DataTable
export const CompanyPersonnelLeadsListDataTable = ({ data, companyName, personnelName }: { data: Lead[]; companyName: string; personnelName: string }) => {
	// Add companyName and personnelName to each lead
	const leads = data.map((lead) => ({
		...lead,
		companyName,
		personnelName,
	}));

	return (
		<DataTable
			columns={leadsColumns}
			data={leads}
		/>
	);
};
