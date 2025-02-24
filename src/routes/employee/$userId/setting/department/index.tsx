import MenuList from '@/components/menuList';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { formatUrlString } from '@/lib/utils';
import { createFileRoute, Link, useParams } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';

export const Route = createFileRoute('/employee/$userId/setting/department/')({
	component: RouteComponent,
});

const menuItems = [
	{ label: 'Data Field', path: '/employee/$userId/setting' },
	{ label: 'Data Category', path: '/employee/$userId/setting/data-category' },
	{ label: 'Employee Category', path: '/employee/$userId/setting/employee-category' },
	{ label: 'Department', path: '/employee/$userId/setting/department' },
];

type DataCategoryRow = {
	id: string;
	name: string;
	parentDepartment: string;
	manager: string;
	employee: string;
};

const rowDataCategory: DataCategoryRow[] = [
	{
		id: '12',
		name: 'Sales Department',
		parentDepartment: '-',
		manager: '12',
		employee: '12',
	},
	{
		id: '24',
		name: 'Marketing Department',
		parentDepartment: '-',
		manager: '45',
		employee: '45',
	},
	{
		id: '36',
		name: 'Sosial media team',
		parentDepartment: 'Marketing Department',
		manager: '05',
		employee: '05',
	},
];

function RouteComponent() {
	const { userId } = Route.useParams();

	const columnsDataCategory: ColumnDef<DataCategoryRow>[] = [
		{
			accessorKey: 'name',
			header: 'Department Name',
		},
		{
			accessorKey: 'parentDepartment',
			header: 'Parent Department',
		},
		{
			accessorKey: 'manager',
			header: 'Manager',
		},
		{
			accessorKey: 'employee',
			header: 'Employee',
		},
		{
			accessorKey: 'id',
			header: '',
			cell: ({ row }) => (
				<Link
					to="/employee/$userId/setting/department/$departmenId"
					params={{ userId: userId as string, departmenId: formatUrlString(row.original.name) }}>
					VIEW
				</Link>
			),
		},
	];

	return (
		<div>
			<div className="container flex items-center justify-between px-4 bg-white border-b">
				<MenuList items={menuItems} />
			</div>
			<div className="flex w-full bg-white border-b justify-end">
				<Button className="w-20 h-10 text-black bg-transparent border-l border-r link">ADD +</Button>
				<Button className="w-20 h-10 text-black bg-transparent border-r link">EDIT</Button>
			</div>
			<div className="border-r border-b">
				<DataTable
					columns={columnsDataCategory}
					data={rowDataCategory}
				/>
			</div>
		</div>
	);
}
