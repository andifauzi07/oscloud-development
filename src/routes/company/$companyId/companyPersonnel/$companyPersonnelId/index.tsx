import { createFileRoute } from "@tanstack/react-router";
import { Link, useParams } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import MenuList from "@/components/menuList";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { leadsColumns } from "@/components/companyPersonnelLeadsListDataTable";
import AdvancedFilterPopover from "@/components/search/advanced-search";
import { KanbanColumnTypes, Lead } from "@/components/kanban/types";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { PersonnelLead } from "@/types/personnel";
import { usePersonnel } from "@/hooks/usePersonnel";
import { useCompanies } from "@/hooks/useCompany";
import { useProject } from "@/hooks/useProject";
import ScheduleTable from "@/components/EmployeTimeLine";

export const Route = createFileRoute(
    "/company/$companyId/companyPersonnel/$companyPersonnelId/"
)({
    component: RouteComponent,
});

const projectColumns = [
    { header: "Project Name", accessorKey: "name" },
    { header: "Status", accessorKey: "status" },
    { header: "Start Date", accessorKey: "startDate" },
    { header: "End Date", accessorKey: "endDate" },
];

function RouteComponent() {
    const { companyId, companyPersonnelId } = useParams({ strict: false });
    const [advancedSearchFilter] = useState("");

    // Fetch company data
    const { selectedCompany: company, fetchCompany } = useCompanies();

    // Fetch personnel data using the new hook
    const { personnel, loading, error, updatePersonnel, fetchPersonnel } =
        usePersonnel(Number(companyPersonnelId));

    const { addProject } = useProject();

    useEffect(() => {
        if (companyId) fetchCompany(Number(companyId));
    }, [companyId, fetchCompany]);

    // Kanban data transformations
    const transformLeadsToKanbanFormat = (
        apiLeads: PersonnelLead[]
    ): Lead[] => {
        return apiLeads.map((lead) => ({
            id: lead.leadId.toString(),
            company: company?.name || "",
            personnel: personnel?.name || "",
            title: lead.name || `Lead ${lead.leadId}`,
            addedOn: lead.createdAt || new Date().toISOString(),
            manager: personnel?.manager?.email || "Unassigned",
            contractValue: `${lead.contractValue.toLocaleString()} USD`,
            status: lead.status.toLowerCase(),
        }));
    };

    const [personnelLeads, setPersonnelLeads] = useState<Lead[]>([]);

    useEffect(() => {
        if (personnel?.leads) {
            setPersonnelLeads(transformLeadsToKanbanFormat(personnel.leads));
        }
    }, [personnel]);

    // Kanban columns configuration
    const kanbanColumns: KanbanColumnTypes[] = [
        {
            id: "active",
            title: "Active",
            color: "bg-blue-500",
            leads: personnelLeads.filter((lead) => lead.status === "active"),
        },
        {
            id: "pending",
            title: "Pending",
            color: "bg-green-500",
            leads: personnelLeads.filter((lead) => lead.status === "pending"),
        },
        {
            id: "completed",
            title: "Completed",
            color: "bg-yellow-500",
            leads: personnelLeads.filter((lead) => lead.status === "completed"),
        },
    ];

    const handleColumnUpdate = async (updatedColumns: KanbanColumnTypes[]) => {
        try {
            const allLeads = updatedColumns.flatMap((column) => column.leads);
            setPersonnelLeads(allLeads);
            // Implement the update logic here
            await fetchPersonnel();
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    const handleCreateProject = async (leadId: number, data: any) => {
        try {
            await addProject(leadId, {
                name: data.name,
                status: data.status,
                startDate: data.startDate,
                endDate: data.endDate,
            });
            await fetchPersonnel();
        } catch (error) {
            console.error("Project creation failed:", error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!personnel) return <div>No personnel found</div>;

    return (
        <div className="flex-1 h-full">
            {/* Menus */}
            <div className="flex-none">
                <div className="flex items-center justify-between pl-4 border-r">
                    <MenuList
                        items={[
                            { label: "Profile", path: `/company/${companyId}` },
                            {
                                label: "Personnel",
                                path: `/company/${companyId}/companyPersonnel`,
                            },
                        ]}
                    />
                    <div className="pr-4">
                        <Link to="/company/setting" className="text-xs">
                            Setting
                        </Link>
                    </div>
                </div>
            </div>

            {/* Personnel Name */}
            <div className="flex items-center justify-start bg-white border border-l-0 px-9 min-h-14">
                <h2 className="text-base font-semibold">
                    {personnel?.name || "Loading..."}
                </h2>
            </div>

            {/* Edit Button */}
            <div className="flex justify-end flex-none w-full bg-white">
                <Button className="w-1/2 h-10 text-black bg-transparent border-l border-r md:w-20">
                    EDIT
                </Button>
            </div>

            {/* Tabs Section */}
            <Tabs
                defaultValue="profile"
                className="w-full bg-white border-t [&>*]:p-0 [&>*]:m-0 rounded-none [&>*]:rounded-none"
            >
                <div className="px-8">
                    <TabsList className=" justify-start border-r w-full gap-8 bg-gray-100 [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 pl-5">
                        <TabsTrigger
                            className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
                            value="profile"
                        >
                            Profile
                        </TabsTrigger>
                        <TabsTrigger
                            className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
                            value="leads"
                        >
                            Leads
                        </TabsTrigger>
                        <TabsTrigger
                            className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
                            value="projects"
                        >
                            Projects
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Profile Tab */}
                <TabsContent value="profile" className="m-0 overflow-x-hidden">
                    <div className="flex flex-col text-xs">
                        <div className="flex justify-start w-full pl-4 border-t">
                            <div className="flex justify-start p-4 w-1/8 gap-14">
                                <h1>Name</h1>
                            </div>
                            <div className="flex justify-start p-4 w-1/8 gap-14">
                                <h1>{company?.name || "Loading company..."}</h1>
                            </div>
                        </div>
                        <div className="flex justify-start w-full pl-4 border-t">
                            <div className="flex justify-start p-4 w-1/8 gap-14">
                                <h1>Email</h1>
                            </div>
                            <div className="flex justify-start p-4 w-1/8 gap-14">
                                <h1>
                                    {personnel?.email || "No email available"}
                                </h1>
                            </div>
                        </div>
                        <div className="flex justify-start w-full pl-4 border-t">
                            <div className="flex justify-start p-4 w-1/8 gap-14">
                                <h1>Manager</h1>
                            </div>
                            <div className="flex justify-start p-4 w-1/8 gap-14">
                                <h1>
                                    {personnel?.manager?.name ||
                                        personnel?.manager?.email ||
                                        (company?.managerid ?
                                            "Manager " + company.managerid
                                        :   "Unassigned")}
                                </h1>
                            </div>
                        </div>
                        <div className="flex justify-start w-full h-24 pl-4 border-t border-b">
                            <p className="px-4 py-4">
                                {personnel?.description || "No description"}
                            </p>
                        </div>
                    </div>
                </TabsContent>

                {/* Leads Tab */}
                <TabsContent value="leads" className="m-0 overflow-x-hidden">
                    <div>
                        <div className="flex flex-col gap-4 px-8 pt-4 border-t border-b border-r md:flex-row md:gap-16">
                            {/* Search and Filter Controls */}
                            <div className="flex flex-col w-full space-y-2 md:w-auto">
                                <Label htmlFor="keyword">Keyword</Label>
                                <Input
                                    type="keyword"
                                    id="keyword"
                                    placeholder="Search leads..."
                                    className="border rounded-none w-[400px]"
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <Label>Status</Label>
                                <div className="flex">
                                    <Button className="w-full bg-black rounded-none md:w-20">
                                        Active
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full rounded-none md:w-20"
                                    >
                                        All
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2 md:p-5 md:m-0">
                                <AdvancedFilterPopover />
                            </div>
                        </div>

                        <Tabs defaultValue="kanban">
                            <TabsList className="justify-start w-full border-r gap-8 bg-white [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 pl-5">
                                <TabsTrigger
                                    className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
                                    value="kanban"
                                >
                                    Kanban
                                </TabsTrigger>
                                <TabsTrigger
                                    className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
                                    value="list"
                                >
                                    List
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent
                                value="kanban"
                                className="pl-4 m-0 border-t border-r"
                            >
                                <KanbanBoard
                                    columns={kanbanColumns}
                                    onColumnUpdate={handleColumnUpdate}
                                    // onCreateLead={handleCreateLead}
                                />
                            </TabsContent>

                            <TabsContent value="list" className="m-0">
                                <DataTable
                                    columns={leadsColumns}
                                    data={personnelLeads.map((lead) => ({
                                        ...lead,
                                        companyName: company?.name,
                                        personnelName: personnel?.name,
                                        manager:
                                            personnel?.manager ||
                                            company?.managers?.[0]?.name,
                                    }))}
                                    loading={loading}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </TabsContent>

                {/* Projects Tab */}
                <TabsContent value="projects" className="m-0 overflow-x-hidden">
                    <div>
                        <div className="flex flex-col gap-4 px-4 pt-4 border-t border-r md:flex-row md:px-8 md:gap-16">
                            {/* Project Controls (similar to leads) */}
                            <div className="flex flex-col w-full space-y-2 md:w-auto">
                                <Label htmlFor="projectKeyword">Keyword</Label>
                                <Input
                                    type="text"
                                    id="projectKeyword"
                                    placeholder="Search projects..."
                                    className="border rounded-none w-[400px]"
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <Label>Status</Label>
                                <div className="flex">
                                    <Button className="w-full bg-black rounded-none md:w-20">
                                        Active
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full rounded-none md:w-20"
                                    >
                                        All
                                    </Button>
                                </div>
                            </div>
                            <AdvancedFilterPopover />
                        </div>

                        <Tabs defaultValue="list">
                        <TabsList className="justify-start w-full gap-8 bg-white border-t border-r [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 pl-5">
									<TabsTrigger
										className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
										value="list">
										List View
									</TabsTrigger>
									<TabsTrigger
										className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
										value="timeline">
										Timeline
									</TabsTrigger>
								</TabsList>
                            <TabsContent value="list" className="m-0">
                                <DataTable
                                    columns={projectColumns}
                                    data={
                                        personnel?.leads.flatMap((lead: any) =>
                                            lead.projects.map(
                                                (project: any) => ({
                                                    ...project,
                                                    startDate:
                                                        project.startDate ||
                                                        project.startdate,
                                                    endDate:
                                                        project.endDate ||
                                                        project.enddate,
                                                })
                                            )
                                        ) || []
                                    }
                                    loading={loading}
                                />
                            </TabsContent>

                            <TabsContent value="timeline" className="m-0">
                                <ScheduleTable
                                    projects={
                                        personnel?.leads.flatMap(
                                            (lead: any) => lead.projects
                                        ) || []
                                    }
                                    // onCreateProject={handleCreateProject}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
