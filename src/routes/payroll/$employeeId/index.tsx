import AdvancedFilterPopover from '@/components/search/advanced-search';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createFileRoute, Link, useParams } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { formatUrlString, revertUrlString } from '@/lib/utils';
import { usePayroll } from '@/hooks/usePayroll'; // Import the usePayroll hook
import { useUserData } from '@/hooks/useUserData';
import Loading from '@/components/Loading';
import { InfoSection, TitleWrapper } from '@/components/wrapperElement';
import { AddRecordDialog } from '@/components/AddRecordDialog';
import { useCallback, useState } from 'react';

export const Route = createFileRoute('/payroll/$employeeId/')({
	component: RouteComponent,
});

// Joined Projects (breakdown) mockData
type BreakdownRow = {
	project: string;
	start: string;
	end: string;
	break: string;
	duration: string;
	hourRate: string;
	transportFee: string;
	costA: string;
	costB: string;
	costumeFee: string;
	totalFee: string;
};

const dataBreakdown: BreakdownRow[] = [
	{
		project: '@100週年…',
		start: '2024.10.25 09:00AM',
		end: '2024.10.25 21:00PM',
		break: '1h',
		duration: '8.5h',
		hourRate: '¥ 2,500 (Hourly RateA)',
		transportFee: '350円',
		costA: '',
		costB: '',
		costumeFee: '',
		totalFee: '¥ 20,000',
	},
	{
		project: '@100週年…',
		start: '2024.10.25 09:00AM',
		end: '2024.10.25 21:00PM',
		break: '1h',
		duration: '8.5h',
		hourRate: '¥ 2,500 (Hourly RateA)',
		transportFee: '350円',
		costA: '',
		costB: '',
		costumeFee: '',
		totalFee: '¥ 20,000',
	},
	{
		project: '@100週年…',
		start: '2024.10.25 09:00AM',
		end: '2024.10.25 21:00PM',
		break: '1h',
		duration: '8.5h',
		hourRate: '¥ 2,500 (Hourly RateA)',
		transportFee: '350円',
		costA: '',
		costB: '',
		costumeFee: '',
		totalFee: '¥ 20,000',
	},
];

const columBreakdown: ColumnDef<BreakdownRow>[] = [
	{
		accessorKey: 'project',
		header: 'Projects',
	},
	{
		accessorKey: 'start',
		header: 'Start',
	},
	{
		accessorKey: 'end',
		header: 'End',
	},
	{
		accessorKey: 'break',
		header: 'Break',
	},
	{
		accessorKey: 'duration',
		header: 'Duration',
	},
	{
		accessorKey: 'hourRate',
		header: 'Houra rate',
	},
	{
		accessorKey: 'transportFee',
		header: 'Transport fee',
	},
	{
		accessorKey: 'costA',
		header: 'Cost A',
	},
	{
		accessorKey: 'costB',
		header: 'Cost B',
	},
	{
		accessorKey: 'costumeFee',
		header: 'Costume fee',
	},
	{
		accessorKey: 'totalFee',
		header: 'Total fee',
	},
	{
		accessorKey: 'action',
		header: '',
		cell: () => (
			<Link
				to="/"
				className="w-full h-full">
				<Button
					variant="outline"
					className="w-20 h-full">
					VIEW
				</Button>
			</Link>
		),
	},
];

// Joined Projects mockData
type PayrollRow = {
	image: string;
	id: string;
	name: string;
	employeeCategory: string;
	totalPayment: string;
	totalHours: string;
	hourlyRateA: string;
	hourlyRateB: string;
	transportFee: string;
	costA: string;
	costB: string;
	other: string;
};

const dataEmployee: PayrollRow[] = [
	{
		image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		id: '12',
		name: 'John Brown',
		employeeCategory: 'UI Designer',
		totalHours: '20h',
		totalPayment: '¥ 214,000',
		hourlyRateA: '10h (¥ 2,000)',
		hourlyRateB: '¥ 4,000',
		transportFee: '¥ 4,000',
		costA: '¥ 4,000',
		costB: '¥ 4,000',
		other: '¥ 4,000',
	},
];

const columnsEmployee: ColumnDef<PayrollRow>[] = [
	{
		accessorKey: 'image',
		header: '',
		cell: ({ row }) => (
			<img
				src={row.original.image}
				className="w-16 h-16 border-0 rounded-none"
			/>
		),
	},
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => (
			<Input
				enableEmoji={false}
				defaultValue={row.original.id}
				className="w-20 border-0 rounded-none"
				onChange={(e) => {
					// Handle ID change logic here
					console.log('ID changed:', e.target.value);
				}}
			/>
		),
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'employeeCategory',
		header: 'Employee Category',
	},
	{
		accessorKey: 'totalPayment',
		header: 'Total Payment',
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
		accessorKey: 'transportFee',
		header: 'Transport Fee',
	},
	{
		accessorKey: 'costA',
		header: 'Cost A',
	},
	{
		accessorKey: 'costB',
		header: 'Cost B',
	},
	{
		accessorKey: 'other',
		header: 'Other',
	},
];

// Payment mockData
type Status = 'Paid' | 'Review' | 'Pending';

type PaymentTab = {
	id: string;
	name: string;
	staffName: string;
	createdBy: string;
	dueDate: string;
	totalHour: string;
	amount: string;
	status: Status;
};

const paymentDataEmployeeColumn: ColumnDef<PaymentTab>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		// cell: ({ row }) => (
		// 	<Input
		// 		enableEmoji={false}
		// 		defaultValue={row.original.id}
		// 		className="w-20 border-0 rounded-none"
		// 		onChange={(e) => {
		// 			// Handle ID change logic here
		// 			console.log('ID changed:', e.target.value);
		// 		}}
		// 	/>
		// ),
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'staffName',
		header: 'Staff name',
	},
	{
		accessorKey: 'createdBy',
		header: 'Created by',
	},
	{
		accessorKey: 'dueDate',
		header: 'Due date',
	},
	{
		accessorKey: 'totalHour',
		header: 'Total Hour',
	},
	{
		accessorKey: 'amount',
		header: 'Amount',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
	{
		header: '',
		accessorKey: 'id',
		cell: (prev) => {
			return (
				<Link
					to="/payroll/$employeeId/$paymentId"
					params={{ paymentId: formatUrlString(prev.row.original.name), employeeId: formatUrlString(prev.row.original.id) }}
					className="w-20 h-full">
					VIEW
				</Link>
			);
		},
	},
];

function RouteComponent() {
	const { employeeId } = Route.useParams();
	const { workspaceid } = useUserData();
	const { payments, loading, error } = usePayroll({ workspaceId: Number(workspaceid), employeeId: employeeId });
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

	// Transform payment data for employee profile
	const employeeData = payments[0]
		? {
				id: payments[0].employee.employeeId.toString(),
				name: payments[0].employee.name,
			}
		: null;

	// Transform payment data for joined projects
	const joinedProjectsData = payments.map((payment: any) => ({
		image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		id: payment.paymentId.toString(),
		name: payment.employee.name,
		employeeCategory: 'Staff', // Default category
		totalHours: `${payment.details[0]?.hoursWorked || 0}h`,
		totalPayment: `¥${payment.totalPayment}`,
		hourlyRateA: payment.details[0] ? `${payment.details[0].hoursWorked}h (¥${payment.details[0].totalAmount})` : '-',
		hourlyRateB: '-',
		transportFee: `¥${payment.details[0]?.transportFee || 0}`,
		costA: '-',
		costB: '-',
		other: '-',
	}));

	// Transform payment data for breakdown
	const breakdownData = payments.flatMap((payment: any) =>
		payment.details.map((detail: any) => ({
			project: `Project ${detail.projectId}`,
			start: new Date().toLocaleString(),
			end: new Date().toLocaleString(),
			break: '1h',
			duration: `${detail.hoursWorked}h`,
			hourRate: `¥${(detail.totalAmount / detail.hoursWorked).toFixed(2)}`,
			transportFee: `¥${detail.transportFee}`,
			costA: '-',
			costB: '-',
			costumeFee: '-',
			totalFee: `¥${detail.totalAmount}`,
		}))
	);

	// Transform payment data for payment tab
	const paymentDataEmployeeRow = payments.map((payment: any) => ({
		id: payment.paymentId.toString(),
		name: `Payment ${payment.paymentId}`,
		staffName: payment.employee.name,
		createdBy: payment.createdBy.name,
		dueDate: new Date().toLocaleDateString(), // Add due date to API if needed
		totalHour: payment.details[0]?.hoursWorked.toString() || '0',
		amount: `¥${payment.totalPayment}`,
		status: payment.status,
	}));

	const basicInfo = [
		{ label: 'UserID', value: employeeData?.id || '' },
		{ label: '名前', value: employeeData?.name || '' },
		// ...rest of your basicInfo items...
	];

	const contractInfo = [
		{ label: 'UserID', value: '終日' },
		{ label: '名前', value: '9:00 ~ 17:00' },
		{ label: 'なまえ', value: '終日' },
		{ label: '誕生日', value: '終日' },
		{ label: '2024.11.25', value: '9:00 ~ 17:00' },
		{ label: '2024.11.28', value: '終日' },
	];

	return (
		<div className="flex flex-col flex-1 h-full">
			{/* Tabs Section */}
			<Tabs defaultValue="profile">
				<div className="flex items-center justify-between bg-white border-b border-r">
					<TabsList className="justify-start gap-8 px-8 bg-white [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12">
						<TabsTrigger
							value="profile"
							className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2">
							Profile
						</TabsTrigger>
						<TabsTrigger
							value="joinedprojects"
							className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2">
							Joined Projects
						</TabsTrigger>
						<TabsTrigger
							value="payment"
							className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2">
							Payment
						</TabsTrigger>
					</TabsList>
				</div>

				{/* Employee List Tab */}
				<TabsContent
					value="profile"
					className="m-0">
					<div className="h-full">
						<div className="flex flex-col">
							<TitleWrapper>
								<h1>{employeeData?.name}</h1>
							</TitleWrapper>
							<div className="border-b">
								<div className="flex justify-end flex-none w-full bg-white">
									<Button className="w-20 h-10 text-black bg-transparent border-l border-r link">EDIT</Button>
								</div>
							</div>
						</div>

						{/* Scrollable content section */}
						<div className="flex-1 min-h-0">
							{/* Image and list container */}
							<div className="flex">
								{/* Left side - Image section */}
								<div className="w-[30%] flex flex-col border-b">
									<figure className="w-full h-[100%] relative overflow-hidden">
										<img
											className="w-full absolute top-[50%] left-[50%] right-[50%] transform translate-x-[-50%] translate-y-[-50%]"
											src="https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
											alt="Profile"
										/>
									</figure>
									<div className="flex flex-col items-center">
										<h4 className="py-3">Edit profile image</h4>
										<p className="pb-3 text-gray-500">PNG, JPEG, (3MG)</p>
										<div>
											<label
												htmlFor="profile_upload"
												className="cursor-pointer bg-[#f2f2f2] w-48 h-12 flex justify-center items-center hover:bg-muted transition">
												UPLOAD
											</label>
											<Input
												id="profile_upload"
												type="file"
												className="hidden"
												enableEmoji={false}
											/>
										</div>
									</div>
								</div>

								{/* Right side - Info sections */}
								<div className="w-[70%] overflow-y-auto">
									<InfoSection
										items={basicInfo}
										title="Basic Information"
									/>
									<InfoSection
										items={contractInfo}
										title="Contact"
									/>
								</div>
							</div>
						</div>
					</div>
				</TabsContent>

				{/* Joined Projects Tab */}
				<TabsContent
					className="m-0"
					value="joinedprojects">
					<div className="flex flex-row flex-wrap items-center justify-between w-full px-8 py-4 bg-white border-b border-r md:flex-row">
						<div className="flex flex-col space-y-2 bg-white md:w-auto">
							<Label htmlFor="keyword">Keyword</Label>
							<Input
								type="keyword"
								id="keyword"
								placeholder=""
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

						<div className="flex flex-col space-y-2">
							<Label>Duration</Label>
							<div className="flex items-center gap-2">
								<Input
									type="date"
									className="w-[150px] border rounded-none"
									enableEmoji={false}
								/>
								<span className="text-gray-500">-</span>
								<Input
									type="date"
									className="w-[150px] border rounded-none"
									enableEmoji={false}
								/>
							</div>
						</div>

						<div className="flex flex-col space-y-2">
							<Label>‎</Label>
							<AdvancedFilterPopover />
						</div>
					</div>
					<div className="flex justify-end w-full bg-white border-r">
						<Link
							to="/payroll/$employeeId/joined-projects"
							params={{ employeeId: employeeId }}>
							<Button
								variant="outline"
								className="w-20 h-full">
								CREATE
							</Button>
						</Link>
					</div>
					<div className="border-t border-b border-r">
						<DataTable
							columns={columnsEmployee}
							data={joinedProjectsData}
							loading={loading || error}
						/>
					</div>
					<TitleWrapper>
						<h2 className="text-xl">Breakdown</h2>
					</TitleWrapper>
					<div className="border-t border-b border-r">
						<DataTable
							columns={columBreakdown}
							data={breakdownData}
							loading={loading || error}
						/>
					</div>
				</TabsContent>

				{/* Payment List Tab */}
				<TabsContent
					className="m-0"
					value="payment">
					<div className="flex flex-row flex-wrap items-center justify-between w-full px-8 py-4 bg-white border-b border-r md:flex-row">
						<div className="flex flex-col space-y-2 bg-white md:w-auto">
							<Label htmlFor="keyword">Keyword</Label>
							<Input
								type="keyword"
								id="keyword"
								placeholder=""
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

						<div className="flex flex-col space-y-2">
							<Label>Duration</Label>
							<div className="flex items-center gap-2">
								<Input
									type="date"
									className="w-[150px] border rounded-none"
									enableEmoji={false}
								/>
								<span className="text-gray-500">-</span>
								<Input
									type="date"
									className="w-[150px] border rounded-none"
									enableEmoji={false}
								/>
							</div>
						</div>

						<div className="flex flex-col space-y-2">
							<Label>‎</Label>
							<AdvancedFilterPopover />
						</div>
					</div>
					<div className="flex justify-between w-full bg-white border-r">
						<h2 className="text-xl px-8">Payment</h2>
						<div className="flex w-full justify-end">
							<AddRecordDialog
								columns={paymentDataEmployeeColumn}
								onSave={handleAddRecord}
								nonEditableColumns={['status*', 'id*']}
							/>
							<Button
								onClick={() => setEditable((prev) => !prev)}
								className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
								EDIT+
							</Button>
						</div>
					</div>
					<div className="border-t border-b border-r">
						<DataTable
							columns={paymentDataEmployeeColumn}
							data={paymentDataEmployeeRow}
							loading={loading || error}
							onSave={handleSaveEdits}
							isEditable={editable}
							nonEditableColumns={['id', 'status']}
						/>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
