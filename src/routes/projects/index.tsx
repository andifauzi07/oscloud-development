import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { projectsColumns } from "@/components/companyPersonnelProjectsDataTable";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import AdvancedFilterPopover from "@/components/search/advanced-search";
import ScheduleTable from "@/components/EmployeTimeLine";
import { TitleWrapper } from "@/components/wrapperElement";
import { useCallback, useState, useMemo } from "react";
import { AddRecordDialog } from "@/components/AddRecordDialog";
import { useProjects } from "@/hooks/useProject";

export const Route = createFileRoute("/projects/")({
    component: RouteComponent,
});

function RouteComponent() {
    const [editable, setEditable] = useState(false);
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        status: "active",
        keyword: "",
    });

    // Memoize filters for useProjects hook to prevent infinite updates
    const projectFilters = useMemo(() => ({
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        // status: filters.status,
    }), [filters.startDate, filters.endDate,]);

    const { projects, loading, addProject } = useProjects(projectFilters);

    // Debounce filter changes
    const handleFilterChange = useCallback((key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleAddRecord = async (data: any) => {
        try {
            await addProject({
                ...data,
                assignedStaff: [], // Initialize with empty staff array
            });
        } catch (error) {
            console.error("Failed to add record:", error);
        }
    };

    const handleSaveEdits = useCallback(async (updatedData: any[]) => {
        try {
            // TODO: Implement batch update when available in API
            console.log("Saving updates:", updatedData);
            setEditable(false);
        } catch (error) {
            console.error("Failed to save updates:", error);
        }
    }, []);

    return (
        <div className="">
            <TitleWrapper>
                <h2 className="text-base">Project List</h2>
                <Link to="/projects/setting">Settings</Link>
            </TitleWrapper>

            <Tabs defaultValue="list">
                <TabsList className="justify-start w-full gap-8 bg-white border-b border-r [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 px-8">
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
                    <AddRecordDialog
                        columns={projectsColumns}
                        onSave={handleAddRecord}
                        nonEditableColumns={["id*"]}
                    />
                    <Button
                        onClick={() => setEditable((prev) => !prev)}
                        className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10"
                    >
                        EDIT+
                    </Button>
                </div>

                <TabsContent className="m-0" value="list">
                    <div className="flex flex-row flex-wrap items-center justify-between w-full p-8 pt-4 bg-white border-t border-b border-r md:flex-row">
                        <div className="flex flex-col space-y-2 bg-white md:w-auto">
                            <Label htmlFor="keyword">Keyword</Label>
                            <Input
                                type="keyword"
                                id="keyword"
                                value={filters.keyword}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "keyword",
                                        e.target.value
                                    )
                                }
                                className="border rounded-none w-[400px]"
                            />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Label>Duration</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="date"
                                    value={filters.startDate}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "startDate",
                                            e.target.value
                                        )
                                    }
                                    className="w-[150px] border rounded-none"
                                />
                                <span className="text-gray-500">-</span>
                                <Input
                                    type="date"
                                    value={filters.endDate}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "endDate",
                                            e.target.value
                                        )
                                    }
                                    className="w-[150px] border rounded-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Label>Status</Label>
                            <div className="flex">
                                <Button
                                    size="default"
                                    className={`w-full rounded-none md:w-20 ${
                                        filters.status === "active" ?
                                            "bg-black"
                                        :   "bg-transparent text-black"
                                    }`}
                                    onClick={() =>
                                        handleFilterChange("status", "active")
                                    }
                                >
                                    Active
                                </Button>
                                <Button
                                    size="default"
                                    variant="outline"
                                    className={`w-full rounded-none md:w-20 ${
                                        filters.status === "all" ?
                                            "bg-black text-white"
                                        :   ""
                                    }`}
                                    onClick={() =>
                                        handleFilterChange("status", "all")
                                    }
                                >
                                    All
                                </Button>
                            </div>
                        </div>

                        <div className="flex-col space-y-2 fflex">
                            <Label>‎ </Label>
                            <AdvancedFilterPopover />
                        </div>
                    </div>
                    <div className="border-b border-r">
                        <DataTable
                            columns={projectsColumns}
                            data={projects}
                            loading={loading}
                            isEditable={editable}
                            onSave={handleSaveEdits}
                            nonEditableColumns={["id*"]}
                        />
                    </div>
                </TabsContent>

                <TabsContent className="m-0" value="timeline">
                    <ScheduleTable />
                </TabsContent>
            </Tabs>
        </div>
    );
}
