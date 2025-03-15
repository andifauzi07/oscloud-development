import { CellContext } from '@tanstack/react-table';
import { BaseColumnSetting } from '@/types/table';
import { Company, Project, ProjectDisplay } from '@/types/company';
import { Link } from '@tanstack/react-router';
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';

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

// Project

const costColumns = Object.entries({
	revenue: 'Revenue',
	labour_cost: 'Labour Cost',
	transport_cost: 'Transport Cost',
	break: 'Break Cost',
	food: 'Food Cost',
	rental: 'Rental Cost',
	manager_fee: 'Manager Fee',
	costume_cost: 'Costume Cost',
	other_cost: 'Other Cost',
	sales_profit: 'Sales Profit',
}).map(([key, label], index) => ({
	accessorKey: `costs.${key}` as keyof ProjectDisplay, // Changed to access nested costs object
	header: label,
	label: label,
	type: 'number' as const,
	date_created: new Date().toISOString(),
	status: 'shown' as const,
	order: 8 + index,
	cell: ({ row }: CellContext<ProjectDisplay, unknown>) => {
		const cost = row.original.costs?.[key as keyof typeof row.original.costs] || 0;
		return <span>¥{cost.toLocaleString()}</span>;
	},
}));

export const defaultProjectColumnSettings: BaseColumnSetting<ProjectDisplay>[] = [
	{
		accessorKey: 'name',
		header: () => <h1 className="pl-8">Project Name</h1>,
		label: 'Project Name',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 1,
		cell: ({ row }) => <h1 className="pl-8">{row.original.name}</h1>,
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
		accessorKey: 'categoryid',
		header: 'Category',
		label: 'Category',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 6,
		cell: ({ row }) => <span>{row.original.category?.name}</span>,
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
			return <span>{personnelCount}</span>;
		},
	},
	// Map through all cost types
	...costColumns,
	// Detail button always at the end
	{
		accessorKey: 'detail',
		header: '',
		label: '',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 99,
		cell: ({ row }) => (
			<div className="flex justify-end w-full">
				<div className="sticky right-0 bg-white">
					<Button
						variant="outline"
						className="w-20 border ">
						<Link
							to={`/projects/$projectId`}
							params={{
								projectId: row.original.projectid.toString(),
							}}>
							View
						</Link>
					</Button>
				</div>
			</div>
		),
	},
];

//Column for //Employee Page
export const defaultEmployeeColumnSettings: BaseColumnSetting<any>[] = [
	{
		accessorKey: 'profileimage',
		header: '',
		label: '',
		type: 'image',
		status: 'shown',
		order: 1,
		cell: ({ row }: any) => (
			<img
				className="object-cover w-10 h-10"
				src={row.original.profileimage || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
				alt={`${row.original.name}'s profile`}
			/>
		),
	},
	{
		accessorKey: 'employeeid',
		header: 'ID',
		label: 'Employee ID',
		type: 'number',
		status: 'shown',
		order: 2,
		cell: ({ row }) => <h1>{row.original.employeeid}</h1>,
	},
	{
		accessorKey: 'name',
		header: 'Name',
		label: 'Name',
		type: 'text',
		status: 'shown',
		order: 3,
		cell: ({ row }: any) => (
			<Link
				to={'/employee/$userId'}
				params={{ userId: row.original.employeeid.toString() }}
				className="text-blue-600 hover:underline">
				{row.original.name || '-'}
			</Link>
		),
	},
	{
		accessorKey: 'employeecategoryid',
		header: 'Employee Category',
		label: 'Employee Category',
		type: 'number',
		status: 'shown',
		order: 4,
		cell: ({ row }: any) => row.original.employeeCategory?.categoryname || '-',
	},
	{
		accessorKey: 'email',
		header: 'Email',
		label: 'Email',
		type: 'email',
		status: 'shown',
		order: 5,
		cell: ({ row }: any) =>
			row.original.email ? (
				<a
					href={`mailto:${row.original.email}`}
					className="text-blue-600 hover:underline">
					{row.original.email}
				</a>
			) : (
				'-'
			),
	},
	{
		accessorKey: 'departmentid',
		header: 'Department',
		label: 'Department',
		type: 'text',
		status: 'shown',
		order: 6,
		cell: ({ row }: any) => row.original.department?.departmentname || '-',
	},
	{
		accessorKey: 'actions',
		header: '',
		label: '',
		type: 'text',
		status: 'shown',
		order: 7,
		cell: ({ row }) => (
			<div className="flex justify-end w-full">
				<Link
					to={'/employee/$userId'}
					className="sticky"
					params={{ userId: row.original.employeeid.toString() }}>
					<Button
						variant="outline"
						className="w-20 border-t-0 border-b border-r-0">
						DETAIL
					</Button>
				</Link>
			</div>
		),
	},
];
