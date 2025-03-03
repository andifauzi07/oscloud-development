import { createFileRoute, Link } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { AssignedStaff, PaymentStaff } from '../../../components/projectAssignedStaffDataTable';
import AdvancedFilterPopover from '../../../components/search/advanced-search';
import { DataTable } from '../../../components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { GraphicChart } from '@/components/graphicChart';
import { TitleWrapper } from '@/components/wrapperElement';

// Define mock data for AssignedStaff
export const mockAssignedStaff: AssignedStaff[] = [
	{
		id: 1,
		image: '/public/vite.svg',
		name: 'John Doe',
		status: 'Active',
		money: 5000.75,
		money2: 3000.5,
		grade: 'A',
	},
	{
		id: 2,
		image: '/public/vite.svg',
		name: 'Jane Smith',
		status: 'Inactive',
		money: 4500.25,
		money2: 2500.0,
		grade: 'B',
	},
	{
		id: 3,
		image: '/public/vite.svg',
		name: 'Alice Johnson',
		status: 'Active',
		money: 6000.0,
		money2: 3500.75,
		grade: 'A+',
	},
	{
		id: 4,
		image: '/public/vite.svg',
		name: 'Michael Brown',
		status: 'Active',
		money: 5500.5,
		money2: 2800.25,
		grade: 'A-',
	},
	{
		id: 5,
		image: '/public/vite.svg',
		name: 'Emily Davis',
		status: 'Inactive',
		money: 4000.0,
		money2: 2200.0,
		grade: 'C',
	},
];

export const mockPaymentStaff: PaymentStaff[] = [
	{
		id: '1',
		image: '/public/vite.svg',
		name: 'John Doe',
		break: 30,
		duration: 8.5,
		hour_rate: 20,
		transport_fee: 15,
		cost_a: 50,
		cost_b: 30,
		costum_fee: 10,
		total_fee: 225,
	},
	{
		id: '2',
		image: '/public/vite.svg',
		name: 'Jane Smith',
		break: 45,
		duration: 7.2,
		hour_rate: 22,
		transport_fee: 10,
		cost_a: 40,
		cost_b: 20,
		costum_fee: 5,
		total_fee: 204,
	},
	{
		id: '3',
		image: '/public/vite.svg',
		name: 'Michael Johnson',
		break: 20,
		duration: 9.1,
		hour_rate: 18,
		transport_fee: 20,
		cost_a: 60,
		cost_b: 35,
		costum_fee: 15,
		total_fee: 257,
	},
	{
		id: '4',
		image: '/public/vite.svg',
		name: 'Emily Davis',
		break: 30,
		duration: 6.9,
		hour_rate: 25,
		transport_fee: 12,
		cost_a: 55,
		cost_b: 28,
		costum_fee: 8,
		total_fee: 200,
	},
	{
		id: '5',
		image: '/public/vite.svg',
		name: 'Chris Brown',
		break: 40,
		duration: 8.5,
		hour_rate: 19,
		transport_fee: 18,
		cost_a: 45,
		cost_b: 25,
		costum_fee: 12,
		total_fee: 232,
	},
];

// Columns for Assigned Staff
const assignedStaffColumns: ColumnDef<AssignedStaff>[] = [
	{
		accessorKey: 'image',
		header: () => <h1 className="pl-4"></h1>,
		cell: ({ row }) => (
			<img
				src={row.original.image}
				alt="Profile"
				className="w-10 h-10 rounded-full"
			/>
		),
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'status',
		header: 'Availability',
	},
	{
		accessorKey: 'money',
		header: 'Money',
		cell: ({ row }) => `$${row.original.money.toFixed(2)}`,
	},
	{
		accessorKey: 'money2',
		header: 'Money 2',
		cell: ({ row }) => `$${row.original.money2.toFixed(2)}`,
	},
	{
		accessorKey: 'grade',
		header: 'Total Score',
	},
	{
		id: 'actions',
		accessorKey: 'id',
		header: '',
		cell: () => (
			<div className=" w-full flex justify-end">
				<Button
					variant="outline"
					className="text-xs border-r-0 border-t-0 border-b-0">
					ASSIGN
				</Button>
			</div>
		),
	},
];

// Columns for Payment Staff
const paymentStaffColumns: ColumnDef<PaymentStaff>[] = [
	{
		accessorKey: 'image',
		header: '',
		cell: ({ row }) => (
			<img
				src={row.original.image}
				alt="Profile"
				className="w-10 h-10 object-cover"
			/>
		),
	},
	{
		accessorKey: 'name',
		header: 'Name',
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
		accessorKey: 'hour_rate',
		header: 'Hour Rate',
	},
	{
		accessorKey: 'transport_fee',
		header: 'Transport Fee',
	},
	{
		accessorKey: 'cost_a',
		header: 'Cost A',
	},
	{
		accessorKey: 'cost_b',
		header: 'Cost B',
	},
	{
		accessorKey: 'costum_fee',
		header: 'Costume Fee',
	},
	{
		accessorKey: 'total_fee',
		header: 'Total Fee',
	},
	{
		id: 'actions',
		header: '',
		cell: ({ row }: any) => (
			<div className="w-full flex justify-end">
				<Button
					className="w-20 border-t-0 border-b-0 border-r-0"
					variant="outline">
					EDIT
				</Button>
			</div>
		),
	},
];

export const Route = createFileRoute('/projects/$projectId/')({
	component: ProjectView,
});

function ProjectView() {
	const { projectId } = Route.useParams(); // Access the projectId from the route

	return (
		<div className="flex flex-col bg-white">
			<TitleWrapper>
				<h1>Project {projectId}</h1>
			</TitleWrapper>

			<Tabs defaultValue="description">
				<TabsList className="justify-start w-full gap-8 bg-white border-r border-b [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 pl-5">
					<TabsTrigger
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
						value="description">
						Description
					</TabsTrigger>
					<TabsTrigger
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
						value="members">
						Members
					</TabsTrigger>
					<TabsTrigger
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
						value="payment">
						Payment
					</TabsTrigger>

					<TabsTrigger
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
						value="P/L">
						P/L
					</TabsTrigger>
				</TabsList>

				{/* Description Tab */}
				<TabsContent
					className="m-0"
					value="description">
					<div className="flex flex-col">
						<div className="flex justify-between border-r">
							<div className="h-10 flex items-center px-8">
								<h1 className="text-sm">Description</h1>
							</div>
							<Button className="w-20 text-black bg-transparent link h-10">PRINT</Button>
							{/* </Link> */}
						</div>
						<div className="flex items-center justify-between bg-gray-100 border-t border-b border-r">
							<div className="px-8">
								<h1 className="text-base">一般情報</h1>
							</div>
							<Button className="w-20 text-black bg-transparent border-l link border-r-none h-10">EDIT</Button>
						</div>
						<div className="flex text-xs flex-col border-r">
							<Input
								className="px-8 border-none"
								placeholder="Project Name"></Input>

							<div className="w-full justify-start border-t px-6 gap-4 flex">
								<div className="flex justify-start w-1/8 p-2">
									<h1>Client</h1>
								</div>
								<div className="flex justify-start w-1/8 p-2">
									<h1>Company Name</h1>
								</div>
							</div>

							<div className="w-full justify-start border-t px-6 gap-4 flex">
								<div className="flex justify-start w-1/8 p-2">
									<h1>Personnel</h1>
								</div>
								<div className="flex justify-start w-1/8 p-2">
									<h1>John Brown</h1>
								</div>
							</div>
							<div className="w-full justify-start border-t px-6 gap-4 flex">
								<div className="flex justify-start w-1/8 p-2">
									<h1>Category</h1>
								</div>
								<div className="flex justify-start w-1/8 p-2">
									<h1>Category</h1>
								</div>
							</div>

							<div className="w-full justify-start border-t px-6 gap-4 flex">
								<div className="flex justify-start w-1/8 p-2">
									<h1>Manager</h1>
								</div>
								<div className="flex justify-start w-1/8 p-2">
									<div className="flex flex-row gap-2">
										<img src="/public/vite.svg" />
										<h1>John Brown</h1>
									</div>
								</div>
							</div>
							<div className="w-full justify-start border-t px-6 gap-4 flex">
								<div className="flex justify-start w-1/8 p-2">
									<h1>Required staff number</h1>
								</div>
								<div className="flex justify-start w-1/8 p-2">
									<h1>13</h1>
								</div>
							</div>
							<div className="flex items-center justify-between bg-gray-100 border-t border-b">
								<div className="px-8">
									<h1 className="text-base">Description</h1>
								</div>
								<Button className="w-20 text-black bg-transparent border-l link border-r-none h-10">EDIT</Button>
							</div>
							<Input
								className="px-8 rounded-none"
								placeholder="Bla bla bla bla"></Input>
							<div className="flex items-center justify-between bg-gray-100 border-t">
								<div className="px-8">
									<h1>Assigned staffs</h1>
								</div>
								<div className="flex flex-row items-center gap-6">
									<h1>2/13</h1>
									<Button className="w-20 text-black bg-transparent border-l link border-r-none h-10">EDIT</Button>
								</div>
							</div>
						</div>
						<DataTable
							columns={assignedStaffColumns}
							data={mockAssignedStaff}
							loading={false}
						/>
					</div>
				</TabsContent>

				{/* Members Tab */}
				<TabsContent
					className="m-0"
					value="members">
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
											ASSIGN
										</Button>
									</div>
								))}
							</div>
						</div>
						<div className="w-full">
							<div className="flex items-center p-4 border-r border-l">
								<h1>Members</h1>
							</div>

							<div className="flex flex-row flex-wrap items-center justify-between w-full p-4 bg-white border border-b-0 md:flex-row">
								<div className="flex flex-col space-y-2 bg-white md:w-auto">
									<Label htmlFor="keyword">Keyword</Label>
									<Input
										type="text"
										id="keyword"
										placeholder="Search by name, email, etc."
										className="border rounded-none w-[250px]"
									/>
								</div>

								{/* Status Toggle */}
								<div className="flex flex-row gap-2 ">
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
										<AdvancedFilterPopover />
									</div>
								</div>
							</div>
							<div className="border-l">
								<DataTable
									columns={assignedStaffColumns}
									data={mockAssignedStaff}
									loading={false}
								/>
							</div>
						</div>
					</div>
				</TabsContent>

				{/* Payment Tab */}
				<TabsContent
					className="m-0"
					value="payment">
					<TitleWrapper>
						<h1>Member adjustment</h1>
					</TitleWrapper>
					<div className="flex flex-row bg-white">
						<div className="w-full">
							<div className="flex flex-row items-center border-r gap-4 px-8 py-4">
								<div className="flex flex-col space-y-2">
									<Label htmlFor="keyword">Keyword</Label>
									<Input
										type="text"
										id="keyword"
										placeholder="Search by name, email, etc."
										className="border rounded-none w-[400px]"
									/>
								</div>

								{/* Status Toggle */}
								<div className="flex flex-col space-y-2">
									<Label>Status</Label>
									<div className="flex">
										<Button
											size="default"
											className="bg-black rounded-none">
											Active
										</Button>
										<Button
											size="default"
											variant="outline"
											className="rounded-none">
											All
										</Button>
									</div>
								</div>
								{/* Advanced Search */}
								<div className="flex flex-col mt-5">
									<AdvancedFilterPopover />
								</div>
							</div>
							<DataTable
								columns={paymentStaffColumns}
								data={mockPaymentStaff}
								loading={false}
							/>
						</div>
					</div>
				</TabsContent>
				<TabsContent
					className="m-0"
					value="P/L">
					<TitleWrapper>
						<h1>Member adjustment</h1>
					</TitleWrapper>
					<TitleWrapper>
						<h1>Profit & Loss</h1>
					</TitleWrapper>

					<div className="flex w-full h-full">
						{/* Left Side */}
						<div className="w-1/3 h-full border-r">
							<div className="flex items-center justify-center w-full py-2 px-4 bg-gray-100">
								<h2>Profit</h2>
							</div>
							<div className="flex w-full h-[250px] justify-center items-center border-t border-b p-4">
								<h2 className="text-2xl">280,000 USD</h2>
							</div>
							<div className="flex items-center justify-center w-full p-4 bg-gray-100">
								<h2>Profitability</h2>
							</div>
							<div className="flex w-full justify-center h-[250px] items-center border-t p-4">
								<h2 className="text-2xl ">15 %</h2>
							</div>
							<div className="min-h-[600px]">
								<div className="flex items-center justify-center w-full p-4 bg-gray-100 border-t border-b">
									<h2>Cost Breakdown</h2>
								</div>
								<GraphicChart />
							</div>
						</div>

						{/* Righ Side */}
						<div className="w-2/3">
							<div className="flex items-center justify-between w-full p-4 bg-gray-100 border-b border-r">
								<h2>Sales Revenue</h2>
								<Button
									variant={'link'}
									className="hover:cursor-pointer">
									EDIT
								</Button>
							</div>
							<div className="flex w-full gap-2 p-4 border-b border-r">
								<h2>Revenue Cost</h2>
								<h2>1,000,000 USD</h2>
							</div>
							<div className="flex w-full gap-2 p-4 border-b border-r">
								<h2>Other Cost</h2>
								<h2>0 USD</h2>
							</div>
							<div className="flex items-center justify-between w-full p-4 bg-gray-100 border-b border-r">
								<h2>Expenditures</h2>
								<Button
									variant={'link'}
									className="hover:cursor-pointer">
									EDIT
								</Button>
							</div>
							<div className="flex w-full gap-2 p-4 border-b border-r">
								<h2>Labour Cost</h2>
								<h2>10,000 USD</h2>
							</div>
							<div className="flex w-full gap-2 p-4 border-b border-r">
								<h2>Transport Cost</h2>
								<h2>10,000 USD</h2>
							</div>
							<div className="flex w-full gap-2 p-4 border-b border-r">
								<h2>Costume Cost</h2>
								<h2>10,000 USD</h2>
							</div>
							<div className="flex w-full gap-2 p-4 border-b border-r">
								<h2>Manager Fee</h2>
								<h2>10,000 USD</h2>
							</div>
							<div className="flex w-full gap-2 p-4 border-b border-r">
								<h2>Other Cost</h2>
								<h2>10,000 USD</h2>
							</div>
							<div className="flex items-center justify-start w-full p-4 bg-gray-100 border-b border-r">
								<h2>Profit</h2>
							</div>
							<div className="flex w-full gap-2 p-4 border-r border-b">
								<h2>Sales Profit</h2>
								<h2>10,000 USD</h2>
							</div>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
