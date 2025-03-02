import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import MenuList from '@/components/menuList';
import { DataTable } from '@/components/ui/data-table'; // Import the new DataTable component
import { mockEmployees } from '@/config/mockData/employees';
import { mockCompanies } from '@/config/mockData/companies';
import { TitleWrapper } from '@/components/wrapperElement';

// Define the data structure
interface PersonnelData {
	id: number;
	name: string;
	company: string;
	companyId: number;
	manager: string;
	activeLeads: number;
	closedLeads: number;
	status: string;
	addedAt: string;
}

export const Route = createFileRoute('/features/personnel-list/')({
	component: RouteComponent,
});

function RouteComponent() {
	// Map mockEmployees to PersonnelData
	const data: PersonnelData[] = mockEmployees.map((employee) => {
		const company = mockCompanies.find((comp) => comp.id === employee.companyId);
		return {
			id: employee.id,
			name: employee.name,
			company: company ? company.name : 'Unknown',
			companyId: employee.companyId,
			manager: company?.managers.map((m) => m.name).join(', ') || 'None',
			activeLeads: employee.leads.filter((lead) => lead.status === 'active').length,
			closedLeads: employee.leads.filter((lead) => lead.status === 'completed').length,
			status: employee.isTemporary ? 'Temporary' : 'Permanent',
			addedAt: employee.joinedDate,
		};
	});

	// Define columns for the new DataTable
	const columns = [
		{ header: () => <h1 className="pl-8">ID</h1>, accessorKey: 'id', cell: ({ row }: any) => <h1 className="pl-8">{row.original.id}</h1> },
		{ header: 'Personnel Name', accessorKey: 'name' },
		{ header: 'Company', accessorKey: 'company' },
		{ header: 'Manager', accessorKey: 'manager' },
		{ header: 'Active Leads', accessorKey: 'activeLeads' },
		{ header: 'Closed Leads', accessorKey: 'closedLeads' },
		{ header: 'Status', accessorKey: 'status' },
		{ header: 'Added At', accessorKey: 'addedAt' },
		{
			header: '',
			accessorKey: 'id', // Use 'id' as the accessorKey for actions
			cell: () => (
				<div className="w-full flex justify-end">
					{/* // <Link to={`/company/$companyId/personnel/$companyPersonnelId`}> */}
					<Button
						variant="outline"
						className="w-20 border-r-0 border-b-0 border-t-0">
						VIEW
					</Button>
					{/* // </Link> */}
				</div>
			),
		},
	];

	return (
		<div className="flex-1 h-full">
			{/* Header Section */}
			{/* <div className="flex-none min-h-0">
				<div className="container flex flex-row items-center border-r pr-8 justify-between">
					<MenuList
						items={[
							{
								label: 'Profile',
								path: '/dashboard/profile',
							},
							{
								label: 'Personnel',
								path: '/dashboard/personnel',
							},
						]}
					/>
					<Link
						className="relative bottom-2"
						to="/performance/setting">
						Setting
					</Link>
				</div>
			</div> */}

			{/* Title Section */}
			<TitleWrapper>
				<h2>All Employees</h2>
			</TitleWrapper>

			{/* Action Buttons */}
			<div className="flex justify-end flex-none w-full bg-white">
				<Button className="w-1/2 text-black bg-transparent border-r border-l md:w-20 link border-r-none min-h-10">ADD+</Button>
				<Button className="w-1/2 text-black bg-transparent border-r md:w-20 link min-h-10">EDIT</Button>
			</div>

			{/* Data Table */}
			<DataTable
				columns={columns}
				data={data}
				loading={false}
			/>
		</div>
	);
}
