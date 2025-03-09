import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link } from '@tanstack/react-router';
import { AddRecordDialog } from '@/components/AddRecordDialog';
import { useCallback, useMemo, useState } from 'react';
import { formatUrlString } from '@/lib/utils';
import { useDepartments, useFlatDepartmentList } from '@/hooks/useDepartment';

export const Route = createFileRoute('/employee/setting/')({
	component: RouteComponent,
});

const dataFieldColumns = [
	{ id: 'field', header: () => <h1 className="pl-8 py-2">Data Field</h1>, accessorKey: 'field', cell: ({ row }: any) => <h1 className="pl-8 py-2">{row.original.field}</h1> },
	{ id: 'type', header: 'Type', accessorKey: 'type' },
	{ id: 'category', header: 'Category', accessorKey: 'category' },
	{ id: 'dateCreated', header: 'Date Created', accessorKey: 'dateCreated' },
	{ id: 'dateAdded', header: 'Date Added', accessorKey: 'dateAdded' },
	{ id: 'status', header: 'Status', accessorKey: 'status' },
	{
		id: 'actions',
		header: '',
		accessorKey: 'actions',
		cell: ({ row }: any) => (
			<div className="w-full flex justify-end items-center">
				<Button
					variant={'outline'}
					onClick={() => console.log('Removing:', row.original.actions)}>
					REMOVE
				</Button>
			</div>
		),
	},
];

const dataFieldData = [
	{ id: 1, field: 'Name', type: 'Custom Data', category: '', dateCreated: '2024.11.01', dateAdded: '2024.11.01', actions: 'REMOVE', status: 'Active' },
	{ id: 2, field: 'Phone number', type: 'Custom data', category: 'Basic information', dateCreated: '2024.11.01', dateAdded: '2024.11.01', actions: 'REMOVE', status: 'Hidden' },
];

const categoryColumns = [
	{ accessorKey: 'categoryName', header: () => <h1 className="pl-8 py-2">Category Name</h1>, cell: ({ row }: any) => <h1 className="pl-8 py-2">{row.original.categoryName}</h1> },
	{ accessorKey: 'parentCategory', header: 'Parent Category' },
];

const categoryData = [{ id: 1, categoryName: 'Basic information', type: 'Category', parentCategory: 'Basic information', action: 'VIEW' }];

const employeeCategory = [
	{
		id: '1',
		category: 'Food Service',
		parenCategory: '-',
	},
	{
		id: '2',
		category: 'Employee Category B',
		parenCategory: 'Food Event',
	},
	{
		id: '3',
		category: 'Temp staff',
		parenCategory: '-',
	},
];

const employeeCategoryColumns = [
	{
		id: 'category',
		accessorKey: 'category',
		header: () => <h1 className="pl-8 text-xs">Category</h1>,
		cell: ({ row }: any) => <h1 className="pl-8">{row.original.category}</h1>,
	},
	{
		id: 'parentCategory',
		accessorKey: 'parenCategory',
		header: 'Parent Category',
	},
	{
		id: 'action',
		header: '',
		accessorKey: 'action',
		cell: ({ row }: any) => (
			<div className="w-full flex justify-end">
				<Link
					to={`/employee/setting/category/$categoryName`}
					params={{ categoryName: row.original.categoryName }}>
					<Button
						variant={'outline'}
						onClick={() => console.log('Removing:', row.original.actions)}>
						VIEW
					</Button>
				</Link>
			</div>
		),
	},
];

const departmentColumns = [
	{
		header: () => <h1 className="pl-8">Category</h1>,
		accessorKey: 'departmentname',
		cell: ({ row }: any) => <h1 className="pl-8 py-2">{row.original.departmentname}</h1>,
	},
	{
		header: 'Parent Department',
		accessorKey: 'parentdepartmentid',
		cell: ({ row }: any) => <h1>{row.original.parentDepartmentId ? row.original.parentDepartmentId : '-'}</h1>,
	},
	{
		header: 'Manager',
		accessorKey: 'managerCount',
	},
	{
		header: 'Employees',
		accessorKey: 'employeeCount',
	},
	{
		header: '',
		accessorKey: 'departmentid',
		cell: ({ row }: any) => (
			<div className="w-full flex justify-end">
				<Link
					to={`/employee/setting/department/$departmentName`}
					params={{ departmentName: row.original.departmentid }}>
					<Button className="w-20 text-black bg-transparent border border-t-0 border-b-0 rounded-none">VIEW</Button>
				</Link>
			</div>
		),
	},
];

async function RouteComponent() {
	const [editable, setEditable] = useState(false);
	const { flatDepartments, loading } = useFlatDepartmentList();
	const handleAddRecord = async (data: any) => {
		try {
			// Add your API call here to save the new record
			console.log('Adding new record:', data);
		} catch (error) {
			console.error('Failed to add record:', error);
		}
	};

	const handleSaveEdits = useCallback(async (updatedData: any[]) => {
		try {
			console.log('Saving updates:', updatedData);
			// Add your API call here
			setEditable(false); // Turn off edit mode after saving
		} catch (error) {
			console.error('Failed to save updates:', error);
		}
	}, []);
	return (
		<div className="flex-1 h-full">
			<Tabs defaultValue="data-field">
				<TabsList className="justify-start w-full gap-8 bg-white border-b border-r [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 pl-5">
					<TabsTrigger
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
						value="data-field">
						Data Field
					</TabsTrigger>
					<TabsTrigger
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
						value="data-category">
						Data Category
					</TabsTrigger>
					<TabsTrigger
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
						value="employe-category">
						Employee Category
					</TabsTrigger>
					<TabsTrigger
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
						value="department">
						Department
					</TabsTrigger>
				</TabsList>
				<TabsContent
					className="m-0"
					value="data-field">
					<div className="flex justify-end flex-none w-full bg-white">
						<AddRecordDialog
							columns={dataFieldColumns}
							onSave={handleAddRecord}
							nonEditableColumns={['action*', 'dateAdded*', 'dateCreated*']}
						/>
						<Button
							onClick={() => setEditable((prev) => !prev)}
							className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
							EDIT+
						</Button>
					</div>
					<DataTable
						enableColumnDragAndDrop={true}
						columns={dataFieldColumns}
						data={dataFieldData}
						loading={false}
						isEditable={editable}
						onSave={handleSaveEdits}
						nonEditableColumns={['action*']}
					/>
				</TabsContent>
				<TabsContent
					className="m-0"
					value="data-category">
					<div className="flex justify-end flex-none w-full bg-white">
						<AddRecordDialog
							columns={categoryColumns}
							onSave={handleAddRecord}
							nonEditableColumns={['action*']}
						/>
						<Button
							onClick={() => setEditable((prev) => !prev)}
							className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
							EDIT+
						</Button>
					</div>
					<DataTable
						columns={categoryColumns}
						data={categoryData}
						loading={false}
						isEditable={editable}
						onSave={handleSaveEdits}
						nonEditableColumns={['action*']}
					/>
				</TabsContent>
				<TabsContent
					className="m-0"
					value="employe-category">
					<div className="flex justify-end flex-none w-full bg-white">
						<AddRecordDialog
							columns={employeeCategoryColumns}
							onSave={handleAddRecord}
							nonEditableColumns={['action*']}
						/>

						<Button
							onClick={() => setEditable((prev) => !prev)}
							className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
							EDIT+
						</Button>
					</div>
					<DataTable
						enableRowDragAndDrop={editable}
						columns={employeeCategoryColumns}
						data={employeeCategory}
						loading={false}
						onSave={handleSaveEdits}
						nonEditableColumns={['action*']}
						isEditable={editable}
					/>
				</TabsContent>

				<TabsContent
					className="m-0"
					value="department">
					<div className="flex justify-end flex-none w-full bg-white">
						<AddRecordDialog
							columns={departmentColumns}
							onSave={handleAddRecord}
							nonEditableColumns={['action*', 'employees*', 'manager*']}
						/>
						<Button
							onClick={() => setEditable((prev) => !prev)}
							className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
							EDIT+
						</Button>
					</div>
					<DataTable
						columns={departmentColumns}
						data={flatDepartments}
						loading={loading}
						onSave={handleSaveEdits}
						nonEditableColumns={['action*', 'employees', 'manager']}
						isEditable={editable}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
