import { CompanyPersonnelLeadsListDataTable } from '@/components/companyPersonnelLeadsListDataTable';
import { EmployeePerformanceCell } from '@/components/EmployeePerformanceCell';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TitleWrapper } from '@/components/wrapperElement';
import useDebounce from '@/hooks/useDebounce';
import { useWorkspaceEmployees } from '@/hooks/useEmployee';
import { getCategoryScore, useEmployeePerformance, usePerformanceSheets, usePerformanceTemplates } from '@/hooks/usePerformance';
import { useUserData } from '@/hooks/useUserData';
import { fetchEmployeePerformance } from '@/store/slices/performanceSlice';
import { AppDispatch, RootState } from '@/store/store';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddRecordDialog } from '@/components/AddRecordDialog';

import { useReactTable, getCoreRowModel } from '@tanstack/react-table';

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
	// const { sheets, loading: sheetsLoading } = usePerformanceSheets({
	// 	startDate: dateRange.startDate,
	// 	endDate: dateRange.endDate,
	// });

	const { workspaceid } = useUserData();

	const defaultTemplate = templates[0];
	const { performanceData, loading: employeePerformanceLoading } = useEmployeePerformance({
		workspaceId: Number(workspaceid),
		// templateId: defaultTemplate?.templateid,
		// Pass employeeId if you want to fetch data for a specific employee
		// employeeId: someEmployeeId,
	});

	const filteredEmployees = employees?.filter((employee: any) => employee.name.toLowerCase().includes(debouncedSearch.toLowerCase()));

	const columns: ColumnDef<any>[] = useMemo(
		() => [
			{
				accessorKey: 'profileimage',
				header: '',
				cell: ({ row }: any) => (
					<img
						className="object-cover w-10 h-10"
						src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
			...(defaultTemplate?.categories?.map((category: any) => ({
				accessorKey: `performance_${category.categoryid}`,
				header: category.categoryname,
				cell: (
					{ row }: any // Add parentheses to return the component
				) => (
					<EmployeePerformanceCell
						workspaceId={Number(workspaceid)}
						employeeId={row.original.employeeid}
						templateId={defaultTemplate.templateid}
						categoryId={category.categoryid}
					/>
				),
			})) || []),
			{
				id: 'actions',
				header: '',
				cell: ({ row }: any) => (
					<div className="w-full flex justify-end">
						<Link
							to={`/performance/$employeeId`}
							params={{ employeeId: row.original.employeeid }}>
							<Button
								variant="outline"
								className="w-20 border-t-0 border-b-0 border-r-0">
								DETAIL
							</Button>
						</Link>
					</div>
				),
			},
		],
		[workspaceid, defaultTemplate]
	);

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

	const table = useReactTable({
		data: filteredEmployees || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	// if (employeesLoading || templatesLoading || employeePerformanceLoading) {
	//     return <Loading />;
	// }

	// if (!employees?.length || !templates?.length) {
	//     return <div>No data available</div>;
	// }

	return (
		<div className="flex flex-col flex-1 h-full">
			<TitleWrapper>
				<h1>Performance</h1>
				<Link
					className="text-xs"
					to="/performance/setting">
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
							className="border rounded-none w-[400px]"
						/>
					</div>
				</div>

				<div className="flex flex-col space-y-2">
					<Label>Duration</Label>
					<div className="flex items-center gap-2">
						<Input
							type="date"
							value={dateRange.startDate}
							onChange={(e) =>
								setDateRange({
									...dateRange,
									startDate: e.target.value,
								})
							}
							className="w-[150px] border rounded-none"
							enableEmoji={false}
						/>
						<span className="text-gray-500">-</span>
						<Input
							type="date"
							value={dateRange.endDate}
							onChange={(e) =>
								setDateRange({
									...dateRange,
									endDate: e.target.value,
								})
							}
							className="w-[150px] border rounded-none"
							enableEmoji={false}
						/>
					</div>
				</div>
			</div>
			{/* Responsive action buttons */}
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
