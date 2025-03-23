import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link } from '@tanstack/react-router';
import { AddRecordDialog } from '@/components/AddRecordDialog';
import { AddSettingColumn } from '@/components/AddSettingColumn';
import { useCallback, useMemo, useState } from 'react';
import { formatUrlString } from '@/lib/utils';
import { useDepartments, useFlatDepartmentList } from '@/hooks/useDepartment';
import { ColumnDef } from '@tanstack/react-table';
import { BaseColumnSetting } from '@/types/table';
import { Switch } from '@/components/ui/switch';
import { useColumnSettings } from '@/hooks/useColumnSettings';
import { defaultEmployeeColumnSettings } from '@/config/columnSettings';

export const Route = createFileRoute('/employee/setting/')({
	component: RouteComponent,
});

const categoryColumns = [
	{ accessorKey: 'categoryName', header: () => <h1 className="py-2">Category Name</h1>, cell: ({ row }: any) => <h1 className="py-2">{row.original.categoryName}</h1> },
	{ accessorKey: 'parentCategory', header: 'Parent Category' },
];

const categoryData = [
	{
		id: 1,
		categoryName: '基本情報',
		type: 'Category',
		parentCategory: '-',
		action: 'VIEW',
	},
	{
		id: 2,
		categoryName: '単価',
		type: 'Category',
		parentCategory: '-',
		action: 'VIEW',
	},
	{
		id: 3,
		categoryName: '契約関連',
		type: 'Category',
		parentCategory: '-',
		action: 'VIEW',
	},
	{
		id: 4,
		categoryName: '講習会',
		type: 'Category',
		parentCategory: '-',
		action: 'VIEW',
	},
	{
		id: 5,
		categoryName: '面談結果',
		type: 'Category',
		parentCategory: '-',
		action: 'VIEW',
	},
	{
		id: 5,
		categoryName: 'SNS',
		type: 'Category',
		parentCategory: '-',
		action: 'VIEW',
	},
];

const employeeCategory = [
	{
		id: '1',
		category: 'Food Service',
		parenCategory: '-',
	},
	{
		id: '2',
		category: 'Employee Category B',
		parenCategory: 'Food Event',
	},
	{
		id: '3',
		category: 'Temp staff',
		parenCategory: '-',
	},
];

const employeeCategoryColumns = [
	{
		id: 'category',
		accessorKey: 'category',
		header: () => <h1 className="text-xs">Category</h1>,
		cell: ({ row }: any) => <h1 className="">{row.original.category}</h1>,
	},
	{
		id: 'parentCategory',
		accessorKey: 'parenCategory',
		header: 'Parent Category',
	},
	{
		id: 'action',
		header: '',
		accessorKey: 'action',
		cell: ({ row }: any) => (
			<div className="w-full flex justify-end">
				<Link
					to={`/employee/setting/category/$categoryName`}
					params={{ categoryName: row.original.categoryName }}>
					<Button
						variant={'outline'}
						onClick={() => console.log('Removing:', row.original.actions)}>
						VIEW
					</Button>
				</Link>
			</div>
		),
	},
];

const departmentColumns = [
	{
		id: 'departmentname',
		header: () => <h1 className="">Category</h1>,
		accessorKey: 'departmentname',
		cell: ({ row }: any) => <h1 className="py-2">{row.original.departmentname}</h1>,
	},
	{
		id: 'parentdepartmentid',
		header: 'Parent Department',
		accessorKey: 'parentdepartmentid',
		cell: ({ row }: any) => <h1>{row.original.parentDepartmentId ? row.original.parentDepartmentId : '-'}</h1>,
	},
	{
		id: 'managerCount',
		header: 'Manager',
		accessorKey: 'managerCount',
	},
	{
		id: 'employeeCount',
		header: 'Employees',
		accessorKey: 'employeeCount',
	},
	{
		id: 'actions',
		header: '',
		accessorKey: 'departmentid',
		cell: ({ row }: any) => (
			<div className="w-full flex justify-end">
				<Link
					to={`/employee/setting/department/$departmentName`}
					params={{ departmentName: row.original.departmentid }}>
					<Button className="w-20 text-black bg-transparent border border-t-0 border-b-0 rounded-none">VIEW</Button>
				</Link>
			</div>
		),
	},
];

function RouteComponent() {
	const [editable, setEditable] = useState(false);
	const { flatDepartments, loading } = useFlatDepartmentList();
	const { settings, saveSettings, addNewSetting, reorderColumns } = useColumnSettings<any>({
		storageKey: 'EmployeeColumnSetting',
		defaultSettings: defaultEmployeeColumnSettings,
	});
	const [updateDataFromChild, setUpdateDataFromChild] = useState(settings);
	const memoizedDataFieldSettingsColumns = useMemo(() => settings, [settings]);

	const handleStatusChange = useCallback(
		(accessorKey: string, checked: boolean) => {
			saveSettings((prevSettings: BaseColumnSetting<any>[]) => prevSettings.map((setting) => (setting.accessorKey === accessorKey ? { ...setting, status: checked ? 'Active' : 'Hidden' } : setting)));
		},
		[saveSettings]
	);

	console.log(settings);

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
			setEditable((prev) => !prev);
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
			setEditable(false); // Turn off edit mode after saving
		} catch (error) {
			console.error('Failed to save updates:', error);
		}
	}, []);
	
	return (
		<div className="flex-1 h-full">
			<Tabs defaultValue="data-field">
				<TabsList className="justify-start w-full gap-8 bg-white border-b border-r [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 pl-5">
					<TabsTrigger
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
						value="data-field">
						Data Field
					</TabsTrigger>
					<TabsTrigger
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
						value="data-category">
						Data Category
					</TabsTrigger>
					<TabsTrigger
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
						value="employe-category">
						Employee Category
					</TabsTrigger>
					<TabsTrigger
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
						value="department">
						Department
					</TabsTrigger>
				</TabsList>

				{/* Data-field */}

				<TabsContent
					className="m-0"
					value="data-field">
					<div className="flex border-b-0 justify-end flex-none w-full bg-white">
						{editable ? (
							<Button
								onClick={() => setEditable((prev) => !prev)}
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

						{editable ? (
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
								onClick={() => setEditable((prev) => !prev)}
								className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
								EDIT
							</Button>
						)}
					</div>
					<DataTable
						// enableRowDragAndDrop={true}
						columns={dataFieldColumns}
						data={memoizedDataFieldSettingsColumns}
						loading={false}
						isEditable={editable}
						setTableData={(updateFunctionOrData) => {
							const evaluatedData = typeof updateFunctionOrData === 'function' ? updateFunctionOrData([...memoizedDataFieldSettingsColumns]) : updateFunctionOrData;
							setUpdateDataFromChild(evaluatedData);
						}}
						// onRowDragEnd={({ oldIndex, newIndex }) => {
						// 	console.log('data di geser dari : ', oldIndex);
						// 	console.log('ke : ', newIndex);

						// reorderColumns(oldIndex, newIndex);
						// }}
						nonEditableColumns={['action*', 'status*']}
					/>
				</TabsContent>

				{/* Data-category */}
				<TabsContent
					className="m-0"
					value="data-category">
					<div className="flex justify-end flex-none w-full bg-white">
						<AddRecordDialog
							columns={categoryColumns}
							onSave={handleAddRecord}
							nonEditableColumns={['action*']}
						/>
						<Button
							onClick={() => setEditable((prev) => !prev)}
							className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
							EDIT+
						</Button>
					</div>
					<DataTable
						columns={categoryColumns}
						data={categoryData}
						loading={false}
						isEditable={editable}
						onSave={handleSaveEdits}
						nonEditableColumns={['action*']}
					/>
				</TabsContent>

				{/* Employee-category */}
				<TabsContent
					className="m-0"
					value="employe-category">
					<div className="flex justify-end flex-none w-full bg-white">
						<AddRecordDialog
							columns={employeeCategoryColumns}
							onSave={handleAddRecord}
							nonEditableColumns={['action*']}
						/>

						<Button
							onClick={() => setEditable((prev) => !prev)}
							className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
							EDIT+
						</Button>
					</div>
					<DataTable
						enableRowDragAndDrop={editable}
						columns={employeeCategoryColumns}
						data={employeeCategory}
						loading={false}
						onSave={handleSaveEdits}
						nonEditableColumns={['action*']}
						isEditable={editable}
					/>
				</TabsContent>

				{/* Department */}
				<TabsContent
					className="m-0"
					value="department">
					<div className="flex justify-end flex-none w-full bg-white">
						<AddRecordDialog
							columns={departmentColumns}
							onSave={handleAddRecord}
							nonEditableColumns={['action*', 'employees*', 'manager*']}
						/>
						<Button
							onClick={() => setEditable((prev) => !prev)}
							className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
							EDIT+
						</Button>
					</div>
					<DataTable
						columns={departmentColumns}
						data={flatDepartments}
						loading={loading}
						onSave={handleSaveEdits}
						nonEditableColumns={['action*', 'employees', 'manager']}
						isEditable={editable}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
