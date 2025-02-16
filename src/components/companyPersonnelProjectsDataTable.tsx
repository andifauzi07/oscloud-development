import { Button } from './ui/button';
import { Link } from '@tanstack/react-router';

// Define the type for a Project
export interface Project {
	id: number;
	projectName: string;
	manager: string;
	startDate: string;
	endDate: string;
	clientName: string;
	category: string;
	members: string[];
	costs: {
		rest: number;
		food: number;
		rental: number;
		otherCost: number;
	};
}

// Column definitions for the new DataTable
export const projectsColumns = [
	{
		header: 'Project Name',
		accessorKey: 'projectName',
	},
	{
		header: 'Manager',
		accessorKey: 'manager',
	},
	{
		header: 'Starting',
		accessorKey: 'startDate',
	},
	{
		header: 'End',
		accessorKey: 'endDate',
	},
	{
		header: 'Client Name',
		accessorKey: 'clientName',
	},
	{
		header: 'Category',
		accessorKey: 'category',
	},
	{
		header: 'Members',
		accessorKey: 'members', // Use 'members' as the accessorKey
		cell: (props: any) => {
			return props.row.original.members.join(', ');
		},
	},
	{
		header: 'Rest',
		accessorKey: 'costs.rest',
	},
	{
		header: 'Food',
		accessorKey: 'costs.food',
	},
	{
		header: 'Rental',
		accessorKey: 'costs.rental',
	},
	{
		header: 'Other Cost',
		accessorKey: 'costs.otherCost',
	},
	{
		header: 'Actions',
		accessorKey: 'id', // Use 'id' as the accessorKey for actions
		cell: () => {
			return (
				<Button variant="outline">
					{/* Use the project ID from row.id */}
					<Link to={`/project/$projectId`}>View</Link>
				</Button>
			);
		},
	},
];
