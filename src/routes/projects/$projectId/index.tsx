import { createFileRoute, Link } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    AssignedStaff,
    PaymentStaff,
} from "@/components/projectAssignedStaffDataTable";
import AdvancedFilterPopover from "@/components/search/advanced-search";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { GraphicChart } from "@/components/graphicChart";
import { TitleWrapper } from "@/components/wrapperElement";
import { useProject } from "@/hooks/useProject";
import { useEffect, useState, useCallback } from "react";
import { CompanyPersonnelLeadsListDataTable } from "@/components/companyPersonnelLeadsListDataTable";
import { useUserData } from "@/hooks/useUserData";
import { useAvailability } from "@/hooks/useAvailability";
import { format } from "date-fns";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCompanies } from "@/hooks/useCompany";
import { useUsers } from "@/hooks/useUser";
import { useEmployee, useWorkspaceEmployees } from "@/hooks/useEmployee";
import { useMemo } from "react";
import useDebounce from "@/hooks/useDebounce";
import { ProjectCategory } from "@/types/company";
import { ProjectDescriptionTab } from "@/components/projects/ProjectDescriptionTab";
import { ProjectMembersTab } from "@/components/projects/ProjectMembersTab";
import { ProjectPaymentTab } from "@/components/projects/ProjectPaymentTab";
import { ProjectPLTab } from "@/components/projects/ProjectPLTab";
import { type FilterField } from "@/components/search/advanced-search";

interface EnhancedEmployee {
    employeeid: number;
    name: string;
    email: string;
    profileimage: string | null;
    department: {
        departmentname: string;
    };
    employeeCategory: {
        categoryname: string;
    };
    rates?: {
        type: string;
        value: number;
    }[];
    availability?: string;
    averagePerformance?: number | null;
}


// Columns for Assigned Staff
const assignedStaffColumns: ColumnDef<AssignedStaff>[] = [
    {
        accessorKey: "profileImage",
        header: "",
        cell: ({ row }) => (
            <img
                src={row.original?.profileImage || "/default-avatar.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full"
            />
        ),
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => row.original?.name || "-",
    },
    {
        accessorKey: "availability",
        header: "Availability",
        cell: ({ row }) => row.original?.availability || "-",
    },
    {
        accessorKey: "totalEarnings",
        header: "Total Earnings",
        cell: ({ row }) => {
            const earnings = row.original?.totalEarnings;
            if (earnings === undefined || earnings === null) return "-";
            return `$${Number(earnings).toFixed(2)}`;
        },
    },
    {
        accessorKey: "averagePerformance",
        header: "Performance",
        cell: ({ row }) => {
            const performance = row.original?.averagePerformance;
            if (performance === undefined || performance === null) return "N/A";
            return `${Number(performance).toFixed(1)}%`;
        },
    },
];

export const Route = createFileRoute("/projects/$projectId/")({
    component: ProjectView,
});

function ProjectView() {
    // Get projectId from route params
    const { projectId } = Route.useParams();
    const { currentUser } = useUserData();
    const {
        getProjectById,
        currentProject,
        loading,
        getProjectCategories,
        editProject,
        assignProjectStaff,
        removeProjectStaff
    } = useProject();

    // Add console.log to debug
    const { addAvailability, updateAvailability: updateAvailabilityDetails } =
        useAvailability();
    const { companies } = useCompanies();
    const { users } = useUsers(Number(currentUser?.workspaceid));
    const { employees, loading: employeesLoading } = useWorkspaceEmployees();
    const [searchKeyword, setSearchKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("active");
    const debouncedSearch = useDebounce(searchKeyword, 300) || "";
    // State management
    const [isEditingGeneral, setIsEditingGeneral] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [categories, setCategories] = useState([]);
    const [editedGeneralInfo, setEditedGeneralInfo] =
        useState({
            name: currentProject?.name || "",
            companyId: currentProject?.companyid || 0,
            managerId: currentProject?.managerid || "",
            requiredStaffNumber: currentProject?.requiredstaffnumber || 0,
            categoryId: currentProject?.categoryid || null,
        });
    const [editedDescription, setEditedDescription] = useState("");
    const [editedData, setEditedData] = useState<Record<string, any>>({});
    const [availabilityModal, setAvailabilityModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<any>(null);
    const [editedAvailability, setEditedAvailability] = useState<{
        date: string;
        timeSlot: {
            start: string;
            end: string;
        };
        isNew?: boolean;
    }>({
        date: "",
        timeSlot: {
            start: "",
            end: "",
        },
    });
    const [isEditingStaff, setIsEditingStaff] = useState(false);

    // Add loading state
    const [isLoading, setIsLoading] = useState(true);

    // Create enhanced employees data that combines both sources
    const enhancedEmployees = useMemo(() => {
        if (!employees || !Array.isArray(employees)) return [];

        return employees.map((employee): EnhancedEmployee => {
            // Find matching assigned staff data if employee is assigned to project
            const assignedStaffData = currentProject?.assignedStaff?.find(
                (staff) => staff.employeeId === employee.employeeid
            );

            return {
                ...employee,
                availability: assignedStaffData?.availability || "Not Assigned",
                rates: assignedStaffData?.rates || [], // Use rates from assignedStaff
                averagePerformance: assignedStaffData?.averagePerformance,
            };
        });
    }, [employees, currentProject?.assignedStaff]);

    // Filter employees based on search and status
    const filteredEmployees = useMemo(() => {
        if (!employees || !Array.isArray(employees)) return [];

        const searchTerm = (debouncedSearch || "").toLowerCase();

        return employees.filter((employee) => {
            if (!employee) return false;

            // Safely check if the required properties exist
            const employeeName = String(employee?.name || "");
            const employeeEmail = String(employee?.email || "");

            const matchesSearch =
                employeeName.toLowerCase().includes(searchTerm) ||
                employeeEmail.toLowerCase().includes(searchTerm);

            // Since there's no explicit status field in your data, you might want to
            // modify this condition based on your needs
            const matchesStatus = statusFilter === "all" ? true : true; // temporarily always true

            return matchesSearch && matchesStatus;
        });
    }, [employees, debouncedSearch, statusFilter]);

    // Add this near your other state/constant definitions
    const advancedSearchFields: FilterField[] = [
        {
            key: "status",
            label: "Status",
            type: "toogle",
            options: ["Active", "Inactive", "All"],
        },
        {
            key: "date",
            label: "Date",
            type: "date",
        },
        // Add more fields as needed
    ];

    const [plData, setPLData] = useState({
        revenue: { revenueCost: 1000000, otherCost: 0 },
        expenditures: {
            labourCost: 10000,
            transportCost: 10000,
            costumeCost: 10000,
            managerFee: 10000,
            otherCost: 10000,
        },
        profit: {
            total: 280000,
            profitability: 15,
            salesProfit: 10000,
        },
    });

    const handleEditRevenue = () => {
        // Implement your revenue editing logic here
    };

    const handleEditExpenditures = () => {
        // Implement your expenditures editing logic here
    };

    // Initial data fetch
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            
            if (!currentUser?.workspaceid) {
                console.log('Waiting for workspace ID...');
                return;
            }

            // Remove this check since we know projectId exists from the URL
            try {
                // Load categories first
                const response = await getProjectCategories();
                setCategories(response);
                
                // Then load project details - ensure projectId is a number
                await getProjectById(Number(projectId));
            } catch (error) {
                console.error('Error loading project:', error);
                alert(error instanceof Error ? error.message : 'Failed to load project data');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [currentUser?.workspaceid, projectId, getProjectById, getProjectCategories]);

    // Effect to update form when currentProject changes
    useEffect(() => {
        if (currentProject) {
            setEditedGeneralInfo({
                name: currentProject.name || "",
                companyId:
                    currentProject.companyid ?
                        Number(currentProject.companyid)
                    :   0,
                managerId: currentProject.managerid || "",
                requiredStaffNumber: currentProject.requiredstaffnumber || 0,
                categoryId:
                    currentProject.categoryid ?
                        Number(currentProject.categoryid)
                    :   null,
            });
        }
    }, [currentProject]);

    const handleAvailabilitySave = async () => {
        try {
            if (editedAvailability.isNew) {
                await addAvailability({
                    employeeId: selectedStaff.id,
                    date: editedAvailability.date,
                    timeSlot: editedAvailability.timeSlot,
                });
            } else {
                await updateAvailabilityDetails(selectedStaff.id, {
                    date: editedAvailability.date,
                    timeSlot: editedAvailability.timeSlot,
                });
            }
            setAvailabilityModal(false);
            await getProjectById(Number(projectId));
            alert("Availability updated successfully");
        } catch (error) {
            console.error("Failed to update availability:", error);
            alert("Failed to update availability");
        }
    };

    // Show loading state while waiting for workspace ID
    if (!currentUser?.workspaceid) {
        return (
            <div className="flex items-center justify-center h-full">
                <p>Loading workspace information...</p>
            </div>
        );
    }

    // Show loading state while waiting for data
    if (isLoading || loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <p>Loading project details...</p>
            </div>
        );
    }

    // Show error state if no project found
    if (!currentProject) {
        return (
            <div className="flex items-center justify-center h-full">
                <p>No project found with ID: {projectId}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-white">
            <TitleWrapper>
                <h1>Project: {currentProject.name}</h1>
            </TitleWrapper>

            <Tabs defaultValue="description">
                <TabsList className="justify-start w-full gap-8 bg-white border-r border-b [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 pl-5">
                    <TabsTrigger
                        className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
                        value="description"
                    >
                        Description
                    </TabsTrigger>
                    <TabsTrigger
                        className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
                        value="members"
                    >
                        Members
                    </TabsTrigger>
                    <TabsTrigger
                        className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
                        value="payment"
                    >
                        Payment
                    </TabsTrigger>

                    <TabsTrigger
                        className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
                        value="P/L"
                    >
                        P/L
                    </TabsTrigger>
                </TabsList>

                {/* Description Tab */}
                <ProjectDescriptionTab
                    currentProject={currentProject}
                    projectId={Number(projectId)}
                    companies={companies}
                    categories={categories}
                    users={users}
                    loading={loading}
                    editProject={editProject}
                    getProjectById={getProjectById}
                />

                {/* Project Tab Components */}
                <ProjectMembersTab
                    currentProject={currentProject}
                    projectId={Number(projectId)}
                    currentUser={currentUser}
                    enhancedEmployees={enhancedEmployees}
                    loading={loading}
                    employeesLoading={employeesLoading}
                    searchKeyword={searchKeyword}
                    setSearchKeyword={setSearchKeyword}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    removeProjectStaff={removeProjectStaff}
                    assignProjectStaff={assignProjectStaff}
                    editProject={editProject}
                    getProjectById={getProjectById}
                />

                <ProjectPaymentTab
                    advancedSearchFields={advancedSearchFields}
                    loading={loading}
                    currentProject={currentProject}
                />

                <ProjectPLTab
                    projectId={Number(projectId)}
                    onEditRevenue={handleEditRevenue}
                    onEditExpenditures={handleEditExpenditures}
                />
            </Tabs>

            {/* Staff Availability Dialog */}
            <Dialog
                open={availabilityModal}
                onOpenChange={setAvailabilityModal}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Staff Availability</DialogTitle>
                        <DialogDescription>
                            Update availability for {selectedStaff?.name}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-4">
                        {/* Date Selection */}
                        <div className="flex flex-col gap-2">
                            <Label>Date</Label>
                            <Input
                                type="date"
                                value={editedAvailability.date}
                                onChange={(e) =>
                                    setEditedAvailability((prev) => ({
                                        ...prev,
                                        date: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        {/* Time Range Selection */}
                        <div className="flex gap-4">
                            <div className="flex flex-col flex-1 gap-2">
                                <Label>Start Time</Label>
                                <Input
                                    type="time"
                                    value={editedAvailability.timeSlot.start}
                                    onChange={(e) =>
                                        setEditedAvailability((prev) => ({
                                            ...prev,
                                            timeSlot: {
                                                ...prev.timeSlot,
                                                start: e.target.value,
                                            },
                                        }))
                                    }
                                />
                            </div>

                            <div className="flex flex-col flex-1 gap-2">
                                <Label>End Time</Label>
                                <Input
                                    type="time"
                                    value={editedAvailability.timeSlot.end}
                                    onChange={(e) =>
                                        setEditedAvailability((prev) => ({
                                            ...prev,
                                            timeSlot: {
                                                ...prev.timeSlot,
                                                end: e.target.value,
                                            },
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setAvailabilityModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleAvailabilitySave}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
