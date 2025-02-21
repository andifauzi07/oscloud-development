import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AdvancedFilterPopover from '@/components/search/advanced-search';
import { useWorkspaceEmployees } from '@/hooks/useEmployee';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../components/ui/data-table';
import Loading from '@/components/Loading';

export interface Employee {
    employeeid: number;
    name: string;
    email: string;
    profileimage: string;
    employeecategoryid: number;
    departmentid: number;
    workspaceid: number;
    employeeCategory: {
        categoryid: number;
        categoryname: string;
        parentcategoryid: number;
    };
    department: {
        departmentid: number;
        departmentname: string;
        parentdepartmentid: number | null;
    };
}

const columns = [
    {
        accessorKey: 'profileimage',
        header: '',
        cell: ({ row }: any) => (
            <div className="flex items-center justify-center h-full">
                <figure className="w-16 h-16 overflow-hidden rounded-full">
                    <img
                        className="object-cover w-full h-full"
                        src={row.original.profileimage || '/default-avatar.png'}
                        alt={`${row.original.name}'s profile`}
                    />
                </figure>
            </div>
        ),
    },
    {
        accessorKey: 'employeeid',
        header: 'ID',
    },
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }: any) => (
            <Link
                to={'/employee/$userId'}
                params={{ userId: row.original.employeeid.toString() }}
                className="text-blue-600 hover:underline">
                {row.original.name || '-'}
            </Link>
        ),
    },
    {
        accessorKey: 'employeeCategory.categoryname',
        header: 'Employee Category',
        cell: ({ row }: any) => row.original.employeeCategory?.categoryname || '-'
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }: any) => (
            row.original.email ? (
                <a href={`mailto:${row.original.email}`} className="text-blue-600 hover:underline">
                    {row.original.email}
                </a>
            ) : '-'
        ),
    },
    {
        accessorKey: 'department.departmentname',
        header: 'Department',
        cell: ({ row }: any) => row.original.department?.departmentname || '-'
    },
    // {
    //     accessorKey: 'status',
    //     header: 'Status',
    //     cell: ({ row }) => row.original.status || 'Active'
    // },
    // {
    //     accessorKey: 'position',
    //     header: 'Position',
    //     cell: ({ row }) => row.original.position || '-'
    // },
    // {
    //     accessorKey: 'phone',
    //     header: 'Phone',
    //     cell: ({ row }) => row.original.phone || '-'
    // },
    {
        id: 'actions',
        header: '',
        cell: ({ row }: any) => (
            <Link
                to={'/employee/$userId'}
                params={{ userId: row.original.employeeid.toString() }}>
                <Button variant="outline" className="w-20">
                    DETAIL
                </Button>
            </Link>
        ),
    },
];

export const Route = createFileRoute('/employee/')({
    component: RouteComponent,
});

function RouteComponent() {
    const { employees, loading } = useWorkspaceEmployees();

    if (loading) {
        return <Loading />
    }

    return (
        <div className="flex flex-col flex-1 h-full">
            <div className="flex-none min-h-0 px-4 py-2 bg-white border-b">
                <div className="container flex justify-between md:px-6">
                    <h1>Employee List</h1>
                    <Link to="/employee/setting">Settings</Link>
                </div>
            </div>

            <div className="flex flex-row flex-wrap items-center justify-between w-full p-8 pt-4 bg-white border-b md:flex-row">
                <div className="flex flex-row flex-wrap gap-4">
                    <div className="flex flex-col space-y-2 md:w-auto">
                        <Label htmlFor="keyword">Keyword</Label>
                        <Input
                            type="text"
                            id="keyword"
                            placeholder="Search employees..."
                            className="border rounded-none w-[400px]"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label>Status</Label>
                        <div className="flex">
                            <Button
                                className="w-20 bg-black rounded-none"
                            >
                                Active
                            </Button>
                            <Button
                                variant="outline"
                                className="w-20 rounded-none"
                            >
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

            <div className="flex justify-end flex-none w-full bg-white">
                <Button className="text-black bg-transparent border-l border-r md:w-20 link min-h-14">
                    ADD+
                </Button>
                <Button className="text-black bg-transparent border-r md:w-20 link min-h-14">
                    EDIT
                </Button>
            </div>

<<<<<<< HEAD
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
			<div className="flex-none min-h-0 px-4 py-2 border-r bg-white border-b">
				<div className="container flex justify-between md:px-6">
					<h1>Employee List</h1>
					<Link to="/employee/setting">Settings</Link>
				</div>
			</div>

			<div className="flex flex-row flex-wrap items-center justify-between w-full px-8 py-4 bg-white border-b border-r md:flex-row">
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
				</div>

				<div className="flex flex-col space-y-2">
					<Label>Duration</Label>
					<div className="flex items-center gap-2">
						<Input
							type="date"
							enableEmoji={false}
							className="w-[150px] border rounded-none"
						/>
						<span className="text-gray-500">-</span>
						<Input
							enableEmoji={false}
							type="date"
							className="w-[150px] border rounded-none"
						/>
					</div>
				</div>

				<div className="flex flex-col space-y-2">
					<Label>‎</Label>
					<AdvancedFilterPopover />
				</div>
			</div>
			{/* Responsive action buttons */}
			<div className="flex justify-end flex-none w-full bg-white">
				<Button className="text-black bg-transparent border-l border-r md:w-20 link border-r-none min-h-10">ADD+</Button>
				<Button className="text-black bg-transparent border-r md:w-20 link min-h-10">EDIT</Button>
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
=======
            <div className="border-r">
                <DataTable
                    columns={columns}
                    data={employees}
                />
            </div>
        </div>
    );
>>>>>>> 81ca0ace08b83ae48119bc118ed748142bef435a
}
