import { Button } from "./ui/button";
import { DataTable } from "./ui/data-table";

// Define the type for a Lead
export interface Lead {
    id: number;
    projectName: string;
    manager: string;
    companyName: string;
    personnelName: string;
    status: string;
    startDate: string;
    value: string;
}

// Column definitions for the new DataTable
export const leadsColumns = [
    {
        header: "ID",
        accessorKey: "id",
    },
    {
        header: "Contract Name",
        accessorKey: "projectName",
    },
    {
        header: "Manager",
        accessorKey: "manager",
    },
    {
        header: "Company Name",
        accessorKey: "companyName",
    },
    {
        header: "Personnel",
        accessorKey: "personnelName",
    },
    {
        header: "Status",
        accessorKey: "status",
    },
    {
        header: "Added At",
        accessorKey: "startDate",
    },
    {
        header: "Contract Value",
        accessorKey: "value",
    },
    {
        header: "Actions",
        accessorKey: "id", // Use 'id' as the accessorKey for actions
        cell: () => (
            <Button variant="outline">View</Button>
        ),
    },
];

// Component to render the DataTable
export const CompanyPersonnelLeadsListDataTable = ({
    data,
    companyName,
    personnelName,
}: {
    data: Lead[];
    companyName: string;
    personnelName: string;
}) => {
    // Add companyName and personnelName to each lead
    const leads = data.map((lead) => ({
        ...lead,
        companyName,
        personnelName,
    }));

    return <DataTable columns={leadsColumns} data={leads} />;
};