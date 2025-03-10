import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import MenuList from "@/components/menuList";
import { DataTable } from "@/components/ui/data-table";
import { TitleWrapper } from "@/components/wrapperElement";
import { usePersonnel } from "@/hooks/usePersonnel";
import { format } from "date-fns";
import { Personnel } from "@/types/personnel";
import { useEffect, useState, useCallback } from "react";
import { AddRecordDialog } from "@/components/AddRecordDialog";
import { useUserData } from "@/hooks/useUserData";
import { useCompanies,  } from "@/hooks/useCompany";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { updatePersonnel, fetchAllPersonnel } from "@/store/slices/personnelSlice";

interface PersonnelData {
    id: number;
    name: string;
    email: string;
    manager: string;
    activeLeads: number;
    closedLeads: number;
    status: string;
    addedAt: string;
}

export const Route = createFileRoute("/features/personnel-list/")({
    component: RouteComponent,
});

function RouteComponent() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        personnel,
        loading,
        error,
        fetchAllPersonnel: fetchAllPersonnelHook,
        addPersonnel,
    } = usePersonnel();
    const { currentUser } = useUserData();
    const { companies } = useCompanies();
    const [isEditable, setIsEditable] = useState(false);

    // Create company options for the select field
    const companyOptions =
        companies?.map((company) => ({
            value: company.companyid.toString(),
            label: company.name,
        })) || [];

    const handleAddRecord = async (data: any) => {
        try {
            if (!currentUser?.userid) {
                throw new Error("No user ID available");
            }

            await addPersonnel(Number(data.companyid), {
                name: data.name,
                email: data.email,
                status: data.status,
                managerId: currentUser.userid, 
                description: data.description || "",
            });

            await fetchAllPersonnelHook();
            alert("Personnel added successfully");
        } catch (error) {
            console.error("Failed to add record:", error);
            alert("Failed to add personnel");
        }
    };

    const handleSaveEdits = useCallback(
        async (updatedData: any[]) => {
            try {
                if (!currentUser?.workspaceid) {
                    throw new Error("No workspace ID available");
                }

                console.log('Starting updates with data:', updatedData); // Debug log

                await Promise.all(
                    updatedData.map(async (person) => {
                        if (!person.id) {
                            console.error('Missing personnel ID:', person);
                            return;
                        }

                        // Create the update payload according API structure
                        const data = {
                            name: person.name,
                            email: person.email,
                            status: person.status,
                            companyid: typeof person.company === 'object' 
                                ? person.company?.companyid 
                                : person.companyid,
                            description: person.description
                        };

                        console.log('Dispatching update with:', {
                            workspaceId: Number(currentUser.workspaceid),
                            personnelId: person.id,
                            data
                        });

                        // Dispatch the update action with the correct parameters
                        await dispatch(updatePersonnel({
                            workspaceId: Number(currentUser.workspaceid),
                            personnelId: person.id,
                            data
                        }));
                    })
                );

                await dispatch(fetchAllPersonnel({
                    workspaceId: Number(currentUser.workspaceid)
                }));
                
                setIsEditable(false);
                alert("Changes saved successfully");
            } catch (error) {
                console.error("Failed to save updates:", error);
                alert("Failed to save changes");
                setIsEditable(true);
            }
        },
        [dispatch, currentUser?.workspaceid]
    );

    const statusOptions = [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
        { value: "Blocked", label: "Blocked" },
    ];

    useEffect(() => {
        fetchAllPersonnelHook();
    }, [fetchAllPersonnelHook]);

    const data: PersonnelData[] =
        personnel?.map((person) => {
            return {
                id: person.personnelId, // Changed from personnelid
                name: person.name,
                email: person.email || "N/A",
                manager: person.manager.email || "Unassigned", // Changed from app_user
                // Calculate active and closed leads from the leads array
                activeLeads: person.leads.filter(lead => lead.status === "Active").length,
                closedLeads: person.leads.filter(lead => lead.status === "Completed").length,
                status: person.status,
                addedAt: person.createdAt ? 
                    format(new Date(person.createdAt), "yyyy-MM-dd")
                    : "N/A",
                // If you need company information, you'll need to add it to the API response
                // or fetch it separately
            };
        }) || [];

    const columns = [
        {
            header: () => <h1 className="pl-8">ID</h1>,
            accessorKey: "id",
            cell: ({ row }: any) => <h1 className="pl-8">{row.original.id}</h1>,
            enableEditing: false,
        },
        {
            header: "Personnel Name",
            accessorKey: "name",
        },
        {
            header: "Email",
            accessorKey: "email",
        },
        {
            header: "Manager",
            accessorKey: "manager",
            enableEditing: false,
        },
        {
            header: "Active Leads",
            accessorKey: "activeLeads",
            enableEditing: false,
        },
        {
            header: "Closed Leads",
            accessorKey: "closedLeads",
            enableEditing: false,
        },
        {
            header: "Status",
            accessorKey: "status",
            type: "select",
        },
        {
            header: "Company",
            accessorKey: "companyid",
            type: "select",
        },
        {
            header: "Added At",
            accessorKey: "addedAt",
            enableEditing: false,
        },
        {
            header: "",
            id: "actions",
            cell: ({ row }: any) => (
                <div className="flex justify-end w-full">
                    <Link
                        to={`/company/$companyId/companyPersonnel/$companyPersonnelId`}
                        params={{
                            companyId: row.original.company?.companyid,
                            companyPersonnelId: row.original.id,
                        }}
                    >
                        <Button
                            variant="outline"
                            className="w-20 border-t-0 border-b-0 border-r-0"
                        >
                            VIEW
                        </Button>
                    </Link>
                </div>
            ),
            enableEditing: false,
        },
    ];

    const addRecordColumns = [
        {
            header: "Personnel Name",
            accessorKey: "name",
            required: true,
        },
        {
            header: "Email",
            accessorKey: "email",
            required: true,
        },
        {
            header: "Status",
            accessorKey: "status",
            required: true,
            type: "select",
        },
        {
            header: "Company",
            accessorKey: "companyid",
            required: true,
            type: "select",
        },
        {
            header: "Description",
            accessorKey: "description",
            required: false,
        },
    ];

    useEffect(() => {
        fetchAllPersonnelHook();
    }, [fetchAllPersonnelHook]);

    return (
        <div className="flex-1 h-full">
            <TitleWrapper>
                <h2>All Personnel</h2>
            </TitleWrapper>

            <div className="flex justify-end flex-none w-full bg-white">
                <AddRecordDialog
                    columns={addRecordColumns}
                    onSave={handleAddRecord}
                    nonEditableColumns={["actions", "id", "manager", "activeLeads", "closedLeads", "addedAt"]}
                    selectFields={{
                        status: {
                            options: statusOptions,
                        },
                        companyid: {
                            options: companyOptions,
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
                data={data}
                loading={loading}
                isEditable={isEditable}
                onSave={handleSaveEdits}
                nonEditableColumns={["actions", "id", "manager", "activeLeads", "closedLeads", "addedAt"]}
                selectFields={{
                    status: {
                        options: statusOptions,
                    },
                    companyid: {
                        options: companyOptions,
                    },
                }}
            />
        </div>
    );
}
