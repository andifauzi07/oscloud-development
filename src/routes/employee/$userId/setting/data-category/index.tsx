import MenuList from '@/components/menuList';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { createFileRoute } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';

export const Route = createFileRoute('/employee/$userId/setting/data-category/')({
	component: RouteComponent,
});

const menuItems = [
	{ label: 'Data Field', path: '/employee/$userId/setting' },
	{ label: 'Data Category', path: '/employee/$userId/setting/data-category' },
	{ label: 'Employee Category', path: '/employee/$userId/setting/employee-category' },
	{ label: 'Department', path: '/employee/$userId/setting/department' },
];

type DataCategoryRow = {
	category: string;
	parentCategory: string;
};

const rowDataCategory: DataCategoryRow[] = [
	{
		category: 'Basic Information',
		parentCategory: '-',
	},
	{
		category: 'SNS',
		parentCategory: 'Basic Information',
	},
	{
		category: 'Contracts',
		parentCategory: 'Basic Information',
	},
];

const columnsDataCategory: ColumnDef<DataCategoryRow>[] = [
	{
		accessorKey: 'category',
		header: 'Category',
	},
	{
		accessorKey: 'parentCategory',
		header: 'Parent Category',
	},
	{
		id: 'actions',
		header: '',
		cell: () => (
			<Button variant="outline">
				{/* Example action: View details of the staff member */}
				View
			</Button>
		),
	},
];

function RouteComponent() {
	return (
		<div>
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
		</div>
	);
}
