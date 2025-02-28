import { createFileRoute } from '@tanstack/react-router';
import { useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { mockEmployees } from '@/config/mockData/employees';
import { Link } from '@tanstack/react-router';
import MenuList from '@/components/menuList';
import { mockCompanies } from '@/config/mockData/companies';
import { DataTable } from '@/components/ui/data-table';

export const Route = createFileRoute('/company/$companyId/companyPersonnel/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { companyId } = useParams({ strict: false });

	// Transform mock data into the required format
	const data = mockEmployees.map((employee) => {
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

	// Define columns with custom cells
	const columns = [
		{ header: () => <h1 className="pl-8">ID</h1>, accessorKey: 'id', cell: ({ row }: any) => <h1 className="pl-8">{row.original.id}</h1> },
		{ header: 'Name', accessorKey: 'name' },
		{ header: 'Company', accessorKey: 'company' },
		{ header: 'Manager', accessorKey: 'manager' },
		{ header: 'Active Leads', accessorKey: 'activeLeads' },
		{ header: 'Closed Leads', accessorKey: 'closedLeads' },
		{ header: 'Status', accessorKey: 'status' },
		{
			header: '',
			accessorKey: 'id',
			cell: ({ row }: any) => (
				<div className="w-full justify-end flex items-center">
					<Button
						variant="outline"
						className="w-20 border-b-0 border-t-0 border-r-0">
						<Link
							params={{ companyId: row.original.companyId, companyPersonnelId: row.original.id }}
							to="/company/$companyId/companyPersonnel/$companyPersonnelId">
							VIEW
						</Link>
					</Button>
				</div>
			),
		},
	];

	return (
		<div className="flex-1 h-full">
			<div className="items-center flex-none min-h-0 border-b">
				<div className="container flex border-r pl-4 items-center justify-between">
					<MenuList
						items={[
							{
								label: 'Profile',
								path: `/company/${companyId}`,
							},
							{
								label: 'Personnel',
								path: `/company/${companyId}/companyPersonnel`,
							},
						]}
					/>
					<div className="pr-4">
						<Link
							className="text-xs"
							to="/performance/setting">
							Settings
						</Link>
					</div>
				</div>
			</div>
			<div className="flex items-center justify-start px-8 bg-white border-b border-r h-12">
				<h2 className="text-base">Company Personnel of {companyId}</h2>
			</div>
			<div className="flex justify-end flex-none w-full bg-white">
				<Button className="w-20 text-black bg-transparent border-r md:w-20 link border-l h-10">ADD+</Button>
				<Button className="w-20 text-black bg-transparent border-b-0 border-r border-t-0 md:w-20 link h-10">EDIT</Button>
			</div>
			<DataTable
				columns={columns}
				data={data}
				loading={false}
			/>
		</div>
	);
}
