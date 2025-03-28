import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import MenuList from '@/components/menuList';
import { DataTable } from '@/components/ui/data-table';
import { TitleWrapper } from '@/components/wrapperElement';
import { usePersonnel } from '@/hooks/usePersonnel';
import { format } from 'date-fns';
import { Personnel } from '@/types/personnel';
import { useEffect, useState, useCallback } from 'react';
import { AddRecordDialog } from '@/components/AddRecordDialog';
import { useUserData } from '@/hooks/useUserData';
import { useCompanies } from '@/hooks/useCompany';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { updatePersonnel, fetchAllPersonnel } from '@/store/slices/personnelSlice';
import { ColumnDef } from '@tanstack/react-table';
import { useSaveEdits } from '@/hooks/handler/useSaveEdit';

export const Route = createFileRoute('/features/personnel-list/')({
	component: RouteComponent,
});

function RouteComponent() {
	const dispatch = useDispatch<AppDispatch>();
	const { personnel, loading, error, fetchAllPersonnel: fetchAllPersonnelHook, addPersonnel, updatePersonnel } = usePersonnel();
	const { currentUser } = useUserData();
	const { companies } = useCompanies();
	const [updateDataFromChild, setUpdateDataFromChild] = useState(personnel);
	const [isEditable, setIsEditable] = useState(false);

	// Create company options for the select field
	const companyOptions =
		companies?.map((company) => ({
			value: company.companyid?.toString()!,
			label: company.name,
		})) || [];

	const handleAddRecord = async (data: any) => {
		try {
			if (!currentUser?.id) {
				throw new Error('No user ID available');
			}

			await addPersonnel(Number(data.companyid), {
				name: data.name,
				email: data.email,
				status: data.status,
				managerId: currentUser.id,
				description: data.description || '',
			});

			await fetchAllPersonnelHook();
			alert('Personnel added successfully');
		} catch (error) {
			console.error('Failed to add record:', error);
			alert('Failed to add personnel');
		}
	};

	const handleSaveEdits = useSaveEdits<any>();

	// const handleSaveEdits = useCallback(
	// 	async (updatedData: any[]) => {
	// 		try {
	// 			if (!currentUser?.workspaceid) {
	// 				throw new Error('No workspace ID available');
	// 			}

	// 			console.log('Starting updates with data:', updatedData); // Debug log

	// 			await Promise.all(
	// 				updatedData.map(async (person) => {
	// 					if (!person.id) {
	// 						console.error('Missing personnel ID:', person);
	// 						return;
	// 					}

	// 					// Create the update payload according API structure
	// 					const data = {
	// 						name: person.name,
	// 						email: person.email,
	// 						status: person.status,
	// 						companyid: typeof person.company === 'object' ? person.company?.companyid : person.companyid,
	// 						description: person.description,
	// 					};

	// 					console.log('Dispatching update with:', {
	// 						workspaceId: Number(currentUser.workspaceid),
	// 						personnelId: person.id,
	// 						data,
	// 					});

	// 					// Dispatch the update action with the correct parameters
	// 					await dispatch(
	// 						updatePersonnel({
	// 							workspaceId: Number(currentUser.workspaceid),
	// 							personnelId: person.id,
	// 							data,
	// 						})
	// 					);
	// 				})
	// 			);

	// 			await dispatch(
	// 				fetchAllPersonnel({
	// 					workspaceId: Number(currentUser.workspaceid),
	// 				})
	// 			);

	// 			setIsEditable(false);
	// 			alert('Changes saved successfully');
	// 		} catch (error) {
	// 			console.error('Failed to save updates:', error);
	// 			alert('Failed to save changes');
	// 			setIsEditable(true);
	// 		}
	// 	},
	// 	[dispatch, currentUser?.workspaceid]
	// );

	const statusOptions = [
		{ value: 'Active', label: 'Active' },
		{ value: 'Inactive', label: 'Inactive' },
		{ value: 'Blocked', label: 'Blocked' },
	];

	useEffect(() => {
		fetchAllPersonnelHook();
	}, [fetchAllPersonnelHook]);

	const columns: ColumnDef<Personnel>[] = [
		{
			header: () => <h1 className="pl-8">ID</h1>,
			accessorKey: 'personnelid',
			cell: ({ row }) => <h1 className="pl-8">{row.original.personnelid}</h1>,
			// enableEditing: false,
		},
		{
			header: 'Personnel Name',
			accessorKey: 'name',
		},
		{
			header: 'Email',
			accessorKey: 'email',
			cell: ({ row }) => row.original.email || '-',
		},
		{
			header: 'Manager',
			accessorKey: 'managerid',
			cell: ({ row }) => row.original.managerid || '-',
			// enableEditing: false,
		},
		{
			header: 'Company',
			accessorKey: 'company',
			cell: ({ row }) => row.original.company?.name || '-',
			// type: 'select',
		},
		{
			header: 'Lead',
			accessorKey: 'leadid',
			cell: ({ row }) => row.original.leadid || '-',
			// enableEditing: false,
		},
		{
			header: 'Status',
			accessorKey: 'status',
			// type: 'select',
		},
		{
			header: 'Description',
			accessorKey: 'description',
			cell: ({ row }) => row.original.description || '-',
		},
		{
			header: '',
			id: 'actions',
			cell: ({ row }) => (
				<div className="flex justify-end w-full">
					<Link
						to={`/company/$companyId/companyPersonnel/$companyPersonnelId`}
						params={{
							companyId: row.original.company?.companyid.toString()!,
							companyPersonnelId: row.original.personnelid?.toString()!,
						}}>
						<Button
							variant="outline"
							className="w-20 border-t-0 border-b-0 border-r-0">
							VIEW
						</Button>
					</Link>
				</div>
			),
			// enableEditing: false,
		},
	];

	// const addRecordColumns = [
	// 	{
	// 		header: 'Personnel Name',
	// 		accessorKey: 'name',
	// 		required: true,
	// 	},
	// 	{
	// 		header: 'Email',
	// 		accessorKey: 'email',
	// 		required: true,
	// 	},
	// 	{
	// 		header: 'Status',
	// 		accessorKey: 'status',
	// 		required: true,
	// 		type: 'select',
	// 	},
	// 	{
	// 		header: 'Company',
	// 		accessorKey: 'companyid',
	// 		required: true,
	// 		type: 'select',
	// 	},
	// 	{
	// 		header: 'Description',
	// 		accessorKey: 'description',
	// 		required: false,
	// 	},
	// ];

	console.log(personnel);

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
						nonEditableColumns={['actions', 'id', 'manager', 'activeLeads', 'closedLeads', 'addedAt']}
						selectFields={{
							status: {
								options: statusOptions,
							},
							companyid: {
								options: companyOptions,
							},
						}}
					/>
				)}

				{isEditable ? (
					<Button
						onClick={async () => {
							const result = await handleSaveEdits(companies, updateDataFromChild, 'companyid', ['name', 'email', 'city', 'product', 'categoryGroup', 'manager', 'status'], async (id: number, data: Partial<Personnel>) => {
								const res = await updatePersonnel(data);
								console.log('ini res: ', res);
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
	}, [isEditable, personnel, updateDataFromChild, updatePersonnel]);

	useEffect(() => {
		fetchAllPersonnelHook();
	}, [fetchAllPersonnelHook]);

	return (
		<div className="flex-1 h-full">
			<TitleWrapper>
				<h2>All Personnel</h2>
			</TitleWrapper>
			<div className="flex justify-end flex-none bg-white">{editButton()}</div>
			<DataTable
				columns={columns}
				data={personnel}
				loading={loading}
				isEditable={isEditable}
				nonEditableColumns={['actions', 'id', 'manager', 'activeLeads', 'closedLeads', 'addedAt']}
				selectFields={{
					status: {
						options: statusOptions,
					},
					companyid: {
						options: companyOptions,
					},
				}}
				setTableData={(updateFunctionOrData) => {
					if (typeof updateFunctionOrData === 'function') {
						const newData = updateFunctionOrData(updateDataFromChild);
						setUpdateDataFromChild(newData);
					} else {
						setUpdateDataFromChild(updateFunctionOrData);
					}
				}}
			/>
		</div>
	);
}
