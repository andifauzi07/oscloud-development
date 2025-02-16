import MenuList from "@/components/menuList";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { createFileRoute, Link } from "@tanstack/react-router";
import { RowExpanding } from "@tanstack/react-table";

export const Route = createFileRoute("/employee/setting/department/")({
    component: RouteComponent,
});

// Define the data structure for departments
interface Department {
    departmentName: string;
    parentDepartment: string;
    manager: string;
    employees: string;
    action: string;
}

// Sample data
const data: Department[] = [
    {
        departmentName: "Sales department",
        parentDepartment: "-",
        manager: "12",
        employees: "12",
        action: "VIEW",
    },
    {
        departmentName: "Marketing department",
        parentDepartment: "-",
        manager: "45",
        employees: "45",
        action: "VIEW",
    },
    {
        departmentName: "Social media team",
        parentDepartment: "Marketing department",
        manager: "05",
        employees: "05",
        action: "VIEW",
    },
];
function RouteComponent() {
    // Define columns for the new DataTable
    const columns = [
        {
            header: "Department Name",
            accessorKey: "departmentName",
        },
        {
            header: "Parent Department",
            accessorKey: "parentDepartment",
        },
        {
            header: "Manager",
            accessorKey: "manager",
        },
        {
            header: "Employees",
            accessorKey: "employees",
        },
        {
            header: "",
            accessorKey: "action", // Use 'action' as the accessorKey for actions
            cell: ({ row }: { row: any }) => (
                <Link
                    to={`/employee/setting/department/$departmentName`}
                    params={{ departmentName: row.original.departmentName }}
                    className="w-20 px-4 py-2 text-black transition bg-transparent border rounded-none link hover:bg-gray-100"
                >
                    VIEW
                </Link>
            ),
        },
    ];

    return (
        <div className="flex-1 h-full">
            {/* Top Navigation */}
            <div className="flex-none min-h-0 border-b">
                <div className="container">
                    <MenuList
                        items={[
                            {
                                label: "Data Field",
                                path: "/employee/setting",
                            },
                            {
                                label: "Category",
                                path: "/employee/setting/category",
                            },
                            {
                                label: "Department",
                                path: "/employee/setting/department",
                            },
                        ]}
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end flex-none w-full">
                <Button className="w-20 text-black bg-transparent border link border-r-none min-h-14">
                    ADD+
                </Button>
                <Button className="w-20 text-black bg-transparent border link min-h-14">
                    EDIT
                </Button>
            </div>

            {/* Data Table */}
            <div>
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    );
}
