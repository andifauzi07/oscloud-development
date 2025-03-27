import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { TitleWrapper } from '@/components/wrapperElement';
import { AddRecordDialog } from '@/components/AddRecordDialog';
import { DataTable } from '@/components/ui/data-table';
import AdvancedFilterPopover from '@/components/search/advanced-search';
import { useCompanies } from '@/hooks/useCompany';
import useDebounce from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { Company, CreateCompanyRequest, UpdateCompanyRequest, CompanyUpdate } from '@/types/company';
import { useColumnSettings } from '@/hooks/useColumnSettings';
import { defaultCompanyColumnSettings } from '@/config/columnSettings';
import { useSaveEdits } from '@/hooks/handler/useSaveEdit';
import { AppUser } from '@/types/user';

export const Route = createFileRoute('/company/')({
	component: RouteComponent,
});

const defaultCellRenderer = ({ getValue }: CellContext<Company, any>) => {
	const value = getValue();
	if (value === null || value === undefined) {
		return <span className="text-xs whitespace-nowrap">-</span>;
	}
	return <span className="text-xs whitespace-nowrap">{String(value)}</span>;
};

// const field = [
// 	{
// 		key: 'status',
// 		label: 'Status',
// 		type: 'toogle',

// 		options: ['All', 'Active', 'Inactive'],
// 	},
// 	{
// 		key: 'employeeid',
// 		label: 'Employee Id',
// 		type: 'number',
// 	},
// 	{
// 		key: 'email',
// 		label: 'Email',
// 		type: 'email',
// 	},
// 	{
// 		key: 'name',
// 		label: 'Name',
// 		type: 'text',
// 	},
// 	{
// 		key: 'depertment',
// 		label: 'Department',
// 		type: 'text',
// 	},
// ];

function RouteComponent() {
	const [searchKeyword, setSearchKeyword] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('');
	const [manager, setManager] = useState<AppUser[]>([]);
	const [isEditable, setIsEditable] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 10;

	const debouncedSearchKeyword = useDebounce(searchKeyword, 500);

	// Define filters before using it
	const filters = useMemo(
		() => ({
			search: debouncedSearchKeyword || undefined,
			status: statusFilter || undefined,
			page: currentPage,
			limit: pageSize,
		}),
		[debouncedSearchKeyword, statusFilter, currentPage, pageSize]
	);

	// Use filters after it's defined
	const { companies, loading, addCompany, updateCompany, total } = useCompanies(filters);
	const [updateDataFromChild, setUpdateDataFromChild] = useState(companies);

	const handleSaveEdits = useSaveEdits<Company>();

	const { settings } = useColumnSettings<Company>({
		storageKey: 'companyColumnSettings',
		defaultSettings: defaultCompanyColumnSettings,
	});

	// Modified columns setup
	const columns = useMemo<ColumnDef<Company, any>[]>(() => {
		// If settings is empty, use defaultCompanyColumnSettings
		const activeSettings = settings.length > 0 ? settings : defaultCompanyColumnSettings;

		return activeSettings
			.filter((setting) => setting.status === 'Active' || setting.status !== 'Hidden') // Accept both status types
			.sort((a, b) => a.order - b.order)
			.map((setting) => {
				// Find the matching default setting
				const defaultSetting = defaultCompanyColumnSettings.find((def) => def.accessorKey === setting.accessorKey);

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
				};
			});
	}, [settings]);

	const transformedCompanies = useMemo(() => {
		if (!companies || !Array.isArray(companies)) return [];

		return companies.map((company) => ({
			companyid: company.companyid,
			name: company.name,
			logo: company.logo,
			email: company.email,
			city: company.city,
			product: company.product,
			status: company.status,
			category_group: company.category_group,
			created_at: company.created_at,
			managerid: company.manager?.name,
			workspaceid: company.workspaceid,
			personnel: company.personnel || [],
			activeLeads: company.activeLeads || 0,
			totalContractValue: company.totalContractValue || 0,
			detail: company.detail || {},
		}));
	}, [companies]);

	// Local filtering if needed
	const filteredCompanies = useMemo(() => {
		return transformedCompanies.filter((company) => {
			// Filter by status if specified
			if (statusFilter && statusFilter !== 'All' && company.status !== 'Active') {
				return false;
			}

			// Filter by search keyword
			if (debouncedSearchKeyword) {
				const searchLower = debouncedSearchKeyword.toLowerCase();
				return (
					(company.name?.toLowerCase() || '').includes(searchLower) ||
					(company.email?.toLowerCase() || '').includes(searchLower) ||
					(company.city?.toLowerCase() || '').includes(searchLower) ||
					(company.product?.toLowerCase() || '').includes(searchLower) ||
					(company.category_group?.toLowerCase() || '').includes(searchLower)
				);
			}

			return true;
		});
	}, [transformedCompanies, statusFilter, debouncedSearchKeyword]);

	// Update local data when filtered companies change
	useEffect(() => {
		setUpdateDataFromChild(filteredCompanies);
	}, [filteredCompanies]);

	const handleAddRecord = useCallback(
		async (data: Partial<Company>) => {
			try {
				if (!data.name) {
					throw new Error('Company name is required');
				}

				const newCompanyRequest: CreateCompanyRequest = {
					name: data.name,
					logo: data.logo || '',
					city: data.city || '',
					product: data.product || '',
					email: data.email || '',
					categoryGroup: data.category_group || '',
					managerid: data.managerid || '',
					personnel: [],
				};

				await addCompany(newCompanyRequest);
			} catch (error) {
				console.error('Failed to add record:', error);
				throw error;
			}
			console.log('INI DATA YANG DIKIRIM : ', data);
		},
		[addCompany]
	);

	const editButton = useCallback(() => {
		return (
			<>
				{isEditable ? (
					<Button
						onClick={() => {
							setIsEditable((prev) => !prev);
						}}
						className="text-black bg-transparent border-l md:w-20 link border-l-none min-h-10">
						CANCEL
					</Button>
				) : (
					<AddRecordDialog
						columns={columns}
						onSave={handleAddRecord}
						nonEditableColumns={['logo', 'companyid', 'actions', 'personnel', 'created_at*', 'detail', 'activeLeads', 'totalContractValue']}
						selectFields={{
							category_group: {
								options: [
									{ value: 'tech', label: 'Technology' },
									{ value: 'finance', label: 'Finance' },
								],
							},
							managerid: {
								options: manager?.map((m) => ({ value: m.id, label: m.name })),
							},
						}}
					/>
				)}

				{isEditable ? (
					<Button
						onClick={async () => {
							const result = await handleSaveEdits(filteredCompanies, updateDataFromChild, 'companyid', ['name', 'email', 'city', 'product', 'category_group', 'managerid', 'status'], async (id: number, data: Partial<Company>) => {
								const transformedData = {
									name: data.name || undefined,
									email: data.email || undefined,
									city: data.city || undefined,
									product: data.product || undefined,
									categoryGroup: data.category_group || undefined,
									managerid: data.managerid || undefined,
									logo: data.logo || undefined,
									status: data.status || undefined,
								};
								await updateCompany(id, transformedData);
							});
							console.log(result);
							setIsEditable(false);
						}}
						className="text-black bg-transparent border-l border-r md:w-20 link border-l-none min-h-10">
						SAVE
					</Button>
				) : (
					<Button
						onClick={() => setIsEditable((prev) => !prev)}
						className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
						EDIT
					</Button>
				)}
			</>
		);
	}, [isEditable, filteredCompanies, updateDataFromChild, updateCompany]);

	const handleStatusChange = useCallback((newStatus: string) => {
		setStatusFilter(newStatus);
	}, []);

	const handlePageChange = useCallback((page: number) => {
		setCurrentPage(page);
	}, []);

	console.log('INI data dari companies: ', filteredCompanies);

	return (
		<div className="flex flex-col flex-1 h-full">
			<TitleWrapper>
				<h1 className="text-base">Company </h1>
				<Link
					className="text-xs"
					to="/company/setting">
					Settings
				</Link>
			</TitleWrapper>
			<div className="flex flex-row flex-wrap items-center justify-between w-full px-8 py-4 bg-white border-b border-r md:flex-row">
				<div className="flex gap-8">
					<div className="flex flex-col space-y-2 bg-white md:w-auto">
						<Label htmlFor="keyword">Keyword</Label>
						<Input
							type="keyword"
							id="keyword"
							placeholder=""
							className="border rounded-none w-[400px]"
							value={searchKeyword}
							onChange={(e) => setSearchKeyword(e.target.value)}
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
				</div>

				{/* <div className="flex flex-col items-end space-y-2">
					<Label>‎</Label>
					<div className="flex items-center gap-4">
						<AdvancedFilterPopover fields={field} />
					</div>
				</div> */}
			</div>

			<div className="flex justify-end flex-none bg-white">{editButton()}</div>
			<div className="flex-1 overflow-auto">
				<div className="max-w-full overflow-x-auto">
					<DataTable
						columns={columns}
						data={filteredCompanies}
						loading={loading}
						isEditable={isEditable}
						nonEditableColumns={['logo', 'companyid', 'actions', 'personnel', 'activeLeads', 'totalContractValue', 'created_at*', 'detail*']}
						total={total}
						currentPage={currentPage}
						onPageChange={handlePageChange}
						pageSize={pageSize}
						setTableData={(updateFunctionOrData) => {
							if (typeof updateFunctionOrData === 'function') {
								const newData = updateFunctionOrData(updateDataFromChild);
								setUpdateDataFromChild(newData);
							} else {
								setUpdateDataFromChild(updateFunctionOrData);
							}
						}}
						selectFields={{
							managerid: {
								options: manager?.map((m) => ({ value: m.id.toString(), label: m.name })),
							},
							category_group: {
								options: [
									{ value: 'tech', label: 'Technology' },
									{ value: 'finance', label: 'Finance' },
								],
							},
							status: {
								options: [
									{ value: 'Active', label: 'Active' },
									{ value: 'Inactive', label: 'Inactive' },
									{ value: 'Blocked', label: 'Blocked' },
								],
							},
						}}
					/>
				</div>
			</div>
		</div>
	);
}
