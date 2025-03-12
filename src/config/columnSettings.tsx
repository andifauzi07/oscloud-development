import { CellContext } from '@tanstack/react-table';
import { BaseColumnSetting } from '@/types/table';
import { Company, Project, ProjectDisplay } from '@/types/company';
import { Link } from '@tanstack/react-router';
import { memo } from 'react';
import { Button } from '@/components/ui/button';

// Memoized Image Cell component
const CompanyLogoCell = memo(({ row }: { row: any }) => (
	<div className="flex items-center justify-start h-full">
		<figure className="w-10 h-10 overflow-hidden">
			<img
				className="object-cover w-full h-full"
				src={row.original.logo || '/default-avatar.png'}
				alt={`${row.original.name} logo`}
			/>
		</figure>
	</div>
));
CompanyLogoCell.displayName = 'CompanyLogoCell';

export const defaultCompanyColumnSettings: BaseColumnSetting<Company>[] = [
	{
		accessorKey: 'logo',
		header: '',
		label: '',
		type: 'image',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 1,
		cell: ({ row }: CellContext<Company, any>) => <CompanyLogoCell row={row} />,
	},
	{
		accessorKey: 'companyid',
		header: 'ID',
		label: 'ID',
		type: 'number',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 2,
	},
	{
		accessorKey: 'name',
		header: 'Company',
		label: 'Company',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 3,
	},
	{
		accessorKey: 'personnel',
		header: 'Personnel No.',
		label: 'Personnel No.',
		type: 'number',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 4,
		cell: ({ row }: CellContext<Company, any>) => <div className="flex items-center justify-start h-full">{row.original.personnel?.length}</div>,
	},
	{
		accessorKey: 'category_group',
		header: 'Category Group',
		label: 'Category Group',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 5,
	},
	{
		accessorKey: 'city',
		header: 'Cities',
		label: 'Cities',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 6,
	},
	{
		accessorKey: 'createdAt', // Type assertion
		header: 'Created at',
		label: 'Created at',
		type: 'date',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 7,
	},
	{
		accessorKey: 'managerid',
		header: 'Manager',
		label: 'Manager',
		type: 'number',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 8,
	},
	{
		accessorKey: 'product',
		header: 'Product',
		label: 'Product',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 9,
	},
	{
		accessorKey: 'activeLeads',
		header: 'Active Leads',
		label: 'Active Leads',
		type: 'number',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 10,
	},
	{
		accessorKey: 'email',
		header: 'Email',
		label: 'Email',
		type: 'email',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 11,
	},
	{
		accessorKey: 'detail',
		header: 'View',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 12,
		cell: ({ row }: CellContext<Company, any>) => (
			<Link
				to={`/company/$companyId`}
				params={{
					companyId: row.original.companyid.toString(),
				}}>
				<Button
					variant="outline"
					className="w-20 h-full border">
					DETAIL
				</Button>
			</Link>
		),
	},
];

import { ColumnDef } from '@tanstack/react-table';

export const projectColumns: ColumnDef<Project>[] = [
	{
		accessorKey: 'name',
		header: 'Project Name',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
	{
		accessorKey: 'startdate',
		header: 'Start Date',
	},
	{
		accessorKey: 'enddate',
		header: 'End Date',
	},
];

export const defaultProjectColumnSettings: BaseColumnSetting<ProjectDisplay>[] = [
	{
		accessorKey: 'name',
		header: () => <h1 className="pl-8">Project Name</h1>,
		label: 'Project Name',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 1,
		cell: ({ row }) => <h1 className="py-2 pl-8">{row.original.name}</h1>,
	},
	{
		accessorKey: 'managerid', // Changed from "manager.name" to match Project type
		header: 'Manager',
		label: 'Manager',
		type: 'number',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 2,
		cell: ({ row }) => <span>{row.original.manager?.name}</span>, // Access nested property in cell renderer
	},
	{
		accessorKey: 'startdate', // Changed from startDate to match Project type
		header: 'Starting',
		label: 'Starting',
		type: 'date',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 3,
		cell: ({ row }) => (row.original.startdate ? new Date(row.original.startdate).toLocaleDateString() : 'N/A'),
	},
	{
		accessorKey: 'enddate', // Changed from endDate to match Project type
		header: 'End',
		label: 'End',
		type: 'date',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 4,
		cell: ({ row }) => (row.original.enddate ? new Date(row.original.enddate).toLocaleDateString() : 'N/A'),
	},
	{
		accessorKey: 'companyid', // Changed from company.name to match Project type
		header: 'Client Name',
		label: 'Client Name',
		type: 'number',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 5,
		cell: ({ row }) => <span>{row.original.company?.name}</span>, // Access nested property in cell renderer
	},
	{
		accessorKey: 'status',
		header: 'Status',
		label: 'Status',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 6,
	},
	{
		accessorKey: 'assignedStaff',
		header: 'Members',
		label: 'Members',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 7,
		cell: ({ row }) => {
			const personnelCount = Array.isArray(row.original.assignedStaff) ? row.original.assignedStaff.length : 0;
			return (
				<div className="flex items-center gap-2 text-xs whitespace-nowrap">
					<span>{personnelCount}</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'costs',
		header: 'Break Cost',
		label: 'Break Cost',
		type: 'number',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 8,
		cell: ({ row }) => {
			const cost = row.original.costs?.break || 0;
			return `¥${cost.toLocaleString()}`;
		},
	},
	{
		accessorKey: 'costs',
		header: 'Food Cost',
		label: 'Food Cost',
		type: 'number',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 9,
		cell: ({ row }) => {
			const cost = row.original.costs?.food || 0;
			return `¥${cost.toLocaleString()}`;
		},
	},
	{
		accessorKey: 'detail',
		header: '',
		label: '',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 10,
		cell: ({ row }) => {
			return (
				<div className="flex justify-end w-full">
					<Button
						variant="outline"
						className="border-t-0 border-b-0 border-r-0">
						<Link
							to={`/projects/$projectId`}
							params={{
								projectId: row.original.projectid.toString(),
							}}>
							View
						</Link>
					</Button>
				</div>
			);
		},
	},
];
