import React, { useState, useEffect } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { TitleWrapper } from '../wrapperElement';
import { usePayments, usePayrollEmployees } from '@/hooks/usePayroll';
import { useProject } from '@/hooks/useProject';
import { defaultPaymentColumnSettings } from '@/config/columnSettings';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

interface ProjectPaymentTabProps {
    projectId: number;
}

export const ProjectPaymentTab: React.FC<ProjectPaymentTabProps> = ({ projectId }) => {
    const [paymentStaffData, setPaymentStaffData] = useState<PaymentStaff[]>([]);
    const { payments, loading: paymentsLoading } = usePayments({ projectId });
    const { employees } = usePayrollEmployees();
    const { getProjectById, currentProject: project } = useProject();

    useEffect(() => {
        getProjectById(projectId); // Fetch project data before rendering
        if (payments && employees && project) {
            const transformedData: PaymentStaff[] = payments.map(payment => {
                // Find corresponding employee
                const employee = employees.find(emp => emp.employeeId === payment.employeeId);
                const projectDetail = payment.details.find(detail => detail.projectId === projectId);
                
                // Calculate duration based on project dates
                const startDate = new Date(project.startdate);
                const endDate = new Date(project.enddate);
                const duration = Math.ceil(
                    Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
                );

                // Get hourly rate
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
        }
    }, [payments, employees, project, getProjectById, projectId]);

    const [searchKeyword, setSearchKeyword] = useState('');
    const [filters, setFilters] = useState<Record<string, any>>({});

    // Filter data based on search keyword
    const filteredData = paymentStaffData.filter(staff => 
        staff.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    const handleAdvancedSearch = (newFilters: Record<string, any>) => {
        setFilters(newFilters);
    };

    return (
        <TabsContent value="payment" className="m-0">
            <TitleWrapper>
                <h1>Member Payments</h1>
            </TitleWrapper>

            <div className="p-4 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Search by name..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="w-64"
                        />
                        <AdvancedFilterPopover
                            fields={[
                                { key: 'duration', label: 'Duration', type: 'number' },
                                { key: 'hourlyRate', label: 'Hourly Rate', type: 'number' },
                                { key: 'break', label: 'Break Hours', type: 'number' },
                            ]}
                            // onSearch={handleAdvancedSearch}
                        />
                    </div>
                    <Button variant="outline">Export</Button>
                </div>
                {/* Redeploy */}


                <DataTable
                    columns={defaultPaymentColumnSettings}
                    data={filteredData}
                    loading={paymentsLoading}
                />
            </div>
        </TabsContent>
    );
};
