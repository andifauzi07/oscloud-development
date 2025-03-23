import { createFileRoute } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { defaultProjectColumnSettings } from '@/config/columnSettings';
import { useColumnSettings } from '@/hooks/useColumnSettings';
import { useCallback, useMemo, useState } from 'react';
import { BaseColumnSetting } from '@/types/table';
import { Switch } from '@/components/ui/switch';
import { AddSettingColumn } from '@/components/AddSettingColumn';
import { AddRecordDialog } from '@/components/AddRecordDialog';

type DataCategoryRow = {
	category: string;
	parentCategory: string;
};

const rowDataCategory: DataCategoryRow[] = [
	{
		category: 'Basic Information',
		parentCategory: '-',
	},
	{
		category: 'SNS',
		parentCategory: 'Basic Information',
	},
	{
		category: 'Contracts',
		parentCategory: 'Basic Information',
	},
];

const columnsDataCategory: ColumnDef<DataCategoryRow>[] = [
	{
		accessorKey: 'category',
		header: () => <h1 className="pl-8">Category</h1>,
		cell: ({ row }) => <h1 className="pl-8 py-2">{row.original.category}</h1>,
	},
	{
		accessorKey: 'parentCategory',
		header: 'Parent Category',
	},
	{
		id: 'actions',
		header: '',
		cell: () => (
			<div className="w-full flex justify-end">
				<Button
					variant="outline"
					className="border-b-0 border-t-0 border-r-0">
					View
				</Button>
			</div>
		),
	},
];

export const Route = createFileRoute('/projects/setting/')({
	component: RouteComponent,
});

function RouteComponent() {
	const [editableDataField, setEditableDataField] = useState(false);
	const { settings, saveSettings, addNewSetting, reorderColumns } = useColumnSettings<any>({
		storageKey: 'ProjectsColumnSettings',
		defaultSettings: defaultProjectColumnSettings,
	});
	const [updateDataFromChild, setUpdateDataFromChild] = useState(settings);
	const memoizedDataFieldSettingsColumns = useMemo(() => settings, [settings]);
	const [editableDataCategory, setEditableDataCategory] = useState(false);

	const handleStatusChange = useCallback(
		(accessorKey: string, checked: boolean) => {
			saveSettings((prevSettings: BaseColumnSetting<any>[]) => prevSettings.map((setting) => (setting.accessorKey === accessorKey ? { ...setting, status: checked ? 'Active' : 'Hidden' } : setting)));
		},
		[saveSettings]
	);

	const dataFieldColumns = useMemo<ColumnDef<BaseColumnSetting<any>>[]>(
		() => [
			{
				id: 'label',
				accessorKey: 'label',
				header: 'Data Field',
				cell: ({ row }) => <div className="py-2">{row.original.label || '-'}</div>,
			},
			{
				id: 'type',
				accessorKey: 'type',
				header: 'Type',
				cell: ({ row }) => <h1>{row.original.type}</h1>,
			},
			{
				id: 'category',
				accessorKey: 'category',
				header: 'Category',
				cell: ({ row }) => <h1>{row.original.category || '-'}</h1>,
			},
			{
				id: 'status',
				accessorKey: 'status',
				header: 'Status',
				cell: ({ row }) => <h1>{row.original.status}</h1>,
			},
			{
				id: 'toggle',
				accessorKey: '',
				header: '',
				cell: ({ row }) => (
					<div className="flex items-center justify-center">
						<Switch
							checked={row.original.status === 'Active'}
							onCheckedChange={(checked) => handleStatusChange(row.original.accessorKey.toString(), checked)}
						/>
					</div>
				),
			},
		],
		[handleStatusChange]
	);

	const handleSaveEditsDataField = useCallback(
		(updateDataArray: BaseColumnSetting<any>[]) => {
			saveSettings((prevSettings) =>
				prevSettings.map((setting) => {
					const updatedItem = updateDataArray.find((update) => update.accessorKey === setting.accessorKey);
					return updatedItem ? { ...setting, ...updatedItem } : setting;
				})
			);
			setEditableDataField((prev) => !prev);
		},
		[saveSettings]
	);

	const handleAddRecord = async (data: any) => {
		try {
			// Add your API call here to save the new record
			console.log('Adding new setting:', data);
		} catch (error) {
			console.error('Failed to add record:', error);
		}
	};

	const handleSaveEdits = useCallback(async (updatedData: any[]) => {
		try {
			console.log('Saving updates:', updatedData);
			// Add your API call here
			setEditableDataCategory(false); // Turn off edit mode after saving
		} catch (error) {
			console.error('Failed to save updates:', error);
		}
	}, []);

	return (
		<div className="flex flex-col flex-1 h-full">
			{/* Tabs Section */}
			<Tabs defaultValue="dataField">
				<TabsList className="justify-start w-full gap-8 bg-white border-b border-r [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 px-4">
					<TabsTrigger
						value="dataField"
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none">
						Data Field
					</TabsTrigger>
					<TabsTrigger
						value="dataCategory"
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none">
						Data Category
					</TabsTrigger>
				</TabsList>



				{/* DataField Tab */}
				<TabsContent
					className="m-0 rounded-none"
					value="dataField">
					<div className="flex border-b-0 justify-end flex-none w-full bg-white">
						{editableDataField ? (
							<Button
								onClick={() => setEditableDataField((prev) => !prev)}
								className="text-black bg-transparent border-l md:w-20 link border-l-none min-h-10">
								CANCEL
							</Button>
						) : (
							<AddSettingColumn
								columns={dataFieldColumns}
								addSettingsHandler={addNewSetting}
								nonEditableColumns={['action*', 'dateAdded*', 'dateCreated*', '*id', 'header*']}
								selectFields={{
									status: {
										options: [
											{ value: 'Active', label: 'Active' },
											{ value: 'Hidden', label: 'Hidden' },
										],
									},
									type: {
										options: [
											{ value: 'text', label: 'Text' },
											{ value: 'number', label: 'Number' },
											{ value: 'boolean', label: 'Boolean' },
											{ value: 'email', label: 'Email' },
											{ value: 'file', label: 'File' },
											{ value: 'image', label: 'Image' },
											{ value: 'actions', label: 'Actions' },
										],
									},
								}}
							/>
						)}

						{editableDataField ? (
							<Button
								// onClick={handleSaveEditsDataField(updateDataFromChild)}
								onClick={(e) => {
									e.preventDefault(); // Opsional, jika perlu mencegah submit
									handleSaveEditsDataField(updateDataFromChild);
								}}
								className="text-black bg-transparent border-l border-r md:w-20 link border-l-none min-h-10">
								SAVE
							</Button>
						) : (
							<Button
								onClick={() => setEditableDataField((prev) => !prev)}
								className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
								EDIT
							</Button>
						)}
					</div>
					<DataTable
						columns={dataFieldColumns}
						data={memoizedDataFieldSettingsColumns}
						loading={false}
						isEditable={editableDataField}
						setTableData={(updateFunctionOrData) => {
							const evaluatedData = typeof updateFunctionOrData === 'function' ? updateFunctionOrData([...memoizedDataFieldSettingsColumns]) : updateFunctionOrData;
							setUpdateDataFromChild(evaluatedData);
						}}
						nonEditableColumns={['action*', 'status*']}
					/>
				</TabsContent>

				{/* DataCategory Tab */}
				<TabsContent
					className="m-0"
					value="dataCategory">
					<div className="flex justify-end flex-none w-full bg-white">
						<AddRecordDialog
							columns={columnsDataCategory}
							onSave={handleAddRecord}
							nonEditableColumns={['action*']}
						/>
						<Button
							onClick={() => setEditableDataCategory((prev) => !prev)}
							className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
							EDIT+
						</Button>
					</div>
					<DataTable
						columns={columnsDataCategory}
						data={rowDataCategory}
						loading={false}
						isEditable={editableDataCategory}
						onSave={handleSaveEdits}
						nonEditableColumns={['action*']}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
