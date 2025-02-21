import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { mockTemplates } from '@/config/mockData/templates';
import { DataTable } from '@/components/ui/data-table';

export const Route = createFileRoute('/performance/setting/')({
	component: RouteComponent,
});
const columns = [
	{
		header: 'Template',
		accessorKey: 'name',
	},
	{
		header: 'Created At',
		accessorKey: 'created_at',
	},
	{
		header: 'Categories',
		accessorKey: 'categories',
		cell: ({ row }: any) => `${row.original.categories.length} categories`,
	},
	{
		header: '',
		accessorKey: 'id',
		cell: ({ row }: any) => (
			<Link
				to={`/performance/setting/$templateId`}
				params={{ templateId: row.original.id }}>
				<Button
					variant="outline"
					className="w-20">
					DETAIL
				</Button>
			</Link>
		),
	},
];

function RouteComponent() {
	return (
		<div className="flex-1 h-full">
			{/* Header Section */}
			<div className="flex items-center flex-none w-full p-4 bg-white border-b border-r">
				<h1>Template List</h1>
			</div>

			{/* Action Buttons */}
			<div className="flex justify-end flex-none w-full bg-white shadow-none">
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button className="w-full text-black bg-transparent border-none shadow-none">
							Latest <ChevronDown />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>Latest</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				{/* <Link to="/performance/setting/$templateId"> */}
				<Button className="w-20 text-black bg-transparent border-l border-r link border-r-none min-h-14">ADD+</Button>
				{/* </Link> */}
				<Button className="w-20 text-black bg-transparent border-r link min-h-14">EDIT</Button>
			</div>

			{/* Data Table */}
			<div>
				<DataTable
					columns={columns}
					data={mockTemplates}
				/>
			</div>
		</div>
	);
}
