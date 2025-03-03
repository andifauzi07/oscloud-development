import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { TitleWrapper } from '@/components/wrapperElement';
import { useUserData } from '@/hooks/useUserData';
import { useWorkspace } from '@/hooks/useWorkspace';
import { createFileRoute } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';

export const Route = createFileRoute('/workspace/')({
	component: RouteComponent,
});

type Role = 'Manager' | 'Admin' | 'Staff';

interface Workspaces {
	userid: string;
	email: string;
	status: string;
	role: Role;
}

function RouteComponent() {
	const { workspaceid } = useUserData();
	const { selectedWorkspace, updateWorkspace, loading, error } = useWorkspace(Number(workspaceid));

	const usersColumn: ColumnDef<Workspaces>[] = [
		{
			accessorKey: 'userid',
			header: () => <h1 className="pl-8">User ID</h1>,
			cell: ({ row }) => <h1 className="pl-8">{row.original.userid}</h1>,
		},
		{
			accessorKey: 'email',
			header: 'Email',
		},
		{
			accessorKey: 'status',
			header: 'Status',
		},
		{
			accessorKey: 'role',
			header: 'Role',
		},
		{
			id: 'actions',
			header: '',
			cell: () => (
				<div className="w-full flex justify-end">
					<Button
						variant="outline"
						className="w-20 text-xs border-t-0 border-r-0 border-b-0">
						REMOVE
					</Button>
				</div>
			),
		},
	];

	return (
		<>
			<TitleWrapper className="border-b-0">
				<h1>Users</h1>
			</TitleWrapper>
			<DataTable
				columns={usersColumn}
				data={selectedWorkspace?.users || []}
				loading={false}
				isEditable={false}
				nonEditableColumns={['']}
			/>
		</>
	);
}
