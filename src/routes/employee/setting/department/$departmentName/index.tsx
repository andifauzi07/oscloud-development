import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";


export const Route = createFileRoute(
    "/employee/setting/department/$departmentName/"
)({
    component: RouteComponent,
});

// Define types for managers and members
type Manager = {
    id: string;
    name: string;
    email: string;
    role: string;
};

type Member = {
    id: string;
    name: string;
    email: string;
    category: string;
    image: string;
};

function RouteComponent() {
    const { departmentName } = useParams({ strict: false });
    const decodedDepartmentName = decodeURIComponent(
        departmentName || "Unknown"
    );
    const [advancedSearchFilter, setAdvancedSearchFilter] = useState("");
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Sample data
    const managers: Manager[] = [
        { id: "1", name: "John Doe", email: "john@example.com", role: "Admin" },
        {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            role: "Manager",
        },
    ];

    const memberData: Member[] = [
        {
            id: "101",
            name: "Alice Johnson",
            email: "alice@example.com",
            category: "Management",
            image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            id: "102",
            name: "Bob Smith",
            email: "bob@example.com",
            category: "Staff",
            image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
    ];

    // Column definitions for managers
    const managerColumns = [
        { header: "Name", accessorKey: "name" },
        {
            header: "ID",
            accessorKey: "id",
            cell: (props: any) => (screenWidth > 640 ? props.row.original.id : null),
        },
        {
            header: "Email",
            accessorKey: "email",
            cell: (props: any) => (
                <span className="truncate">{props.row.original.email}</span>
            ),
        },
        {
            header: "Role",
            accessorKey: "role",
            cell: (props: any) =>
                screenWidth > 768 ? props.row.original.role : null,
        },
        {
            header: "",
            accessorKey: "id",
            cell: (props: any) => (
                <Button
                    variant="outline"
                    onClick={() => handleRemove(props.row.original.id)}
                >
                    Remove
                </Button>
            ),
        },
    ];

    // Column definitions for members
    const memberColumns = [
        {
            header: "Profile",
            accessorKey: "image",
            cell: (props: any) => (
                <img
                    src={props.row.original.image}
                    alt={props.row.original.name}
                    className="w-10 h-10 rounded-full"
                />
            ),
        },
        { header: "Name", accessorKey: "name" },
        {
            header: "ID",
            accessorKey: "id",
            cell: (props: any) => (screenWidth > 640 ? props.row.original.id : null),
        },
        { header: "Email", accessorKey: "email" },
        {
            header: "Category",
            accessorKey: "category",
            cell: (props: any) =>
                screenWidth > 768 ? props.row.original.category : null,
        },
        {
            header: "",
            accessorKey: "id",
            cell: (props: any) => (
                <Button
                    variant="outline"
                    onClick={() => handleRemove(props.row.original.id)}
                >
                    Remove
                </Button>
            ),
        },
    ];

    // Handle remove action
    const handleRemove = (id: string) => {
        console.log("Removing user with ID:", id);
    };

    // Handle advanced search selection
    const handleAdvSearchSelect = (filter: string) => {
        setAdvancedSearchFilter(filter);
    };

    return (
        <div className="flex-1 h-full">
            {/* Header Section */}
            <div className="flex items-center justify-between p-4 bg-white border-b">
                <h1>{decodedDepartmentName}</h1>
                <Button>Edit</Button>
            </div>

            {/* Managers Table */}
            <div className="p-4">
                <h2>Managers</h2>
                <DataTable columns={managerColumns} data={managers} />
            </div>

            {/* Members Table */}
            <div className="p-4">
                <h2>Members</h2>
                <DataTable columns={memberColumns} data={memberData} />
            </div>

            {/* Search Section */}
            <div className="p-4">
                <h3>Search Members</h3>
                <Input placeholder="Keyword" />
                <div className="mt-4">
                    <Label>Status</Label>
                    <RadioGroup defaultValue="active">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="active" id="active" />
                            <Label htmlFor="active">Active</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="all" />
                            <Label htmlFor="all">All</Label>
                        </div>
                    </RadioGroup>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="outline">
                            Advanced search{" "}
                            {advancedSearchFilter &&
                                `(${advancedSearchFilter})`}
                            <ChevronDown className="ml-2" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem
                            onClick={() =>
                                handleAdvSearchSelect("Filter by Name")
                            }
                        >
                            Filter by Name
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                handleAdvSearchSelect("Filter by Date")
                            }
                        >
                            Filter by Date
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                handleAdvSearchSelect("Clear Filters")
                            }
                        >
                            Clear Filters
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
