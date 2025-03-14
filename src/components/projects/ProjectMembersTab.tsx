import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { type Project } from "@/types/project";
import { type Employee } from "@/types/employee";
import { type ColumnDef } from "@tanstack/react-table";
import { TitleWrapper } from "../wrapperElement";
import AdvancedFilterPopover from "../search/advanced-search";
import { AppUser as CurrentUser } from "@/types/user";
import { useHourlyRates } from "@/hooks/useHourlyRates";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProjectMembersTabProps {
    currentProject: Project;
    projectId?: number;
    currentUser?: CurrentUser;
    enhancedEmployees: Employee[];
    loading: boolean;
    employeesLoading: boolean;
    searchKeyword: string;
    setSearchKeyword: (keyword: string) => void;
    statusFilter: "active" | "all";
    setStatusFilter: (status: "active" | "all") => void;
    assignProjectStaff: (projectId: number, employeeId: number) => Promise<any>;
    removeProjectStaff: (projectId: number, employeeId: number) => Promise<any>;
    editProject: (params: { workspaceId: number; projectId: number; data: any }) => Promise<any>;
    getProjectById: (projectId: number) => Promise<any>;
}
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
export const ProjectMembersTab: React.FC<ProjectMembersTabProps> = ({
    currentProject,
    projectId,
    currentUser,
    enhancedEmployees,
    loading,
    employeesLoading,
    searchKeyword,
    setSearchKeyword,
    statusFilter,
    setStatusFilter,
    assignProjectStaff,
    removeProjectStaff,
    editProject,
    getProjectById,
}) => {
    const [isRatePopoverOpen, setIsRatePopoverOpen] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const [rateValue, setRateValue] = useState('');
    const [rateType, setRateType] = useState('A');
    const [showRateDialog, setShowRateDialog] = useState(false);
    const { getEmployeeRates: getRates, createRate } = useHourlyRates(currentUser?.workspaceid); // Get createRate from the hook

    // Fetch rates when component mounts
    useEffect(() => {
        const fetchEmployeeRates = async () => {
            if (!currentUser?.workspaceid) return;
            
            try {
                // Fetch rates for all employees
                for (const employee of enhancedEmployees) {
                    const rates = await getRates(employee.employeeid);
                    // Update the employee's rates in the state
                    // Note: You'll need to implement this state update logic
                    // based on how your employee state is managed
                }
            } catch (error) {
                console.error("Failed to fetch rates:", error);
            }
        };

        fetchEmployeeRates();
    }, [currentUser?.workspaceid, enhancedEmployees, getRates]);

    // Filter employees based on search keyword
    const filteredEmployees = useMemo(() => {
        if (!enhancedEmployees) return [];
        
        const searchTerm = searchKeyword.toLowerCase().trim();
        if (!searchTerm) return enhancedEmployees;

        return enhancedEmployees.filter((employee) => {
            if (!employee) return false;

            return (
                employee.name?.toLowerCase().includes(searchTerm) ||
                employee.email?.toLowerCase().includes(searchTerm) ||
                employee.department?.departmentname?.toLowerCase().includes(searchTerm)
            );
        });
    }, [enhancedEmployees, searchKeyword]);

    const handleAssignEmployee = async (employeeId: number) => {
        if (!projectId || !currentUser?.workspaceid) {
            alert("Missing project or workspace information");
            return;
        }

        try {
            // Fetch the employee's rates
            const rates = await getRates(employeeId);
            const hasAnyRate = rates && rates.length > 0;

            if (!hasAnyRate) {
                setSelectedEmployeeId(employeeId);
                setShowRateDialog(true);
                return;
            }

            await assignProjectStaff(Number(projectId), employeeId);
            await getProjectById(Number(projectId));
            alert("Employee assigned successfully");
        } catch (error) {
            console.error("Failed to assign employee:", error);
            alert("Failed to assign employee");
        }
    };

    const handleRateCreate = async () => {
        if (!selectedEmployeeId || !rateValue || isNaN(Number(rateValue))) {
            alert("Please enter a valid rate");
            return;
        }

        try {
            // Use createRate with camelCase keys
            await createRate({
                employeeId: selectedEmployeeId,  // camelCase
                type: rateType,                  // camelCase
                ratevalue: Number(rateValue)     // camelCase
            });

            // Only proceed with assignment if rate creation was successful
            await assignProjectStaff(Number(projectId), selectedEmployeeId);
            await getProjectById(Number(projectId));
            
            // Reset form state
            setShowRateDialog(false);
            setRateValue('');
            setRateType('A');
            setSelectedEmployeeId(null);
            
            alert("Employee assigned successfully");
        } catch (error: any) {
            console.error("Failed to set rate or assign employee:", error);
            alert(error.response?.data?.message || "Failed to set hourly rate");
        }
    };

    // Handle employee removal
    const handleRemoveEmployee = async (employeeId: number) => {
        try {
            if (!projectId || !currentUser?.workspaceid) {
                alert("Missing project or workspace information");
                return;
            }

            await removeProjectStaff(projectId, employeeId);
            await getProjectById(projectId);
            alert("Employee removed successfully");
        } catch (error) {
            console.error("Failed to remove employee:", error);
            alert("Failed to remove employee");
        }
    };

    const memberColumns = [
        {
            accessorKey: "profileimage",
            header: "",
            cell: ({ row }: any) => (
                <img
                    src={row.original.profileimage || "/default-avatar.png"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                />
            ),
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "department.departmentname",
            header: "Department",
            cell: ({ row }: any) =>
                row.original.department?.departmentname || "N/A",
        },
        {
            accessorKey: "availability",
            header: "Availability",
            cell: ({ row }: any) => row.original.availability || "Not Assigned",
        },
        {
            accessorKey: "rates",
            header: "Rate",
            cell: ({ row }: any) => {
                const staff = row.original;
                const rateValue = getRateValue(staff);

                if (rateValue === null) return "N/A";
                return `¥${rateValue.toLocaleString()}/hr`;
            },
        },
        {
            accessorKey: "averagePerformance",
            header: "Performance",
            cell: ({ row }: any) => {
                const performance = row.original.averagePerformance;
                if (performance === undefined || performance === null)
                    return "N/A";
                return `${Number(performance).toFixed(1)}%`;
            },
        },
        {
            id: "actions",
            cell: ({ row }: any) => {
                const isAssigned = currentProject?.assignedStaff?.some(
                    (staff) => staff.employeeId === row.original.employeeid
                );

                return (
                    <Button
                        variant="outline"
                        className="w-20 py-2 border rounded-none"
                        size="sm"
                        disabled={isAssigned}
                        onClick={() => handleAssignEmployee(row.original.employeeid)}
                    >
                        {isAssigned ? "ASSIGNED" : "ASSIGN"}
                    </Button>
                );
            },
        },
    ];

    const getRateValue = (staff: any) => {
        // First try to get rate from the rates array
        if (staff.rates && Array.isArray(staff.rates)) {
            const rateA = staff.rates.find(
                (rate: any) => rate.type === "A"
            )?.value;
            if (rateA !== undefined) return rateA;
        }

        // Fallback to rateValue if rates array is not available
        if (staff.rateValue !== undefined) return staff.rateValue;

        return null;
    };

    return (
        <>
            <TabsContent className="m-0" value="members">
                <TitleWrapper>
                    <h1>Member adjustment</h1>
                </TitleWrapper>
                <div className="flex flex-row bg-white">
                    {/* Assigned Members Section */}
                    <div className="w-1/3 py-2 border-r">
                        <div className="flex items-center justify-between px-8 py-3 mb-4 border-b">
                            <h3 >Assigned</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                    {currentProject?.assignedStaff?.length || 0} /{" "}
                                    {currentProject?.requiredstaffnumber || 0}
                                </span>
                            </div>
                        </div>

                        <AssignedMembersList
                            assignedStaff={currentProject?.assignedStaff}
                            onRemove={handleRemoveEmployee}
                        />
                    </div>

                    {/* Available Members Section */}
                    <div className="w-full">
                        <div className="flex items-center p-4 border-b">
                            <h1>Available Members</h1>
                        </div>

                        <SearchAndFilterSection
                            searchKeyword={searchKeyword}
                            setSearchKeyword={setSearchKeyword}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            field={field}
                        />

                        <div className="border-l">
                            <DataTable
                                columns={memberColumns}
                                data={filteredEmployees}
                                loading={loading || employeesLoading}
                            />
                        </div>
                    </div>
                </div>
            </TabsContent>
            
            <Dialog 
                open={showRateDialog} 
                onOpenChange={(open) => {
                    if (!open) {
                        setShowRateDialog(false);
                        setRateValue('');
                        setRateType('A');
                        setSelectedEmployeeId(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Set Hourly Rate</DialogTitle>
                        <DialogDescription>
                            This employee doesn't have an hourly rate set. Please set it now.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="rateType">Rate Type</Label>
                            <Select
                                value={rateType}
                                onValueChange={setRateType}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select rate type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A">Type A</SelectItem>
                                    <SelectItem value="B">Type B</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="rate">Rate (¥/hr)</Label>
                            <Input
                                id="rate"
                                type="number"
                                value={rateValue}
                                onChange={(e) => setRateValue(e.target.value)}
                                placeholder="Enter hourly rate"
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowRateDialog(false);
                                setRateValue('');
                                setRateType('A');
                                setSelectedEmployeeId(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleRateCreate}>
                            Set Rate & Assign
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

interface AssignedMembersListProps {
    assignedStaff?: Array<{
        employeeId: number;
        name: string;
        profileImage?: string;
        rates?: Array<{ type: string; value: number }>;
    }>;
    onRemove: (employeeId: number) => void;
}

const AssignedMembersList: React.FC<AssignedMembersListProps> = ({
    assignedStaff,
    onRemove,
}) => {
    if (!assignedStaff || assignedStaff.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <span className="text-sm">No members assigned yet</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {assignedStaff.map((staff) => (
                <div
                    key={staff.employeeId}
                    className="flex items-center justify-between px-8 py-4 border-b"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <span className="font-medium">{staff.name}</span>
                            <span className="text-sm text-gray-500">
                                {(
                                    staff.rates?.find(
                                        (rate) => rate.type === "A"
                                    )?.value
                                ) ?
                                    `¥${staff.rates.find((rate) => rate.type === "A")?.value}/hr`
                                :   "No rate set"}
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-none cursor-pointer"
                        onClick={() => onRemove(staff.employeeId)}
                    >
                        REMOVE
                    </Button>
                </div>
            ))}
        </div>
    );
};

interface SearchAndFilterSectionProps {
    searchKeyword: string;
    setSearchKeyword: (keyword: string) => void;
    statusFilter: "active" | "all";
    setStatusFilter: (status: "active" | "all") => void;
    field: any[]; // Replace 'any' with proper type if available
}

const SearchAndFilterSection: React.FC<SearchAndFilterSectionProps> = ({
    searchKeyword,
    setSearchKeyword,
    statusFilter,
    setStatusFilter,
    field,
}) => {
    return (
        <div className="flex flex-row flex-wrap items-center justify-between w-full p-4 bg-white border-b md:flex-row">
            <div className="flex flex-col space-y-2 bg-white md:w-auto">
                <Label htmlFor="keyword">Keyword</Label>
                <Input
                    type="text"
                    id="keyword"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Search by name, email, etc."
                    className="border rounded-none w-[250px]"
                />
            </div>

            <div className="flex flex-row gap-2">
                <div className="flex flex-col space-y-2">
                    <Label>Status</Label>
                    <div className="flex">
                        <Button
                            size="default"
                            className={`w-20 rounded-none ${
                                statusFilter === "active" ? "bg-black" : ""
                            }`}
                            onClick={() => setStatusFilter("active")}
                        >
                            Active
                        </Button>
                        <Button
                            size="default"
                            variant="outline"
                            className={`w-20 rounded-none ${
                                statusFilter === "all" ?
                                    "bg-black text-white"
                                :   ""
                            }`}
                            onClick={() => setStatusFilter("all")}
                        >
                            All
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    <Label>‎</Label>
                    <AdvancedFilterPopover fields={field} />
                </div>
            </div>
        </div>
    );
};
