import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { revertUrlString } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';

export const Route = createFileRoute('/payroll/$employeeId/$paymentId/')({
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
				to="/projects"
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

function RouteComponent() {
	const { employeeId, paymentId } = Route.useParams();

	return (
		<div className="flex flex-col border-r">
			<div className="bg-white border-b">
				<h2 className="container px-4 py-3 ">{revertUrlString(employeeId)}</h2>
			</div>
			<div className="bg-white">
				<h2 className="container px-4 py-3 ">{revertUrlString(paymentId)}</h2>
			</div>
			<div className="border-t border-b">
				<DataTable
					columns={columnsEmployee}
					data={dataEmployee}
				/>
			</div>
			<div className="flex w-full px-6 py-4 bg-white">
				<h2 className="text-xl">Breakdown</h2>
			</div>
			<div className="border-t border-b">
				<DataTable
					columns={columBreakdown}
					data={dataBreakdown}
				/>
			</div>
		</div>
	);
}
