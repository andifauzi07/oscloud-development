import { AddRecordDialog } from '@/components/AddRecordDialog';
import AdvancedFilterPopover from '@/components/search/advanced-search';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TitleWrapper } from '@/components/wrapperElement';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';

export const Route = createFileRoute('/payment/')({
	component: RouteComponent,
});

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

export interface Payment {
	id: number;
	name: string;
	status: string;
	employee: string;
	totalPayment: number;
	totalHours: string;
	HourlyRateA: string;
	HourlyRateB: string;
	TransportFee: string;
	TotalPayment: string;
}

function RouteComponent() {
	const [searchKeyword, setSearchKeyword] = useState('');
	const [editable, setEditable] = useState(false);

	const payments: Payment[] = [
		{
			id: 1,
			name: 'Tanaka Hiroshi',
			status: 'Paid',
			employee: 'Yamamoto Akira',
			totalPayment: 120000,
			totalHours: '40',
			HourlyRateA: '3000',
			HourlyRateB: '3500',
			TransportFee: '5000',
			TotalPayment: '120000',
		},
		{
			id: 2,
			name: 'Kobayashi Mei',
			status: 'Pending',
			employee: 'Fujimoto Kenta',
			totalPayment: 95000,
			totalHours: '35',
			HourlyRateA: '2800',
			HourlyRateB: '3200',
			TransportFee: '4500',
			TotalPayment: '95000',
		},
		{
			id: 3,
			name: 'Takahashi Yuki',
			status: 'Paid',
			employee: 'Shimizu Haruto',
			totalPayment: 110000,
			totalHours: '38',
			HourlyRateA: '2900',
			HourlyRateB: '3400',
			TransportFee: '4800',
			TotalPayment: '110000',
		},
		{
			id: 4,
			name: 'Nakamura Aoi',
			status: 'Unpaid',
			employee: 'Matsumoto Ren',
			totalPayment: 87000,
			totalHours: '30',
			HourlyRateA: '2700',
			HourlyRateB: '3100',
			TransportFee: '4000',
			TotalPayment: '87000',
		},
		{
			id: 5,
			name: 'Saito Haruna',
			status: 'Paid',
			employee: 'Inoue Sora',
			totalPayment: 130000,
			totalHours: '42',
			HourlyRateA: '3100',
			HourlyRateB: '3600',
			TransportFee: '5200',
			TotalPayment: '130000',
		},
	];

	const columns: ColumnDef<Payment>[] = [
		{
			id: 'employeeid',
			header: 'Employee Id',
			accessorKey: 'id',
		},
		{
			id: 'name',
			header: 'Name',
			accessorKey: 'name',
		},
		{
			id: 'status',
			header: 'Status',
			accessorKey: 'status',
		},
		{
			id: 'employee',
			header: 'Employee',
			accessorKey: 'employee',
		},
		{
			id: 'totalPayment',
			header: 'Total Payment',
			accessorKey: 'totalPayment',
		},
		{
			id: 'totalHours',
			header: 'Total Hours',
			accessorKey: 'totalHours',
		},
		{
			id: 'HourlyRateA',
			header: 'Hourly Rate A',
			accessorKey: 'HourlyRateA',
		},
		{
			id: 'HourlyRateB',
			header: 'Hourly Rate B',
			accessorKey: 'HourlyRateB',
		},
		{
			id: 'TransportFee',
			header: 'Transport Fee',
			accessorKey: 'TransportFee',
		},
		{
			id: 'actions',
			header: '',
			accessorKey: '',
			cell: ({ row }) => (
				<div className="flex justify-end w-full">
					<Link to={'/payment'}>
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

	const handleAddRecord = async (data: any) => {
		// try {
		// 	if (!data.employeeId) throw new Error('Invalid employee data');

		// 	await createPayment({
		// 		employeeId: Number(data.employeeId),
		// 		details: [
		// 			{
		// 				projectid: 1, // Should be replaced with actual project selection
		// 				hoursworked: 0,
		// 				transportfee: 0,
		// 			},
		// 		],
		// 	});
		// } catch (error) {
		// 	console.error('Failed to add record:', error);
		// }
		console.log('data di tambahkan');
	};

	return (
		<div>
			<TitleWrapper>Payment List</TitleWrapper>
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
				{editable ? (
					<Button
						onClick={() => setEditable(false)}
						className="text-black bg-transparent border-l md:w-20 link border-l-none min-h-10">
						CANCEL
					</Button>
				) : (
					// <AddRecordDialog
					// 	columns={columns}
					// 	onSave={handleAddRecord}
					// 	nonEditableColumns={['image', 'id', 'joinedOn', 'numberOfPayment', 'action']}
					// 	selectFields={{
					// 		employeeCategory: {
					// 			options: employeeCategoryOptions,
					// 		},
					// 	}}
					// />
					<Button
						onClick={handleAddRecord}
						className="text-black bg-transparent border-l md:w-20 link border-l-none min-h-10">
						ADD
					</Button>
				)}

				{editable ? (
					<Button
						onClick={async () => {
							// try {
							// 	// Konversi data dari PayrollRow ke EmployeeData untuk diproses
							// 	const originalEmployees =
							// 		employees?.map((employee) => ({
							// 			employeeId: employee.employeeId,
							// 			employeecategory: {
							// 				categoryname: employee.employeecategory?.categoryname || '',
							// 			},
							// 		})) || [];

							// 	const updatedEmployees = updateDataFromChild.map((row) => ({
							// 		employeeId: Number(row.id),
							// 		employeecategory: {
							// 			categoryname: row.employeeCategory,
							// 		},
							// 	}));

							// 	// Cari perubahan data
							// 	const changedData = updatedEmployees.filter((updatedItem) => {
							// 		const originalItem = originalEmployees.find((item) => item.employeeId === updatedItem.employeeId);

							// 		if (!originalItem) return false;

							// 		return originalItem.employeecategory.categoryname !== updatedItem.employeecategory.categoryname;
							// 	});

							// 	if (changedData.length === 0) {
							// 		setEditable(false);
							// 		return;
							// 	}

							// 	// Proses perubahan data
							// 	await Promise.all(
							// 		changedData.map(async (item) => {
							// 			await updatePaymentStatus(item.employeeId, {
							// 				status: 'Updated',
							// 				data: {
							// 					employeecategory: {
							// 						categoryname: item.employeecategory.categoryname,
							// 					},
							// 				},
							// 			});
							// 		})
							// 	);

							// 	console.log('Success edit data');
							// 	setEditable(false);
							// 	setIsLoading(false);
							// } catch (error) {
							// 	console.error('Failed to save updates:', error);
							// 	setIsLoading(false);
							// }
							console.log('save');
						}}
						className="text-black bg-transparent border-l border-r md:w-20 link border-l-none min-h-10">
						SAVE
					</Button>
				) : (
					<Button
						onClick={() => setEditable(true)}
						className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
						EDIT
					</Button>
				)}
			</div>
			<DataTable
				columns={columns}
				data={payments}
				loading={false}
				isEditable={editable}
				nonEditableColumns={['image', 'joinedOn', 'numberOfPayment', 'id', 'action']}
				// setTableData={(updateFunctionOrData) => {
				// 	const evaluatedData = typeof updateFunctionOrData === 'function' ? updateFunctionOrData([...localData]) : updateFunctionOrData;
				// 	setUpdateDataFromChild(evaluatedData);
				// }}
			/>
		</div>
	);
}
