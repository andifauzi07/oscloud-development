import { createFileRoute, Link } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AdvancedFilterPopover from '@/components/search/advanced-search';
import { TitleWrapper } from '@/components/wrapperElement';
import { useCallback, useState, useMemo, useEffect } from 'react';
import { AddRecordDialog } from '@/components/AddRecordDialog';
import { useProjects } from '@/hooks/useProject';
import { Project, type Costs } from '@/store/slices/projectSlice';
import { ColumnDef } from '@tanstack/react-table';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import useDebounce from '@/hooks/useDebounce';
import ScheduleTable from '@/components/ScheduleTimeLine';

export const Route = createFileRoute('/projects/')({
	component: RouteComponent,
});

function RouteComponent() {
	const [editable, setEditable] = useState(false);
	const [filters, setFilters] = useState({
		startDate: '',
		endDate: '',
		status: '',
		keyword: '',
	});
	const debouncedKeyword = useDebounce(filters.keyword, 500);

	// Memoize filters for useProjects hook to prevent infinite updates
	const projectFilters = useMemo(
		() => ({
			startDate: filters.startDate || undefined,
			endDate: filters.endDate || undefined,
			status: filters.status === '' ? undefined : filters.status,
			search: debouncedKeyword || undefined,
		}),
		[filters.startDate, filters.endDate, filters.status, debouncedKeyword]
	);

	const { projects, loading, addProject } = useProjects(projectFilters);

	// Debounce filter changes
	const handleFilterChange = useCallback((key: string, value: string) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	}, []);

	//handle status change
	const handleStatusChange = useCallback((newStatus: string) => {
		setFilters((prevFilters) => {
			return {
				...prevFilters,
				status: newStatus,
			};
		});
	}, []);

	const handleAddRecord = async (data: any) => {
		try {
			await addProject({
				...data,
				assignedStaff: [],
				status: 'In Progress',
				city: 'New York',
				product: 'Marketing Automation',
			});
		} catch (error) {
			console.error('Failed to add record:', error);
		}
	};

	const handleSaveEdits = useCallback(async (updatedData: any[]) => {
		try {
			// TODO: Implement batch update when available in API
			console.log('Saving updates:', updatedData);
			setEditable(false);
		} catch (error) {
			console.error('Failed to save updates:', error);
		}
	}, []);

	const projectsColumns: ColumnDef<Project>[] = useMemo(
		() => [
			{
				header: () => <h1 className="pl-8">Project Name</h1>,
				accessorKey: 'name',
				cell: ({ row }) => <h1 className="pl-8">{row.original.name}</h1>,
			},
			{
				header: 'Manager',
				accessorKey: 'manager.name',
			},
			{
				header: 'Starting',
				accessorKey: 'startDate',
				cell: ({ row }) => (row.original.startDate ? new Date(row.original.startDate).toLocaleDateString() : row.original.startDate ? new Date(row.original.startDate).toLocaleDateString() : 'N/A'),
			},
			{
				header: 'End',
				accessorKey: 'endDate',
				cell: ({ row }) => (row.original.endDate ? new Date(row.original.endDate).toLocaleDateString() : row.original.endDate ? new Date(row.original.endDate).toLocaleDateString() : 'N/A'),
			},
			{
				header: 'Client Name',
				accessorKey: 'company.name',
			},
			{
				header: 'Category',
				accessorKey: 'categoryGroup', // Assuming you have this field in your Project type
			},
			{
				header: 'Members',
				accessorKey: 'assignedStaff',
				cell: ({ row }) => {
					const personnelCount = Array.isArray(row.original.assignedStaff) ? row.original.assignedStaff.length : 0;
					return (
						<div className="flex items-center gap-2 text-xs whitespace-nowrap">
							<span>{personnelCount}</span>
						</div>
					);
				},
			},
			{
				header: 'Break Cost',
				accessorKey: 'costs.break',
				cell: ({ row }) => {
					const cost = row.original.costs?.break || 0;
					return `${cost}$`;
				},
			},
			{
				header: 'Food Cost',
				accessorKey: 'costs.food',
				cell: ({ row }) => {
					const cost = row.original.costs?.food || 0;
					return `${cost}$`;
				},
			},
			{
				header: 'Rental Cost',
				accessorKey: 'costs.rental',
				cell: ({ row }) => {
					const cost = row.original.costs?.rental || 0;
					return `${cost}$`;
				},
			},
			{
				header: 'Other Cost',
				accessorKey: 'costs.other_cost',
				cell: ({ row }) => {
					const cost = row.original.costs?.other_cost || 0;
					return `${cost}$`;
				},
			},
			{
				header: '',
				accessorKey: 'projectId',
				cell: ({ row }) => {
					return (
						<div className="w-full flex justify-end">
							<Button
								variant="outline"
								className="border-r-0 border-t-0 border-b-0">
								<Link
									to={`/projects/$projectId`}
									params={{
										projectId: row.original.projectId.toString(),
									}}>
									View
								</Link>
							</Button>
						</div>
					);
				},
			},
		],
		[]
	);

	return (
		<div className="">
			<TitleWrapper>
				<h2 className="text-base">Project List</h2>
				<Link
					to="/projects/setting"
					className="text-xs">
					Settings
				</Link>
			</TitleWrapper>

			<Tabs defaultValue="list">
				<TabsList className="justify-start w-full gap-8 bg-white border-b border-r [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 pl-5">
					<TabsTrigger
						value="list"
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2">
						List View
					</TabsTrigger>
					<TabsTrigger
						value="timeline"
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2">
						Timeline
					</TabsTrigger>
				</TabsList>

				<div className="flex justify-end flex-none w-full bg-white">
					<AddRecordDialog
						columns={projectsColumns}
						onSave={handleAddRecord}
						nonEditableColumns={['projectId*', 'id*', 'financials*', 'assignedStaff*', 'costs*']}
					/>
					<Button
						onClick={() => setEditable((prev) => !prev)}
						className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
						EDIT+
					</Button>
				</div>

				<TabsContent
					className="m-0"
					value="list">
					<div className="flex flex-row flex-wrap items-center justify-between w-full p-8 pt-4 bg-white border-t border-r md:flex-row">
						<div className="flex flex-col space-y-2 bg-white">
							<Label htmlFor="keyword">Keyword</Label>
							<Input
								type="keyword"
								id="keyword"
								value={filters.keyword}
								onChange={(e) => handleFilterChange('keyword', e.target.value)}
								className="border rounded-none w-[250px]"
							/>
						</div>

						<div className="flex flex-col space-y-2">
							<Label>Duration</Label>
							<div className="flex items-center gap-2">
								<Input
									type="date"
									value={filters.startDate}
									onChange={(e) => handleFilterChange('startDate', e.target.value)}
									className="w-[150px] border rounded-none"
									enableEmoji={false}
								/>
								<span className="text-gray-500">-</span>
								<Input
									enableEmoji={false}
									type="date"
									value={filters.endDate}
									onChange={(e) => handleFilterChange('endDate', e.target.value)}
									className="w-[150px] border rounded-none"
								/>
							</div>
						</div>

						<div className="flex flex-col space-y-2">
							<Label>Status</Label>
							<div className="flex">
								<Button
									size="default"
									variant="outline"
									className={cn('w-20 rounded-none', filters.status == 'Active' && 'bg-black text-white')}
									onClick={() => handleStatusChange('Active')}>
									Active
								</Button>
								<Button
									size="default"
									variant="outline"
									className={cn('w-20 rounded-none', filters.status == '' && 'bg-black text-white')}
									onClick={() => handleStatusChange('')}>
									All
								</Button>
							</div>
						</div>

						<div className="flex flex-col items-end space-y-2">
							<Label>‎</Label>
							<div className="flex items-center gap-4">
								<AdvancedFilterPopover />
							</div>
						</div>
					</div>
					<DataTable
						columns={projectsColumns}
						data={projects}
						loading={loading}
						isEditable={editable}
						onSave={handleSaveEdits}
						nonEditableColumns={['projectId*', 'id*', 'financials*', 'assignedStaff*', 'costs*']}
					/>
				</TabsContent>

				<TabsContent
					className="m-0"
					value="timeline">
					<ScheduleTable data={projects} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
