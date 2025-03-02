import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TitleWrapper } from '@/components/wrapperElement';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';

export const Route = createFileRoute('/features/company-list/')({
	component: RouteComponent,
});

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
		header: () => <h1 className="pl-8">Projects</h1>,
		cell: ({ row }) => <h1 className="pl-8 py-2">{row.original.project}</h1>,
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
			<div className="w-full flex justify-end">
				<Link to="/projects">
					<Button
						variant="outline"
						className="w-20 h-full border-b-0 border-t-0 border-r-0">
						VIEW
					</Button>
				</Link>
			</div>
		),
	},
];

function RouteComponent() {
	return (
		<div className="flex flex-col">
			<TitleWrapper>
				<h2>Payment List</h2>
			</TitleWrapper>
			<div className="flex px-8 py-2 border-b flex-row flex-wrap gap-4 border-r">
				<div className="flex flex-col w-full space-y-2 md:w-auto">
					<Label htmlFor="keyword">Staff Name</Label>
					<Input
						type="keyword"
						id="keyword"
						placeholder=""
						className="border rounded-none w-[400px]"
					/>
				</div>

				<div className="flex flex-col space-y-2">
					<Label>Duration</Label>
					<div className="flex items-center gap-2">
						<Input
							type="date"
							enableEmoji={false}
							className="w-[150px] border rounded-none"
						/>
						<span className="text-gray-500">-</span>
						<Input
							enableEmoji={false}
							type="date"
							className="w-[150px] border rounded-none"
						/>
					</div>
				</div>
			</div>

			<div className="flex justify-end flex-none w-full bg-white">
				<Button className="text-black bg-transparent border md:w-20 link border-r-0 border-t-0 border-b-0 min-h-10">ADD+</Button>
				<Button className="text-black bg-transparent border md:w-20 link border-t-0 border-r border-b-0 min-h-10">EDIT</Button>
			</div>
			<DataTable
				columns={columnsEmployee}
				data={dataEmployee}
				loading={false}
			/>
			<TitleWrapper className="border-b-0">
				<h2>Breakdown</h2>
			</TitleWrapper>
			<DataTable
				columns={columBreakdown}
				data={dataBreakdown}
				loading={false}
			/>
		</div>
	);
}
