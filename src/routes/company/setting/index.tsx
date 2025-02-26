import { AddRecordDialog } from '@/components/AddRecordDialog';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useCallback, useState } from 'react';

export const Route = createFileRoute('/company/setting/')({
	component: RouteComponent,
});

const dataFieldColumns = [
	{ id: 'field', header: 'Data Field shown in profile', accessorKey: 'field' },
	{ id: 'type', header: 'Type', accessorKey: 'type' },
	{ id: 'category', header: 'Category', accessorKey: 'category' },
	{ id: 'dateCreated', header: 'Date Created', accessorKey: 'dateCreated' },
	{ id: 'dateAdded', header: 'Date Added', accessorKey: 'dateAdded' },
	{ id: 'status', header: 'Status', accessorKey: 'status' },
];

const dataFieldData = [
	{
		id: 1,
		field: 'Name',
		type: 'Custom Data',
		category: '',
		dateCreated: '2024.11.01',
		dateAdded: '2024.11.01',
		status: 'Active',
	},
	{
		id: 2,
		field: 'Phone number',
		type: 'Custom data',
		category: 'Basic information',
		dateCreated: '2024.11.01',
		dateAdded: '2024.11.01',
		status: 'Hidden',
	},
	{
		id: 3,
		field: 'Email address',
		type: 'Custom Data',
		category: 'Basic information',
		dateCreated: '2025.11.02',
		dateAdded: '2025.11.01',
		status: 'Hidden',
	},
	{
		id: 4,
		field: 'Name',
		type: 'Custom Data',
		category: '',
		dateCreated: '2024.11.01',
		dateAdded: '2024.11.01',
		status: 'Active',
	},
	{
		id: 5,
		field: 'User ID',
		type: 'Text Date',
		category: 'Basic information',
		dateCreated: '2024.11.01',
		dateAdded: '2024.11.01',
		status: 'Hidden',
	},
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

const categoryData = [
	{
		id: 1,
		categoryName: 'Basic information',
		parentCategory: '-',
		action: 'VIEW',
	},
	{
		id: 2,
		categoryName: 'SNS',
		parentCategory: 'Basic information',
		action: 'VIEW',
	},
	{
		id: 3,
		categoryName: 'Contracts',
		parentCategory: 'Basic Information',
		action: 'VIEW',
	},
];

function RouteComponent() {
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
			</Tabs>
		</div>
	);
}
