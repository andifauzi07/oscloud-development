import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TitleWrapper } from "@/components/wrapperElement";
import { AddRecordDialog } from "@/components/AddRecordDialog";
import { DataTable } from "@/components/ui/data-table";
import AdvancedFilterPopover from "@/components/search/advanced-search";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BaseColumnSetting } from "@/types/table";
import { DurationInput } from "@/components/ui/duration-input";
import { ProjectsTimeline } from "@/components/ProjectsTimeline";
import { TimelineCalendar } from "@/components/timeline/TimeLineSchedule";
import { Project as TimelineProject } from '@/components/timeline/propsTypes';
import ScheduleTable from "@/components/EmployeTimeLine";
import { useUsers } from "@/hooks/useUser";
import { fetchProjectCategories } from "@/store/slices/projectSlice";
import { useSaveEdits } from '@/hooks/handler/useSaveEdit';

export const Route = createFileRoute("/projects/")({
    component: RouteComponent,
});

const defaultCellRenderer = ({ getValue }: any) => {
    const value = getValue();
    if (value === null || value === undefined) {
        return <span className="text-xs whitespace-nowrap">-</span>;
    }
    return <span className="text-xs whitespace-nowrap">{String(value)}</span>;
};

const field = [
    {
        key: "status",
        label: "Status",
        type: "toogle",

        options: ["All", "Active", "Inactive"],
    },
    {
        key: "employeeid",
        label: "Employee Id",
        type: "number",
    },
    {
        key: "email",
        label: "Email",
        type: "email",
    },
    {
        key: "name",
        label: "Name",
        type: "text",
    },
    {
        key: "depertment",
        label: "Department",
        type: "text",
    },
];

function RouteComponent() {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const debouncedKeyword = useDebounce(searchKeyword, 500);
    const [isEditable, setIsEditable] = useState(false);
    const [categories, setCategories] = useState([]);
    const [updateDataFromChild, setUpdateDataFromChild] = useState<ProjectDisplay[]>([]);

    const filters = useMemo(
        () => ({
            status: statusFilter || undefined,
            search: debouncedKeyword || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
        }),
        [statusFilter, debouncedKeyword, startDate, endDate]
    );

    const { projects, loading } = useProjects(filters);
    const { addProject, editProject } = useProject();

    // First, let's create a function to merge settings with defaults
    const mergeWithDefaultSettings = (
        currentSettings: BaseColumnSetting<ProjectDisplay>[]
    ) => {
        const mergedSettings = [...defaultProjectColumnSettings];

        // Update existing settings with stored values
        currentSettings.forEach((setting) => {
            const index = mergedSettings.findIndex(
                (def) => def.accessorKey === setting.accessorKey
            );
            if (index !== -1) {
                mergedSettings[index] = {
                    ...mergedSettings[index],
                    ...setting,
                };
            }
        });

        return mergedSettings;
    };

    // Then use it with useColumnSettings
    const { settings, saveSettings, reorderColumns } = useColumnSettings({
        storageKey: "projectColumnSettings",
        defaultSettings: defaultProjectColumnSettings,
        onInitialize: mergeWithDefaultSettings, // Add this option to the hook
    });

    const { companies } = useCompanies();
    const { currentUser } = useUserData();
    const workspaceid = currentUser?.workspaceid;
    
    // Get managers using the existing selector
    const { users: managers } = useUsers(Number(workspaceid));

    useEffect(() => {
        const fetchInitialData = async () => {
            if (!workspaceid) return;
            
            try {
                const categoriesResponse = await fetchProjectCategories(Number(workspaceid));
                // Make sure we're setting the categories array from the response
                setCategories(categoriesResponse.categories || []);
            } catch (error) {
                console.error('Error fetching initial data:', error);
                // Set empty array as fallback
                setCategories([]);
            }
        };
        
        fetchInitialData();
    }, [workspaceid]);

    const companyOptions = useMemo(
        () =>
            companies.map((company) => ({
                value: company.companyid.toString(),
                label: company.name,
            })),
        [companies]
    );

    const columns = useMemo<ColumnDef<ProjectDisplay, any>[]>(() => {
        return settings
            .filter((setting) => setting.status === "shown")
            .sort((a, b) => a.order - b.order)
            .map((setting) => {
                const defaultSetting = defaultProjectColumnSettings.find(
                    (def) => def.accessorKey === setting.accessorKey
                );

                // Special handling for manager column
                if (setting.accessorKey === 'managerid') {
                    return {
                        id: String(setting.accessorKey),
                        accessorKey: setting.accessorKey as string,
                        header: defaultSetting?.header || setting.header,
                        cell: ({ row }) => (
                            <span className="text-xs whitespace-nowrap">
                                {row.original.manager.name || 'Unassigned'}
                            </span>
                        ),
                    };
                }

                // Special handling for dates
                if (setting.accessorKey === 'startdate' || setting.accessorKey === 'enddate') {
                    return {
                        id: String(setting.accessorKey),
                        accessorKey: setting.accessorKey as string,
                        header: defaultSetting?.header || setting.header,
                        cell: ({ row }) => {
                            const date = row.getValue(setting.accessorKey);
                            return (
                                <span className="text-xs whitespace-nowrap">
                                    {date ? new Date(date).toLocaleDateString() : '-'}
                                </span>
                            );
                        },
                    };
                }

                // Special handling for category
                if (setting.accessorKey === 'categoryid') {
                    return {
                        id: String(setting.accessorKey),
                        accessorKey: setting.accessorKey as string,
                        header: defaultSetting?.header || setting.header,
                        cell: ({ row }) => (
                            <span className="text-xs whitespace-nowrap">
                                {categories.find(cat => cat.categoryid === row.getValue(setting.accessorKey))?.categoryname || '-'}
                            </span>
                        ),
                    };
                }

                return {
                    id: String(setting.accessorKey),
                    accessorKey: setting.accessorKey as string,
                    header: defaultSetting?.header || setting.header,
                    cell: defaultSetting?.cell || setting.cell || defaultCellRenderer,
                };
            });
    }, [settings, categories]);

    const handleAddRecord = useCallback(
        async (data: Partial<Project>) => {
            if (!workspaceid) {
                alert('Workspace ID is not available');
                return;
            }

            try {
                if (!data.name) {
                    throw new Error('Project name is required');
                }

                const newProjectRequest: CreateProjectRequest = {
                    name: data.name,
                    startDate: data.startdate,
                    endDate: data.enddate,
                    status: 'Active',
                    managerid: Number(data.managerid),
                    companyid: Number(data.companyid),
                    workspaceid: Number(workspaceid),
                    categoryid: Number(data.categoryid),
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
                alert('Project successfully added!');
            } catch (error) {
                console.error('Failed to add project:', error);
                alert('Failed to create project');
                throw error;
            }
        },
        [addProject, workspaceid]
    );

    const handleStatusChange = useCallback((newStatus: string) => {
        setStatusFilter(newStatus);
    }, []);

    const saveEdits = useSaveEdits<ProjectDisplay>();

    const handleSaveEdits = async () => {
        try {
            const isSuccess = await saveEdits(
                projects, // Original data
                updateDataFromChild, // Updated data
                'projectid', // Key field
                ['name', 'startdate', 'enddate', 'status', 'managerid', 'categoryid'], // Fields to compare
                async (projectId: number, data: Partial<ProjectDisplay>) => {
                    const updatePayload: UpdateProjectRequest = {
                        name: data.name,
                        startdate: data.startdate,
                        enddate: data.enddate,
                        status: data.status,
                        managerid: Number(data.managerid),
                        categoryid: Number(data.categoryid)
                    };

                    await editProject({
                        projectId,
                        data: updatePayload,
                    });
                }
            );
            
            setIsEditable(false);
            if (isSuccess) {
                toast.success('Projects updated successfully');
            }
        } catch (error) {
            console.error('Error updating projects:', error);
            toast.error('Failed to update projects');
        }
    };

    const getProjectsData = useCallback((): TimelineProject[] => {
        return projects.map(project => ({
            projectId: project.projectid,
            name: project.name || '',
            startDate: project.startdate || null,
            endDate: project.enddate || null,
            manager: {
                userId: project.managerid || 0,
                name: project.managername || 'Unassigned'
            },
            status: project.status || null
        }));
    }, [projects]);

    if (!workspaceid) {
        return <div>Loading workspace information...</div>;
    }

    return (
        <div className="flex flex-col flex-1 h-full">
            <TitleWrapper>
                <h1 className="text-base">Projects</h1>
                <Link className="text-xs" to="/projects/setting">
                    Settings
                </Link>
            </TitleWrapper>

            {/* Filter Section */}
            <div className="flex flex-row flex-wrap items-center justify-between w-full px-8 py-4 bg-white border-b border-r md:flex-row">
                <div className="flex gap-8">
                    <div className="flex flex-col space-y-2 bg-white md:w-auto">
                        <Label htmlFor="keyword">Keyword</Label>
                        <Input
                            type="keyword"
                            id="keyword"
                            placeholder=""
                            className="border rounded-none w-[400px]"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </div>
                    <DurationInput
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                    />
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

                <div className="flex flex-col items-end space-y-2">
                    <Label>‎</Label>
                    <div className="flex items-center gap-4">
                        <AdvancedFilterPopover fields={field} />
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="list">
                <TabsList className="justify-start w-full gap-8 bg-white border-t border-r [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 pl-5">
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

                <TabsContent value="list" className="m-0">
                    <div className="flex justify-end flex-none bg-white">
                        <AddRecordDialog
                            columns={columns}
                            onSave={handleAddRecord}
                            nonEditableColumns={[
                                "projectid",
                                "created_at",
                                "updated_at",
                                "assignedStaff",
                                "connectedPersonnel",
                                "costs",
                                "managerid",
                                "categoryid"
                            ]}
                            selectFields={{
                                companyid: {
                                    options: companyOptions,
                                },
                                managerid: {
                                    options: managers.map(manager => ({
                                        value: manager.userid,
                                        label: manager.name
                                    }))
                                },
                                categoryid: {
                                    options: Array.isArray(categories) ? categories.map(category => ({
                                        value: category.categoryid,
                                        label: category.categoryname
                                    })) : []
                                }
                            }}
                            customFields={{
                                duration: {
                                    type: "dateRange",
                                    startKey: "startdate",
                                    endKey: "enddate",
                                    label: "Duration",
                                },
                            }}
                            enableCosts={true}
                        />
                        {isEditable ? (
                            <>
                                <Button
                                    onClick={() => setIsEditable(false)}
                                    className="text-black bg-transparent border-l md:w-20 link border-l-none min-h-10">
                                    CANCEL
                                </Button>
                                <Button
                                    onClick={handleSaveEdits}
                                    className="text-black bg-transparent border-l md:w-20 link border-l-none min-h-10">
                                    SAVE
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={() => setIsEditable(true)}
                                className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
                                EDIT
                            </Button>
                        )}
                    </div>
                    <div className="flex-1">
                        <DataTable
                            columns={columns}
                            data={projects}
                            loading={loading}
                            isEditable={isEditable}
                            setTableData={setUpdateDataFromChild}
                            nonEditableColumns={[
                                "projectid",
                                "created_at",
                                "updated_at",
                                "assignedStaff",
                                "connectedPersonnel",
                                "costs",
                            ]}
                            selectFields={{
                                managerid: {
                                    options: managers
                                        .filter(manager => manager?.userid) // Filter out invalid managers
                                        .map(manager => ({
                                            value: manager.userid?.toString() || '',
                                            label: manager.name || 'Unnamed Manager'
                                        }))
                                },
                                categoryid: {
                                    options: categories.map(category => ({
                                        value: category.categoryid.toString(),
                                        label: category.categoryname
                                    }))
                                }
                            }}
                            customFields={{
                                startdate: {
                                    type: 'date'
                                },
                                enddate: {
                                    type: 'date'
                                }
                            }}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="timeline" className="m-0">
                    <div className="flex justify-end flex-none bg-white">
                        <AddRecordDialog
                            columns={columns}
                            onSave={handleAddRecord}
                            nonEditableColumns={[
                                "projectid",
                                "created_at",
                                "updated_at",
                                "assignedStaff",
                                "connectedPersonnel",
                                "costs",
                                "managerid",
                                "categoryid"
                            ]}
                            selectFields={{
                                companyid: {
                                    options: companyOptions,
                                },
                                managerid: {
                                    options: managers.map(manager => ({
                                        value: manager.userid,
                                        label: manager.name
                                    }))
                                },
                                categoryid: {
                                    options: Array.isArray(categories) ? categories.map(category => ({
                                        value: category.categoryid,
                                        label: category.categoryname
                                    })) : []
                                }
                            }}
                            customFields={{
                                duration: {
                                    type: "dateRange",
                                    startKey: "startdate",
                                    endKey: "enddate",
                                    label: "Duration",
                                },
                            }}
                            enableCosts={true}
                        />
                        {isEditable ? (
                            <>
                                <Button
                                    onClick={() => setIsEditable(false)}
                                    className="text-black bg-transparent border-l md:w-20 link border-l-none min-h-10">
                                    CANCEL
                                </Button>
                                <Button
                                    onClick={handleSaveEdits}
                                    className="text-black bg-transparent border-l md:w-20 link border-l-none min-h-10">
                                    SAVE
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={() => setIsEditable(true)}
                                className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
                                EDIT
                            </Button>
                        )}
                    </div>

                    <div className="flex-1 overflow-x-auto">
                        <ScheduleTable 
                            projects={getProjectsData()}
                            currentDate={new Date()}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
