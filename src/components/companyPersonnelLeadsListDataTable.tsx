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
		accessorKey: 'id',
		cell: ({ row }: any) => <h1 className="pl-8 py-2">{row.original.id}</h1>,
	},
	{
		header: 'Contract Name',
		accessorKey: 'projectName',
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
		header: 'Added At',
		accessorKey: 'startDate',
	},
	{
		header: 'Contract Value',
		accessorKey: 'value',
	},
	{
		header: '',
		accessorKey: 'actions', // Use 'id' as the accessorKey for actions
		cell: () => (
			<div className="w-full flex justify-end">
				<Button
					variant="outline"
					className="border-b-0 border-t-0 border-r-0">
					View
				</Button>
			</div>
		),
	},
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
