// src/routes/company/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Users } from 'lucide-react';
import { TitleWrapper } from '@/components/wrapperElement';
import { AddRecordDialog } from '@/components/AddRecordDialog';
import { DataTable } from '@/components/ui/data-table';
import AdvancedFilterPopover from '@/components/search/advanced-search';
import { useCompanies } from '@/hooks/useCompany';
import useDebounce from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { Company, CreateCompanyRequest, CompanyDisplay, UpdateCompanyRequest, CompanyUpdate } from '@/types/company';
import { useColumnSettings } from '@/hooks/useColumnSettings';
import { defaultCompanyColumnSettings } from '@/config/columnSettings';

export const Route = createFileRoute('/company/')({
	component: RouteComponent,
});

const defaultCellRenderer = ({ getValue }: CellContext<CompanyDisplay, any>) => {
	const value = getValue();
	if (value === null || value === undefined) {
		return <span className="text-xs whitespace-nowrap">-</span>;
	}
	return <span className="text-xs whitespace-nowrap">{String(value)}</span>;
};

function RouteComponent() {
	const [searchKeyword, setSearchKeyword] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('');
	const debouncedSearchKeyword = useDebounce(searchKeyword, 500);
	const [isEditable, setIsEditable] = useState(false);
	const filters = useMemo(() => ({ category: '' }), []);
	const { companies, loading, addCompany, updateCompany } = useCompanies(filters); // This is the companies data
	const { settings, saveSettings, reorderColumns } = useColumnSettings<CompanyDisplay>({
		storageKey: 'companyColumnSettings',
		defaultSettings: defaultCompanyColumnSettings,
	});
	const columns = useMemo<ColumnDef<CompanyDisplay, any>[]>(() => {
		return settings
			.filter((setting) => setting.status === 'shown')
			.sort((a, b) => a.order - b.order)
			.map((setting) => {
				// Find the matching default setting to get the original cell renderer
				const defaultSetting = defaultCompanyColumnSettings.find((def) => def.accessorKey === setting.accessorKey);

				return {
					id: String(setting.accessorKey),
					accessorKey: setting.accessorKey as string,
					header: setting.header || setting.label,
					// Use the cell from defaultSettings if available, otherwise use the current setting's cell or defaultCellRenderer
					cell: defaultSetting?.cell || setting.cell || defaultCellRenderer,
				};
			});
	}, [settings]);

	const filteredCompanies = useMemo(() => {
		return companies.filter((company) => {
			if (!statusFilter) return true;
			return true;
		});
	}, [companies, statusFilter]);

	const handleAddRecord = useCallback(
		async (data: Partial<CompanyDisplay>) => {
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
					category_group: data.category_group || '',
					managerid: Number(data.managerid) || 1,
					personnel: [],
				};

				await addCompany(newCompanyRequest);
			} catch (error) {
				console.error('Failed to add record:', error);
				throw error;
			}
		},
		[addCompany]
	);

	const handleSaveEdits = useCallback(
		async (updatedData: Partial<Company>[]) => {
			try {
				const updatePromises = updatedData.map(async (company) => {
					const companyId = company.companyId || company.companyid;
					if (!companyId) {
						throw new Error(`Company ID is required for updates (Company: ${company.name || 'unknown'})`);
					}

					// Create update payload with only modified fields
					const updatePayload: CompanyUpdate = {};
					if (company.name !== undefined) updatePayload.name = company.name;
					if (company.logo !== undefined) updatePayload.logo = company.logo;
					if (company.city !== undefined) updatePayload.city = company.city;
					if (company.product !== undefined) updatePayload.product = company.product;
					if (company.email !== undefined) updatePayload.email = company.email;
					if (company.category_group !== undefined) updatePayload.category_group = company.category_group;
					if (company.managerid !== undefined) updatePayload.managerid = company.managerid;

					// Only proceed if there are actual changes
					if (Object.keys(updatePayload).length === 0) {
						return Promise.resolve();
					}

					return updateCompany(Number(companyId), updatePayload);
				});

				await Promise.all(updatePromises);
				setIsEditable(false);
				alert('Companies updated successfully');
			} catch (error: any) {
				alert('Failed to save updates:' + error);
			}
		},
		[updateCompany]
	);

	const handleStatusChange = useCallback((newStatus: string) => {
		setStatusFilter(newStatus);
	}, []);

	const editButton = useCallback(() => {
		return (
			<Button
				onClick={() => setIsEditable((prev) => !prev)}
				className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
				EDIT+
			</Button>
		);
	}, [isEditable]);

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

				<div className="flex flex-col items-end space-y-2">
					<Label>‎</Label>
					<div className="flex items-center gap-4">
						<AdvancedFilterPopover />
					</div>
				</div>
			</div>

			<div className="flex justify-end flex-none bg-white">
				<AddRecordDialog
					columns={columns}
					onSave={handleAddRecord}
					nonEditableColumns={['logo', 'companyid', 'actions', 'personnel', 'created_at', 'managerid', 'detail', 'activeLeads', 'totalContractValue']}
					selectFields={{
						category_group: {
							options: [
								{ value: 'tech', label: 'Technology' },
								{ value: 'finance', label: 'Finance' },
							],
						},
					}}
				/>
				{editButton()}
			</div>
			<div className="flex-1 overflow-auto">
				<div className="max-w-full overflow-x-auto">
					<DataTable
						columns={columns}
						data={filteredCompanies}
						loading={loading}
						isEditable={isEditable}
						onSave={handleSaveEdits}
						nonEditableColumns={['logo', 'companyid', 'actions', 'personnel', 'activeLeads', 'totalContractValue']}
					/>
				</div>
			</div>
		</div>
	);
}
