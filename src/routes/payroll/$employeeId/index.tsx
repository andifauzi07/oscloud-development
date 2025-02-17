import AdvancedFilterPopover from '@/components/search/advanced-search';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';

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
//End line

//Joined Projects mockData
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
//End line

//Payment mockData

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

const paymentDataEmployeeRow: PaymentTab[] = [
	{
		id: '12',
		name: 'Dec. Payment',
		staffName: 'Jhon Brown',
		createdBy: 'Sarah White',
		dueDate: '2024.11.01',
		totalHour: '23',
		amount: '230,000円',
		status: 'Paid',
	},
	{
		id: '17',
		name: 'Nov Payment',
		staffName: 'Jhon Brown',
		createdBy: 'Sarah White',
		dueDate: '2024.11.01',
		totalHour: '23',
		amount: '230,000円',
		status: 'Review',
	},
	{
		id: '45',
		name: 'Urgent Payment',
		staffName: 'Jhon Brown',
		createdBy: 'Sarah White',
		dueDate: '2024.11.01',
		totalHour: '23',
		amount: '230,000円',
		status: 'Paid',
	},
	{
		id: '254',
		name: 'Oct Payment',
		staffName: 'Jhon Brown',
		createdBy: 'Sarah White',
		dueDate: '2024.11.01',
		totalHour: '23',
		amount: '230,000円',
		status: 'Pending',
	},
];

const paymentDataEmployeeColumn: ColumnDef<PaymentTab>[] = [
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
		cell: () => {
			return (
				<Button
					variant="outline"
					className="w-20 h-full">
					VIEW
				</Button>
			);
		},
	},
];

function RouteComponent() {
	const InfoSection = ({ title, items }: { title: React.ReactNode; items: { label: string; value: string }[] }) => (
		<div className="flex flex-col">
			<h2 className="px-4 py-4 text-sm font-medium bg-gray-100">{title}</h2>
			<div className="divide-y">
				{items.map((item, index) => (
					<div
						key={index}
						className="flex gap-8 border-gray-200">
						<div className="w-32 px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50">
							<span>{item?.label}</span>
						</div>
						<div className="flex-1 px-4 py-3 text-sm">
							<span>{item?.value}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
	const basicInfo = [
		{ label: 'UserID', value: '終日' },
		{ label: '名前', value: 'John Brown' },
		{ label: 'なまえ', value: '終日' },
		{ label: '誕生日', value: '終日' },
		{ label: '2024.11.25', value: '9:00 ~ 17:00' },
		{ label: '2024.11.28', value: '終日' },
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
				<div className="flex items-center justify-between px-4 bg-white border-b">
					<TabsList className="justify-start gap-8 bg-white [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12">
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
				<TabsContent value="profile">
					<>
						<div className="flex flex-col">
							<div className="bg-white border-b">
								<h2 className="container px-4 py-3 ">John Brown</h2>
							</div>
							<div className="border-b">
								<div className="flex justify-end flex-none w-full bg-white border-t">
									<Button className="w-20 text-black bg-transparent border link h-14">EDIT</Button>
								</div>
							</div>
						</div>

						{/* Scrollable content section */}
						<div className="flex-1 min-h-0">
							{/* Image and list container */}
							<div className="flex">
								{/* Left side - Image section */}
								<div className="w-[30%] flex flex-col">
									<figure className="w-full h-[65%] relative overflow-hidden">
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
					</>
				</TabsContent>

				{/* Payment List Tab */}
				<TabsContent
					className="m-0"
					value="joinedprojects">
					<div className="flex flex-row flex-wrap items-center justify-between w-full p-8 bg-white border md:flex-row">
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
					<div className="flex w-full bg-white p-2 justify-end">
						<Button
							variant="outline"
							className="w-20 h-full">
							CREATE
						</Button>
					</div>
					<DataTable
						columns={columnsEmployee}
						data={dataEmployee}
					/>
					<div className="flex w-full bg-white px-6 py-4">
						<h2 className="text-xl">Breakdown</h2>
					</div>
					<DataTable
						columns={columBreakdown}
						data={dataBreakdown}
					/>
				</TabsContent>

				<TabsContent
					className="m-0"
					value="payment">
					<div className="flex flex-row flex-wrap items-center justify-between w-full p-8 bg-white border md:flex-row">
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
					<div className="flex justify-between w-full bg-white px-6 py-4">
						<h2 className="text-xl">Payment</h2>
						<div className="flex gap-2">
							<Button
								variant="outline"
								className="w-20 h-full">
								EDIT
							</Button>
							<Button
								variant="outline"
								className="w-20 h-full">
								CREATE +
							</Button>
						</div>
					</div>

					<DataTable
						columns={paymentDataEmployeeColumn}
						data={paymentDataEmployeeRow}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
