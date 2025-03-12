import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AdvancedFilterPopover from '@/components/search/advanced-search';
import { useEmployeeCategories, useWorkspaceEmployees } from '@/hooks/useEmployee';
import { DataTable } from '../../components/ui/data-table';
import { TitleWrapper } from '@/components/wrapperElement';
import { useCallback, useState, useEffect } from 'react';
import { AddRecordDialog } from '@/components/AddRecordDialog';
import { ColumnDef } from '@tanstack/react-table';
import { useDepartments } from '@/hooks/useDepartment';
import { Department } from '@/types/departments';
import { Employee } from '@/types/employee';
import { useSaveEdits } from '@/hooks/handler/useSaveEdit';

const columns: ColumnDef<Employee>[] = [
	{
		accessorKey: 'profileimage',
		header: '',
		cell: ({ row }) => (
			<img
				className="object-cover w-10 h-10"
				src={row.original.profileimage || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
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
		cell: ({ row }) => (
			<Link
				to={'/employee/$userId'}
				params={{ userId: row.original.employeeid.toString() }}
				className="text-blue-600 hover:underline">
				{row.original.name || '-'}
			</Link>
		),
	},
	{
		accessorKey: 'employeecategoryid',
		header: 'Employee Category',
		cell: ({ row }) => row.original.employeeCategory?.categoryname || '-',
	},
	{
		accessorKey: 'email',
		header: 'Email',
		cell: ({ row }) =>
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
		accessorKey: 'departmentid',
		header: 'Department',
		cell: ({ row }) => row.original.department?.departmentname || '-',
	},
	{
		id: 'actions',
		header: '',
		cell: ({ row }) => (
			<div className="flex justify-end w-full">
				<Link
					to={'/employee/$userId'}
					className="sticky"
					params={{ userId: row.original.employeeid.toString() }}>
					<Button
						variant="outline"
						className="w-20 border-t-0 border-b-0">
						DETAIL
					</Button>
				</Link>
			</div>
		),
	},
];

const field = [
	{
		key: 'id',
		label: 'ID',
		type: 'number',
	},
	{
		key: 'name',
		label: 'Name',
		type: 'text',
	},
	{
		key: 'employeeCategory',
		label: 'Employee Category',
		type: 'text',
	},
	{
		key: 'email',
		label: 'Email',
		type: 'email',
	},
	{
		key: 'depertment',
		label: 'Department',
		type: 'text',
	},
];

export const Route = createFileRoute('/employee/')({
	component: RouteComponent,
});

interface Props {
	employees: Employee[];
	setEditable: (value: boolean) => void;
	updateEmployeeData: (id: number, data: Partial<Employee>) => Promise<void>;
}

function RouteComponent() {
	const { employees, loading, addEmployee, updateEmployeeData } = useWorkspaceEmployees();
	const { categories } = useEmployeeCategories();
	const { departments, loading: loadingDepartments } = useDepartments();
	const [editable, setEditable] = useState(false);
	const [employeeCategoryOptions, setEmployeeCategoryOptions] = useState<Array<{ value: string; label: string }>>([]);
	const [departmentOptions, setDepartmentOptions] = useState<Array<{ value: string; label: string }>>([]);
	const [updateDataFromChild, setUpdateDataFromChild] = useState(employees);
	const handleSaveEdits = useSaveEdits<Employee>();

	useEffect(() => {
		if (categories) {
			// Corrected Mapping Logic
			const options = categories.map((category) => ({
				value: category.categoryid.toString(),
				label: category.categoryname,
			}));
			setEmployeeCategoryOptions(options);
		}
	}, [categories]);

	useEffect(() => {
		if (departments) {
			const options = departments.map((department: Department) => ({
				value: department.departmentid.toString(),
				label: department.departmentname,
			}));
			setDepartmentOptions(options);
		}
	}, [departments]);

	const handleAddRecord = async (data: any) => {
		try {
			// Add your API call here to save the new record
			addEmployee(data);
			console.log('Adding new record:', data);
		} catch (error) {
			console.error('Failed to add record:', error);
		}
	};

	// const handleSaveEdits = useCallback(
	// 	async (updatedData: any[]) => {
	// 		try {
	// 			// compare with the new data if anything change
	// 			const changedEmployees = updatedData.filter((updatedEmp) => {
	// 				const originalEmp = employees.find((emp) => emp.employeeid === updatedEmp.employeeid);

	// 				if (!originalEmp) return false;

	// 				// Check the data if anything importants
	// 				return updatedEmp.name !== originalEmp.name || updatedEmp.email !== originalEmp.email || updatedEmp.employeecategoryid !== originalEmp.employeecategoryid || updatedEmp.departmentid !== originalEmp.departmentid;
	// 			});

	// 			if (changedEmployees.length === 0) {
	// 				setEditable(false);
	// 				return;
	// 			}

	// 			await Promise.all(
	// 				changedEmployees.map(async (employee) => {
	// 					// Check the data from the backend
	// 					if (!employee.employeeid) {
	// 						return;
	// 					}

	// 					const updatePayload = {
	// 						employeeid: employee.employeeid,
	// 						name: employee.name,
	// 						email: employee.email,
	// 						employeecategoryid: employee.employeecategoryid,
	// 						departmentid: employee.departmentid,
	// 					};

	// 					await updateEmployeeData(employee.employeeid, updatePayload);
	// 				})
	// 			);

	// 			//if success, return true or something
	// 			// console.log('Success edit data');
	// 			setEditable(false);
	// 		} catch (error) {
	// 			console.error('Failed to save updates:', error);
	// 		}
	// 	},
	// 	[updateEmployeeData, employees, setEditable, updateDataFromChild]
	// );

	const selectFields = {
		employeecategoryid: {
			options: employeeCategoryOptions,
		},
		departmentid: {
			options: departmentOptions,
		},
	};

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
						<AdvancedFilterPopover fields={field} />
					</div>
				</div>
			</div>

			<div className="flex justify-end flex-none w-full bg-white">
				{editable ? (
					<Button
						onClick={() => setEditable((prev) => !prev)}
						className="text-black bg-transparent border-l md:w-20 link border-l-none min-h-10">
						CANCEL
					</Button>
				) : (
					<AddRecordDialog
						columns={columns}
						onSave={handleAddRecord}
						nonEditableColumns={['employeeid*', 'actions', 'profileimage']}
						selectFields={selectFields}
					/>
				)}

				{editable ? (
					<Button
						onClick={async () => {
							const isSucces = await handleSaveEdits(
								employees, // Initial Data from the hooks and also rendered on the table component
								updateDataFromChild, // State to catch an update from the component child (DataTable)
								'employeeid', // Unique identifier, eg. employeeId, departmentId, catgeoryId etc..
								['name', 'email', 'employeecategoryid', 'departmentid'], // Field that want to compare and track update
								updateEmployeeData // update function from hooks
							);
							setEditable(false);
							console.log(isSucces); // can use this variable to make update on ui
						}}
						className="text-black bg-transparent border-l md:w-20 link border-l-none min-h-10">
						SAVE
					</Button>
				) : (
					<Button
						onClick={() => setEditable((prev) => !prev)}
						className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
						EDIT
					</Button>
				)}
			</div>

			<DataTable
				columns={columns}
				data={employees}
				loading={loading}
				isEditable={editable}
				nonEditableColumns={['employeeid*', 'actions', 'profileimage']}
				setTableData={(updateFunctionOrData) => {
					const evaluatedData = typeof updateFunctionOrData === 'function' ? updateFunctionOrData([...employees]) : updateFunctionOrData;
					setUpdateDataFromChild(evaluatedData);
				}}
			/>
		</div>
	);
}
