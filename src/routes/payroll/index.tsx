import { createFileRoute, Link } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import AdvancedFilterPopover from '@/components/search/advanced-search';
import { Label } from '@/components/ui/label';

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

const data: PayrollRow[] = [
	{
		image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		id: '1',
		name: 'John Doe',
		employeeCategory: 'Full-Time',
		hourlyRateA: '$20',
		hourlyRateB: '$25',
		totalPayment: '$5,000',
		numberOfPayment: '10',
		joinedOn: '2023-01-01',
	},
	{
		image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		id: '2',
		name: 'Jane Smith',
		employeeCategory: 'Part-Time',
		hourlyRateA: '$18',
		hourlyRateB: '$22',
		totalPayment: '$3,500',
		numberOfPayment: '8',
		joinedOn: '2023-02-15',
	},
	{
		image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		id: '3',
		name: 'Alice Johnson',
		employeeCategory: 'Contract',
		hourlyRateA: '$25',
		hourlyRateB: '$30',
		totalPayment: '$6,000',
		numberOfPayment: '12',
		joinedOn: '2023-03-10',
	},
];

// Define columns
const columns: ColumnDef<PayrollRow>[] = [
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
		cell: ({ row }) => (
			<Input
				enableEmoji={false}
				defaultValue={row.original.name}
				className="w-40 border-0 rounded-none"
				onChange={(e) => {
					// Handle Name change logic here
					console.log('Name changed:', e.target.value);
				}}
			/>
		),
	},
	{
		accessorKey: 'employeeCategory',
		header: 'Employee Category',
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
		accessorKey: 'action',
		header: '',

		cell: ({ row }) => (
			<Link
				to={'/payroll/$employeeId'}
				params={{ employeeId: row.original.id.toString() }}
				className="w-full h-full">
				<Button
					variant="outline"
					className="w-20 h-full">
					DETAIL
				</Button>
			</Link>
		),
	},
];

export const Route = createFileRoute('/payroll/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col flex-1 h-full">
			{/* Tabs Section */}
			<Tabs defaultValue="employeeList">
				<div className="flex items-center justify-between px-4 bg-white border-b">
					<TabsList className="justify-start gap-8 bg-white [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12">
						<TabsTrigger
							value="employeeList"
							className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2">
							Employee List
						</TabsTrigger>
						<TabsTrigger
							value="paymentList"
							className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2">
							Payment List
						</TabsTrigger>
					</TabsList>
					<Link
						to="/payroll"
						className="">
						Setting
					</Link>
				</div>
				<div className="flex flex-row flex-wrap items-center justify-between w-full p-8 pt-4 bg-white border md:flex-row">
					<div className="flex gap-8">
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
					</div>

					<div className="flex flex-col space-y-2">
						<Label>‎</Label>
						<AdvancedFilterPopover />
					</div>
				</div>

				<div className="flex justify-end flex-none w-full bg-white">
					<Button className="text-black bg-transparent border md:w-20 link border-r-none h-14">ADD+</Button>
					<Button className="text-black bg-transparent border md:w-20 link h-14">EDIT</Button>
				</div>

				{/* Employee List Tab */}
				<TabsContent value="employeeList">
					<DataTable
						columns={columns}
						data={data}
					/>
				</TabsContent>

				{/* Payment List Tab */}
				<TabsContent value="paymentList">
					{/* <DataTable
						columns={columns}
						data={data}
					/> */}
				</TabsContent>
			</Tabs>
		</div>
	);
}
