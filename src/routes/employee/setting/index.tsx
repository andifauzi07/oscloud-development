import MenuList from '@/components/menuList';
import { Button } from '@/components/ui/button';
import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '../../../components/ui/data-table';

export const Route = createFileRoute('/employee/setting/')({
  component: RouteComponent,
})

// Define the data structure for DataItem1
interface DataItem1 {
    field: string;
    type: string;
    category: string;
    dateCreated: string;
    dateAdded: string;
    status: string;
    actions: string;
}

// Sample data
const data: DataItem1[] = [
    {
        field: "Name",
        type: "Custom Data",
        category: "",
        dateCreated: "2024.11.01",
        dateAdded: "2024.11.01",
        actions: "REMOVE",
        status: "Active",
    },
    {
        field: "Phone number",
        type: "Custom data",
        category: "Basic information",
        dateCreated: "2024.11.01",
        dateAdded: "2024.11.01",
        actions: "REMOVE",
        status: "Hidden",
    },
    {
        field: "Email address",
        type: "Custom data",
        category: "Basic information",
        dateCreated: "2024.11.02",
        dateAdded: "2024.11.02",
        actions: "REMOVE",
        status: "Active",
    },
    {
        field: "Email address",
        type: "Custom data",
        category: "Basic information",
        dateCreated: "2024.11.02",
        dateAdded: "2024.11.02",
        actions: "REMOVE",
        status: "Active",
    },
];

// Column definitions for the new DataTable
const columns = [
    {
        header: "Data Field Shown in Profile",
        accessorKey: "field",
    },
    {
        header: "Type",
        accessorKey: "type",
    },
    {
        header: "Category",
        accessorKey: "category",
    },
    {
        header: "Date Created",
        accessorKey: "dateCreated",
    },
    {
        header: "Date Added",
        accessorKey: "dateAdded",
    },
    {
        header: "Status",
        accessorKey: "status",
    },
    {
        header: "Actions",
        accessorKey: "actions", // Use 'actions' as the accessorKey for actions
        cell: (props: any) => (
            <button
                className="p-2 border hover:underline"
                onClick={() => console.log("Removing:", props.row.original.actions)}
            >
                REMOVE
            </button>
        ),
    },
];



function RouteComponent() {
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
