import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AdvancedFilterPopover from '@/components/search/advanced-search';
import { useEmployeeCategories, useWorkspaceEmployees } from '@/hooks/useEmployee';
import { DataTable } from '../../components/ui/data-table';
import { TitleWrapper } from '@/components/wrapperElement';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { AddRecordDialog } from '@/components/AddRecordDialog';
import { ColumnDef } from '@tanstack/react-table';
import { useDepartments } from '@/hooks/useDepartment';
import { Department } from '@/types/departments';
import { Employee } from '@/types/employee';
import { useSaveEdits } from '@/hooks/handler/useSaveEdit';
import useDebounce from '@/hooks/useDebounce';
import { defaultEmployeeColumnSettings } from '@/config/columnSettings';
import { useColumnSettings } from '@/hooks/useColumnSettings';
import { useFilter } from '@/hooks/useFilter';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const field = [
	{
		key: 'id',
		label: 'ID',
		type: 'number',
	},
	{
		key: 'name',
		label: 'フルネーム',
		type: 'text',
	},
	{
		key: 'employeeCategory',
		label: 'カテゴリー',
		type: 'text',
	},
	{
		key: 'email',
		label: 'メアド',
		type: 'email',
	},
	{
		key: 'depertment',
		label: '部署',
		type: 'text',
	},
];

export const Route = createFileRoute('/employee/')({
	component: RouteComponent,
});

interface Props {
	employees: Employee[];
	setEditable: (value: boolean) => void;
	updateEmployeeData: (id: number, data: Partial<Employee>) => Promise<void>;
}

function RouteComponent() {
	const { categories } = useEmployeeCategories();
	const { departments, loading: loadingDepartments } = useDepartments();
	const [editable, setEditable] = useState(false);
	const [employeeCategoryOptions, setEmployeeCategoryOptions] = useState<Array<{ value: string; label: string }>>([]);
	const [departmentOptions, setDepartmentOptions] = useState<Array<{ value: string; label: string }>>([]);
	const [statusOptions, setStatusOptions] = useState<Array<{ value: string; label: string }>>([
		{ value: 'Active', label: 'Active' },
		{ value: 'Inactive', label: 'Inactive' },
	]);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const { settings, saveSettings, reorderColumns } = useColumnSettings<Employee>({
		storageKey: 'EmployeeColumnSetting',
		defaultSettings: defaultEmployeeColumnSettings,
	});
	const { filter: storeFilter } = useFilter();
	const debounceSearchTerms = useDebounce(searchQuery, 500);
	const [statusFilter, setStatusFilter] = useState<string>('');
	// const debounceStatusFilter = useDebounce(statusFilter, 500);
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 10;
	const filters = useMemo(
		() => ({
			// search: debounceSearchTerms || '',
			status: statusFilter ? 'Active' : '',
			page: currentPage,
			limit: pageSize,
		}),
		[statusFilter, currentPage, pageSize, debounceSearchTerms]
	);
	const { employees, loading, addEmployee, updateEmployeeData, total } = useWorkspaceEmployees(filters);
	const [updateDataFromChild, setUpdateDataFromChild] = useState(employees);

	const columns = useMemo<ColumnDef<Employee, any>[]>(() => {
		// If settings is empty, use defaultEmployeeColumnSettings
		const activeSettings = settings.length > 0 ? settings : defaultEmployeeColumnSettings;

		return activeSettings
			.filter((setting) => setting.status === 'Active' || setting.status !== 'Hidden')
			.sort((a, b) => a.order - b.order)
			.map((setting) => {
				// Find the matching default setting
				const defaultSetting = defaultEmployeeColumnSettings.find((def) => def.accessorKey === setting.accessorKey);

				return {
					id: String(setting.accessorKey),
					accessorKey: setting.accessorKey as string,
					header: defaultSetting?.header || setting.header || setting.label,
					cell:
						defaultSetting?.cell ||
						setting.cell ||
						(({ row }) => {
							const value = row.getValue(setting.accessorKey as string);
							return value != null ? String(value) : '-';
						}),
					type: defaultSetting?.type || setting.type,
				};
			});
	}, [settings]);

	// Add this debug log to help track the column generation
	// useEffect(() => {
	// 	console.log(
	// 		'Employee Settings after status filter:',
	// 		settings.filter((setting) => setting.status === 'Active' || setting.status !== 'Hidden')
	// 	);
	// }, [settings]);

	const handleSaveEdits = useSaveEdits<Employee>();

	const filteredData = useMemo(() => {
		return employees.filter((employee) => {
			const matchesSearchTerm =
				employee.name.toLowerCase().includes(debounceSearchTerms.toLowerCase()) ||
				employee.employeeCategory?.categoryname.toLowerCase().includes(debounceSearchTerms.toLowerCase()) ||
				employee.email.toLowerCase().includes(debounceSearchTerms.toLowerCase()) ||
				employee.department?.departmentname.toLowerCase().includes(debounceSearchTerms.toLowerCase());

			const matchesAdvancedSearch = Object.entries(storeFilter).every(([key, value]) => {
				const lowerValue = String(value).toLowerCase();

				const lookup: Record<string, boolean> = {
					employeeCategory: employee.employeeCategory?.categoryname?.toLowerCase().includes(lowerValue),
					department: employee.department?.departmentname?.toLowerCase().includes(lowerValue),
					id: employee.employeeid === Number(value),
				};

				return (
					lookup[key] ??
					(key in employee &&
						String(employee[key as keyof Employee])
							?.toLowerCase()
							.includes(lowerValue))
				);
			});

			return matchesSearchTerm && matchesAdvancedSearch;
		});
	}, [employees, debounceSearchTerms, storeFilter]);

	useEffect(() => {
		if (categories) {
			// Corrected Mapping Logic
			const options = categories.map((category) => ({
				value: category.categoryid.toString(),
				label: category.categoryname,
			}));
			setEmployeeCategoryOptions(options);
		}
	}, [categories]);

	useEffect(() => {
		if (departments) {
			const options = departments.map((department: Department) => ({
				value: department.departmentid.toString(),
				label: department.departmentname,
			}));
			setDepartmentOptions(options);
		}
	}, [departments]);

	const handleAddRecord = async (data: any) => {
		try {
			const processedData = {
				name: data.name,
				email: data.email,
				employeeCategoryId: Number(data.employeecategoryid),
				departmentId: Number(data.departmentid),
				status: data.status,
				// No need for role field since we're using metadata
			};

			const result = await addEmployee(processedData);
			toast({
				title: 'Success',
				description: 'Record added successfully',
				duration: 1000,
			});
			return result;
		} catch (error) {
			console.error('Failed to add record:', error);
			toast({
				title: 'Error',
				description: 'Failed to add record',
				duration: 1000,
			});
		}
	};

	const selectFields = {
		employeecategoryid: {
			options: categories?.map((category) => ({ value: category.categoryid.toString(), label: category.categoryname })),
		},
		departmentid: {
			options: departments?.map((department) => ({ value: department.departmentid.toString(), label: department.departmentname })),
		},
		status: {
			options: statusOptions,
		},
	};

	const handleStatusChange = useCallback((newStatus: string) => {
		setStatusFilter(newStatus);
	}, []);

	const handlePageChange = useCallback((page: number) => {
		setCurrentPage(page);
	}, []);

	return (
		<div className="flex flex-col flex-1 h-full">
			<TitleWrapper>
				<h1>Employee List</h1>
				<Link
					className="text-xs"
					to="/employee/setting">
					Settings
				</Link>
			</TitleWrapper>
			<div className="flex flex-row flex-wrap items-center justify-between w-full px-8 py-4 bg-white border-b border-r md:flex-row">
				<div className="flex flex-row flex-wrap gap-4">
					<div className="flex flex-col space-y-2 md:w-auto">
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

					<div className="flex flex-col space-y-2">
						<Label>Status</Label>
						<div className="flex">
							<Button
								size="default"
								variant={'outline'}
								className={cn('w-20 rounded-none', statusFilter === 'Active' && 'bg-black text-white')}
								onClick={() => handleStatusChange('Active')}>
								Active
							</Button>
							<Button
								size="default"
								variant={'outline'}
								className={cn('w-20 rounded-none', statusFilter === '' && 'bg-black text-white')}
								onClick={() => handleStatusChange('')}>
								All
							</Button>
						</div>
					</div>
					<div className="flex flex-col space-y-2">
						<Label>‎</Label>
						<AdvancedFilterPopover fields={field} />
					</div>
				</div>
			</div>
			<div className="flex justify-end flex-none w-full bg-white">
				{editable ? (
					<Button
						onClick={() => setEditable((prev) => !prev)}
						className="text-black bg-transparent border-l md:w-20 link border-l-none min-h-10">
						CANCEL
					</Button>
				) : (
					<AddRecordDialog
						columns={columns}
						onSave={handleAddRecord}
						nonEditableColumns={['employeeid*', 'actions', 'profileimage']}
						selectFields={selectFields}
					/>
				)}

				{editable ? (
					<Button
						onClick={async () => {
							const isSucces = await handleSaveEdits(
								employees, // Initial Data from the hooks and also rendered on the table component
								updateDataFromChild, // State to catch an update from the component child (DataTable)
								'employeeid', // Unique identifier, eg. employeeId, departmentId, catgeoryId etc..
								['name', 'email', 'employeecategoryid', 'departmentid'], // Field that want to compare and track update
								updateEmployeeData // update function from hooks
							);
							if (isSucces) {
								toast({
									title: 'Success',
									description: 'Record updated successfully',
									duration: 1000,
								});
							}
							setEditable(false);
						}}
						className="text-black bg-transparent border-l border-r md:w-20 link border-l-none min-h-10">
						SAVE
					</Button>
				) : (
					<Button
						onClick={() => setEditable((prev) => !prev)}
						className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
						EDIT
					</Button>
				)}
			</div>

			<DataTable
				columns={columns}
				data={filteredData}
				loading={loading}
				isEditable={editable}
				nonEditableColumns={['employeeid*', 'actions', 'profileimage']}
				currentPage={currentPage}
				pageSize={pageSize}
				onPageChange={handlePageChange}
				total={total}
				setTableData={(updateFunctionOrData) => {
					const evaluatedData = typeof updateFunctionOrData === 'function' ? updateFunctionOrData([...employees]) : updateFunctionOrData;
					setUpdateDataFromChild(evaluatedData);
				}}
				selectFields={{
					employeecategoryid: {
						options: employeeCategoryOptions,
					},
					departmentid: {
						options: departmentOptions,
					},
					status: {
						options: statusOptions,
					},
				}}
			/>
		</div>
	);
}
