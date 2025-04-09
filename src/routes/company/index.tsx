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
import { Company, CreateCompanyRequest, CompanyUpdate } from '@/types/company';
import { useColumnSettings } from '@/hooks/useColumnSettings';
import { defaultCompanyColumnSettings } from '@/config/columnSettings';
import { useSaveEdits } from '@/hooks/handler/useSaveEdit';
import { AppUser } from '@/types/user';
import { useManagers } from '@/hooks/useManager';
import { toast } from '@/hooks/use-toast';
import { set } from 'date-fns';

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
// 		label: 'manager',
// 		type: 'text',
// 	},
// ];

function RouteComponent() {
	const [searchKeyword, setSearchKeyword] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('');
	// const [manager, setManager] = useState<AppUser[]>([]);
	const [isEditable, setIsEditable] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const { manager: companyManager, loading: companyManagerLoading, error } = useManagers();
	const [companyManagerOptions, setCompanyManagerOptions] = useState<Array<{ value: string; label: string }>>([]);
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
	const [updateDataFromChild, setUpdateDataFromChild] = useState<Company[]>([]);

	// const handleSaveEdits = useSaveEdits<any>();

	const { settings } = useColumnSettings<Company>({
		storageKey: 'companyColumnSettings',
		defaultSettings: defaultCompanyColumnSettings,
	});

	useEffect(() => {
		if (companyManager) {
			const options = companyManager.map((manager) => ({
				value: manager.userid,
				label: manager.name,
			}));
			setCompanyManagerOptions(options);
		}
	}, [companyManager]);

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
					type: defaultSetting?.type || setting.type,
				};
			});
	}, [settings]);

	// const transformedCompanies = useMemo(() => {
	// 	if (!companies || !Array.isArray(companies)) return [];

	// 	return companies.map((company) => ({
	// 		companyid: company.companyid,
	// 		name: company.name,
	// 		logo: company.logo,
	// 		email: company.email,
	// 		city: company.city,
	// 		product: company.product,
	// 		status: company.status,
	// 		categoryGroup: company.category_group,
	// 		created_at: company.created_at,
	// 		manager: company.manager,
	// 		workspaceid: company.workspaceid,
	// 		personnel: company.personnel || [],
	// 		activeLeads: company.activeLeads || 0,
	// 		totalContractValue: company.totalContractValue || 0,
	// 	}));
	// }, [companies]);

	// Local filtering if needed
	const filteredCompanies = useMemo(() => {
		return companies.filter((company) => {
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
	}, [companies, statusFilter, debouncedSearchKeyword]);

	// Update local data when filtered companies change
	useEffect(() => {
		setUpdateDataFromChild(companies);
	}, [filteredCompanies]);

	const handleAddRecord = useCallback(
		async (data: Partial<CompanyUpdate>) => {
			try {
				if (!data.name) {
					throw new Error('Company name is required');
				}

				const newCompanyRequest: any = {
					name: data.name,
					logo: data.logo || '',
					city: data.city || '',
					product: data.product || '',
					email: data.email || '',
					categoryGroup: data.category_group || '',
					managerId: data.manager || '',
					status: data.status,
					personnel: [],
				};
				const result = await addCompany(newCompanyRequest);
				console.log('adding data company: ', result);
			} catch (error) {
				console.error('Failed to add record:', error);
				throw error;
			}
			console.log('INI DATA YANG DIKIRIM : ', data);
		},
		[addCompany]
	);

	const handelEdit = useCallback(async () => {
		const updateData = updateDataFromChild.find((updatedItem) => {
			const originalItem = filteredCompanies?.find((company) => company.companyid === updatedItem.companyid);

			if (!originalItem) return false;

			// Bandingkan field satu per satu
			return (Object.keys(updatedItem) as (keyof typeof updatedItem)[]).some((key) => {
				return updatedItem[key] !== originalItem[key];
			});
		});

		if (!updateData) {
			toast({
				title: 'No changes detected',
				description: 'Please make some changes before saving.',
				variant: 'destructive',
			});
			setIsEditable(false);
			setUpdateDataFromChild([]);
			return;
		}

		const { manager, ...rest } = updateData as Company;

		const transformedData = {
			managerId: updateData?.manager || null || undefined,
			...rest,
		};

		try {
			await updateCompany(updateData.companyid, transformedData as CompanyUpdate);
			toast({
				title: 'Success!',
				description: 'Data Updated !',
			});
		} catch (error) {
			console.error('Failed to edit record:', error);
			toast({
				title: 'Failed!',
				description: 'No data Updated.',
				variant: 'destructive',
			});
		} finally {
			setIsEditable(false);
			setUpdateDataFromChild([]);
		}
	}, [companies, updateDataFromChild]);

	const editButton = useCallback(() => {
		return (
			<>
				{isEditable ? (
					<Button
						onClick={() => {
							setIsEditable((prev) => !prev);
							setUpdateDataFromChild([]);
						}}
						className="text-black bg-transparent border-l md:w-20 link border-l-none min-h-10">
						CANCEL
					</Button>
				) : (
					<AddRecordDialog
						columns={columns}
						onSave={handleAddRecord}
						nonEditableColumns={['logo', 'companyid', 'actions', 'personnel', 'created_at', 'detail', 'activeLeads', 'totalContractValue']}
						selectFields={{
							categoryGroup: {
								options: [
									{ value: 'tech', label: 'Technology' },
									{ value: 'finance', label: 'Finance' },
								],
							},
							manager: {
								options: companyManagerOptions?.map((m) => ({ value: m.value, label: m.label })),
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
				)}

				{isEditable ? (
					<Button
						onClick={handelEdit}
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
	}, [isEditable, filteredCompanies, updateDataFromChild]);

	const handleStatusChange = useCallback((newStatus: string) => {
		setStatusFilter(newStatus);
	}, []);

	const handlePageChange = useCallback((page: number) => {
		setCurrentPage(page);
	}, []);

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
						// setTableData={(updateFunctionOrData) => {
						// 	if (typeof updateFunctionOrData === 'function') {
						// 		const newData = updateFunctionOrData(updateDataFromChild);
						// 		setUpdateDataFromChild(newData);
						// 	} else {
						// 		setUpdateDataFromChild(updateFunctionOrData);
						// 	}
						// }}
						setTableData={(updateFunctionOrData) => {
							const evaluatedData = typeof updateFunctionOrData === 'function' ? updateFunctionOrData([...companies]) : updateFunctionOrData;
							setUpdateDataFromChild(evaluatedData);
						}}
						selectFields={{
							manager: {
								options: companyManagerOptions,
							},
							categoryGroup: {
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
