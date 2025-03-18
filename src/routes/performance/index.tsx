import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TitleWrapper } from '@/components/wrapperElement';
import useDebounce from '@/hooks/useDebounce';
import { useWorkspaceEmployees } from '@/hooks/useEmployee';
import {
	useEmployeePerformance,
	usePerformanceSheets,
	usePerformanceTemplate,
	usePerformanceTemplates,
} from '@/hooks/usePerformance';
import { useUserData } from '@/hooks/useUserData';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { AddRecordDialog } from '@/components/AddRecordDialog';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

export const Route = createFileRoute('/performance/')({
	component: RouteComponent,
});

function RouteComponent() {
	const [editable, setEditable] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
	const debouncedSearch = useDebounce(searchQuery, 500);
	const { employees, loading: employeesLoading } = useWorkspaceEmployees();
	const { templates, loading: templatesLoading } = usePerformanceTemplates();
	const [selectedItems, setSelectedItems] = useState<number | undefined>(undefined);
	const { template, categories, getTotalWeight, loading } = usePerformanceTemplate(selectedItems!);
	const { sheets, loading: sheetsLoading, error } = usePerformanceSheets();

	const { currentUser } = useUserData();
	const workspaceid = currentUser?.workspaceid;

	const defaultTemplate = selectedItems !== undefined ? templates.find((temp) => temp.templateid === selectedItems) : templates[0];

	const { performanceData, loading: employeePerformanceLoading } = useEmployeePerformance({
		workspaceId: Number(workspaceid),
		// templateId: selectedItems,
		// Pass employeeId if you want to fetch data for a specific employee
		// employeeId: someEmployeeId,
	});

	const filteredEmployees = useMemo(() => {
		if (!Array.isArray(employees)) return [];

		const startDateObj = dateRange.startDate ? new Date(dateRange.startDate) : null;
		const endDateObj = dateRange.endDate ? new Date(dateRange.endDate) : null;

		return employees.filter((employee: any) => {
			const matchesSearch = employee.name.toLowerCase().includes(debouncedSearch.toLowerCase());

			// Get record performance for this employee
			const records = Array.isArray(performanceData)
				? performanceData?.filter((record: any) => record.employeeid === employee.employeeid)
				: [];

			// If no date range is selected, display employees that match the search criteria.
			if (!startDateObj && !endDateObj) {
				return matchesSearch;
			}

			// Filter records based on the date range.
			const filteredRecords = records.filter((record: any) => {
				if (!record.completeDate) return false;
				const recordDate = new Date(record.completedDate);
				if (startDateObj && endDateObj) {
					return recordDate >= startDateObj && recordDate <= endDateObj;
				}
				if (startDateObj && !endDateObj) {
					return recordDate >= startDateObj;
				}
				if (!startDateObj && endDateObj) {
					return recordDate <= endDateObj;
				}
				return true;
			});

			// Display employees if they match the search criteria and have at least one valid record.
			return matchesSearch && filteredRecords.length > 0;
		});
	}, [employees, debouncedSearch, performanceData, dateRange]);

	const columns = useMemo(() => {
		// Basic columns for employee data.
		const baseColumns = [
			{
				accessorKey: 'profileimage',
				header: '',
				cell: ({ row }: any) => (
					<img
						className="object-cover w-10 h-10"
						src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop"
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
				cell: ({ row }: any) => (
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
				cell: ({ row }: any) => row.original.employeeCategory?.categoryname || '-',
			},
		];

		// Dynamic columns based on the selected template.
		let dynamicColumns: any[] = [];
		if (defaultTemplate && defaultTemplate.categories) {
			dynamicColumns = defaultTemplate.categories.flatMap((category: any) => {
				// Individual score columns for each point within the category.
				const pointColumns = category.points.map((point: any) => ({
					accessorKey: `performance_${category.categoryid}_${point.pointid}`,
					header: point.pointname,
					cell: ({ row }: any) => {
						const employee = row.original;
						if (Array.isArray(performanceData)) {
							const record = performanceData.find(
								(r: any) =>
									r.employeeid === employee.employeeid &&
									r.categoryid === category.categoryid &&
									r.pointid === point.pointid
							);
							return record ? record.score : '-';
						}
						return '-';
					},
				}));

				// Total score column for each category.
				const categoryTotalColumn = {
					id: `category_total_${category.categoryid}`,
					header: `Total ${category.categoryname}`,
					cell: ({ row }: any) => {
						const employee = row.original;
						if (Array.isArray(performanceData)) {
							const categoryRecords = performanceData.filter(
								(r: any) =>
									r.employeeid === employee.employeeid &&
									r.categoryid === category.categoryid
							);
							const total = categoryRecords.reduce(
								(acc: number, rec: any) => acc + (rec.score || 0),
								0
							);
							return total;
						}
						return '-';
					},
				};

				return [...pointColumns, categoryTotalColumn];
			});
		}

		// Total overall score column for each employee.
		const totalScoreColumn = {
			id: 'grand_total',
			header: 'Total Score',
			cell: ({ row }: any) => {
				const employee = row.original;
				if (Array.isArray(performanceData)) {
					const employeeRecords = performanceData.filter((r: any) => r.employeeid === employee.employeeid);
					const grandTotal = employeeRecords.reduce(
						(acc: number, rec: any) => acc + (rec.score || 0),
						0
					);
					return grandTotal;
				}
				return '-';
			},
		};

		return [...baseColumns, ...dynamicColumns, totalScoreColumn];
	}, [defaultTemplate, performanceData]);

	const handleAddRecord = async (data: any) => {
		try {
			// Make an API call to add a new record.
			console.log('Adding new record:', data);
		} catch (error) {
			console.error('Failed to add record:', error);
		}
	};

	const handleSaveEdits = useCallback(async (updatedData: any[]) => {
		try {
			console.log('Saving updates:', updatedData);
			setEditable(false);
		} catch (error) {
			console.error('Failed to save updates:', error);
		}
	}, []);

	const table = useReactTable({
		data: filteredEmployees || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const handleSelectTemplate = (value: string) => {
		setSelectedItems(Number(value));
	};

	return (
		<div className="flex flex-col flex-1 h-full">
			<TitleWrapper>
				<h1>Performance</h1>
				<Link className="text-xs" to="/performance/setting">
					Settings
				</Link>
			</TitleWrapper>

			<div className="flex flex-row flex-wrap items-center w-full gap-8 px-8 py-4 bg-white border-b border-r md:flex-row">
				<div className="flex flex-row flex-wrap gap-4">
					<div className="flex flex-col w-full space-y-2 md:w-auto">
						<Label htmlFor="keyword">Keyword</Label>
						<Input
							type="text"
							id="keyword"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search employees..."
							className="border rounded-none w-[250px]"
						/>
					</div>
				</div>

				<div className="flex flex-col space-y-2">
					<Label>Duration</Label>
					<div className="flex items-center gap-2">
						<Input
							type="date"
							value={dateRange.startDate}
							onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
							className="w-[150px] border rounded-none"
							enableEmoji={false}
						/>
						<span className="text-gray-500">-</span>
						<Input
							type="date"
							value={dateRange.endDate}
							onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
							className="w-[150px] border rounded-none"
							enableEmoji={false}
						/>
					</div>
				</div>
				<div className="flex flex-row space-y-2">
					<div className="flex flex-col w-full space-y-2">
						<Label className="text-sm font-semibold">Template</Label>
						<Select defaultValue={defaultTemplate?.templateid.toString()} onValueChange={handleSelectTemplate}>
							<SelectTrigger className="w-[180px] h-8">
								<SelectValue placeholder="Select a template" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Templates</SelectLabel>
									{templates.map((template) => (
										<SelectItem value={template.templateid.toString()} key={template.templateid}>
											{template.templatename}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>
			<div className="flex justify-end flex-none w-full bg-white">
				<AddRecordDialog
					columns={columns}
					onSave={handleAddRecord}
					nonEditableColumns={['performance*', 'employeeid*']}
				/>
				<Button
					onClick={() => setEditable((prev) => !prev)}
					className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
					EDIT
				</Button>
			</div>
			<DataTable
				isEditable={editable}
				columns={columns}
				loading={employeesLoading || templatesLoading || employeePerformanceLoading}
				data={filteredEmployees}
				nonEditableColumns={['performance*', 'profileimage', 'actions', 'employeeid']}
				onSave={handleSaveEdits}
			/>
		</div>
	);
}

export default RouteComponent;
