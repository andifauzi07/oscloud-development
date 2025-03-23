import { createFileRoute } from '@tanstack/react-router';
import { useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import MenuList from '@/components/menuList';
import { DataTable } from '@/components/ui/data-table';
import { useCompanyPersonnel } from '@/hooks/useCompany';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { AddRecordDialog } from '@/components/AddRecordDialog';
import { toast } from '@/hooks/use-toast';
import { useSaveEdits } from '@/hooks/handler/useSaveEdit';
import { CompanyPersonnel } from '@/types/company';
import { UpdatePersonnelRequest } from '@/types/personnel';

type PersonnelStatus = 'Active' | 'Inactive' | 'Blocked';

export const Route = createFileRoute('/company/$companyId/companyPersonnel/')({
	component: RouteComponent,
});

const transformToCompanyPersonnel = (data: any[]): CompanyPersonnel[] => {
	return data.map((item) => ({
		personnelid: item.personnelId || item.personnelid,
		companyid: item.companyId || item.companyid,
		name: item.name,
		email: item.email,
		status: item.status,
		description: item.description,
		managerid: item.managerId || item.managerid || '',
	}));
};

function RouteComponent() {
	const { companyId } = useParams({ strict: false });
	const { personnel, loading, error, addPersonnel, updatePersonnel, refetchPersonnel } = useCompanyPersonnel(Number(companyId));
	const [isEditable, setIsEditable] = useState(false);
	const [tableData, setTableData] = useState<CompanyPersonnel[]>([]);
	const [editedData, setEditedData] = useState<CompanyPersonnel[]>([]);

	// Initialize tableData when personnel changes and not in edit mode
	useEffect(() => {
		if (!isEditable) {
			const transformedData = transformToCompanyPersonnel(personnel || []);
			setTableData(transformedData);
			setEditedData(transformedData);
		}
	}, [personnel, isEditable]);

	const handleAddRecord = async (data: any) => {
		try {
			await addPersonnel({
				name: data.name,
				email: data.email,
				status: data.status,
				description: data.description,
				managerId: data.managerId,
			});

			await refetchPersonnel();
			toast({
				title: 'Success',
				description: 'Successfully added personnel',
			});
		} catch (error) {
			console.error('Failed to add record:', error);
			toast({
				title: 'Error',
				description: 'Failed to add personnel',
			});
		}
	};

	const handleSaveEdits = useSaveEdits<CompanyPersonnel>();

	const handleTableSave = async (updatedData: CompanyPersonnel[]) => {
		try {
			const result = await handleSaveEdits(tableData, editedData, 'personnelid', ['name', 'email', 'status', 'description'], async (id: number, data: Partial<CompanyPersonnel>) => {
				console.log('Updating personnel with ID:', id, 'Data:', data);
				const updateData: UpdatePersonnelRequest = {
					name: data.name,
					email: data.email,
					status: data.status,
					description: data.description,
				};
				await updatePersonnel(id, updateData);
			});

			// Jika tidak ada perubahan, result akan undefined
			if (result === undefined) {
				toast({
					title: 'Info',
					description: 'Tidak ada perubahan data yang perlu disimpan',
				});
				return false;
			}

			return result;
		} catch (error) {
			console.error('Error in handleTableSave:', error);
			toast({
				title: 'Error',
				description: 'Gagal menyimpan perubahan',
				variant: 'destructive',
			});
			return false;
		}
	};

	const columns = useMemo(
		() => [
			{
				id: 'personnelid',
				header: () => <h1 className="pl-8">Personel ID</h1>,
				accessorKey: 'personnelid',
				cell: ({ row }: any) => (
					<div className="pl-8">
						<h1>{row.original.personnelid}</h1>
					</div>
				),
			},
			{
				id: 'name',
				header: 'Name',
				accessorKey: 'name',
				cell: ({ row }: any) => <div className="">{row.original.name}</div>,
			},
			{
				id: 'email',
				header: 'Email',
				accessorKey: 'email',
				cell: ({ row }: any) => <div className="">{row.original.email}</div>,
			},
			{
				id: 'status',
				header: 'Status',
				accessorKey: 'status',
				cell: ({ row }: any) => <div className="">{row.original.status}</div>,
			},
			{
				id: 'description',
				header: 'Description',
				accessorKey: 'description',
				cell: ({ row }: any) => <div className="">{row.original.description}</div>,
			},
			{
				id: 'detail',
				header: '',
				accessorKey: 'detail',
				cell: ({ row }: any) => {
					const personnelid = row.original?.personnelid;
					if (!personnelid) return null;

					return (
						<div className="flex items-center justify-end w-full ">
							<Button
								variant="outline"
								className="w-20 border-t-0 border-b-0 border-r-0">
								<Link
									params={{
										companyId: companyId!,
										companyPersonnelId: personnelid.toString(),
									}}
									to="/company/$companyId/companyPersonnel/$companyPersonnelId">
									VIEW
								</Link>
							</Button>
						</div>
					);
				},
			},
		],
		[companyId]
	);

	const statusOptions = [
		{ value: 'Active', label: 'Active' },
		{ value: 'Inactive', label: 'Inactive' },
		{ value: 'Blocked', label: 'Blocked' },
	];

	if (error) {
		return <div>Error loading personnel: {error}</div>;
	}

	return (
		<div className="flex-1 h-full">
			<div className="items-center flex-none min-h-0 border-b">
				<div className="container flex items-center justify-between pl-4 border-r">
					<MenuList
						items={[
							{
								label: 'Profile',
								path: `/company/${companyId}`,
							},
							{
								label: 'Personnel',
								path: `/company/${companyId}/companyPersonnel`,
							},
						]}
					/>
					<div className="pr-4">
						<Link
							className="text-xs"
							to="/performance/setting">
							Settings
						</Link>
					</div>
				</div>
			</div>
			<div className="flex items-center justify-start h-12 px-8 bg-white border-b border-r">
				<h2 className="text-base">Company Personnel</h2>
			</div>
			<div className="flex justify-end flex-none w-full bg-white">
				{isEditable ? (
					<Button
						onClick={() => {
							setIsEditable(false);
							const transformedData = transformToCompanyPersonnel(personnel || []);
							setTableData(transformedData);
							setEditedData(transformedData);
						}}
						className="text-black bg-transparent border-l md:w-20 link border-l-none min-h-10">
						CANCEL
					</Button>
				) : (
					<AddRecordDialog
						columns={columns.map((col) => ({
							header: col.header,
							accessorKey: col.accessorKey,
						}))}
						onSave={handleAddRecord}
						nonEditableColumns={['personnelid', 'detail']}
						selectFields={{
							status: {
								options: statusOptions,
							},
						}}
					/>
				)}

				{isEditable ? (
					<Button
						onClick={async () => {
							try {
								const isSuccess = await handleTableSave(editedData);
								if (isSuccess) {
									await refetchPersonnel();
									setIsEditable(false);
									toast({
										title: 'Success',
										description: 'Successfully updated data',
									});
								}
							} catch (error) {
								console.error('Error saving changes:', error);
								toast({
									title: 'Error',
									description: 'Failed to save changes',
									variant: 'destructive',
								});
							}
						}}
						className="text-black bg-transparent border-l border-r md:w-20 link border-l-none min-h-10">
						SAVE
					</Button>
				) : (
					<Button
						onClick={() => setIsEditable(true)}
						className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
						EDIT
					</Button>
				)}
			</div>
			<DataTable
				columns={columns}
				data={tableData}
				loading={loading}
				isEditable={isEditable}
				nonEditableColumns={['personnelid', 'detail']}
				onSave={handleTableSave}
				selectFields={{
					status: {
						options: statusOptions,
					},
				}}
				setTableData={setEditedData}
			/>
		</div>
	);
}
