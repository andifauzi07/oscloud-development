import { createFileRoute } from "@tanstack/react-router";
import { Link, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import MenuList from "@/components/menuList";
import { DataTable } from "@/components/ui/data-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

// Define the data structure for performance sheets
interface PerformanceSheet {
    id: number;
    name: string;
    template: string;
    date: string;
}

export const Route = createFileRoute("/performance/$employeeId/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { employeeId } = useParams({ strict: false });
    if (!employeeId) return

    // Define columns for the new DataTable
    const columns = [
        { header: "Name", accessorKey: "name" },
        { header: "Template", accessorKey: "template" },
        { header: "Date", accessorKey: "date" },
        {
            header: "",
            accessorKey: "id", // Use 'id' as the accessorKey for actions
            cell: ( props: any )  => (
                <Link
                    to={`/performance/$employeeId/$sheetId`}
                    params={{
                        sheetId: props.row.original.id,
                        employeeId: employeeId.toString()
                    }}
                >
                    <Button variant="outline" className="w-20">
                        DETAIL
                    </Button>
                </Link>
            ),
        },
    ];

    // Sample data
    const data: PerformanceSheet[] = [
        {
            id: 1,
            name: "Performance Sheet Vol.2",
            template: "Performance Sheet Template 1",
            date: "2024.01.15",
        },
        {
            id: 2,
            name: "Performance Sheet Vol.1",
            template: "Performance Sheet Template 1",
            date: "2024.01.01",
        },
    ];

    return (
        <div className="flex-1 h-full">
            {/* Header Section */}
            <div className="flex-none min-h-0 border-b">
                <div className="container flex flex-row items-center justify-between pt-4">
                    <MenuList
                        items={[
                            {
                                label: "Sheet List",
                                path: `/performance/${employeeId}`,
                            },
                            {
                                label: "Access Control",
                                path: `/performance/${employeeId}/accesscontrol`,
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
