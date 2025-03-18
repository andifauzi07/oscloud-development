import React, { useState, useCallback } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { TabsContent } from "@/components/ui/tabs";
import { type ColumnDef } from "@tanstack/react-table";
import { type Project } from "@/types/project";
import { ProjectCategory, type Company } from "@/types/company";
import { User } from "@/types/payroll";
import { AssignedStaff } from "@/store/slices/projectSlice";
import { toast } from "@/components/ui/use-toast";
import { User as CurrentUser } from "@/types/user";
import { Link } from "@tanstack/react-router";

interface EditedTimeSlot {
    date: string;
    timeSlot: {
        start: string;
        end: string;
    };
    isNew: boolean;
}

interface EditedDataType {
    [key: string]: EditedTimeSlot;
}

interface ProjectDescriptionTabProps {
    currentProject: Project;
    projectId?: number;
    companies: Company[];
    categories: ProjectCategory[];
    users: User[];
    loading: boolean;
    editProject: (params: { projectId: number; data: any }) => Promise<any>;
    getProjectById: (projectId: number) => Promise<any>;
    onGeneralInfoSave: (info: GeneralInfo) => Promise<void>;
    onDescriptionSave: (description: string) => Promise<void>;
    createAssignedStaffColumns: (
        isEditing: boolean
    ) => ColumnDef<AssignedStaff>[];
    convertAssignedStaffType: (staff: any[]) => AssignedStaff[];
}

interface GeneralInfo {
    name: string;
    companyId: string;
    categoryId: number | null;
    managerId: string;
    requiredStaffNumber: number;
}

export const ProjectDescriptionTab: React.FC<ProjectDescriptionTabProps> = ({
    currentProject,
    projectId,
    companies,
    categories,
    users,
    loading,
    editProject,
    getProjectById,
}) => {
    const [isEditingGeneral, setIsEditingGeneral] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [isEditingStaff, setIsEditingStaff] = useState(false);
    const [editedData, setEditedData] = useState<EditedDataType>({});

    const [editedGeneralInfo, setEditedGeneralInfo] = useState<GeneralInfo>({
        name: currentProject?.name || "",
        companyId: currentProject?.company?.companyid?.toString() || "",
        categoryId: currentProject?.category?.categoryid || null,
        managerId: currentProject?.manager?.userid || "",
        requiredStaffNumber: currentProject?.requiredStaffNumber || 0,
    });

    const [editedDescription, setEditedDescription] = useState(
        currentProject?.description || ""
    );

    const handleGeneralInfoSave = async () => {
        try {
            if (!projectId) {
                throw new Error("Project ID is required");
            }

            // Format the data to match the API expectations
            const updateData = {
                name: editedGeneralInfo.name.trim(),
                companyId: Number(editedGeneralInfo.companyId),
                managerId: editedGeneralInfo.managerId,
                categoryId: editedGeneralInfo.categoryId 
                    ? Number(editedGeneralInfo.categoryId)
                    : null,
                requiredStaffNumber: Number(editedGeneralInfo.requiredStaffNumber),
                // Preserve existing values from currentProject
                startDate: currentProject?.startdate || null,
                endDate: currentProject?.enddate || null,
                status: currentProject?.status || "Active",
                costs: currentProject?.costs || {
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

            console.log("Sending update data:", updateData);

            const result = await editProject({
                projectId: Number(projectId),
                data: updateData,
            });

            console.log("Update result:", result);

            // Refresh project data
            await getProjectById(Number(projectId));

            setIsEditingGeneral(false);
            alert("Project updated successfully");
        } catch (error) {
            console.error("Failed to update project:", error);
            alert(
                "Failed to update project. Please check all fields are filled correctly."
            );
        }
    };

    const handleDescriptionSave = async () => {
        try {
            if (!currentProject || !projectId) {
                throw new Error("Project data is not available");
            }

            const updatePayload = {
                description: editedDescription,
                name: currentProject.name,
                companyid: currentProject.companyid,
                managerid: currentProject.managerid,
                requiredstaffnumber: currentProject.requiredStaffNumber,
                startdate: currentProject.startdate,
                enddate: currentProject.enddate,
                status: currentProject.status || undefined,
            };

            console.log("Sending update payload:", updatePayload);

            const result = await editProject({
                projectId: Number(projectId),
                data: updatePayload,
            });

            console.log("Update result:", result);

            await getProjectById(Number(projectId));

            setIsEditingDescription(false);
            alert("Description updated successfully");
        } catch (error) {
            console.error("Failed to update description:", error);
            alert(
                "Failed to update description. Please check the console for details."
            );
        }
    };

    const convertAssignedStaffType = (staff: AssignedStaff[]): any[] => {
        return staff.map((s) => ({
            id: s.employeeId,
            image: s.profileImage,
            name: s.name,
            status: "Active",
            money: getRateValue(s) || 0,
            money2: s.totalEarnings || 0,
            grade: s.averagePerformance ? String(s.averagePerformance) : "N/A",
        }));
    };

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



    const createAssignedStaffColumns = useCallback(
        (isEditing: boolean): ColumnDef<AssignedStaff>[] => [
            {
                accessorKey: "profileImage",
                header: "",
                cell: ({ row }) => (
                    <img
                        src={
                            row.original?.profileImage || "/default-avatar.png"
                        }
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
                accessorKey: "availability",
                header: "Availability",
                cell: ({ row }) => {
                    if (!isEditing) {
                        return (
                            <div>
                                {row.getValue("availability") || "Not set"}
                            </div>
                        );
                    }

                    return (
                        <div className="flex items-center gap-2">
                            <Input
                                type="date"
                                className="w-32"
                                value={editedData[row.original.id]?.date || ""}
                                onChange={(e) => {
                                    const timeSlot = editedData[row.original.id]
                                        ?.timeSlot || {
                                        start: "09:00",
                                        end: "17:00",
                                    };
                                    setEditedData({
                                        ...editedData,
                                        [row.original.id]: {
                                            date: e.target.value,
                                            timeSlot,
                                            isNew: !row.getValue(
                                                "availability"
                                            ),
                                        },
                                    });
                                }}
                            />
                            <Input
                                type="time"
                                className="w-24"
                                value={
                                    editedData[row.original.id]?.timeSlot
                                        ?.start || "09:00"
                                }
                                onChange={(e) => {
                                    const current = editedData[
                                        row.original.id
                                    ] || {
                                        date: format(new Date(), "yyyy-MM-dd"),
                                        timeSlot: { end: "17:00" },
                                    };
                                    setEditedData({
                                        ...editedData,
                                        [row.original.id]: {
                                            ...current,
                                            timeSlot: {
                                                ...current.timeSlot,
                                                start: e.target.value,
                                            },
                                            isNew: !row.getValue(
                                                "availability"
                                            ),
                                        },
                                    });
                                }}
                            />
                            <span>-</span>
                            <Input
                                type="time"
                                className="w-24"
                                value={
                                    editedData[row.original.id]?.timeSlot
                                        ?.end || "17:00"
                                }
                                onChange={(e) => {
                                    const current = editedData[
                                        row.original.id
                                    ] || {
                                        date: format(new Date(), "yyyy-MM-dd"),
                                        timeSlot: { start: "09:00" },
                                    };
                                    setEditedData({
                                        ...editedData,
                                        [row.original.id]: {
                                            ...current,
                                            timeSlot: {
                                                ...current.timeSlot,
                                                end: e.target.value,
                                            },
                                            isNew: !row.getValue(
                                                "availability"
                                            ),
                                        },
                                    });
                                }}
                            />
                        </div>
                    );
                },
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
                    if (performance === undefined || performance === null)
                        return "N/A";
                    return `${Number(performance).toFixed(1)}%`;
                },
            },
        ],
        [editedData]
    );

    return (
        <TabsContent className="m-0" value="description">
            <div className="flex flex-col">
                {/* Header */}
                <div className="flex justify-between border-r">
                    <div className="flex items-center h-10 px-8">
                        <h1 className="text-sm">案件情報</h1>
                    </div>
                    <Button className="w-20 h-10 text-black bg-transparent link">
                        PRINT
                    </Button>
                </div>

                {/* General Information Section */}
                <div className="flex items-center justify-between bg-gray-100 border-t border-b border-r">
                    <div className="px-8">
                        <h1 className="text-base">基本情報</h1>
                    </div>
                    <div className="flex">
                        <Button
                            className="w-20 h-10 text-black bg-transparent border-l link border-r-none"
                            onClick={() =>
                                setIsEditingGeneral(!isEditingGeneral)
                            }
                        >
                            {isEditingGeneral ? "CANCEL" : "EDIT"}
                        </Button>
                        {isEditingGeneral && (
                            <Button
                                className="w-20 h-10 text-black bg-transparent border-l link border-r-none"
                                onClick={handleGeneralInfoSave}
                            >
                                SAVE
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col text-xs border-r">
                    {/* Project Name */}
                    <InfoField
                        label="案件名"
                        isEditing={isEditingGeneral}
                        value={currentProject?.name}
                        editComponent={
                            <Input
                                value={editedGeneralInfo.name}
                                onChange={(e) =>
                                    setEditedGeneralInfo((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                className="h-8"
                            />
                        }
                    />

                    {/* Client/Company */}
                    <InfoField
                        label="指名者"
                        isEditing={isEditingGeneral}
                        value={currentProject?.company?.name}
                        editComponent={
                            <Select
                                value={String(editedGeneralInfo.companyId || currentProject?.companyid || '')}
                                onValueChange={(value) => {
                                    console.log('Company onValueChange:', { value });
                                    setEditedGeneralInfo((prev) => ({
                                        ...prev,
                                        companyId: value,
                                    }))
                                }}
                            >
                                <SelectTrigger className="h-8">
                                    <SelectValue>
                                        {companies?.find(c => String(c.companyid) === String(editedGeneralInfo.companyId || currentProject?.companyid))?.name || "Select company"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {companies?.map((company) => (
                                        <SelectItem
                                            key={company.companyid}
                                            value={String(company.companyid)}
                                        >
                                            {company.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        }
                    />

                    {/* Personnel */}
                    {currentProject?.personnel &&
                        currentProject.personnel.length > 0 && (
                            <InfoField
                                label="ご担当者"
                                isEditing={false}
                                value={currentProject.personnel[0].name}
                            />
                        )}

                    {/* Category */}
                    <InfoField
                        label="カテゴリー"
                        isEditing={isEditingGeneral}
                        value={
                            currentProject?.category?.categoryname ||
                            "No category assigned"
                        }
                        editComponent={
                            <Select
                                value={
                                    editedGeneralInfo.categoryId?.toString() ||
                                    "none"
                                }
                                onValueChange={(value) =>
                                    setEditedGeneralInfo((prev) => ({
                                        ...prev,
                                        categoryId:
                                            value === "none" ? null : (
                                                Number(value)
                                            ),
                                    }))
                                }
                            >
                                <SelectTrigger className="h-8">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">
                                        No Category
                                    </SelectItem>
                                    {categories?.map((category) => (
                                        <SelectItem
                                            key={category.categoryid}
                                            value={category.categoryid.toString()}
                                        >
                                            {category.categoryname}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        }
                    />

                    <InfoField
                        label="スタッフ"
                        isEditing={isEditingGeneral}
                        value={currentProject?.manager?.name}
                        editComponent={
                            <Select
                                value={editedGeneralInfo.managerId || currentProject?.managerid || ''}
                                onValueChange={(value) => {
                                    console.log('Manager onValueChange:', { value });
                                    setEditedGeneralInfo((prev) => ({
                                        ...prev,
                                        managerId: value,
                                    }))
                                }}
                            >
                                <SelectTrigger className="h-8">
                                    <SelectValue>
                                        {users?.find(u => u.id === (editedGeneralInfo.managerId || currentProject?.managerid))?.email || "Select manager"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {users?.map((user) => (
                                        <SelectItem
                                            key={user.id}
                                            value={user.id}
                                        >
                                            {user.email}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        }
                    />

                    {/* Required Staff Number */}
                    <InfoField
                        label="人数"
                        isEditing={isEditingGeneral}
                        value={currentProject?.requiredStaffNumber?.toString()}
                        editComponent={
                            <Input
                                type="number"
                                value={editedGeneralInfo.requiredStaffNumber}
                                onChange={(e) =>
                                    setEditedGeneralInfo((prev) => ({
                                        ...prev,
                                        requiredStaffNumber:
                                            parseInt(e.target.value) || 0,
                                    }))
                                }
                                enableEmoji={false}
                                className="h-8"
                            />
                        }
                    />

                    {/* Description Section */}
                    <div className="flex items-center justify-between bg-gray-100 border-t border-b">
                        <div className="px-8">
                            <h1 className="text-base">案件説明</h1>
                        </div>
                        <div className="flex">
                            <Button
                                className="w-20 h-10 text-black bg-transparent border-l link border-r-none"
                                onClick={() =>
                                    setIsEditingDescription(
                                        !isEditingDescription
                                    )
                                }
                            >
                                EDIT
                            </Button>
                            {isEditingDescription && (
                                <Button
                                    className="w-20 h-10 text-black bg-transparent border-l link border-r-none"
                                    onClick={handleDescriptionSave}
                                >
                                    SAVE
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="px-8 py-4">
                        {isEditingDescription ?
                            <textarea
                                value={editedDescription}
                                onChange={(e) =>
                                    setEditedDescription(e.target.value)
                                }
                                className="w-full h-32 p-2 border rounded"
                            />
                        :   <p>
                                {currentProject?.description ||
                                    "説明なし"}
                            </p>
                        }
                    </div>

                    {/* Assigned Staff Section */}
                    <div className="flex items-center justify-between bg-gray-100 border-t">
                        <div className="px-8">
                            <h1>スタッフ</h1>
                        </div>
                        <div className="flex">
                            <Link to="/payroll">
                                <Button
                                    className="w-20 h-10 text-black bg-transparent border-l link border-r-none"
                                >
                                    EDIT
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <DataTable
                    columns={createAssignedStaffColumns(isEditingStaff)}
                    data={
                        currentProject?.assignedStaff ?
                            convertAssignedStaffType(
                                currentProject.assignedStaff
                            )
                        :   []
                    }
                    loading={loading}
                />
            </div>
        </TabsContent>
    );
};

interface InfoFieldProps {
    label: string;
    isEditing: boolean;
    value: string | undefined;
    editComponent?: React.ReactNode;
}

const InfoField: React.FC<InfoFieldProps> = ({
    label,
    isEditing,
    value,
    editComponent,
}) => (
    <div className="flex justify-start w-full gap-4 px-6 py-3 border-t">
        <div className="flex justify-start p-2 w-1/8">
            <h1>{label}</h1>
        </div>
        <div className="flex justify-start flex-1 p-2">
            {isEditing ? editComponent : <h1>{value}</h1>}
        </div>
    </div>
);
