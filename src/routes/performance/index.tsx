import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useWorkspaceEmployees } from '@/hooks/useEmployee';
import { usePerformanceSheets, usePerformanceTemplates } from '@/hooks/usePerformance';
import { DataTable } from '@/components/ui/data-table';
import useDebounce from '@/hooks/useDebounce';
import Loading from '@/components/Loading';

interface PerformanceScore {
	id: number;
	name: string;
	score: number;
}

export const Route = createFileRoute('/performance/')({
	component: RouteComponent,
});

function RouteComponent() {
	const [searchQuery, setSearchQuery] = useState('');
	const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
	const debouncedSearch = useDebounce(searchQuery, 500);
	const { employees, loading: employeesLoading } = useWorkspaceEmployees();
	const { templates, loading: templatesLoading } = usePerformanceTemplates();
	const { sheets, loading: sheetsLoading } = usePerformanceSheets({
		startDate: dateRange.startDate,
		endDate: dateRange.endDate,
	});

	const defaultTemplate = templates[0];

	const getScore = (employeeId: number, categoryId: number) => {
		return getPerformanceScore(sheets, employeeId, categoryId);
	};

	const columns: ColumnDef<any>[] = [
		{
			accessorKey: 'profileimage',
			header: '',
			cell: ({ row }) => (
				<div className="flex items-center justify-center h-full">
					<figure className="w-16 h-16 overflow-hidden">
						<img
							className="object-cover w-full h-full"
							src={row.original.profileimage || '/default-avatar.png'}
							alt={`${row.original.name}'s profile`}
						/>
					</figure>
				</div>
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
					to={`/performance/$employeeId`}
					params={{ employeeId: row.original.employeeid }}
					className="text-blue-600 hover:underline">
					{row.original.name}
				</Link>
			),
		},
		{
			accessorKey: 'employeeCategory.categoryname',
			header: 'Employee Category',
			cell: ({ row }) => row.original.employeeCategory?.categoryname || '-',
		},
		...(defaultTemplate?.categories?.map((category) => ({
			accessorKey: `performance_${category.categoryid}`,
			header: category.categoryname,
			cell: ({ row }: any) => {
				const score = getScore(row.original.employeeid, category.categoryid);
				const points = category.points.filter((point) => point.categoryid === category.categoryid);
				points;
				return score ? `${score}%` : 'N/A';
			},
		})) || []),
		{
			id: 'actions',
			header: '',
			cell: ({ row }) => (
				<Link
					to={`/performance/$employeeId`}
					params={{ employeeId: row.original.employeeid }}>
					<Button
						variant="outline"
						className="w-20">
						DETAIL
					</Button>
				</Link>
			),
		},
	];

	if (employeesLoading || templatesLoading || sheetsLoading) {
		return <Loading />;
	}

	return (
		<div className="flex flex-col flex-1 h-full">
			<div className="flex-none min-h-0 px-4 py-2 bg-white border-b border-r">
				<div className="container flex justify-between bg-white md:px-6">
					<h1>Performance</h1>
					<Link to="/performance/setting">Settings</Link>
				</div>
			</div>

			<div className="flex flex-row flex-wrap items-center justify-between w-full px-8 py-4 bg-white border-b border-r md:flex-row">
				<div className="flex flex-row flex-wrap gap-4">
					<div className="flex flex-col w-full space-y-2 md:w-auto">
						<Label htmlFor="keyword">Keyword</Label>
						<Input
							type="text"
							id="keyword"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search employees..."
							className="border rounded-none w-[400px]"
						/>
					</div>
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
			{/* Responsive action buttons */}
			<div className="flex justify-end flex-none w-full bg-white">
				<Button className="text-black bg-transparent border-l border-r md:w-20 link border-r-none min-h-10">ADD+</Button>
				<Button className="text-black bg-transparent border-r md:w-20 link min-h-10">EDIT</Button>
			</div>
			<div className="border-r border-t">
				<DataTable
					columns={columns}
					data={employees || []}
				/>
			</div>
		</div>
	);
}

const getPerformanceScore = (sheets: any[], employeeId: number, categoryId: number) => {
	if (!sheets || sheets.length === 0) return null;

	// Find the sheet for the given employee
	const employeeSheet = sheets.find((sheet) => sheet.employeeid === employeeId);
	if (!employeeSheet || !employeeSheet.scores) return null;

	// Find the score for the given category
	const categoryScore = employeeSheet.scores.find((score: any) => score.categoryid === categoryId);

	return categoryScore ? categoryScore.value : null;
};
