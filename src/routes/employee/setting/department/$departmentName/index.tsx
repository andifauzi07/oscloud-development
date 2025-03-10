import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { useWorkspaceEmployees } from '@/hooks/useEmployee';

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

type Staff = {
	name: string;
	employeeid: number; // Sesuai tipe data yang digunakan pada proyek Anda
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
	const { employees, loading: employeeLoading, addEmployee, updateEmployeeData, removeEmployee } = useWorkspaceEmployees();
	const [screenWidth, setScreenWidth] = useState(window.innerWidth);
	const [editable, setEditable] = useState(false);
	const { department, error, loading } = useDepartment(Number(departmentName));
	const [addStaff, setAddStaff] = useState<Staff[]>([]);

	const filteredEmployeesByDepartments = useMemo(() => employees.filter((employee) => employee.departmentid === Number(departmentName)), [employees, departmentName]);

	console.log('Render dengan useMemo', filteredEmployeesByDepartments);

	const handleAddRecord = async (data: any) => {
		try {
			// Add your API call here to save the new record
			console.log('Adding new record:', data);
		} catch (error) {
			console.error('Failed to add record:', error);
		}
	};

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

	const employeeByDepartment = [
		{
			accessorKey: 'profileimage',
			header: '',
			cell: ({ row }: any) => (
				<div className="w-full flex justify-start">
					<img
						className="object-cover w-10 h-10"
						src={row.original.profileimage || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
						alt={`${row.original.name}'s profile`}
					/>
				</div>
			),
		},
		{
			header: () => <h1 className="">Staff ID</h1>,
			accessorKey: 'departmentname',
			cell: ({ row }: any) => <h1 className="">{row.original.employeeid}</h1>,
		},
		{
			header: 'Name',
			accessorKey: 'name',
			cell: ({ row }: any) => row.original.name,
		},
		{
			header: 'Email',
			accessorKey: 'email',
			cell: ({ row }: any) => row.original.email || '-',
		},
		{
			id: 'actions',
			header: '',
			accessorKey: 'departmentid',
			cell: (props: any) => (
				<div className="w-full flex justify-end">
					<Button
						variant="outline"
						className="border-b-0 border-t-0"
						onClick={(e) => {
							addStaff.some((data) => data.employeeid === props.row.original.employeeid) ? removeEmployee(props.row.original.employeeid) : handleAddStaff(props.row.original);
						}}>
						{addStaff.some((data) => data.employeeid === props.row.original.employeeid) ? 'REMOVE' : 'ADD'}
					</Button>
				</div>
			),
		},
	];

	// Handle remove action
	const handleAddStaff = (user: any) => {
		setAddStaff((prevUsers) => {
			const existingIndex = prevUsers.findIndex((u) => u.employeeid === user.employeeid);

			if (existingIndex !== -1) {
				// Perbarui data jika employeeid sudah ada
				const updatedUsers = [...prevUsers];
				updatedUsers[existingIndex] = { name: user.name, employeeid: user.employeeid };
				return updatedUsers;
			} else {
				// Tambahkan data baru jika employeeid belum ada
				return [...prevUsers, { name: user.name, employeeid: user.employeeid }];
			}
		});
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
					<div className="w-1/3">
						<div className="flex items-center py-2 justify-between border-b">
							<h3 className="pl-8">Added</h3>
							<div className="flex items-center gap-2">
								<span className="pr-2">
									{addStaff.length} / {filteredEmployeesByDepartments.length}
								</span>
							</div>
						</div>
						{/* Added Members List */}
						<div className="flex flex-col">
							{addStaff.map((employee, index) => (
								<div
									key={index}
									className="flex items-center justify-between border-b">
									<span className="text-xs font-bold pl-8">{employee.name}</span>
									<Button
										variant="outline"
										className="w-20 border-t-0 border-r-0 border-b-0 rounded-none"
										size="sm"
										onClick={() => removeEmployee(employee.employeeid)}>
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
								columns={employeeByDepartment}
								data={filteredEmployeesByDepartments || []}
								loading={employeeLoading}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
