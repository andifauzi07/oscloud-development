import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { mockCompanies } from "@/config/mockData/companies";
import { DataTable } from "@/components/ui/data-table";
import { projectsColumns } from "@/components/companyPersonnelProjectsDataTable";
import { ProjectsTimeline } from "@/components/ProjectsTimeline";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import AdvancedFilterPopover from "@/components/search/advanced-search";

export const Route = createFileRoute("/projects/")({
    component: RouteComponent,
});

function RouteComponent() {
    // Fetch all projects from all companies
    const allProjects = mockCompanies.flatMap((company) => company.projects);
    const validProjects = allProjects.filter(
        (project) => project && project.id
    );

    return (
        <div className="">
            {/* Header Section */}
            <div className="flex-none min-h-0 border-b">
                <div className="flex flex-row items-center justify-between px-4 py-4 bg-white">
                    <h2 className="text-base font-semibold">Project List</h2>
                    <Link to="/">Settings</Link>
                </div>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="list">
                <TabsList className="justify-start w-full gap-8 bg-white border [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 px-4">
                    <TabsTrigger
                        value="list"
                        className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2"
                    >
                        List View
                    </TabsTrigger>
                    <TabsTrigger
                        value="timeline"
                        className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2"
                    >
                        Timeline
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

                {/* List View Tab */}
                <TabsContent className="m-0" value="list">
                    <div className="flex flex-row gap-4 p-4 m-0 bg-white border md:flex-row md:px-8 md:gap-16">
                        <div className="flex flex-col space-y-2 bg-white md:w-auto">
                            <Label htmlFor="keyword">Keyword</Label>
                            <Input
                                type="keyword"
                                id="keyword"
                                placeholder=""
                                className="border rounded-none w-[400px]"
                            />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Label>Duration</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="date"
                                    className="w-[150px] border rounded-none"
                                    enableEmoji={false}
                                />
                                <span className="text-gray-500">-</span>
                                <Input
                                    type="date"
                                    className="w-[150px] border rounded-none"
                                    enableEmoji={false}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Label>Status</Label>
                            <div className="flex">
                                <Button
                                    size="default"
                                    className="w-full bg-black rounded-none md:w-20"
                                >
                                    Active
                                </Button>
                                <Button
                                    size="default"
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
                    <DataTable columns={projectsColumns} data={validProjects} />
                </TabsContent>

                {/* Timeline View Tab */}
                <TabsContent className="m-0" value="timeline">
                    <ProjectsTimeline projects={validProjects} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
