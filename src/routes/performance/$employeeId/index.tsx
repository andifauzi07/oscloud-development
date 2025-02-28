import { createFileRoute } from '@tanstack/react-router';
import { Link, useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import MenuList from '@/components/menuList';
import { DataTable } from '@/components/ui/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Heading1 } from 'lucide-react';
import { usePerformanceTemplate, usePerformanceTemplates } from '@/hooks/usePerformance';
import { useEmployee } from '@/hooks/useEmployee';
import Loading from '@/components/Loading';
import { usePerformanceSheets } from '../../../hooks/usePerformance';
import { createSheet } from '../../../store/slices/performanceSlice';

function RouteComponent() {
	const { employeeId } = useParams({ strict: false });
	const { template, loading: templatesLoading } = usePerformanceTemplate(Number(employeeId));
	const { employee, loading: employeeLoading } = useEmployee(Number(employeeId));
	const { sheets, loading: sheetsLoading } = usePerformanceSheets({
		employeeId: Number(employeeId),
	});

	if (!employeeId) return null;
	// if (templatesLoading || employeeLoading || sheetsLoading) return <Loading />;

	// Transform sheets data for the table
	const transformedSheets = sheets.map((sheet) => ({
		id: sheet.sheetId.toString(),
		name: sheet.employee.name,
		template: sheet.template.name,
		date: new Date(sheet.createdDate).toLocaleDateString(),
	}));

	const columns = [
		{
			header: () => <h1 className="pl-8">Name</h1>,
			accessorKey: 'name',
			cell: ({ row }: any) => <h1 className="pl-8">{row.original.name}</h1>,
		},
		{
			header: 'Template',
			accessorKey: 'template',
			cell: ({ row }: any) => row.original.template,
		},
		{
			header: 'Date',
			accessorKey: 'date',
		},
		{
			id: 'actions',
			cell: ({ row }: any) => (
				<div className="w-full flex justify-end">
					<Link
						to={`/performance/$employeeId/$sheetId`}
						params={{
							sheetId: row.original.id,
							employeeId: employeeId.toString(),
						}}>
						<Button
							variant="outline"
							className="w-20 border-r border-l border-t-0 border-b-0">
							DETAIL
						</Button>
					</Link>
				</div>
			),
		},
	];

	const handleCreateSheet = () => {
		console.log('CREATE');
	};

	return (
		<div className="flex-1 h-full">
			{/* Header Section */}
			<div className="flex-none min-h-0 border-b border-r">
				<div className="container flex flex-row items-center justify-between">
					<div className="flex items-center gap-4 pl-8">
						<h1 className="text-xl font-semibold">{employee?.name}'s Performance Reviews</h1>
					</div>
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
						className="text-xs pr-5"
						to="/performance/setting">
						Setting
					</Link>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex justify-end flex-none w-full">
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button className="w-full text-black bg-transparent border-none">
							Latest <ChevronDown />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>Latest</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<Button className="w-20 h-10 text-black bg-transparent border-l border-r link border-r-none">ADD+</Button>
				<Button className="w-20 h-10 text-black bg-transparent border-r link">EDIT</Button>
			</div>

			{/* Data Table */}
			<DataTable
				columns={columns}
				data={transformedSheets}
				loading={templatesLoading || employeeLoading || sheetsLoading}
			/>
		</div>
	);
}

export const Route = createFileRoute('/performance/$employeeId/')({
	component: RouteComponent,
});
