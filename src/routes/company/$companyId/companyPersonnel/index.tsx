import { createFileRoute } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import MenuList from "@/components/menuList";
import { DataTable } from "@/components/ui/data-table";
import { useCompanyPersonnel } from "@/hooks/useCompany";
import { useState, useCallback, useMemo } from "react";
import { AddRecordDialog } from "@/components/AddRecordDialog";
import { toast } from "@/hooks/use-toast";

type PersonnelStatus = "Active" | "Inactive" | "Blocked";

export const Route = createFileRoute("/company/$companyId/companyPersonnel/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { companyId } = useParams({ strict: false });
    const {
        personnel,
        loading,
        error,
        addPersonnel,
        updatePersonnel,
        refetchPersonnel,
    } = useCompanyPersonnel(Number(companyId));
    const [isEditable, setIsEditable] = useState(false);

    const handleAddRecord = async (data: any) => {
        try {
            await addPersonnel({
                name: data.name,
                email: data.email,
                status: data.status,
                description: data.description,
            });

            // Refresh the data after successful addition
            await refetchPersonnel();
            alert("Personnel added successfully");
        } catch (error) {
            console.error("Failed to add record:", error);
            alert("Failed to add personnel");
        }
    };

    const handleSaveEdits = useCallback(
        async (updatedData: any[]) => {
            try {
                const updatePromises = updatedData.map(async (person) => {
                    const updatePayload: any = {};

                    // Preserve the ID and other essential fields
                    const originalPerson = personnel?.find(
                        (p) => p.personnelId === person.personnelId
                    );
                    if (!originalPerson) return Promise.resolve();

                    // Only include changed fields
                    if (
                        person.name !== undefined &&
                        person.name !== originalPerson.name
                    ) {
                        updatePayload.name = person.name;
                    }
                    if (
                        person.email !== undefined &&
                        person.email !== originalPerson.email
                    ) {
                        updatePayload.email = person.email;
                    }
                    if (
                        person.status !== undefined &&
                        person.status !== originalPerson.status
                    ) {
                        updatePayload.status = person.status;
                    }
                    if (
                        person.description !== undefined &&
                        person.description !== originalPerson.description
                    ) {
                        updatePayload.description = person.description;
                    }

                    if (Object.keys(updatePayload).length === 0) {
                        return Promise.resolve();
                    }

                    // Keep the original ID in the payload
                    updatePayload.personnelId = person.personnelId;

                    return updatePersonnel(person.personnelId, updatePayload);
                });

                await Promise.all(updatePromises);
                setIsEditable(false);

                // Refresh the data
                if (companyId) {
                    await refetchPersonnel();
                }

                alert("Personnel updated successfully");
            } catch (error) {
                alert("Failed to save updates");
            }
        },
        [updatePersonnel, refetchPersonnel, personnel, companyId]
    );

    const columns = useMemo(
        () => [
            {
                id: "personnelId",
                header: "ID",
                accessorKey: "personnelId",
                cell: ({ row }: any) => (
                    <div className="py-3 pl-8">
                        <h1>{row.original.personnelId}</h1>
                    </div>
                ),
            },
            {
                id: "name",
                header: "Name",
                accessorKey: "name",
                cell: ({ row }: any) => (
                    <div className="py-3">{row.original.name}</div>
                ),
            },
            {
                id: "email",
                header: "Email",
                accessorKey: "email",
                cell: ({ row }: any) => (
                    <div className="py-3">{row.original.email}</div>
                ),
            },
            {
                id: "status",
                header: "Status",
                accessorKey: "status",
                cell: ({ row }: any) => (
                    <div className="py-3">{row.original.status}</div>
                ),
            },
            {
                id: "description",
                header: "Description",
                accessorKey: "description",
                cell: ({ row }: any) => (
                    <div className="py-3">{row.original.description}</div>
                ),
            },
            {
                id: "detail",
                header: "",
                accessorKey: "detail",
                cell: ({ row }: any) => {
                    const personnelId = row.original?.personnelId;
                    if (!personnelId) return null;

                    return (
                        <div className="flex items-center justify-end w-full py-3">
                            <Button
                                variant="outline"
                                className="w-20 border-t-0 border-b-0 border-r-0"
                            >
                                <Link
                                    params={{
                                        companyId: companyId!,
                                        companyPersonnelId:
                                            personnelId.toString(),
                                    }}
                                    to="/company/$companyId/companyPersonnel/$companyPersonnelId"
                                >
                                    VIEW
                                </Link>
                            </Button>
                        </div>
                    );
                },
            },
        ],
        [companyId]
    );

    const statusOptions = [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
        { value: "Blocked", label: "Blocked" },
    ];

    if (error) {
        return <div>Error loading personnel: {error}</div>;
    }

    return (
        <div className="flex-1 h-full">
            <div className="items-center flex-none min-h-0 border-b">
                <div className="container flex items-center justify-between pl-4 border-r">
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
                    <div className="pr-4">
                        <Link className="text-xs" to="/performance/setting">
                            Settings
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-start h-12 px-8 bg-white border-b border-r">
                <h2 className="text-base">Company Personnel</h2>
            </div>
            <div className="flex justify-end flex-none w-full bg-white">
                <AddRecordDialog
                    columns={columns.map((col) => ({
                        header: col.header,
                        accessorKey: col.accessorKey,
                    }))}
                    onSave={handleAddRecord}
                    nonEditableColumns={["personnelId", "detail"]}
                    selectFields={{
                        status: {
                            options: statusOptions,
                        },
                    }}
                />
                <Button
                    onClick={() => setIsEditable((prev) => !prev)}
                    className="w-20 h-10 text-black bg-transparent border-t-0 border-b-0 border-r md:w-20 link"
                >
                    {isEditable ? "CANCEL" : "EDIT"}
                </Button>
            </div>
            <DataTable
                columns={columns}
                data={personnel || []}
                loading={loading}
                isEditable={isEditable}
                nonEditableColumns={["personnelId", "detail"]}
                onSave={handleSaveEdits}
                selectFields={{
                    status: {
                        options: statusOptions,
                    },
                }}
            />
        </div>
    );
}
