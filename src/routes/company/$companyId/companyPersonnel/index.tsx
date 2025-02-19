import { createFileRoute } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { mockEmployees } from "@/config/mockData/employees";
import { Link } from "@tanstack/react-router";
import MenuList from "@/components/menuList";
import { mockCompanies } from "@/config/mockData/companies";
import { DataTable } from "@/components/ui/data-table";

export const Route = createFileRoute("/company/$companyId/companyPersonnel/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { companyId } = useParams({ strict: false });

    // Transform mock data into the required format
    const data = mockEmployees.map((employee) => {
        const company = mockCompanies.find(
            (comp) => comp.id === employee.companyId
        );
        return {
            id: employee.id,
            name: employee.name,
            company: company ? company.name : "Unknown",
            companyId: employee.companyId,
            manager: company?.managers.map((m) => m.name).join(", ") || "None",
            activeLeads: employee.leads.filter(
                (lead) => lead.status === "active"
            ).length,
            closedLeads: employee.leads.filter(
                (lead) => lead.status === "completed"
            ).length,
            status: employee.isTemporary ? "Temporary" : "Permanent",
            addedAt: employee.joinedDate,
        };
    });

    // Define columns with custom cells
    const columns = [
        { header: "ID", accessorKey: "id" },
        { header: "Name", accessorKey: "name" },
        { header: "Company", accessorKey: "company" },
        { header: "Manager", accessorKey: "manager" },
        { header: "Active Leads", accessorKey: "activeLeads" },
        { header: "Closed Leads", accessorKey: "closedLeads" },
        { header: "Status", accessorKey: "status" },
        {
            header: "Actions",
            accessorKey: "id",
            cell: ({ row }: any) => (
                <Button variant="outline" className="w-20">
                    <Link params={{ companyId: row.original.companyId, companyPersonnelId: row.original.id }} to="/company/$companyId/companyPersonnel/$companyPersonnelId">
                        VIEW
                    </Link>

                </Button>
            ),
        },
    ];

    return (
        <div className="flex-1 h-full">
            <div className="items-center flex-none min-h-0 border-b">
                <div className="container flex items-center justify-between px-4">
                    <MenuList
                        items={[
                            {
                                label: "Profile",
                                path: `/company/${companyId}`,
                            },
                            {
                                label: "Personnel",
                                path: `/company/${companyId}/companyPersonnel`,
                            },
                        ]}
                    />

                    <Link
                        className="relative"
                        to="/performance/setting"
                    >
                        Settings
                    </Link>
                </div>
            </div>
            <div className="flex items-center justify-start px-8 bg-white border border-l-0 min-h-14">
                <h2 className="text-base">Company Personnel of {companyId}</h2>
            </div>
            <div className="flex justify-end flex-none w-full bg-white">
                <Button className="w-20 text-black bg-transparent border md:w-20 link border-r-none min-h-14">
                    ADD+
                </Button>
                <Button className="w-20 text-black bg-transparent border md:w-20 link min-h-14">
                    EDIT
                </Button>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    );
}
