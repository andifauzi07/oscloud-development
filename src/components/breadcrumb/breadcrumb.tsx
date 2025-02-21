import { Link, useRouterState } from '@tanstack/react-router';
import { BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Breadcrumb as ShadcnBreadcrumb } from '../ui/breadcrumb';

export function Breadcrumb() {
	const router = useRouterState();
	const path = router.location.pathname;
	const segments = path.split('/').filter(Boolean);

	const breadcrumbMap: Record<string, string> = {
		employee: 'Employee List',
		setting: 'Settings',
		category: 'Categories',
		department: 'Departments',
		performance: 'Performance Review',
	};

	const formatSegment = (segment: string): string => {
		// Check if it's a dynamic segment (contains numbers)
		if (/\d/.test(segment)) {
			return 'Details';
		}

		// Check if we have a mapped value
		if (breadcrumbMap[segment]) {
			return breadcrumbMap[segment];
		}

		// Format the segment: remove hyphens, capitalize each word
		return segment
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	};

	return (
		<div className="w-full flex-none sticky top-0 h-[30px] flex flex-col justify-center p-4 px-8 border-r border-b bg-gray-100">
			<div className="container">
				<ShadcnBreadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem key="home">
							<Link to="/">osMerge</Link>
							<span className="mx-2">/</span>
						</BreadcrumbItem>
						{segments.map((segment, index) => {
							const isLast = index === segments.length - 1;
							const label = formatSegment(segment);
							const href = `/${segments.slice(0, index + 1).join('/')}`;

							return (
								<BreadcrumbItem key={`${segment}-${index}`}>
									{isLast ? (
										<BreadcrumbPage>{label}</BreadcrumbPage>
									) : (
										<>
											<Link to={href}>{label}</Link>
											<span className="mx-2">/</span>
										</>
									)}
								</BreadcrumbItem>
							);
						})}
					</BreadcrumbList>
				</ShadcnBreadcrumb>
			</div>
		</div>
	);
}
