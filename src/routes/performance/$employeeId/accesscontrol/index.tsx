import { createFileRoute } from '@tanstack/react-router';
import { useParams } from '@tanstack/react-router';
import MenuList from '@/components/menuList';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { AddRecordDialog } from '@/components/AddRecordDialog';
import { useUserData } from '@/hooks/useUserData';

export const Route = createFileRoute('/performance/$employeeId/accesscontrol/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { employeeId } = useParams({ strict: false });
    const { currentUser } = useUserData();
    const workspaceid = currentUser?.workspaceid;

	const handleAddRecord = async (data: any) => {
		try {
			// Add your API call here to save the new record
			console.log('Adding new record:');
		} catch (error) {
			console.error('Failed to add record:', error);
		}
	};

	const columns = [
		{
			accessorKey: 'userid',
			header: () => <h1 className="pl-8">User ID</h1>,
			cell: ({ row }: any) => <h1 className="pl-8">{row.original.userid}</h1>,
		},
		{
			accessorKey: 'email',
			header: 'Email Address',
			cell: ({ row }: any) => (
				<a
					href={`mailto:${row.original.email}}`}
					className="text-blue-500 underline">
					{row.original.email}
				</a>
			),
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }: any) => <h1 className=" text-[#0a0a30] ">{row.original.status}</h1>,
		},
		{
			accessorKey: 'role',
			header: 'Role',
			cell: ({ row }: any) => <h1 className="">{row.original.role}</h1>,
		},
		{
			id: 'actions',
			header: '',
			cell: () => (
				<div className="flex justify-end w-full">
					<Button
						variant="outline"
						className="self-end w-20 text-black bg-transparent border border-t-0 border-b-0">
						REMOVE
					</Button>
				</div>
			),
		},
	];

	return (
		<div className="flex-1 h-full">
			<div className="flex-none min-h-0 border-b">
				<div className="container flex flex-row items-center justify-between pl-4">
					<MenuList
						items={[
							{
								label: 'Sheet List',
								path: `/performance/${employeeId}`,
							},
							{
								label: 'Access Control',
								path: `/performance/${employeeId}/accesscontrol`,
							},
						]}
					/>
					<Link
						className="pr-5 text-xs"
						to="/performance/setting">
						Setting
					</Link>
				</div>
			</div>

			<div className="flex justify-end flex-none w-full">
				<AddRecordDialog
					columns={columns}
					onSave={handleAddRecord}
					nonEditableColumns={['userid*']}
				/>
			</div>

			<DataTable
				columns={columns}
				data={[]}
				loading={false}
			/>
		</div>
	);
}
