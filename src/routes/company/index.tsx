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
import { Company, CreateCompanyRequest, CompanyDisplay } from '@/types/company';
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
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [isEditable, setIsEditable] = useState(false);
	const filters = useMemo(() => ({ category: '' }), []);
	const { companies, loading, addCompany } = useCompanies(filters); // This is the companies data
	const { settings, saveSettings, reorderColumns } = useColumnSettings<CompanyDisplay>({
		storageKey: 'companyColumnSettings',
		defaultSettings: defaultCompanyColumnSettings,
	});
	const columns = useMemo<ColumnDef<CompanyDisplay, any>[]>(() => {
		return settings
			.filter((setting) => setting.status === 'shown')
			.sort((a, b) => a.order - b.order)
			.map((setting) => ({
				id: String(setting.accessorKey), // Convert to string
				accessorKey: setting.accessorKey as string, // Explicitly type as string
				header: setting.label,
				cell: setting.cell || defaultCellRenderer,
			}));
	}, [settings]);

	const filteredCompanies = useMemo(() => {
		return companies.filter((company) => {
			if (!statusFilter) return true;
			return true;
		});
	}, [companies, statusFilter]);

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

	const handleStatusChange = useCallback((newStatus: string) => {
		setStatusFilter(newStatus);
	}, []);

	const handleSave = useCallback(async (updatedData: Company[]) => {
		console.log(updatedData);
		//TODO: implement update multiple company
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
						onSave={handleSave}
						nonEditableColumns={['logo', 'companyid', 'actions', 'personnel', 'activeLeads', 'totalContractValue']}
						onRowDragEnd={({ oldIndex, newIndex }) => reorderColumns(oldIndex, newIndex)}
					/>
				</div>
			</div>
		</div>
	);
}
