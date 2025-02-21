import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AdvancedFilterPopover from '@/components/search/advanced-search';
import { useEmployees, useWorkspaceEmployees } from '@/hooks/useEmployee';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../components/ui/data-table';
import Loading from '@/components/Loading';

interface Employee {
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
        cell: ({ row }: any ) => row.original.employeeCategory?.categoryname || '-'
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

            <div className="border-r">
                <DataTable
                    columns={columns}
                    data={employees}
                />
            </div>
        </div>
    );
}
