import { createFileRoute } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';

export const Route = createFileRoute('/setting/members/')({
	component: RouteComponent,
});

type Role = 'Admin' | 'User' | 'Guest';

type Members = {
	id: string;
	name: string;
	role: Role;
	email: string;
};

function RouteComponent() {
	return <div>Hello "/setting/members/"!</div>;
}
