import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { TitleWrapper } from '../wrapperElement';
import { usePayments, usePayrollEmployees } from '@/hooks/usePayroll';
import { useProject } from '@/hooks/useProject';
import { defaultPaymentColumnSettings } from '@/config/columnSettings';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AdvancedFilterPopover from '../search/advanced-search';
import { ProjectCosts } from '@/types/company';

interface PaymentStaff {
    id: string;
    image: string;
    name: string;
    break: number;
    duration: number;
    hourlyRate: number;
    transportFee: number;
    costs: ProjectCosts[];
    totalFee: number;
}

interface SearchAndFilterSectionProps {
    searchKeyword: string;
    setSearchKeyword: (keyword: string) => void;
    statusFilter: "active" | "all";
    setStatusFilter: (status: "active" | "all") => void;
    field: any[]; // Replace with proper type if available
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
                                statusFilter === "all" ? "bg-black text-white" : ""
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

interface ProjectPaymentTabProps {
    projectId: number;
}

export const ProjectPaymentTab: FC<ProjectPaymentTabProps> = ({ projectId }) => {
    const [paymentStaffData, setPaymentStaffData] = useState<PaymentStaff[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { payments, loading: paymentsLoading } = usePayments({ projectId });
    const { employees } = usePayrollEmployees();
    const { getProjectById, currentProject: project } = useProject();

    const [searchKeyword, setSearchKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState<"active" | "all">("active");

    // Define the fields for advanced search
    const fields = [
        {
            key: "duration",
            label: "Duration",
            type: "number",
        },
        {
            key: "hourlyRate",
            label: "Hourly Rate",
            type: "number",
        },
        {
            key: "break",
            label: "Break Hours",
            type: "number",
        },
        {
            key: "totalFee",
            label: "Total Fee",
            type: "number",
        },
    ];

    // First useEffect to fetch project
    useEffect(() => {
        if (projectId) {
            getProjectById(Number(projectId));
        }
    }, [projectId, getProjectById]);

    // Second useEffect to transform data
    useEffect(() => {
        if (!payments || !employees || !project) return;

        const transformedData: PaymentStaff[] = payments.map(payment => {
            const employee = employees.find(emp => emp.employeeId === payment.employeeId);
            const projectDetail = payment.details.find(detail => detail.projectId === projectId);
            
            const startDate = new Date(project.startdate);
            const endDate = new Date(project.enddate);
            const duration = Math.ceil(
                Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            const hourlyRate = employee?.rates.find(rate => rate.type === 'A')?.ratevalue || 0;

            return {
                id: payment.paymentId.toString(),
                image: payment.profileImage || '',
                name: payment.employeeName,
                break: projectDetail?.hoursWorked || 0,
                duration,
                hourlyRate,
                transportFee: projectDetail?.transportFee || 0,
                costs: project.costs ? [project.costs] : [],
                totalFee: payment.totalPayment
            };
        });

        setPaymentStaffData(transformedData);
        setIsLoading(false);
    }, [payments, employees, project, projectId]);

    // Filter data based on search keyword and status
    const filteredData = paymentStaffData.filter(staff => {
        const matchesSearch = staff.name.toLowerCase().includes(searchKeyword.toLowerCase());
        const matchesStatus = statusFilter === "all" ? true : true; // Modify based on your status logic
        return matchesSearch && matchesStatus;
    });

    return (
        <TabsContent value="payment" className="m-0">
            <TitleWrapper>
                <h1>Member Payments</h1>
            </TitleWrapper>

            <div className="flex flex-col bg-white">
                <SearchAndFilterSection
                    searchKeyword={searchKeyword}
                    setSearchKeyword={setSearchKeyword}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    field={fields}
                />

                <div className="border-l">
                    <DataTable
                        columns={defaultPaymentColumnSettings}
                        data={filteredData}
                        loading={isLoading || paymentsLoading}
                    />
                </div>
            </div>
        </TabsContent>
    );
};
