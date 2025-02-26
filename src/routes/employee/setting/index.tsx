import { createFileRoute } from '@tanstack/react-router';
import MenuList from '@/components/menuList';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link } from '@tanstack/react-router';
import { AddRecordDialog } from '@/components/AddRecordDialog';
import { useCallback, useEffect, useState } from 'react';
import { formatUrlString } from '@/lib/utils';
import apiClient from '@/api/apiClient';

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
	{ accessorKey: 'categoryName', header: 'Category' },
	{ accessorKey: 'parentCategory', header: 'Parent Category' },
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
	{ id: 'category', accessorKey: 'category', header: 'Category' },
	{ id: 'parentCategory', accessorKey: 'parenCategory', header: 'Parent Category' },
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
				params={{ departmentName: formatUrlString(row.original.departmentName) }}
				className="w-20 px-4 py-2 text-black transition bg-transparent border rounded-none link hover:bg-gray-100">
				VIEW
			</Link>
		),
	},
];

const departmentData = [{ id: 1, departmentName: 'Sales department', parentDepartment: '-', manager: '12', employees: '12', action: 'VIEW' }];

async function RouteComponent() {
	const [editable, setEditable] = useState(false);
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
						value="employe-category">
						Employee Category
					</TabsTrigger>
					<TabsTrigger
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2"
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
					<div className="border-t border-b border-r">
						<DataTable
							enableColumnDragAndDrop={true}
							columns={dataFieldColumns}
							data={dataFieldData}
							loading={false}
							isEditable={editable}
							onSave={handleSaveEdits}
							nonEditableColumns={['action*']}
						/>
					</div>
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
					<div className="border-t border-b border-r">
						<DataTable
							columns={categoryColumns}
							data={categoryData}
							loading={false}
							isEditable={editable}
							onSave={handleSaveEdits}
							nonEditableColumns={['action*']}
						/>
					</div>
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
					<div className="border-t border-b border-r">
						<DataTable
							enableRowDragAndDrop={editable ? false : true}
							columns={employeeCategoryColumns}
							data={employeeCategory}
							loading={false}
							onSave={handleSaveEdits}
							nonEditableColumns={['action*']}
							isEditable={editable}
						/>
					</div>
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
					<div className="border-t border-b border-r">
						<DataTable
							columns={departmentColumns}
							data={departmentData}
							loading={false}
							onSave={handleSaveEdits}
							nonEditableColumns={['action*', 'employees', 'manager']}
							isEditable={editable}
						/>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
