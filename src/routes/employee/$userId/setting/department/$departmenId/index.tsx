import { revertUrlString } from '@/lib/utils';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/employee/$userId/setting/department/$departmenId/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { departmenId } = Route.useParams();

	return (
		<div>
			<h1>this is rute {revertUrlString(departmenId)}</h1>
		</div>
	);
}
