import { createFileRoute } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

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

// Define columns
const columnsDataField: ColumnDef<DataFieldRow>[] = [
	{
		accessorKey: 'dataField',
		header: 'Data field shown in project',
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

export const Route = createFileRoute('/projects/setting/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col flex-1 h-full">
			{/* Tabs Section */}
			<Tabs defaultValue="dataField">
				<TabsList className="justify-start w-full gap-8 bg-white border-b border-r [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 px-4">
					<TabsTrigger
						value="dataField"
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2">
						Data Field
					</TabsTrigger>
					<TabsTrigger
						value="dataCategory"
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2">
						Data Category
					</TabsTrigger>
				</TabsList>

				<div className="flex justify-end flex-none w-full bg-white">
					<Button className="text-black bg-transparent border-r border-l md:w-20 link h-10">ADD+</Button>
					<Button className="text-black bg-transparent border-r md:w-20 link h-10">EDIT</Button>
				</div>

				{/* DataField Tab */}
				<TabsContent
					className="m-0 rounded-none"
					value="dataField">
					<div className="border-r border-t border-b">
						<DataTable
							columns={columnsDataField}
							data={rowDataField}
						/>
					</div>
				</TabsContent>

				{/* DataCategory Tab */}
				<TabsContent
					className="m-0 rounded-none"
					value="dataCategory">
					<div className="border-r border-t border-b">
						<DataTable
							columns={columnsDataCategory}
							data={rowDataCategory}
						/>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
