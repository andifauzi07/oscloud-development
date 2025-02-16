import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

// Define the data row type
type SalesRow = {
    SalesRevenue: string;
    action: string;
};

const data: SalesRow[] = [
    {
        SalesRevenue: "Revenue",
        action: "Active",
    },
    {
        SalesRevenue: "Other",
        action: "Active",
    },
    {
        SalesRevenue: "Expenditure",
        action: "Active",
    },
    {
        SalesRevenue: "Labour Cost",
        action: "Active",
    },
    {
        SalesRevenue: "Transport Cost",
        action: "Active",
    },
    {
        SalesRevenue: "Costume Cost",
        action: "Active",
    },
    {
        SalesRevenue: "Manager fee",
        action: "Active",
    },
    {
        SalesRevenue: "Other cost",
        action: "Active",
    },
];

// Define columns
const columns: ColumnDef<SalesRow>[] = [
    {
        accessorKey: "SalesRevenue",
        header: "Revenue",
    },
  
    {
        accessorKey: "action",
        header: "", // Empty header for Action
        cell: () => <span>Active</span>, // All actions are "Active"
    },
];

export const Route = createFileRoute("/projects/setting/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="flex flex-col flex-1 h-full">
            {/* Tabs Section */}
            <Tabs defaultValue="dataField">
                <TabsList className="justify-start w-full gap-8 bg-white border [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 px-4">
                    <TabsTrigger
                        value="dataField"
                        className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2"
                    >
                        Data Field
                    </TabsTrigger>
                    <TabsTrigger
                        value="dataCategory"
                        className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2"
                    >
                        Data Category
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

                {/* DataField Tab */}
                <TabsContent className="m-0 rounded-none" value="dataField">
                        <DataTable columns={columns} data={data} />
                </TabsContent>

                {/* DataCategory Tab */}
                <TabsContent className="m-0 rounded-none" value="dataCategory">
                    <DataTable columns={columns} data={data} />
                </TabsContent>
            </Tabs>
        </div>
    );
}