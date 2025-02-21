import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { ColumnDef, createColumnHelper, useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Button } from '../../components/ui/button';
import { mockEmployees, EmployeeTypes } from '../../config/mockData/employees';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import AdvancedFilterPopover from '../../components/search/advanced-search';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEmployees } from '@/hooks/useEmployee';

const columnHelper = createColumnHelper<EmployeeTypes>();

const columns: ColumnDef<EmployeeTypes>[] = [
	columnHelper.display({
		id: 'image',
		cell: ({ row }) => (
			<div className="flex items-center justify-center h-full">
				<figure className="w-16 h-16 overflow-hidden">
					<img
						className="object-cover w-full h-full"
						src={row.original.image}
						alt={`${row.original.name}'s profile`}
					/>
				</figure>
			</div>
		),
	}),
	{
		accessorKey: 'id',
		header: 'ID',
	},
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => (
			<Link
				to={'/employee/$userId'}
				params={{ userId: row.original.id.toString() }}>
				{row.original.name}
			</Link>
		),
	},
	{
		accessorKey: 'category',
		header: 'Employee Category',
	},
	{
		accessorKey: 'email',
		header: 'Email address',
		cell: ({ row }) => (
			<a
				href={`mailto:${row.original.email}`}
				className="text-blue-500 underline">
				{row.original.email}
			</a>
		),
	},
	{
		accessorKey: 'phone',
		header: 'Phone number',
	},
	{
		accessorKey: 'joinedDate',
		header: 'Joined date',
	},
	{
		accessorKey: 'hourlyRateA',
		header: 'Hourly rate A',
	},
	{
		accessorKey: 'hourlyRateB',
		header: 'Hourly rate AB',
	},
	{
		accessorKey: 'projects',
		header: 'Projects',
	},
	{
		accessorKey: 'contact',
		header: 'Contact Detail',
		cell: ({ row }) => (
			<a
				href="#"
				className="text-blue-500 underline">
				{row.original.contact}
			</a>
		),
	},
	{
		accessorKey: 'id',
		header: '',
		cell: ({ row }) => {
			return (
				<Link
					to={'/employee/$userId'}
					params={{ userId: row.original.id.toString() }}
					className="w-full h-full">
					<Button
						variant="outline"
						className="w-20 h-full">
						DETAIL
					</Button>
				</Link>
			);
		},
	},
];

const DRAG_KEY = 'employeeColumnOrder';

export const Route = createFileRoute('/employee/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { employees } = useEmployees();

	const [orderedColumns, setOrderedColumns] = useState<ColumnDef<EmployeeTypes>[]>(columns);
	const [draggedKey, setDraggedKey] = useState<string | null>(null);

	useEffect(() => {
		const savedOrder = localStorage.getItem(DRAG_KEY);
		if (savedOrder) {
			const keysOrder: string[] = JSON.parse(savedOrder);
			const newOrder = keysOrder.map((key) => columns.find((col) => col.id === key)).filter((col) => col !== undefined) as ColumnDef<EmployeeTypes>[];
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
		localStorage.setItem(DRAG_KEY, JSON.stringify(newOrder.map((col) => col.id)));
		setDraggedKey(null);
	};

	// Use TanStack Table's rendering logic
	const table = useReactTable({
		data: mockEmployees,
		columns: orderedColumns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="flex flex-col flex-1 h-full">
			<div className="flex-none min-h-0 px-4 py-2 bg-white border-b border-r">
				<div className="container flex justify-between md:px-6">
					<h1>Employee List</h1>
					<Link to="/employee/setting">Settings</Link>
				</div>
			</div>

			<div className="flex flex-row flex-wrap items-center justify-between w-full p-8 pt-4 bg-white border-b border-r md:flex-row">
				<div className="flex flex-row flex-wrap gap-4">
					<div className="flex flex-col w-full space-y-2 md:w-auto">
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
								className="w-20 bg-black rounded-none md:w-20">
								Active
							</Button>
							<Button
								size="default"
								variant="outline"
								className="w-20 rounded-none md:w-20">
								All
							</Button>
						</div>
					</div>
					<div className="flex flex-col space-y-2">
						<Label>‎</Label>
						<AdvancedFilterPopover />
					</div>
				</div>
			</div>

			{/* Responsive action buttons */}
			<div className="flex justify-end flex-none w-full bg-white">
				<Button className="text-black bg-transparent border-l border-r md:w-20 link border-r-none min-h-14">ADD+</Button>
				<Button className="text-black bg-transparent border-r md:w-20 link min-h-14">EDIT</Button>
			</div>

			{/* Responsive table container */}
			<div className="flex-1 overflow-x-auto">
				<div className="min-w-[1200px]">
					<Table className="p-0 m-0">
						<TableHeader className="bg-gray-100 border-t">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead
											className="py-4 text-[#0a0a30] text-xs font-bold"
											key={header.id}>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow key={row.id}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="text-center">
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
