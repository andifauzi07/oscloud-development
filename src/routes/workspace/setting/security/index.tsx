import MenuList from '@/components/menuList';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/workspace/setting/security/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="pl-4 bg-white border border-t-0 border-l-0">
			<MenuList
				items={[
					{
						label: 'Profile',
						path: `/workspace/setting/profile`,
					},
					{
						label: 'Security',
						path: `/workspace/setting/security`,
					},
				]}
			/>
		</div>
	);
}
