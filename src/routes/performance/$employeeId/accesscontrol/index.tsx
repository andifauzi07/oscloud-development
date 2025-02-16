import { createFileRoute } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { mockEmployees } from "@/config/mockData/employees";
import { createColumnHelper } from "@tanstack/react-table";
import MenuList from "@/components/menuList";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

type AccessControlUser = {
    id: number;
    name: string;
    role: string;
    email: string;
};

const accessControlUsers: AccessControlUser[] = [
    { id: 1, name: "John Doe", role: "Admin", email: "john@example.com" },
    { id: 2, name: "Jane Smith", role: "Editor", email: "jane@example.com" },
    { id: 3, name: "Mike Johnson", role: "Viewer", email: "mike@example.com" },
];
export const Route = createFileRoute("/performance/$employeeId/accesscontrol/")(
    {
        component: RouteComponent,
    }
);

function RouteComponent() {
    const { employeeId } = useParams({ strict: false });
    const employee = mockEmployees.find((emp) => emp.id === Number(employeeId));
    const columnHelper = createColumnHelper<AccessControlUser>();

    if (!employee) {
        return <div>Employee not found</div>;
    }

    const columns = [
        {
            accessorKey: "id",
            header: () => (
                <h1 className=" text-[#0a0a30] text-base font-bold">ID</h1>
            ),
            cell: ({ row }: any) => <h1 className="text-base">{row}</h1>,
        },
        {
            accessorKey: "name",
            header: () => (
                <h1 className=" text-[#0a0a30] text-base font-bold">Name</h1>
            ),
            cell: ({ row }: any) => <h1 className="text-base">{row}</h1>,
        },
        {
            accessorKey: "role",
            header: () => (
                <h1 className=" text-[#0a0a30] text-base font-bold">Role</h1>
            ),
            cell: ({ row }: any) => <h1 className="text-base">{row}</h1>,
        },
        {
            accessorKey: "email",
            header: () => (
                <h1 className=" text-[#0a0a30] text-base font-bold">
                    Email address
                </h1>
            ),
            cell: ({ row }: any) => (
                <a
                    href={`mailto:${row}}`}
                    className="text-base text-blue-500 underline"
                >
                    {row}
                </a>
            ),
        },
        columnHelper.display({
            id: "actions",
            header: "",
            cell: () => (
                <Button
                    variant="outline"
                    className="self-end w-20 text-black bg-transparent border rounded-none"
                >
                    REMOVE
                </Button>
            ),
        }),
    ];

    return (
        <div className="flex-1 h-full">
            <div className="flex-none min-h-0 border-b">
                <div className="container flex flex-row items-center justify-between pt-4">
                    <MenuList
                        items={[
                            {
                                label: "Sheet List",
                                path: `/dashboard/performance/${employeeId}`,
                            },
                            {
                                label: "Access Control",
                                path: `/dashboard/performance/${employeeId}/accesscontrol`,
                            },
                        ]}
                    />
                    <Link
                        className="relative bottom-2"
                        to="/performance/setting"
                    >
                        Setting
                    </Link>
                </div>
            </div>

            <div className="flex justify-end flex-none w-full border-b">
                <Button className="w-20 text-black bg-transparent border link min-h-14">
                    ADD+
                </Button>
            </div>

            <div className="">
                <DataTable columns={columns} data={accessControlUsers} />
            </div>
        </div>
    );
}
