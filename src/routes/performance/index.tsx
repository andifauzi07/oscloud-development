import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { mockEmployees, EmployeeTypes } from "@/config/mockData/employees";
import {
    mockPerformanceSheets,
    mockTemplates,
} from "@/config/mockData/templates";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import AdvancedFilterPopover from "@/components/search/advanced-search";

export const Route = createFileRoute("/performance/")({
    component: RouteComponent,
});

const getLatestPerformanceScores = (employeeId: number) => {
    const employeeSheets = mockPerformanceSheets
        .filter((sheet) => sheet.employeeId === employeeId)
        .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

    if (employeeSheets.length === 0) return null;

    const latestSheet = employeeSheets[0];
    const template = mockTemplates.find((t) => t.id === latestSheet.templateId);

    if (!template) return null;

    return template.categories.map((cat) => {
        // Calculate average score for category items
        const categoryScores = Object.values(latestSheet.scores[cat.id] || {});
        const avgScore =
            categoryScores.length > 0 ?
                Math.round(
                    categoryScores.reduce((a, b) => a + b, 0) /
                        categoryScores.length
                )
            :   0;

        return {
            id: cat.id,
            name: cat.name,
            score: avgScore,
        };
    });
};

const columns: ColumnDef<EmployeeTypes>[] = [
    {
        accessorKey: "image",
        header: "",
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
    },
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }: any) => (
            <Link
                to={`/performance/$employeeId`}
                params={{ employeeId: row.original.id }}
            >
                {row.original.name}
            </Link>
        ),
    },
    {
        accessorKey: "category",
        header: "Employee Category",
    },
    ...mockTemplates[0].categories.map((category) => ({
        accessorKey: category.name.toLowerCase().replace(/\s+/g, "_"),
        header: category.name,
        cell: ({ row }: any) => {
            const scores = getLatestPerformanceScores(row.original.id);
            const score = scores?.find((s) => s.name === category.name)?.score;
            return score !== undefined ? `${score}%` : "N/A";
        },
    })),
    {
        id: "detail",
        header: "",
        cell: ({ row }: any) => (
            <Link
                to={`/performance/$employeeId`}
                params={{ employeeId: row.original.id }}
                className="w-full h-full"
            >
                <Button variant="outline" className="w-20 h-full">
                    DETAIL
                </Button>
            </Link>
        ),
    },
];

function RouteComponent() {
    const table = useReactTable({
        data: mockEmployees,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="flex flex-col flex-1 h-full">
            <div className="flex-none min-h-0 py-4 border-b">
                <div className="container flex justify-between px-4 md:px-6">
                    <h1>List View</h1>
                    <Link to="/performance/setting">Settings</Link>
                </div>
            </div>

            <div className="flex flex-row justify-between w-full pt-4 bg-white border md:flex-row p-8 flex-wrap items-center gap-4">
                <div className="flex flex-row gap-4 flex-wrap">
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

                <div className="">
                    <Label>‎</Label>
                    <AdvancedFilterPopover />
                </div>
            </div>

            {/* Responsive action buttons */}
            <div className="flex justify-end flex-none w-full">
                <Button className="text-black bg-transparent border md:w-20 link border-r-none min-h-14">
                    ADD+
                </Button>
                <Button className="text-black bg-transparent border md:w-20 link min-h-14">
                    EDIT
                </Button>
            </div>
            {/* Table Section */}
            <div className="flex-1 overflow-x-auto">
                <div className="min-w-[1200px]">
                    <Table className="p-0 m-0">
                        <TableHeader className="bg-gray-100 border">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            className="py-4 text-[#0a0a30] text-base font-bold"
                                            key={header.id}
                                        >
                                            {header.isPlaceholder ? null : (
                                                flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ?
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        className="h-20"
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                className="text-base"
                                                key={cell.id}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            :   <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
