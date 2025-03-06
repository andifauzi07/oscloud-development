import { CellContext } from "@tanstack/react-table";
import { BaseColumnSetting } from "@/types/table";
import { CompanyDisplay } from "@/types/company";
import { Link } from "@tanstack/react-router";
import { memo } from "react";
import { Button } from "@/components/ui/button";

// Memoized Image Cell component
const CompanyLogoCell = memo(({ row }: { row: any }) => (
    <div className="flex items-center justify-start h-full">
        <figure className="w-10 h-10 overflow-hidden">
            <img
                className="object-cover w-full h-full"
                src={row.original.logo || "/default-avatar.png"}
                alt={`${row.original.name} logo`}
            />
        </figure>
    </div>
));
CompanyLogoCell.displayName = "CompanyLogoCell";

export const defaultCompanyColumnSettings: BaseColumnSetting<CompanyDisplay>[] =
    [
        {
            accessorKey: "logo",
            label: "",
            type: "image",
            date_created: new Date().toISOString(),
            status: "shown",
            order: 1,
            cell: ({ row }: CellContext<CompanyDisplay, any>) => (
                <CompanyLogoCell row={row} />
            ),
        },
        {
            accessorKey: "companyid",
            label: "ID",
            type: "number",
            date_created: new Date().toISOString(),
            status: "shown",
            order: 2,
        },
        {
            accessorKey: "name",
            label: "Company",
            type: "text",
            date_created: new Date().toISOString(),
            status: "shown",
            order: 3,
        },
        {
            accessorKey: "personnel",
            label: "Personnel No.",
            type: "number",
            date_created: new Date().toISOString(),
            status: "shown",
            order: 4,
        },
        {
            accessorKey: "category_group",
            label: "Category Group",
            type: "text",
            date_created: new Date().toISOString(),
            status: "shown",
            order: 5,
        },
        {
            accessorKey: "city",
            label: "Cities",
            type: "text",
            date_created: new Date().toISOString(),
            status: "shown",
            order: 6,
        },
        {
            accessorKey: "created_at", // Type assertion
            label: "Created at",
            type: "date",
            date_created: new Date().toISOString(),
            status: "shown",
            order: 7,
        },
        {
            accessorKey: "managerid",
            label: "Manager",
            type: "number",
            date_created: new Date().toISOString(),
            status: "shown",
            order: 8,
        },
        {
            accessorKey: "product",
            label: "Product",
            type: "text",
            date_created: new Date().toISOString(),
            status: "shown",
            order: 9,
        },
        {
            accessorKey: "activeLeads",
            label: "Active Leads",
            type: "number",
            date_created: new Date().toISOString(),
            status: "shown",
            order: 10,
        },
        {
            accessorKey: "email",
            label: "Email",
            type: "email",
            date_created: new Date().toISOString(),
            status: "shown",
            order: 11,
        },
        {
            accessorKey: "detail",
            label: "View",
            type: "text",
            date_created: new Date().toISOString(),
            status: "shown",
            order: 12,
            cell: ({ row }: CellContext<CompanyDisplay, any>) => (
                <Link
                    to={`/company/$companyId`}
                    params={{
                        companyId:row.original.companyid.toString(),
                    }}
                >
                    <Button
                        variant="outline"
                        className="w-20 h-full border"
                    >
                        DETAIL
                    </Button>
                </Link>
            ),
        },
    ];
