import MenuList from '@/components/menuList';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { createFileRoute } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';

export const Route = createFileRoute('/employee/$userId/setting/')({
	component: RouteComponent,
});

type statusType = 'Hidden' | 'Active' | 'Disabled';

// Define the data row type
type DataFieldRow = {
	dataField: string;
	type: string;
	category: string;
	dataCreated: string;
	dateCreated: string;
	status: statusType;
};

const rowDataField: DataFieldRow[] = [
	{
		dataField: 'Name',
		type: 'Custom Data',
		category: 'Secret Information',
		dataCreated: '2024.11.01',
		dateCreated: '2024.12.09',
		status: 'Hidden',
	},
	{
		dataField: 'Email',
		type: 'Personal Data',
		category: 'Contact Information',
		dataCreated: '2024.10.15',
		dateCreated: '2024.12.01',
		status: 'Active',
	},
	{
		dataField: 'Phone',
		type: 'Sensitive Data',
		category: 'Contact Information',
		dataCreated: '2024.09.21',
		dateCreated: '2024.11.25',
		status: 'Disabled',
	},
	{
		dataField: 'Address',
		type: 'Location Data',
		category: 'Personal Information',
		dataCreated: '2024.08.05',
		dateCreated: '2024.10.30',
		status: 'Hidden',
	},
	{
		dataField: 'Birthdate',
		type: 'Sensitive Data',
		category: 'Personal Information',
		dataCreated: '2024.07.12',
		dateCreated: '2024.09.18',
		status: 'Active',
	},
	{
		dataField: 'Credit Card',
		type: 'Financial Data',
		category: 'Banking Information',
		dataCreated: '2024.06.30',
		dateCreated: '2024.08.22',
		status: 'Disabled',
	},
	{
		dataField: 'Social Security',
		type: 'Confidential Data',
		category: 'Government Records',
		dataCreated: '2024.05.10',
		dateCreated: '2024.07.15',
		status: 'Hidden',
	},
	{
		dataField: 'Username',
		type: 'Custom Data',
		category: 'Account Information',
		dataCreated: '2024.04.25',
		dateCreated: '2024.06.10',
		status: 'Active',
	},
	{
		dataField: 'Password',
		type: 'Sensitive Data',
		category: 'Account Information',
		dataCreated: '2024.03.14',
		dateCreated: '2024.05.08',
		status: 'Disabled',
	},
	{
		dataField: 'Medical Records',
		type: 'Health Data',
		category: 'Medical Information',
		dataCreated: '2024.02.28',
		dateCreated: '2024.04.12',
		status: 'Hidden',
	},
];

const columnsDataField: ColumnDef<DataFieldRow>[] = [
	{
		accessorKey: 'dataField',
		header: 'Data field shown in employee',
	},
	{
		accessorKey: 'type',
		header: 'Type',
	},
	{
		accessorKey: 'category',
		header: 'Category',
	},
	{
		accessorKey: 'dataCreated',
		header: 'Data Created',
	},
	{
		accessorKey: 'dateCreated',
		header: 'Date Created',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
];

const menuItems = [
	{ label: 'Data Field', path: '/employee/$userId/setting' },
	{ label: 'Data Category', path: '/employee/$userId/setting/data-category' },
	{ label: 'Employee Category', path: '/employee/$userId/setting/employee-category' },
	{ label: 'Department', path: '/employee/$userId/setting/department' },
];

function RouteComponent() {
	return (
		<div>
			<div className="container flex items-center justify-between px-4 bg-white border-b">
				<MenuList items={menuItems} />
			</div>
			<div className="flex w-full border-b justify-end">
				<Button className="w-20 h-10 text-black bg-transparent border-l border-r link">ADD +</Button>
				<Button className="w-20 h-10 text-black bg-transparent border-r link">EDIT</Button>
			</div>
			<div>
				<DataTable
					columns={columnsDataField}
					data={rowDataField}
				/>
			</div>
		</div>
	);
}
