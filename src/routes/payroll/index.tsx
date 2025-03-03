import { createFileRoute, Link } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import AdvancedFilterPopover from '@/components/search/advanced-search';
import { Label } from '@/components/ui/label';
import { useUserData } from '@/hooks/useUserData';
import { useCallback, useEffect, useState } from 'react';
import { AddRecordDialog } from '@/components/AddRecordDialog';
import { Employee } from '@/types/payroll';
import { checkDomainOfScale } from 'recharts/types/util/ChartUtils';
import { useCreatePayment, usePayrollEmployees, useUpdatePaymentStatus } from '@/hooks/usePayroll';

export const Route = createFileRoute('/payroll/')({
    component: RouteComponent,
});

// Define the data row type
type PayrollRow = {
	image: string;
	id: string;
	name: string;
	employeeCategory: string;
	hourlyRateA: string;
	hourlyRateB: string;
	totalPayment: string;
	numberOfPayment: string;
	joinedOn: string;
};

/// Define columns
const columns: ColumnDef<PayrollRow>[] = [
	{
		accessorKey: 'image',
		header: '',
		cell: ({ row }) => (
			<div className="flex items-center justify-start h-full">
				<figure className="w-10 h-10 overflow-hidden">
					<img
						className="object-cover w-full h-full"
						src={row.original.image || '/default-avatar.png'}
					/>
				</figure>
			</div>
		),
	},
	{
		accessorKey: 'id',
		header: 'ID',
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'employeeCategory',
		header: 'Employee Category',
	},
	{
		accessorKey: 'hourlyRateA',
		header: 'Hourly Rate A',
	},
	{
		accessorKey: 'hourlyRateB',
		header: 'Hourly Rate B',
	},
	{
		accessorKey: 'totalPayment',
		header: 'Total Payment',
	},
	{
		accessorKey: 'numberOfPayment',
		header: 'No. of Payment',
	},
	{
		accessorKey: 'joinedOn',
		header: 'Joined on',
	},
	{
		accessorKey: 'action',
		header: '',

		cell: ({ row }) => (
			<div className="flex justify-end w-full">
				<Link
					to={'/payroll/$employeeId'}
					params={{ employeeId: row.original.id }}>
					<Button
						variant="outline"
						className="w-20 h-full border-t-0 border-b-0 border-r-0">
						DETAIL
					</Button>
				</Link>
			</div>
		),
	},
];


function RouteComponent() {
    const { workspaceid } = useUserData();
    const [searchKeyword, setSearchKeyword] = useState("");
    const [editable, setEditable] = useState(false);

    // Using the payroll hooks with proper typing
    const { employees, loading, error } = usePayrollEmployees();
    console.log(employees)
    const { createPayment, loading: creatingPayment } = useCreatePayment();
    const { updatePaymentStatus, loading: updatingStatus } =
        useUpdatePaymentStatus();

    const handleAddRecord = async (data: Partial<Employee>) => {
        try {
            if (!data.employeeId) throw new Error("Invalid employee data");

            await createPayment({
                employeeId: Number(data.employeeId),
                details: [
                    {
                        projectid: 1, // Should be replaced with actual project selection
                        hoursworked: 0,
                        transportfee: 0,
                    },
                ],
            });
        } catch (error) {
            console.error("Failed to add record:", error);
        }
    };

    const handleSaveEdits = useCallback(
        async (updatedData: Partial<PayrollRow>[]) => {
            try {
                await Promise.all(
                    updatedData.map(async (row) => {
                        if (row.id) {
                            await updatePaymentStatus(
                                Number(row.id),
                                "Updated"
                            );
                        }
                    })
                );
                setEditable(false);
            } catch (error) {
                console.error("Failed to save updates:", error);
            }
        },
        [updatingStatus]
    );

    // Enhanced filtering with type safety
    const filteredEmployees =
        employees?.filter(
            (employee) =>
                employee.name
                    ?.toLowerCase()
                    .includes(searchKeyword.toLowerCase()) ||
                employee.employeeId?.toString().includes(searchKeyword) ||
                employee.employeecategory?.categoryname
                    ?.toLowerCase()
                    .includes(searchKeyword)
        ) || [];

    const tableData: PayrollRow[] = filteredEmployees.map((employee) => ({
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        id: employee.employeeId?.toString() || "",
        name: employee.name || "Unknown",
        employeeCategory:
            employee.employeecategory?.categoryname || "Uncategorized",
        hourlyRateA:
            employee.rates
                ?.find((r: any) => r.type === "A")
                ?.ratevalue?.toFixed(2) || "-",
        hourlyRateB:
            employee.rates
                ?.find((r: any) => r.type === "B")
                ?.ratevalue?.toFixed(2) || "-",
        totalPayment: `¥${employee.totalPayment?.toFixed(2) || "0.00"}`,
        numberOfPayment: employee.numberOfPayments?.toString() || "0",
        joinedOn:
            employee.joineddate ?
                new Date(employee.joineddate).toISOString().split("T")[0]
            :   "Unknown",
    }));

    return (
        <div className="flex flex-col flex-1 h-full">
            <Tabs defaultValue="employeeList">
                <div className="flex items-center justify-between pl-4 bg-white border-b border-r">
                    <TabsList className="justify-start gap-8 bg-white [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12">
                        <TabsTrigger
                            value="employeeList"
                            className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2">
                            Employee List
                        </TabsTrigger>
                        <TabsTrigger
                            value="paymentList"
                            className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2">
                            Settings
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Employee List Tab */}
                <TabsContent
                    className="m-0"
                    value="employeeList">
                    <div className="flex flex-row flex-wrap items-center justify-between w-full px-8 py-4 bg-white border-b border-r md:flex-row">
                        <div className="flex gap-8">
                            <div className="flex flex-col space-y-2 bg-white md:w-auto">
                                <Label htmlFor="keyword">Keyword</Label>
                                <Input
                                    type="keyword"
                                    id="keyword"
                                    placeholder="Search employees..."
                                    value={searchKeyword}
                                    onChange={(e) =>
                                        setSearchKeyword(e.target.value)
                                    }
                                    className="border rounded-none w-[400px]"
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <Label>Status</Label>
                                <div className="flex">
                                    <Button
                                        size="default"
                                        className="w-full bg-black rounded-none md:w-20">
                                        Active
                                    </Button>
                                    <Button
                                        size="default"
                                        variant="outline"
                                        className="w-full rounded-none md:w-20">
                                        All
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Label>‎</Label>
                            <AdvancedFilterPopover />
                        </div>
                    </div>
                    <div className="flex justify-end flex-none w-full bg-white">
                        <AddRecordDialog
                            columns={columns}
                            onSave={handleAddRecord}
                            nonEditableColumns={[
                                "image",
                                "id",
                                "joinedOn",
                                "numberOfPayment",
                                "action",
                            ]}
                        />
                        <Button
                            onClick={() => setEditable((prev) => !prev)}
                            className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10"
                        >
                            {editable ? "CANCEL" : "EDIT+"}
                        </Button>
                    </div>
                    <div className="border-t border-r">
                    <DataTable
                            columns={columns}
                            data={tableData}
                            loading={
                                loading || creatingPayment || updatingStatus
                            }
                            isEditable={editable}
                            nonEditableColumns={[
                                "image",
                                "joinedOn",
                                "numberOfPayment",
                                "id",
                                "action",
                            ]}
                            onSave={handleSaveEdits}
                            // error={error?.toString()}
                        />
                    </div>
                </TabsContent>

            {/* Payment List Tab */}
				<TabsContent
					className="m-0 text-xs"
					value="paymentList">
					<div className="w-full bg-gray-100">
						<div className="px-8 py-2 font-bold">
							<h1>Rate Type</h1>
						</div>
					</div>
					<div className="flex items-center justify-between w-full bg-white border-t border-r">
						<div className="flex justify-between w-1/3 px-8 ">
							<h1>Hourly RateA</h1>
							<h1> Active</h1>
						</div>
						<Button className="h-10 text-black bg-transparent border-l border-r md:w-20 link border-r-none">REMOVE</Button>
					</div>
					<div className="flex items-center justify-between w-full bg-white border-t border-r">
						<div className="flex justify-between w-1/3 px-8 ">
							<h1>Hourly RateB</h1>
							<h1> Active</h1>
						</div>
						<Button className="h-10 text-black bg-transparent border-l border-r md:w-20 link border-r-none">REMOVE</Button>
					</div>
					<div className="flex items-center justify-between w-full bg-white border-t border-b border-r">
						<div className="flex justify-between w-1/3 px-8 ">
							<h1>Hourly RateC</h1>
							<h1> Active</h1>
						</div>
						<Button className="h-10 text-black bg-transparent border-l border-r md:w-20 link border-r-none">REMOVE</Button>
					</div>
				</TabsContent>
			</Tabs>
		</div>
    );
}
