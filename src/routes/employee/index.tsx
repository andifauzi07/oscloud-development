import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AdvancedFilterPopover from '@/components/search/advanced-search';
import { useWorkspaceEmployees } from '@/hooks/useEmployee';
import { DataTable } from '../../components/ui/data-table';
import { TitleWrapper } from '@/components/wrapperElement';
import { useCallback, useState } from 'react';
import { AddRecordDialog } from '@/components/AddRecordDialog';

const columns = [
	{
		accessorKey: 'profileimage',
		header: '',
		cell: ({ row }: any) => (
			<img
				className="object-cover w-16 h-16"
				src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
				alt={`${row.original.name}'s profile`}
			/>
		),
	},
	{
		accessorKey: 'employeeid',
		header: 'ID',
	},
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }: any) => (
			<Link
				to={'/employee/$userId'}
				params={{ userId: row.original.employeeid.toString() }}
				className="text-blue-600 hover:underline">
				{row.original.name || '-'}
			</Link>
		),
	},
	{
		accessorKey: 'employeeCategoryId',
		header: 'Employee Category',
		cell: ({ row }: any) => row.original.employeeCategory?.categoryname || '-',
	},
	{
		accessorKey: 'email',
		header: 'Email',
		cell: ({ row }: any) =>
			row.original.email ? (
				<a
					href={`mailto:${row.original.email}`}
					className="text-blue-600 hover:underline">
					{row.original.email}
				</a>
			) : (
				'-'
			),
	},
	{
		accessorKey: 'departmentId',
		header: 'Department',
		cell: ({ row }: any) => row.original.department?.departmentname || '-',
	},
	// {
	//     accessorKey: 'status',
	//     header: 'Status',
	//     cell: ({ row }) => row.original.status || 'Active'
	// },
	// {
	//     accessorKey: 'position',
	//     header: 'Position',
	//     cell: ({ row }) => row.original.position || '-'
	// },
	// {
	//     accessorKey: 'phone',
	//     header: 'Phone',
	//     cell: ({ row }) => row.original.phone || '-'
	// },
	{
		id: 'actions',
		header: '',
		cell: ({ row }: any) => (
			<Link
				to={'/employee/$userId'}
				params={{ userId: row.original.employeeid.toString() }}>
				<Button
					variant="outline"
					className="w-20">
					DETAIL
				</Button>
			</Link>
		),
	},
];

export const Route = createFileRoute('/employee/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { employees, loading, addEmployee } = useWorkspaceEmployees();
	const [editable, setEditable] = useState(false);

	const handleAddRecord = async (data: any) => {
		try {
			// Add your API call here to save the new record
			addEmployee(data);
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
		<div className="flex flex-col flex-1 h-full">
			<TitleWrapper>
				<h1>Employee List</h1>
				<Link
					className="text-xs"
					to="/employee/setting">
					Settings
				</Link>
			</TitleWrapper>
			<div className="flex flex-row flex-wrap items-center justify-between w-full px-8 py-4 bg-white border-b border-r md:flex-row">
				<div className="flex flex-row flex-wrap gap-4">
					<div className="flex flex-col space-y-2 md:w-auto">
						<Label htmlFor="keyword">Keyword</Label>
						<Input
							type="text"
							id="keyword"
							placeholder="Search employees..."
							className="border rounded-none w-[400px]"
						/>
					</div>

					<div className="flex flex-col space-y-2">
						<Label>Status</Label>
						<div className="flex">
							<Button className="w-20 bg-black rounded-none">Active</Button>
							<Button
								variant="outline"
								className="w-20 rounded-none">
								All
							</Button>
						</div>
					</div>
					<div className="flex flex-col space-y-2">
						<Label>‎</Label>
						<AdvancedFilterPopover />
					</div>
				</div>
			</div>

			<div className="flex justify-end flex-none w-full bg-white">
				<AddRecordDialog
					columns={columns}
					onSave={handleAddRecord}
					nonEditableColumns={['employeeid*']}
				/>
				<Button
					onClick={() => setEditable((prev) => !prev)}
					className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
					EDIT
				</Button>
			</div>

			<DataTable
				columns={columns}
				data={employees}
				loading={loading}
				isEditable={editable}
				nonEditableColumns={['employeeid*', 'actions']}
				onSave={handleSaveEdits}
			/>
		</div>
	);
}
