import { Link, useRouterState } from '@tanstack/react-router';
import { BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Breadcrumb as ShadcnBreadcrumb } from '../ui/breadcrumb';
import { formatUrlString } from '@/lib/utils';

export function Breadcrumb() {
	const router = useRouterState();
	const path = router.location.pathname;
	const segments = path.split('/').filter(Boolean);

	const breadcrumbMap: Record<string, string> = {
		employee: 'Employee List',
		setting: 'Setting',
		category: 'Category',
		department: 'Department',
	};

	return (
		<div className="w-full flex-none sticky top-0 h-[var(--breadcrumb-height)] flex flex-col justify-center p-4 px-8 border-t-0 border-b bg-gray-100">
			<div className="container">
				<ShadcnBreadcrumb>
					<BreadcrumbList>
						{segments.map((segment, index) => {
							const isLast = index === segments.length - 1;
							const label = formatUrlString(breadcrumbMap[segment] || segment);
							const href = formatUrlString(`/${segments.slice(0, index + 1).join('/')}`);

							return (
								<>
									<BreadcrumbItem key={segment}>{isLast ? <BreadcrumbPage>{label}</BreadcrumbPage> : <Link to={href}>{label}</Link>}</BreadcrumbItem>
									{!isLast && <BreadcrumbSeparator />}
								</>
							);
						})}
					</BreadcrumbList>
				</ShadcnBreadcrumb>
			</div>
		</div>
	);
}
