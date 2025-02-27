import { createFileRoute } from '@tanstack/react-router';
import { useParams } from '@tanstack/react-router';
import MenuList from '@/components/menuList';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useUsers } from '@/hooks/useUser';
import { AddRecordDialog } from '@/components/AddRecordDialog';

export const Route = createFileRoute('/performance/$employeeId/accesscontrol/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { employeeId } = useParams({ strict: false });
	const workspaceId = 1;
	const { users, loading } = useUsers(workspaceId);

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
			header: 'User ID',
			cell: ({ row }: any) => <h1 className="text-base">{row.original.userid}</h1>,
		},
		{
			accessorKey: 'email',
			header: 'Email Address',
			cell: ({ row }: any) => (
				<a
					href={`mailto:${row.original.email}}`}
					className="text-base text-blue-500 underline">
					{row.original.email}
				</a>
			),
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }: any) => <h1 className=" text-[#0a0a30] text-base">{row.original.status}</h1>,
		},
		{
			accessorKey: 'role',
			header: 'Role',
			cell: ({ row }: any) => <h1 className="text-base">{row.original.role}</h1>,
		},
		{
			id: 'actions',
			header: '',
			cell: () => (
				<Button
					variant="outline"
					className="self-end w-20 text-black bg-transparent border rounded-none">
					REMOVE
				</Button>
			),
		},
	];

	return (
		<div className="flex-1 h-full">
			<div className="flex-none min-h-0 border-b">
				<div className="container flex flex-row items-center justify-between pt-4">
					<MenuList
						items={[
							{
								label: 'Sheet List',
								path: `/dashboard/performance/${employeeId}`,
							},
							{
								label: 'Access Control',
								path: `/dashboard/performance/${employeeId}/accesscontrol`,
							},
						]}
					/>
					<Link
						className="relative bottom-2"
						to="/performance/setting">
						Setting
					</Link>
				</div>
			</div>

			<div className="flex justify-end flex-none w-full border-b">
				<AddRecordDialog
					columns={columns}
					onSave={handleAddRecord}
					nonEditableColumns={['userid*']}
				/>
			</div>

			<div className="">
				<DataTable
					columns={columns}
					data={users}
					loading={loading}
				/>
			</div>
		</div>
	);
}
