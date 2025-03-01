// src/routes/company/setting/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DataTable } from "@/components/ui/data-table";
import { TitleWrapper } from "@/components/wrapperElement";

export const Route = createFileRoute("/company/setting/")({
    component: RouteComponent,
});

// Reusing the ColumnSetting interface from index.tsx for consistency
interface ColumnSetting {
    accessorKey: string;
    label: string;
    type: "text" | "number" | "boolean" | "email" | "date" | "file" | "image";
    date_created: string;
    status: "shown" | "hidden";
}

// Default column settings (same as in index.tsx)
const defaultColumnSettings: ColumnSetting[] = [
    {
        accessorKey: "logo",
        label: "Company Profile Picture",
        type: "image",
        date_created: "2025-01-01",
        status: "shown",
    },
    {
        accessorKey: "companyId",
        label: "ID",
        type: "number",
        date_created: "2025-01-01",
        status: "shown",
    },
    {
        accessorKey: "name",
        label: "Company",
        type: "text",
        date_created: "2025-01-01",
        status: "shown",
    },
    {
        accessorKey: "personnel",
        label: "Personnel No.",
        type: "number",
        date_created: "2025-01-01",
        status: "shown",
    },
    {
        accessorKey: "category_group",
        label: "Category Group",
        type: "text",
        date_created: "2025-01-01",
        status: "shown",
    },
    {
        accessorKey: "city",
        label: "Cities",
        type: "text",
        date_created: "2025-01-01",
        status: "shown",
    },
    {
        accessorKey: "created_at",
        label: "Created at",
        type: "date",
        date_created: "2025-01-01",
        status: "shown",
    },
    {
        accessorKey: "managerid",
        label: "Manager",
        type: "number",
        date_created: "2025-01-01",
        status: "shown",
    },
    {
        accessorKey: "product",
        label: "Product",
        type: "text",
        date_created: "2025-01-01",
        status: "shown",
    },
    {
        accessorKey: "activeLeads",
        label: "Active Leads",
        type: "number",
        date_created: "2025-01-01",
        status: "shown",
    },
    {
        accessorKey: "email",
        label: "Email",
        type: "email",
        date_created: "2025-01-01",
        status: "shown",
    },
    {
        accessorKey: "detail",
        label: "View",
        type: "text",
        date_created: "2025-01-01",
        status: "shown",
    },
];

function RouteComponent() {
    const [columnSettings, setColumnSettings] = useState<ColumnSetting[]>(defaultColumnSettings);
    const [draggedKey, setDraggedKey] = useState<string | null>(null);

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem("companyColumnSettings");
        if (savedSettings) {
            setColumnSettings(JSON.parse(savedSettings));
        }
    }, []);

    // Save settings to localStorage whenever they change
    const saveColumnSettings = useCallback((newSettings: ColumnSetting[]) => {
        localStorage.setItem("companyColumnSettings", JSON.stringify(newSettings));
    }, []);

    useEffect(() => {
        saveColumnSettings(columnSettings);
    }, [columnSettings]); // Removed saveColumnSettings from dependencies

     // Memoized function to generate columns for the settings table
     const generateSettingColumns = useMemo(() => {
        return (
            setColumnSettings: React.Dispatch<React.SetStateAction<ColumnSetting[]>>
        ): ColumnDef<ColumnSetting>[] => {
            return [
                {
                    accessorKey: "label",
                    header: "Data field shown in the Company",
                },
                {
                    accessorKey: "type",
                    header: "Type",
                },
                {
                    accessorKey: "date_created",
                    header: "Date Created",
                },
                {
                    accessorKey: "status",
                    header: "Status",
                    cell: ({ row }) => (
                        // <Switch
                        //     id={row.original.accessorKey}
                        //     checked={row.original.status === "shown"}
                        //     onCheckedChange={(checked) => {
                        //         const newStatus = checked ? "shown" : "hidden";
                        //         setColumnSettings((prevSettings) =>
                        //             prevSettings.map((setting) =>
                        //                 setting.accessorKey === row.original.accessorKey
                        //                     ? { ...setting, status: newStatus }
                        //                     : setting
                        //             )
                        //         );
                        //     }}
                        // />
                        <span>{row.original.status}</span>
                    ),
                },
            ];
        };
    }, []);

    const orderedColumns = useMemo(() => generateSettingColumns(setColumnSettings), [generateSettingColumns]);

    const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, key: string) => {
        setDraggedKey(key);
        e.dataTransfer.effectAllowed = "move";
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, dropKey: string) => {
        e.preventDefault();
        if (!draggedKey || draggedKey === dropKey) return;

        setColumnSettings((prevSettings) => {
            const newOrder = [...prevSettings];
            const fromIndex = newOrder.findIndex((col) => col.accessorKey === draggedKey);
            const toIndex = newOrder.findIndex((col) => col.accessorKey === dropKey);

            const [removed] = newOrder.splice(fromIndex, 1);
            newOrder.splice(toIndex, 0, removed);
            return newOrder;
        });
        setDraggedKey(null);
    }, [draggedKey]);

    const handleResetToDefault = () => {
        setColumnSettings(defaultColumnSettings);
    };

    return (
        <div className="flex flex-col flex-1 w-full h-full">
            <TitleWrapper>
                <Link to="/company/setting" className="text-xs">
                    Company
                </Link>
            </TitleWrapper>
            <div className="px-8 py-4 bg-white border-b border-r">
      
            </div>

            <div className="flex-1 overflow-auto">
                <div className="max-w-full overflow-x-auto">
                    <DataTable
                        columns={orderedColumns}
                        data={columnSettings}
                        // enableRowDragAndDrop={true}
                        // rowDragProps={{
                        //     onDragStart: handleDragStart,
                        //     onDragOver: handleDragOver,
                        //     onDrop: handleDrop,
                        //     draggedKey: draggedKey,
                        // }}
                        // isEditable={true}
                    />
                </div>
            </div>
        </div>
    );
}