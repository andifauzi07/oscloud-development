import { createFileRoute } from '@tanstack/react-router';
import MenuList from '@/components/menuList';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/employee/setting/')({
	component: RouteComponent,
});

const dataFieldColumns = [
	{ id: 'field', header: 'Data Field', accessorKey: 'field' },
	{ id: 'type', header: 'Type', accessorKey: 'type' },
	{ id: 'category', header: 'Category', accessorKey: 'category' },
	{ id: 'dateCreated', header: 'Date Created', accessorKey: 'dateCreated' },
	{ id: 'dateAdded', header: 'Date Added', accessorKey: 'dateAdded' },
	{ id: 'status', header: 'Status', accessorKey: 'status' },
	{
		id: 'actions',
		header: 'Actions',
		accessorKey: 'actions',
		cell: ({ row }: any) => (
			<button
				className="p-2 border hover:underline"
				onClick={() => console.log('Removing:', row.original.actions)}>
				REMOVE
			</button>
		),
	},
];

const dataFieldData = [
	{ id: 1, field: 'Name', type: 'Custom Data', category: '', dateCreated: '2024.11.01', dateAdded: '2024.11.01', actions: 'REMOVE', status: 'Active' },
	{ id: 2, field: 'Phone number', type: 'Custom data', category: 'Basic information', dateCreated: '2024.11.01', dateAdded: '2024.11.01', actions: 'REMOVE', status: 'Hidden' },
];

const categoryColumns = [
	{ id: 'categoryName', accessorKey: 'categoryName', header: 'Category' },
	{ id: 'parentCategory', accessorKey: 'parentCategory', header: 'Parent Category' },
	{
		id: 'action',
		accessorKey: 'action',
		header: 'Actions',
		cell: ({ row }: any) => (
			<Link
				to={`/employee/setting/category/$categoryName`}
				params={{ categoryName: row.original.categoryName }}>
				<Button className="w-20 text-black bg-transparent border rounded-none link">VIEW</Button>
			</Link>
		),
	},
];

const categoryData = [{ id: 1, categoryName: 'Basic information', type: 'Category', parentCategory: 'Basic information', action: 'VIEW' }];

const departmentColumns = [
	{ id: 'departmentName', header: 'Department Name', accessorKey: 'departmentName' },
	{ id: 'parentDepartment', header: 'Parent Department', accessorKey: 'parentDepartment' },
	{ id: 'manager', header: 'Manager', accessorKey: 'manager' },
	{ id: 'employees', header: 'Employees', accessorKey: 'employees' },
	{
		id: 'action',
		header: '',
		accessorKey: 'action',
		cell: ({ row }: any) => (
			<Link
				to={`/employee/setting/department/$departmentName`}
				params={{ departmentName: row.original.departmentName }}
				className="w-20 px-4 py-2 text-black transition bg-transparent border rounded-none link hover:bg-gray-100">
				VIEW
			</Link>
		),
	},
];

const departmentData = [{ id: 1, departmentName: 'Sales department', parentDepartment: '-', manager: '12', employees: '12', action: 'VIEW' }];

function RouteComponent() {
	return (
		<div className="flex-1 h-full">
			<Tabs defaultValue="data-field">
				<TabsList className="justify-start w-full gap-8 bg-white border-b border-r [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 px-8">
					<TabsTrigger
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2"
						value="data-field">
						Data Field
					</TabsTrigger>
					<TabsTrigger
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2"
						value="data-category">
						Data Category
					</TabsTrigger>
					<TabsTrigger
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2"
						value="department">
						Department
					</TabsTrigger>
				</TabsList>

				<div className="flex justify-end flex-none w-full bg-white">
					<Button className="text-black bg-transparent border-l border-r md:w-20 link border-r-none h-10">ADD+</Button>
					<Button className="text-black bg-transparent border-r md:w-20 link h-10">EDIT</Button>
				</div>

				<TabsContent
					className="m-0"
					value="data-field">
					<div className="border-t border-b border-r">
						<DataTable
							enableColumnDragAndDrop={true}
							columns={dataFieldColumns}
							data={dataFieldData}
						/>
					</div>
				</TabsContent>
				<TabsContent
					className="m-0"
					value="data-category">
					<div className="border-t border-b border-r">
						<DataTable
							enableRowDragAndDrop={true}
							columns={categoryColumns}
							data={categoryData}
						/>
					</div>
				</TabsContent>
				<TabsContent
					className="m-0"
					value="department">
					<div className="border-t border-b border-r">
						<DataTable
							columns={departmentColumns}
							data={departmentData}
						/>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
