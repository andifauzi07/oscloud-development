import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useState } from "react";
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Users, Target } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AdvancedFilterPopover from "@/components/search/advanced-search";
import { DataTable } from "@/components/ui/data-table";

// Mock data for Profit & Loss
type ProfitLossTypes = {
    projectName: string;
    manager: string;
    startingDate: string;
    endDate: string;
    clientName: string;
    category: string;
    staff: number;
    revenue: number;
    profit: number;
    profitability: string;
};

const mockProfitLossData: ProfitLossTypes[] = [
    {
        projectName: "Project Alpha",
        manager: "John Doe",
        startingDate: "2023-01-01",
        endDate: "2023-12-31",
        clientName: "Client A",
        category: "Software Development",
        staff: 5,
        revenue: 100000,
        profit: 25000,
        profitability: "25%",
    },
    {
        projectName: "Project Beta",
        manager: "Jane Smith",
        startingDate: "2023-02-15",
        endDate: "2023-11-30",
        clientName: "Client B",
        category: "Consulting",
        staff: 3,
        revenue: 75000,
        profit: 15000,
        profitability: "20%",
    },
];

// Columns definition
const columns: ColumnDef<ProfitLossTypes>[] = [
    {
        accessorKey: "projectName",
        header: "Project Name",
    },
    {
        accessorKey: "manager",
        header: "Manager",
    },
    {
        accessorKey: "startingDate",
        header: "Starting",
    },
    {
        accessorKey: "endDate",
        header: "End",
    },
    {
        accessorKey: "clientName",
        header: "Client Name",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "staff",
        header: "Staff",
    },
    {
        accessorKey: "revenue",
        header: "Revenue",
        cell: ({ row }) => `$${row.original.revenue.toLocaleString()}`,
    },
    {
        accessorKey: "profit",
        header: "Profit",
        cell: ({ row }) => `$${row.original.profit.toLocaleString()}`,
    },
    {
        accessorKey: "profitability",
        header: "Profitability",
    },
    {
        accessorKey: "action",
        header: "EDIT",

        cell: ({ row }) => <Link to={'/features/ProfitLoss/$projectName'}
            params={{ projectName: row.original.projectName }}
            className="border w-20 px-4 py-2"
        >VIEW</Link>
    },
];

export const Route = createFileRoute("/features/ProfitLoss/")({
    component: RouteComponent,
});

function RouteComponent() {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [advancedSearchFilter, setAdvancedSearchFilter] = useState("");

    const filteredData = React.useMemo(() => {
        return mockProfitLossData.filter((item) => {
            const searchLower = searchKeyword.toLowerCase();
            if (!searchKeyword) return true;

            return (
                item.projectName.toLowerCase().includes(searchLower) ||
                item.manager.toLowerCase().includes(searchLower) ||
                item.clientName.toLowerCase().includes(searchLower) ||
                item.category.toLowerCase().includes(searchLower)
            );
        });
    }, [searchKeyword, advancedSearchFilter]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="flex flex-col flex-1 h-full">
            <div className="px-8 py-4">
                <h1 className="text-gray-500">Project List</h1>

            </div>
            {/* Tabs Section */}
            <Tabs defaultValue="list">
                <TabsList className="justify-start w-full gap-8 bg-white border [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 px-4">
                    <TabsTrigger
                        value="table"
                        className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2"
                    >
                        Table View
                    </TabsTrigger>

                    <TabsTrigger
                        value="list"
                        className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2"
                    >
                        List View
                    </TabsTrigger>
                </TabsList>

                <div className="flex justify-end flex-none w-full bg-white">
                    <Button className="text-black bg-transparent border md:w-20 link border-r-none h-14">
                        ADD+
                    </Button>
                    <Button className="text-black bg-transparent border md:w-20 link h-14">
                        EDIT
                    </Button>
                </div>

                {/* List View Tab */}
                <TabsContent className="m-0" value="table">
                    <div className="flex flex-row justify-between w-full pt-4 bg-white border md:flex-row p-8 flex-wrap items-center">
                        <div className="flex flex-col space-y-2 bg-white md:w-auto">
                            <Label htmlFor="keyword">Keyword</Label>
                            <Input
                                type="keyword"
                                id="keyword"
                                placeholder="Search projects..."
                                className="border rounded-none w-[400px]"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Label>Duration</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="date"
                                    className="w-[150px] border rounded-none"
                                    enableEmoji={false}
                                />
                                <span className="text-gray-500">-</span>
                                <Input
                                    type="date"
                                    className="w-[150px] border rounded-none"
                                    enableEmoji={false}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Label>Status</Label>
                            <div className="flex">
                                <Button
                                    size="default"
                                    className="w-full bg-black rounded-none md:w-20"
                                >
                                    Active
                                </Button>
                                <Button
                                    size="default"
                                    variant="outline"
                                    className="w-full rounded-none md:w-20"
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

                    {/* Table */}
                    <div className="flex-1 overflow-x-auto">
                        <DataTable columns={columns} data={mockProfitLossData} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}