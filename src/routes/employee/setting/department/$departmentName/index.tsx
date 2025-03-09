import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/ui/data-table';
import { TitleWrapper } from '@/components/wrapperElement';
import { AddRecordDialog } from '@/components/AddRecordDialog';
import { revertUrlString } from '@/lib/utils';
import AdvancedFilterPopover from '@/components/search/advanced-search';
import { ColumnDef } from '@tanstack/react-table';
import { useDepartment, useDepartments, useFlatDepartmentList } from '@/hooks/useDepartment';
import { number } from 'zod';

export const Route = createFileRoute('/employee/setting/department/$departmentName/')({
	component: RouteComponent,
});

// Define types for managers and members
type Manager = {
	id: string;
	name: string;
	email: string;
	role: string;
};

type Member = {
	id: string;
	name: string;
	email: string;
	category: string;
	image: string;
};

type DepartmentData = {
	id: number;
	image: string;
	name: string;
	email: string;
	category: string;
	score: string;
};

const searchField = [
	{
		key: 'status',
		label: 'Status',
		type: 'toogle',

		options: ['All', 'Active', 'Inactive'],
	},
	{
		key: 'employeeid',
		label: 'Employee Id',
		type: 'number',
	},
	{
		key: 'email',
		label: 'Email',
		type: 'email',
	},
	{
		key: 'name',
		label: 'Name',
		type: 'text',
	},
	{
		key: 'depertment',
		label: 'Department',
		type: 'text',
	},
];

function RouteComponent() {
	const { departmentName } = Route.useParams();
	const decodedDepartmentName = revertUrlString(departmentName as string);
	const [screenWidth, setScreenWidth] = useState(window.innerWidth);
	const [editable, setEditable] = useState(false);
	const { department, error, loading } = useDepartment(Number(departmentName));

	const handleAddRecord = async (data: any) => {
		try {
			// Add your API call here to save the new record
			console.log('Adding new record:', data);
		} catch (error) {
			console.error('Failed to add record:', error);
		}
	};

	// const handleSaveEdits = useCallback(async (updatedData: any[]) => {
	// 	try {
	// 		console.log('Saving updates:', updatedData);
	// 		// Add your API call here
	// 		setEditable(false); // Turn off edit mode after saving
	// 	} catch (error) {
	// 		console.error('Failed to save updates:', error);
	// 	}
	// }, []);

	const memberData: Member[] = [
		{
			id: '101',
			name: 'Alice Johnson',
			email: 'alice@example.com',
			category: 'Management',
			image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		},
		{
			id: '102',
			name: 'Bob Smith',
			email: 'bob@example.com',
			category: 'Staff',
			image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		},
	];

	// Column definitions for members
	const memberColumns = [
		{ header: () => <span className="pl-8">Name</span>, accessorKey: 'name', cell: ({ row }: any) => <span className="pl-8">{row.original.name}</span> },
		{
			header: 'ID',
			accessorKey: 'id',
			cell: (props: any) => (screenWidth > 640 ? props.row.original.id : null),
		},
		{ header: 'Email', accessorKey: 'email' },
		{
			header: 'Category',
			accessorKey: 'category',
			cell: (props: any) => (screenWidth > 768 ? props.row.original.category : null),
		},
		{
			header: '',
			accessorKey: 'id',
			cell: (props: any) => (
				<div className="w-full flex justify-end">
					<Button
						variant="outline"
						className="border-t-0 border-b-0"
						onClick={() => handleRemove(props.row.original.id)}>
						Remove
					</Button>
				</div>
			),
		},
	];

	const subDepartments = [
		{
			header: () => <h1 className="pl-4">Department Name</h1>,
			accessorKey: 'departmentname',
			cell: ({ row }: any) => <h1 className="pl-4">{row.original.departmentname}</h1>,
		},
		{
			header: 'Employee',
			accessorKey: 'employeeCount',
			cell: ({ row }: any) => row.original.employeeCount || '-',
		},
		{
			header: 'Manager',
			accessorKey: 'managerCount',
			cell: ({ row }: any) => row.original.managerCount || '-',
		},
		{
			header: '',
			accessorKey: 'departmentid',
			cell: (props: any) => (
				<div className="w-full flex justify-end">
					<Button
						variant="outline"
						className="border-b-0 border-t-0"
						onClick={() => handleRemove(props.row.original.id)}>
						ADD
					</Button>
				</div>
			),
		},
	];

	// Handle remove action
	const handleRemove = (id: string) => {
		console.log('Removing user with ID:', id);
	};

	return (
		<div className="flex-1 h-full">
			{/* Header Section */}
			<TitleWrapper>{loading ? <span className="loading"></span> : <h1 className="font-bold text-base">{department?.departmentName.toLocaleUpperCase()}</h1>}</TitleWrapper>

			{/* Managers Table */}
			<div className="w-full flex justify-between border-b items-center bg-gray-100">
				<h2 className="px-8">Description</h2>
				<Button
					onClick={() => setEditable((prev) => !prev)}
					className="text-black bg-transparent border-r md:w-20 link border-l min-h-10">
					EDIT+
				</Button>
			</div>
			<div className="w-full flex gap-8 bg-white py-2 px-8 border-r border-b">
				<div>
					<h1>Department Name :</h1>
				</div>
				<div>{loading ? <span className="loading"></span> : <h1 className="font-bold">{department?.departmentName}</h1>}</div>
			</div>
			<div className="w-full flex gap-8 bg-white py-2 px-8 border-r border-b">
				<div>
					<h1>Parent Department :</h1>
				</div>
				<div>{loading && department?.parentDepartmentId === undefined ? <span className="loading"></span> : <h1>{department?.parentDepartmentId !== null ? department?.parentDepartmentId : ' - '}</h1>}</div>
			</div>

			{/* Members Table */}
			<TitleWrapper className="border-b-0">
				<h2>Manager</h2>
			</TitleWrapper>
			<DataTable
				columns={memberColumns}
				data={memberData}
				loading={false}
			/>

			{/* Search Section */}
			<div className="">
				<TitleWrapper>
					<h1>Member adjustment</h1>
				</TitleWrapper>
				<div className="flex flex-row bg-white">
					<div className="w-1/3 py-2 px-8">
						<div className="flex items-center justify-between">
							<h3>Added</h3>
							<div className="flex items-center gap-2">
								<span>2 / 13</span>
								<Button className="w-20 py-2 border rounded-none">EDIT</Button>
							</div>
						</div>
						{/* Added Members List */}
						<div className="flex flex-col gap-2 my-4">
							{['John Brown', 'Sarah White'].map((name, index) => (
								<div
									key={index}
									className="flex items-center justify-between">
									<span>{name}</span>
									<Button
										variant="outline"
										className="w-20 py-2 border rounded-none"
										size="sm"
										onClick={() => console.log('Removing', name)}>
										REMOVE
									</Button>
								</div>
							))}
						</div>
					</div>
					<div className="w-full">
						<div className="flex items-center p-4 border-r border-l">
							<h1>Adding Staff Department</h1>
						</div>

						<div className="flex flex-row flex-wrap items-center justify-between w-full p-4 bg-white border border-b-0 md:flex-row">
							<div className="flex flex-col space-y-2 w-[350px] bg-white">
								<Label htmlFor="keyword">Keyword</Label>
								<Input
									type="text"
									id="keyword"
									placeholder="Search by name, email, etc."
									className="border rounded-none"
								/>
							</div>

							{/* Status Toggle */}
							<div className="flex flex-row gap-2">
								<div className="flex flex-col space-y-2">
									<Label>Status</Label>
									<div className="flex">
										<Button
											size="default"
											className="w-20 bg-black rounded-none">
											Active
										</Button>
										<Button
											size="default"
											variant="outline"
											className="w-20 rounded-none">
											All
										</Button>
									</div>
								</div>
								{/* Advanced Search */}
								<div className="flex flex-col space-y-2">
									<Label>‎</Label>
									<AdvancedFilterPopover fields={searchField} />
								</div>
							</div>
						</div>
						<div className="border-l">
							<DataTable
								columns={subDepartments}
								data={department?.subDepartments || []}
								loading={loading}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
