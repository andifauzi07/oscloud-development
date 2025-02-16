import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import MenuList from '@/components/menuList';
import { DataTable } from '@/components/ui/data-table'; // Import the new DataTable component
import { mockEmployees } from '@/config/mockData/employees';
import { mockCompanies } from '@/config/mockData/companies';

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



export const Route = createFileRoute('/features/PersonnelList/')({
  component: RouteComponent,
})

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
		{ header: 'ID', accessorKey: 'id' },
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
				// <Link to={`/company/$companyId/personnel/$companyPersonnelId`}>
					<Button
						variant="outline"
						className="w-20">
						VIEW
					</Button>
				// </Link>
			),
		},
	];

	return (
		<div className="flex-1 h-full">
			{/* Header Section */}
			<div className="flex-none min-h-0 border-b">
				<div className="container flex flex-row items-center justify-between">
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
			</div>

			{/* Title Section */}
			<div className="flex items-center justify-start px-4 bg-white border border-l-0 min-h-14">
				<h2 className="text-base font-semibold">All Employees</h2>
			</div>

			{/* Action Buttons */}
			<div className="flex justify-end flex-none w-full bg-white">
				<Button className="w-1/2 text-black bg-transparent border md:w-20 link border-r-none min-h-14">ADD+</Button>
				<Button className="w-1/2 text-black bg-transparent border md:w-20 link min-h-14">EDIT</Button>
			</div>

			{/* Data Table */}
			<DataTable
				columns={columns}
				data={data}
			/>
		</div>
	);
}
