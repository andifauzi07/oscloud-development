// src/routes/company/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Users, Target, Mail, Edit, PlusCircle } from "lucide-react";
import { TitleWrapper } from "@/components/wrapperElement";
import { AddRecordDialog } from "@/components/AddRecordDialog";
import { DataTable } from "@/components/ui/data-table";
import AdvancedFilterPopover from "@/components/search/advanced-search";
import { useCompanies } from "@/hooks/useCompany";
import { Company } from "@/store/slices/companySlice";
import { useDebounce } from "@uidotdev/usehooks";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/company/")({
    component: RouteComponent,
});

// Define an interface for the settings data
interface ColumnSetting {
    accessorKey: string;
    label: string;
    type: "text" | "number" | "boolean" | "email" | "date" | "file" | "image";
    date_created: string;
    status: "shown" | "hidden";
}

// Default column settings (will be loaded from local storage or API later)
const defaultColumnSettings: ColumnSetting[] = [
    {
        accessorKey: "logo",
        label: "Company Profile Picture",
        type: "image",
        date_created: new Date().toISOString(),
        status: "shown",
    },
    {
        accessorKey: "companyId",
        label: "ID",
        type: "number",
        date_created: new Date().toISOString(),
        status: "shown",
    },
    {
        accessorKey: "name",
        label: "Company",
        type: "text",
        date_created: new Date().toISOString(),
        status: "shown",
    },
    {
        accessorKey: "personnel",
        label: "Personnel No.",
        type: "number",
        date_created: new Date().toISOString(),
        status: "shown",
    },
    {
        accessorKey: "category_group",
        label: "Category Group",
        type: "text",
        date_created: new Date().toISOString(),
        status: "shown",
    },
    {
        accessorKey: "city",
        label: "Cities",
        type: "text",
        date_created: new Date().toISOString(),
        status: "shown",
    },
    {
        accessorKey: "created_at",
        label: "Created at",
        type: "date",
        date_created: new Date().toISOString(),
        status: "shown",
    },
    {
        accessorKey: "managerid",
        label: "Manager",
        type: "number",
        date_created: new Date().toISOString(),
        status: "shown",
    },
    {
        accessorKey: "product",
        label: "Product",
        type: "text",
        date_created: new Date().toISOString(),
        status: "shown",
    },
    {
        accessorKey: "activeLeads",
        label: "Active Leads",
        type: "number",
        date_created: new Date().toISOString(),
        status: "shown",
    },
    {
        accessorKey: "email",
        label: "Email",
        type: "email",
        date_created: new Date().toISOString(),
        status: "shown",
    },
    {
        accessorKey: "detail",
        label: "View",
        type: "text",
        date_created: new Date().toISOString(),
        status: "shown",
    },
];

function RouteComponent() {
    const [columnSettings, setColumnSettings] = useState<ColumnSetting[]>(
        defaultColumnSettings
    );
    const [searchKeyword, setSearchKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const debouncedSearchKeyword = useDebounce(searchKeyword, 500);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isEditable, setIsEditable] = useState(false);
    //Define the filter here, to avoid unnecessary re render.
    const filters = useMemo(() => ({ category: "" }), []);
    const { companies, loading, addCompany, total, currentPage, perPage } =
        useCompanies(filters, debouncedSearchKeyword, page, limit);

    const filteredCompanies = useMemo(() => {
        return companies.filter((company) => {
            if (!statusFilter) return true;
            // Add more filter options here if needed.
            return true;
        });
    }, [companies, statusFilter]);

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem("companyColumnSettings");
        if (savedSettings) {
            setColumnSettings(JSON.parse(savedSettings));
        }
    }, []);

    // Save settings to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(
            "companyColumnSettings",
            JSON.stringify(columnSettings)
        );
    }, [columnSettings]);

    // Function to generate columns from settings (NOW INSIDE THE COMPONENT)
    const generateColumns = useCallback(
        (settings: ColumnSetting[]): ColumnDef<Company>[] => {
            return settings
                .filter((setting) => setting.status === "shown") // Only shown columns
                .map((setting) => {
                    const columnDef: ColumnDef<Company> = {
                        accessorKey: setting.accessorKey,
                        header: setting.label,
                        id: setting.accessorKey, // Add the id
                    };
                    // Custom cells for some columns
                    switch (setting.accessorKey) {
                        case "logo":
                            columnDef.cell = ({ row }) => (
                                <div className="flex items-center justify-start h-full">
                                    <figure className="w-16 h-16 overflow-hidden">
                                        <img
                                            className="object-cover w-full h-full"
                                            src={
                                                row.original.logo ||
                                                "/default-avatar.png"
                                            }
                                            alt={`${row.original.name} logo`}
                                        />
                                    </figure>
                                </div>
                            );
                            break;
                        case "companyId":
                            break;
                        case "name":
                            columnDef.cell = ({ row }) => (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs whitespace-nowrap">
                                        {row.original.name}
                                    </span>
                                </div>
                            );
                            break;
                        case "personnel":
                            columnDef.cell = ({ row }) => {
                                const count = row.original.personnel.length;
                                return (
                                    <div className="flex items-center gap-2 text-xs whitespace-nowrap">
                                        <Users className="w-4 h-4" />
                                        <span>{count}</span>
                                    </div>
                                );
                            };
                            break;
                        case "category_group":
                            columnDef.cell = ({ row }) => (
                                <span className="px-2 py-1 text-xs whitespace-nowrap">
                                    {row.original.category_group}
                                </span>
                            );
                            break;
                        case "city":
                            columnDef.cell = ({ row }) => (
                                <div className="flex flex-wrap gap-1 text-xs whitespace-nowrap">
                                    {row.original.city}
                                </div>
                            );
                            break;

                        case "managerid":
                            // TODO: should be the name of the manager, now we are doing the id.
                            break;
                        case "activeLeads":
                            columnDef.cell = ({ row }) => {
                                const leads = row.original.activeLeads;
                                return (
                                    <div className="flex items-center gap-2 text-xs whitespace-nowrap">
                                        <span>{leads}</span>
                                    </div>
                                );
                            };
                            break;
                        case "email":
                            columnDef.cell = ({ row }) => (
                                <div className="flex items-center gap-2 text-xs whitespace-nowrap">
                                    <span>{row.original.email}</span>
                                </div>
                            );
                            break;
                        case "detail":
                            columnDef.cell = ({ row }) => (
                                <Link
                                    to={`/company/$companyId`}
                                    params={{
                                        companyId:
                                            row.original.companyId.toString(),
                                    }}
                                    className="w-full h-full"
                                >
                                    <Button
                                        variant="outline"
                                        className="w-20 h-full"
                                    >
                                        DETAIL
                                    </Button>
                                </Link>
                            );
                            break;
                    }

                    // Return the column definition
                    return columnDef;
                });
        },
        []
    );

    // Column drag and drop and visibility management
    const [orderedColumns, setOrderedColumns] = useState<ColumnDef<Company>[]>(
        []
    );

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);
    const handleLimitChange = useCallback((newLimit: number) => {
        setLimit(newLimit);
    }, []);

    useEffect(() => {
        setOrderedColumns(generateColumns(columnSettings));
    }, [columnSettings, generateColumns]);

    const handleAddRecord = useCallback(
        async (data: any) => {
            try {
                // Add your API call here to save the new record
                await addCompany(data);
            } catch (error) {
                console.error("Failed to add record:", error);
            }
        },
        [addCompany]
    );

    const handleStatusChange = useCallback((newStatus: string) => {
        setStatusFilter(newStatus);
    }, []);
    const handleSave = useCallback(async (updatedData: Company[]) => {
        console.log(updatedData);
        //TODO: implement update multiple company
    }, []);
    const editButton = useCallback(() => {
        return (
            <Button
                onClick={() => setIsEditable((prev) => !prev)}
                className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10"
            >
                EDIT+
            </Button>
        );
    }, [isEditable]);

    useEffect(() => {
        console.log(companies);
    }, [companies]); //This will only show when the companies change, you can remove it.

    // Use TanStack Table's rendering logic
    return (
        <div className="flex flex-col flex-1 h-full">
            <TitleWrapper>
                <h1 className="text-base">Company </h1>
                <Link className="text-xs" to="/company/setting">
                    Settings
                </Link>
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
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Label>Status</Label>
                        <div className="flex">
                            <Button
                                size="default"
                                variant={"outline"}
                                className={cn(
                                    "w-20 rounded-none",
                                    statusFilter == "Active" &&
                                        "bg-black text-white"
                                )}
                                onClick={() => handleStatusChange("Active")}
                            >
                                Active
                            </Button>
                            <Button
                                size="default"
                                variant={"outline"}
                                className={cn(
                                    "w-20 rounded-none",
                                    statusFilter == "" && "bg-black text-white"
                                )}
                                onClick={() => handleStatusChange("")}
                            >
                                All
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                    <Label>‎</Label>
                    <div className="flex items-center gap-4">
                        <AdvancedFilterPopover />
                    </div>
                </div>
            </div>

            <div className="flex justify-end flex-none bg-white">
                <AddRecordDialog
                    columns={orderedColumns}
                    onSave={handleAddRecord}
                    nonEditableColumns={[
                        "logo*",
                        "companyId*",
                        "detail*",
                        "personnel*",
                    ]}
                ></AddRecordDialog>
                {editButton()}
            </div>
            <div className="flex-1 overflow-auto">
                <div className="max-w-full overflow-x-auto">
                    <div className="max-h-[500px] overflow-y-auto">
                        <DataTable
                            columns={orderedColumns}
                            data={filteredCompanies}
                            loading={loading}
                            isEditable={isEditable}
                            onSave={handleSave}
                            nonEditableColumns={[
                                "logo*",
                                "companyId*",
                                "detail*",
                                "personnel*",
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
