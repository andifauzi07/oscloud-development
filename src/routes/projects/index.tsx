import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TitleWrapper } from "@/components/wrapperElement";
import { AddRecordDialog } from "@/components/AddRecordDialog";
import { DataTable } from "@/components/ui/data-table";
import { useProject, useProjects } from "@/hooks/useProject";
import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { useColumnSettings } from "@/hooks/useColumnSettings";
import { Project, ProjectDisplay } from "@/types/company";
import { defaultProjectColumnSettings } from "@/config/columnSettings";
import { CreateProjectRequest, UpdateProjectRequest } from "@/types/project";
import { ColumnDef } from "@tanstack/react-table";
import { useCompanies } from "@/hooks/useCompany";
import { useUserData } from "@/hooks/useUserData";
import { useUsers } from "@/hooks/useUser";
import { ProjectCategory } from "@/store/slices/projectSlice";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import ScheduleTable from "@/components/EmployeTimeLine";

export const Route = createFileRoute("/projects/")({
    component: ProjectsRouteComponent,
});

const defaultCellRenderer = ({ getValue }: any) => {
    const value = getValue();
    return <span className="text-xs whitespace-nowrap">{value ?? "-"}</span>;
};

function ProjectsRouteComponent() {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [editable, setEditable] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const [categoryOptions, setCategoryOptions] = useState<Array<{ value: number; label: string }>>([]);
    const [updateDataFromChild, setUpdateDataFromChild] = useState<ProjectDisplay[]>([]);
    const [companyListOptions, setCompanyListOptions] = useState<Array<{ value: string; label: string }>>([]);
    const [managerOptions, setManagerOptions] = useState<Array<{ value: string; label: string }>>([]);

    const debouncedKeyword = useDebounce(searchKeyword, 500);

    const filters = useMemo(
        () => ({
            status: statusFilter || undefined,
            search: debouncedKeyword || undefined,
            page: currentPage,
            limit: pageSize,
        }),
        [statusFilter, debouncedKeyword, currentPage, pageSize]
    );

    const { projects, loading, error, total } = useProjects(filters);
    const { addProject, editProject, getProjectCategories, getProjects } = useProject();
    const { settings, saveSettings, reorderColumns } = useColumnSettings({
        storageKey: "ProjectsColumnSettings",
        defaultSettings: defaultProjectColumnSettings,
    });
    const { currentUser, isWorkspaceReady } = useUserData();

    const { companies } = useCompanies();
    const workspaceid = currentUser?.workspaceid;
    const { users } = useUsers(Number(workspaceid));

    useEffect(() => {
        if (companies) {
            setCompanyListOptions(
                companies.map((company) => ({
                    value: company.companyid.toString(),
                    label: company.name,
                }))
            );
        }
    }, [companies]);

    useEffect(() => {
        if (users) {
            setManagerOptions(
                users.map((user) => ({
                    value: user.id.toString(),
                    label: user.email,
                }))
            );
        }
    }, [users]);

    useEffect(() => {
        const loadCategories = async () => {
                const categories = await getProjectCategories();
                if (categories) {
                    setCategoryOptions(
                        categories.map((category: ProjectCategory) => ({
                            value: category.categoryid,
                            label: category.categoryname,
                        }))
                    );

                }
        };

        loadCategories();
    }, [workspaceid, getProjectCategories]);

    const columns = useMemo<ColumnDef<ProjectDisplay, any>[]>(() => {
        return settings
            .filter((setting) => setting.status === "Active" || setting.status === "shown")
            .sort((a, b) => a.order - b.order)
            .map((setting) => {
                const defaultSetting = defaultProjectColumnSettings.find(
                    (def) => def.accessorKey === setting.accessorKey
                );
                return {
                    id: String(setting.accessorKey),
                    accessorKey: setting.accessorKey as string,
                    header: defaultSetting?.header || setting.header,
                    cell:
                        defaultSetting?.cell ||
                        setting.cell ||
                        defaultCellRenderer,
                };
            });
    }, [settings]);

    const handleAddRecord = useCallback(
        async (data: Partial<Project>) => {
            try {
                if (!data.name) throw new Error("Project name is required");
                if (!data.startdate) throw new Error("Start date is required");

                const newProjectRequest: CreateProjectRequest = {
                    name: data.name,
                    startdate: data.startdate,
                    enddate: data.enddate,
                    status: "Active",
                    managerid: currentUser?.userid || 1,
                    companyid: Number(data.companyid),
                    workspaceid: 1,
                    categoryid: data.categoryid ? Number(data.categoryid) : null,
                    costs: data.costs || {
                        food: 0,
                        break: 0,
                        rental: 0,
                        revenue: 0,
                        other_cost: 0,
                        labour_cost: 0,
                        manager_fee: 0,
                        costume_cost: 0,
                        sales_profit: 0,
                        transport_cost: 0,
                    },
                };

                await addProject(newProjectRequest);
                // Immediately refetch projects after successful addition
                await getProjects(filters);
                toast.success("Project created successfully");
            } catch (error) {
                console.error("Failed to add project:", error);
                toast.error("Failed to create project");
            }
        },
        [addProject, currentUser, getProjects, filters]
    );

    const handleStatusChange = useCallback((newStatus: string) => {
        setStatusFilter(newStatus);
    }, []);

    const handleSave = useCallback(async () => {
        try {
            if (!updateDataFromChild.length) {
                alert("No changes to save");
                return;
            }

            await Promise.all(
                updateDataFromChild.map(async (project) => {
                    if (!project.projectId) return;

                    console.log('project', project);

                    const updatePayload: UpdateProjectRequest = {
                        name: project.name,
                        startdate: project.startDate,
                        enddate: project.endDate,
                        status: project.status,
                        companyid: Number(project.companyid),
                        managerid: project.managerid,
                        categoryid: Number(project.categoryid),
                    };

                    await editProject({
                        projectId: project.projectId,
                        data: updatePayload,
                    });
                })
            );

            // Refresh projects after saving
            await getProjects(filters);

            setEditable(false);
            setUpdateDataFromChild([]);
            alert("Projects updated successfully");
        } catch (error) {
            console.error("Error updating projects:", error);
            alert("Failed to update projects");
        }
    }, [editProject, updateDataFromChild, getProjects, filters]);

    useEffect(() => {
        if (error) {
            toast.error("Failed to load projects");
        }
    }, [error]);

    const selectFields = {
        companyid: { options: companyListOptions },
        managerid: { options: managerOptions },
        categoryid: { options: categoryOptions },
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 h-full">
            <TitleWrapper>
                <h1 className="text-base">Projects</h1>
                <Link className="text-xs" to="/projects/setting">
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
                            placeholder="Search projects..."
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
                                variant="outline"
                                className={cn(
                                    "w-20 rounded-none",
                                    statusFilter === "Active" &&
                                        "bg-black text-white"
                                )}
                                onClick={() => handleStatusChange("Active")}
                            >
                                Active
                            </Button>
                            <Button
                                size="default"
                                variant="outline"
                                className={cn(
                                    "w-20 rounded-none",
                                    statusFilter === "" && "bg-black text-white"
                                )}
                                onClick={() => handleStatusChange("")}
                            >
                                All
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end flex-none w-full bg-white">
				{editable ? (
					<Button
						onClick={() => setEditable((prev) => !prev)}
						className="text-black bg-transparent border-l md:w-20 link border-l-none min-h-10">
						CANCEL
					</Button>
				) : (
					<AddRecordDialog
						columns={columns}
						onSave={handleAddRecord}
						nonEditableColumns={[
                            "projectid",
                            "created_at",
                            "updated_at",
                            "assignedStaff",
                            "connectedPersonnel",
                            "costs*",
                            "manager*"
                        ]}
                        selectFields={selectFields}
                        customFields={{
                            duration: {
                                type: "dateRange",
                                startKey: "startdate",
                                endKey: "enddate",
                                label: "Start Date",
                            }
                        }}
					/>
				)}

				{editable ? (
					<Button
						onClick={handleSave}
						className="text-black bg-transparent border-l border-r md:w-20 link border-l-none min-h-10">
						SAVE
					</Button>
				) : (
					<Button
						onClick={() => setEditable((prev) => !prev)}
						className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
						EDIT
					</Button>
				)}
			</div>

            <Tabs defaultValue="list">
                <TabsList className="border-b justify-start w-full gap-8 bg-white border-t border-r [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 pl-5">
                    <TabsTrigger
                        className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
                        value="list"
                    >
                        List View
                    </TabsTrigger>
                    <TabsTrigger
                        className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
                        value="timeline"
                    >
                        Timeline
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                    <div className="flex-1">
                        <DataTable
                            columns={columns}
                            data={projects}
                            loading={loading}
                            isEditable={editable}
                            setTableData={setUpdateDataFromChild}
                            nonEditableColumns={[
                                "projectid",
                                "created_at",
                                "updated_at",
                                "assignedStaff",
                                "connectedPersonnel",
                                "costs*",
                                "manager*"
                            ]}
                            selectFields={selectFields}
                            total={total}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                            pageSize={pageSize}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="timeline">
                <div className="flex-1 overflow-x-auto">
                        <ScheduleTable
                            projects={projects}
                            currentDate={new Date()}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
