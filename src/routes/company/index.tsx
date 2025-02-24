import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Users, Target } from 'lucide-react';
import { CompanyTypes, mockCompanies } from '../../config/mockData/companies';
import { mockEmployees } from '../../config/mockData/employees';
import AdvancedFilterPopover from '@/components/search/advanced-search';
import { TitleWrapper } from '@/components/wrapperElement';

// Utility functions
const getCompanyPersonnelCount = (companyId: number): number => {
	return mockEmployees.filter((employee) => employee.companyId === companyId).length;
};

const getActiveLeadsCount = (companyId: number): number => {
	return mockEmployees
		.filter((employee) => employee.companyId === companyId)
		.reduce((count, employee) => {
			return count + employee.leads.filter((lead) => lead.status === 'active').length;
		}, 0);
};

const columns: ColumnDef<CompanyTypes>[] = [
	{
		accessorKey: 'image',
		header: '',
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<img
					src={row.original.image}
					alt={`${row.original.name} logo`}
				/>
			</div>
		),
	},
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<span className="font-medium">{row.original.id}</span>
			</div>
		),
	},
	{
		accessorKey: 'name',
		header: 'Company',
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<span className="text-xs whitespace-nowrap">{row.original.name}</span>
			</div>
		),
	},
	{
		accessorKey: 'personnelCount',
		header: 'Personnel',
		cell: ({ row }) => {
			const count = getCompanyPersonnelCount(row.original.id);
			return (
				<div className="flex items-center gap-2 text-xs whitespace-nowrap">
					<Users className="w-4 h-4" />
					<span>{count}</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'categoryGroup',
		header: 'Category',
		cell: ({ row }) => <span className="px-2 py-1 bg-gray-100 rounded-full text-xs whitespace-nowrap">{row.original.categoryGroup}</span>,
	},
	{
		accessorKey: 'cities',
		header: 'Cities',
		cell: ({ row }) => (
			<div className="flex flex-wrap gap-1 text-xs whitespace-nowrap">
				{row.original.cities.map((city, index) => (
					<span
						key={index}
						className="px-2 py-1 text-xs whitespace-nowrap bg-gray-100 rounded-full">
						{city}
					</span>
				))}
			</div>
		),
	},
	{
		accessorKey: 'managers',
		header: 'Managers',
		cell: ({ row }) => (
			<div className="flex flex-col gap-1">
				{row.original.managers.map((manager, index) => (
					<div
						key={index}
						className="text-xs whitespace-nowrap">
						{manager.name} ({manager.role})
					</div>
				))}
			</div>
		),
	},
	{
		accessorKey: 'activeLeads',
		header: 'Active Leads',
		cell: ({ row }) => {
			const leads = getActiveLeadsCount(row.original.id);
			return (
				<div className="flex items-center gap-2 text-xs whitespace-nowrap">
					<Target className="w-4 h-4" />
					<span>{leads}</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'createdAt',
		header: 'Created Date',
	},
	{
		id: 'email',
		accessorKey: 'email',
		header: 'Contact Email',
	},
	{
		id: 'detail',
		header: '',
		cell: ({ row }: any) => (
			<Link
				to={`/company/$companyId`}
				params={{ companyId: row.original.id }}
				className="w-full h-full">
				<Button
					variant="outline"
					className="w-20 h-full">
					DETAIL
				</Button>
			</Link>
		),
	},
];

export const Route = createFileRoute('/company/')({
	component: RouteComponent,
});

function RouteComponent() {
	const [orderedColumns, setOrderedColumns] = useState<ColumnDef<CompanyTypes>[]>(columns);
	const [draggedKey, setDraggedKey] = useState<string | null>(null);
	const [advancedSearchFilter, setAdvancedSearchFilter] = useState('');
	const [searchKeyword, setSearchKeyword] = useState('');

	const filteredCompanies = React.useMemo(() => {
		return mockCompanies.filter((company) => {
			const searchLower = searchKeyword.toLowerCase();
			if (!searchKeyword) return true;

			switch (advancedSearchFilter) {
				case 'Filter by Name':
					return company.name.toLowerCase().includes(searchLower);
				case 'Filter by Date':
					return company.createdAt.includes(searchKeyword);
				default:
					return (
						company.name.toLowerCase().includes(searchLower) ||
						company.categoryGroup.toLowerCase().includes(searchLower) ||
						company.cities.some((city) => city.toLowerCase().includes(searchLower)) ||
						company.email.toLowerCase().includes(searchLower)
					);
			}
		});
	}, [searchKeyword, advancedSearchFilter]);

	useEffect(() => {
		const savedOrder = localStorage.getItem('companyColumnOrder');
		if (savedOrder) {
			const keysOrder: string[] = JSON.parse(savedOrder);
			const newOrder = keysOrder.map((key) => columns.find((col) => col.id === key)).filter((col) => col !== undefined) as ColumnDef<CompanyTypes>[];
			if (newOrder.length === columns.length) {
				setOrderedColumns(newOrder);
			}
		}
	}, []);

	const handleDragStart = (e: React.DragEvent<HTMLDivElement>, key: string) => {
		setDraggedKey(key);
		e.dataTransfer.effectAllowed = 'move';
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropKey: string) => {
		e.preventDefault();
		if (!draggedKey || draggedKey === dropKey) return;

		const newOrder = [...orderedColumns];
		const fromIndex = newOrder.findIndex((col) => col.id === draggedKey);
		const toIndex = newOrder.findIndex((col) => col.id === dropKey);

		const [removed] = newOrder.splice(fromIndex, 1);
		newOrder.splice(toIndex, 0, removed);

		setOrderedColumns(newOrder);
		localStorage.setItem('companyColumnOrder', JSON.stringify(newOrder.map((col) => col.id)));
		setDraggedKey(null);
	};

	// Use TanStack Table's rendering logic
	const table = useReactTable({
		data: filteredCompanies,
		columns: orderedColumns,
		getCoreRowModel: getCoreRowModel(),
	});

	console.log(table.getRowModel().rows[0].getVisibleCells()[0]);
	console.log(table.getRowModel().rows[0].getVisibleCells()[0].id);
	return (
		<div className="flex flex-col flex-1 h-full">
			<TitleWrapper>
				<h1 className="text-base">Company </h1>
				<Link to="/company/setting">Settings</Link>
			</TitleWrapper>
			<div className="flex flex-row flex-wrap items-center justify-between w-full px-8 py-4 bg-white border-b border-r md:flex-row">
				<div className="flex gap-8">
					<div className="flex flex-col space-y-2 bg-white md:w-auto">
						<Label htmlFor="keyword">Keyword</Label>
						<Input
							type="keyword"
							id="keyword"
							placeholder=""
							className="border rounded-none w-[400px]"
						/>
					</div>
					<div className="flex flex-col space-y-2">
						<Label>Status</Label>
						<div className="flex">
							<Button
								size="default"
								className="w-full bg-black rounded-none md:w-20">
								Active
							</Button>
							<Button
								size="default"
								variant="outline"
								className="w-full rounded-none md:w-20">
								All
							</Button>
						</div>
					</div>
				</div>

				<div className="flex flex-col space-y-2">
					<Label>‎</Label>
					<AdvancedFilterPopover />
				</div>
			</div>

			<div className="flex justify-end flex-none bg-white">
				<Button className="text-black bg-transparent border-r border-l h-10 md:w-20 link border-r-none ">ADD+</Button>
				<Button className="text-black bg-transparent border-b-0 border-r h-10 md:w-20 link ">EDIT</Button>
			</div>
			<div className="flex-1 overflow-auto">
				<div className="max-w-full overflow-x-auto">
					<div className="max-h-[500px] overflow-y-auto border-b border-t border-r">
						<table className="w-full border-collapse table-auto">
							<thead className="bg-gray-100 border-b sticky top-0 z-10">
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<th
												key={header.id}
												className="py-4 whitespace-nowrap px-2 text-left font-bold text-xs text-[#0a0a30]"
												draggable
												onDragStart={(e) => handleDragStart(e, header.column.id)}
												onDragOver={handleDragOver}
												onDrop={(e) => handleDrop(e, header.column.id)}>
												{flexRender(header.column.columnDef.header, header.getContext())}
											</th>
										))}
									</tr>
								))}
							</thead>
							<tbody className="divide-y divide-gray-200">
								{table.getRowModel().rows.map((row) => (
									<tr
										key={row.id}
										className="hover:bg-gray-50 bg-white text-left">
										{row.getVisibleCells().map((cell) => (
											<td
												key={cell.id}
												className={`px-2 max-h-20 py-2 text-xs ${cell.column.id === 'image' ? 'w-16 h-16 min-w-[64px]' : ''}`}>
												{cell.column.id === 'image' ? (
													<img
														src={cell.getValue() as string}
														alt="Company logo"
														className="w-16 h-16 object-cover"
													/>
												) : (
													<span className="whitespace-nowrap">{flexRender(cell.column.columnDef.cell, cell.getContext())} </span>
												)}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
