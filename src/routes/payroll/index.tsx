import { createFileRoute, Link } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import AdvancedFilterPopover from '@/components/search/advanced-search';
import { Label } from '@/components/ui/label';
import { useUserData } from '@/hooks/useUserData';
import { useCallback, useEffect, useState } from 'react';
import { AddRecordDialog } from '@/components/AddRecordDialog';
import { Employee } from '@/types/payroll';
import { checkDomainOfScale } from 'recharts/types/util/ChartUtils';
import { useCreatePayment, usePayrollEmployees, useUpdatePaymentStatus } from '@/hooks/usePayroll';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployeeCategories } from '@/hooks/useEmployee';

export const Route = createFileRoute('/payroll/')({
	component: RouteComponent,
});

// Define the data row type
type PayrollRow = {
	image: string;
	id: string;
	name: string;
	employeeCategory: string;
	hourlyRateA: string;
	hourlyRateB: string;
	totalPayment: string;
	numberOfPayment: string;
	joinedOn: string;
};

/// Define columns
const columns: ColumnDef<PayrollRow>[] = [
	{
		accessorKey: 'image',
		header: '',
		cell: ({ row }) => (
			<div className="flex items-center justify-start h-full">
				<figure className="w-10 h-10 overflow-hidden">
					<img
						className="object-cover w-full h-full"
						src={row.original.image || '/default-avatar.png'}
					/>
				</figure>
			</div>
		),
	},
	{
		accessorKey: 'id',
		header: 'ID',
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'employeeCategory',
		header: 'Employee Category',
		cell: ({ row, table }) => {
			// Get editable state from table meta
			const isEditable = table.options.meta?.editable as boolean;
			
			if (isEditable) {
				return (
					<Select
						value={row.original.employeeCategory}
						onValueChange={(value) => {
							// Get the current data from table
							const currentData = table.options.data as PayrollRow[];
							const updatedData = [...currentData];
							const rowIndex = updatedData.findIndex(item => item.id === row.original.id);
							if (rowIndex !== -1) {
								updatedData[rowIndex] = {
									...updatedData[rowIndex],
									employeeCategory: value
								};
								// Update through table meta
								table.options.meta?.updateData?.(updatedData);
							}
						}}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select category" />
						</SelectTrigger>
						<SelectContent>
							{(table.options.meta?.employeeCategoryOptions as Array<{ value: string; label: string }>)?.map((option: { value: string; label: string }) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				);
			}
			return <div>{row.original.employeeCategory}</div>;
		},
	},
	{
		accessorKey: 'hourlyRateA',
		header: 'Hourly Rate A',
	},
	{
		accessorKey: 'hourlyRateB',
		header: 'Hourly Rate B',
	},
	{
		accessorKey: 'totalPayment',
		header: 'Total Payment',
	},
	{
		accessorKey: 'numberOfPayment',
		header: 'No. of Payment',
	},
	{
		accessorKey: 'joinedOn',
		header: 'Joined on',
	},
	{
		id: 'actions',
		accessorKey: 'action',
		header: '',

		cell: ({ row }) => (
			<div className="flex justify-end w-full">
				<Link
					to={'/payroll/$employeeId'}
					params={{ employeeId: row.original.id }}>
					<Button
						variant="outline"
						className="w-20 h-full border-t-0 border-b-0 border-r-0">
						DETAIL
					</Button>
				</Link>
			</div>
		),
	},
];

const field = [
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
	const { currentUser } = useUserData();
	const workspaceid = currentUser?.workspaceid;
	const [searchKeyword, setSearchKeyword] = useState('');
	const [editable, setEditable] = useState(false);
	const [localData, setLocalData] = useState<PayrollRow[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const { categories } = useEmployeeCategories();
	const [employeeCategoryOptions, setEmployeeCategoryOptions] = useState<Array<{ value: string; label: string }>>([]);

	// Add this useEffect to transform categories into options
	useEffect(() => {
		if (categories) {
			const options = categories.map((category) => ({
				value: category.categoryid.toString(),
				label: category.categoryname,
			}));
			setEmployeeCategoryOptions(options);
		}
	}, [categories]);

	// Using the payroll hooks with proper typing
	const { employees, loading: employeesLoading } = usePayrollEmployees();
	const { createPayment, loading: creatingPayment } = useCreatePayment();
	const { updatePaymentStatus, loading: updatingStatus } = useUpdatePaymentStatus();

	// Update local data when employees change
	useEffect(() => {
		if (employees) {
			const tableData: PayrollRow[] = employees.map((employee) => ({
				image: employee.profileimage || '',
				id: employee.employeeId?.toString() || '',
				name: employee.name || 'Unknown',
				employeeCategory: employee.employeecategory?.categoryname || 'Uncategorized',
				hourlyRateA: employee.rates?.find((r: any) => r.type === 'A')?.ratevalue?.toFixed(2) || '-',
				hourlyRateB: employee.rates?.find((r: any) => r.type === 'B')?.ratevalue?.toFixed(2) || '-',
				totalPayment: `¥${employee.totalPayment?.toFixed(2) || '0.00'}`,
				numberOfPayment: employee.numberOfPayments?.toString() || '0',
				joinedOn: employee.joineddate ? new Date(employee.joineddate).toISOString().split('T')[0] : 'Unknown',
			}));
			setLocalData(tableData);
		}
	}, [employees]);

	const handleAddRecord = async (data: Partial<Employee>) => {
		try {
			if (!data.employeeId) throw new Error('Invalid employee data');

			await createPayment({
				employeeId: Number(data.employeeId),
				details: [
					{
						projectid: 1, // Should be replaced with actual project selection
						hoursworked: 0,
						transportfee: 0,
					},
				],
			});
		} catch (error) {
			console.error('Failed to add record:', error);
		}
	};

	const handleUpdateData = useCallback(async (updatedData: PayrollRow[]) => {
		setIsLoading(true);
		try {
			const changes = updatedData.filter((newRow) => {
				const originalRow = localData.find(row => row.id === newRow.id);
				return originalRow && JSON.stringify(originalRow) !== JSON.stringify(newRow);
			});

			if (changes.length === 0) {
				setEditable(false);
				return;
			}

			await Promise.all(
				changes.map(async (row) => {
					const employee = employees?.find(e => e.employeeId?.toString() === row.id);
					if (!employee) return;

					const updatePayload = {
						employeecategory: {
							categoryname: row.employeeCategory
						},
						// Add other fields that need updating
					};

					await updatePaymentStatus(Number(row.id), {
						status: 'Updated',
						data: updatePayload
					});
				})
			);

			setLocalData(updatedData);
			setEditable(false);
		} catch (error) {
			console.error('Failed to save updates:', error);
			// Optionally show error toast/alert here
		} finally {
			setIsLoading(false);
		}
	}, [localData, employees, updatePaymentStatus]);

	// Enhanced filtering with type safety
	const filteredEmployees =
		employees?.filter(
			(employee) => employee.name?.toLowerCase().includes(searchKeyword.toLowerCase()) || employee.employeeId?.toString().includes(searchKeyword) || employee.employeecategory?.categoryname?.toLowerCase().includes(searchKeyword)
		) || [];

	return (
		<div className="flex flex-col flex-1 h-full">
			<Tabs defaultValue="employeeList">
				<div className="flex items-center justify-between pl-4 bg-white border-b border-r">
					<TabsList className="justify-start gap-8 pl-1 bg-white [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12">
						<TabsTrigger
							value="employeeList"
							className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none">
							Employee List
						</TabsTrigger>
						<TabsTrigger
							value="paymentList"
							className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none">
							Settings
						</TabsTrigger>
					</TabsList>
				</div>

				{/* Employee List Tab */}
				<TabsContent
					className="m-0"
					value="employeeList">
					<div className="flex flex-row flex-wrap items-center justify-between w-full px-8 py-4 bg-white border-b border-r md:flex-row">
						<div className="flex gap-8">
							<div className="flex flex-col space-y-2 bg-white md:w-auto">
								<Label htmlFor="keyword">Keyword</Label>
								<Input
									type="keyword"
									id="keyword"
									placeholder="Search employees..."
									value={searchKeyword}
									onChange={(e) => setSearchKeyword(e.target.value)}
									className="border rounded-none w-[400px]"
								/>
							</div>
							<div className="flex flex-col space-y-2">
								<Label>Status</Label>
								<div className="flex">
									<Button
										size="default"
										className="w-full bg-black rounded-none md:w-20">
										Active
									</Button>
									<Button
										size="default"
										variant="outline"
										className="w-full rounded-none md:w-20">
										All
									</Button>
								</div>
							</div>
						</div>

						<div className="flex flex-col space-y-2">
							<Label>‎</Label>
							<AdvancedFilterPopover fields={field} />
						</div>
					</div>
					<div className="flex justify-end flex-none w-full bg-white">
						<AddRecordDialog
							columns={columns}
							onSave={handleAddRecord}
							nonEditableColumns={['image', 'id', 'joinedOn', 'numberOfPayment', 'action']}
							selectFields={{
								employeeCategory: {
									options: employeeCategoryOptions,
								},
							}}
						/>
						<Button
							onClick={() => setEditable((prev) => !prev)}
							className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
							{editable ? 'CANCEL' : 'EDIT+'}
						</Button>
					</div>
					<DataTable
						columns={columns}
						data={localData}
						loading={employeesLoading || creatingPayment || updatingStatus || isLoading}
						isEditable={editable}
						nonEditableColumns={['image', 'joinedOn', 'numberOfPayment', 'id', 'action']}
						onSave={handleUpdateData}
						meta={{
							editable,
							isLoading,
							employeeCategoryOptions,
							updateData: handleUpdateData
						}}
						// error={error?.toString()}
					/>
				</TabsContent>

				{/* Payment List Tab */}
				<TabsContent
					className="m-0 text-xs"
					value="paymentList">
					<div className="w-full bg-gray-100">
						<div className="px-8 py-2 font-bold">
							<h1>Rate Type</h1>
						</div>
					</div>
					<div className="flex items-center justify-between w-full bg-white border-t border-r">
						<div className="flex justify-between w-1/3 px-8 ">
							<h1>Hourly RateA</h1>
							<h1> Active</h1>
						</div>
						<Button className="h-10 text-black bg-transparent border-l border-r md:w-20 link border-r-none">REMOVE</Button>
					</div>
					<div className="flex items-center justify-between w-full bg-white border-t border-r">
						<div className="flex justify-between w-1/3 px-8 ">
							<h1>Hourly RateB</h1>
							<h1> Active</h1>
						</div>
						<Button className="h-10 text-black bg-transparent border-l border-r md:w-20 link border-r-none">REMOVE</Button>
					</div>
					<div className="flex items-center justify-between w-full bg-white border-t border-b border-r">
						<div className="flex justify-between w-1/3 px-8 ">
							<h1>Hourly RateC</h1>
							<h1> Active</h1>
						</div>
						<Button className="h-10 text-black bg-transparent border-l border-r md:w-20 link border-r-none">REMOVE</Button>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
