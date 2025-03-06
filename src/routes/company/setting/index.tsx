// src/routes/company/setting/index.tsx
import { createFileRoute, Link } from '@tanstack/react-router';
import React, { useCallback, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { DataTable } from '@/components/ui/data-table';
import { TitleWrapper } from '@/components/wrapperElement';
import { useColumnSettings } from '@/hooks/useColumnSettings';
import { defaultCompanyColumnSettings } from '@/config/columnSettings';
import { CompanyDisplay } from '@/types/company';
import { BaseColumnSetting } from '@/types/table';

export const Route = createFileRoute('/company/setting/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { settings, saveSettings, reorderColumns } = useColumnSettings<CompanyDisplay>({
		storageKey: 'companyColumnSettings',
		defaultSettings: defaultCompanyColumnSettings
	});

	const handleStatusChange = useCallback((accessorKey: string, checked: boolean) => {
		saveSettings((prevSettings: BaseColumnSetting<CompanyDisplay>[]) => 
			prevSettings.map((setting) =>
				setting.accessorKey === accessorKey
					? { ...setting, status: checked ? "shown" : "hidden" }
					: setting
			)
		);
	}, [saveSettings]);

	const handleDragEnd = useCallback(({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
		if (oldIndex === newIndex) return; // Add this guard clause
		reorderColumns(oldIndex, newIndex);
	}, [reorderColumns]);

	const columns = useMemo<ColumnDef<BaseColumnSetting<CompanyDisplay>>[]>(() => [
		{
			accessorKey: 'label',
			header: 'Data field shown in the Company',
			cell: ({ row }) => <div className="py-2 pl-8">{row.original.label}</div>,
		},
		{
			accessorKey: 'type',
			header: 'Type',
		},
		{
			accessorKey: 'date_created',
			header: 'Date Created',
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => (
				<div className="flex items-center justify-center">
					<Switch
						checked={row.original.status === "shown"}
						onCheckedChange={(checked) => 
							handleStatusChange(row.original.accessorKey.toString(), checked)
						}
					/>
				</div>
			),
		},
	], [handleStatusChange]);

	const handleResetToDefault = useCallback(() => {
		saveSettings(defaultCompanyColumnSettings);
	}, [saveSettings]);

	const memoizedSettings = useMemo(() => settings, [settings]); // Add this

	return (
		<div className="flex flex-col flex-1 w-full h-full">
			<TitleWrapper>
				<Link
					to="/company"
					className="text-xs">
					Company
				</Link>
			</TitleWrapper>
			
			<div className="flex items-center justify-between px-8 py-4 bg-white border-r">
				<h2 className="text-lg font-semibold">Column Settings</h2>
				<Button 
					variant="outline"
					onClick={handleResetToDefault}
				>
					Reset to Default
				</Button>
			</div>

			<div className="flex-1 overflow-auto">
				<DataTable
					columns={columns}
					data={memoizedSettings}
					enableRowDragAndDrop={true}
					onRowDragEnd={handleDragEnd}
				/>
			</div>
		</div>
	);
}


