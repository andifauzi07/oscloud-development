import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { TitleWrapper } from '@/components/wrapperElement';
import { GraphicChart } from '../graphicChart';
import { useProjectPL } from '@/hooks/useProjectPL';
import { useProject } from '@/hooks/useProject';
import { Input } from '@/components/ui/input';

interface ProjectPLTabProps {
    projectId: number;
}

export const ProjectPLTab: React.FC<ProjectPLTabProps> = ({ projectId }) => {
    const plData = useProjectPL(projectId);
    const { editProject, currentProject } = useProject();
    
    const [isRevenueEditable, setIsRevenueEditable] = useState(false);
    const [isExpendituresEditable, setIsExpendituresEditable] = useState(false);
    
    const [revenueForm, setRevenueForm] = useState({
        revenue: 0,
        otherCost: 0
    });

    const [expendituresForm, setExpendituresForm] = useState({
        labourCost: 0,
        transportCost: 0,
        costumeCost: 0,
        managerFee: 0,
        otherCost: 0
    });

    if (!plData || !currentProject) {
        return <TabsContent className="m-0" value="P/L">Loading...</TabsContent>;
    }

    const handleRevenueEdit = () => {
        setRevenueForm({
            revenue: plData.revenue.revenueCost,
            otherCost: plData.revenue.otherCost
        });
        setIsRevenueEditable(true);
    };

    const handleExpendituresEdit = () => {
        setExpendituresForm({
            labourCost: plData.expenditures.labourCost,
            transportCost: plData.expenditures.transportCost,
            costumeCost: plData.expenditures.costumeCost,
            managerFee: plData.expenditures.managerFee,
            otherCost: plData.expenditures.otherCost
        });
        setIsExpendituresEditable(true);
    };

    const handleRevenueSave = async () => {
        try {
            const updateData = {
                ...currentProject,
                costs: {
                    ...currentProject.costs,
                    revenue: revenueForm.revenue,
                    other_cost: revenueForm.otherCost
                }
            };

            await editProject({
                projectId,
                data: updateData
            });

            // Refresh the data after successful save
            await plData.refreshProjectData();
            setIsRevenueEditable(false);
        } catch (error) {
            console.error('Failed to update revenue:', error);
            alert('Failed to update revenue');
        }
    };

    const handleExpendituresSave = async () => {
        try {
            // Create a new costs object that preserves all existing costs
            const updatedCosts = {
                ...currentProject.costs,
                labour_cost: Number(expendituresForm.labourCost),
                transport_cost: Number(expendituresForm.transportCost),
                costume_cost: Number(expendituresForm.costumeCost),
                manager_fee: Number(expendituresForm.managerFee),
                other_cost: Number(expendituresForm.otherCost)
            };

            // Format the update data to match the API structure
            const updateData = {
                projectid: projectId,
                name: currentProject.name,
                startdate: currentProject.startdate,
                enddate: currentProject.enddate,
                workspaceid: currentProject.workspaceid,
                companyid: currentProject.companyid,
                status: currentProject.status,
                managerid: currentProject.managerid,
                description: currentProject.description,
                requiredstaffnumber: currentProject.requiredstaffnumber,
                categoryid: currentProject.categoryid,
                costs: updatedCosts
            };

            await editProject({
                projectId,
                data: updateData
            });

            await plData.refreshProjectData();
            setIsExpendituresEditable(false);
        } catch (error) {
            console.error('Failed to update expenditures:', error);
            alert('Failed to update expenditures');
        }
    };

    const handleRevenueCancel = () => {
        setIsRevenueEditable(false);
        setRevenueForm({
            revenue: plData.revenue.revenueCost,
            otherCost: plData.revenue.otherCost
        });
    };

    const handleExpendituresCancel = () => {
        setIsExpendituresEditable(false);
        setExpendituresForm({
            labourCost: plData.expenditures.labourCost,
            transportCost: plData.expenditures.transportCost,
            costumeCost: plData.expenditures.costumeCost,
            managerFee: plData.expenditures.managerFee,
            otherCost: plData.expenditures.otherCost
        });
    };

    return (
        <TabsContent className="m-0" value="P/L">
            <TitleWrapper>
                <h1>Profit & Loss</h1>
            </TitleWrapper>

            <div className="flex w-full h-full">
                {/* Left Side */}
                <div className="w-1/3 h-full border-r">
                    <div className="flex items-center justify-center w-full px-4 py-2 bg-gray-100">
                        <h2>Profit</h2>
                    </div>
                    <div className="flex w-full h-[250px] justify-center items-center border-t border-b p-4">
                        <h2 className="text-2xl">{plData.profit.total.toLocaleString()} USD</h2>
                    </div>
                    <div className="flex items-center justify-center w-full p-4 bg-gray-100">
                        <h2>Profitability</h2>
                    </div>
                    <div className="flex w-full justify-center h-[250px] items-center border-t p-4">
                        <h2 className="text-2xl">{plData.profit.profitability} %</h2>
                    </div>
                    <div className="min-h-[600px]">
                        <div className="flex items-center justify-center w-full p-4 bg-gray-100 border-t border-b">
                            <h2>Cost Breakdown</h2>
                        </div>
                        <GraphicChart title="Cost Breakdown" description='Project Expenses' data={plData.costBreakdown} />
                    </div>
                </div>

                {/* Right Side */}
                <div className="w-2/3">
                    <div className="flex items-center justify-between w-full p-4 bg-gray-100 border-b border-r">
                        <h2>Sales Revenue</h2>
                        {isRevenueEditable ? (
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    className="hover:cursor-pointer"
                                    onClick={handleRevenueCancel}
                                >
                                    CANCEL
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="hover:cursor-pointer"
                                    onClick={handleRevenueSave}
                                >
                                    SAVE
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="link"
                                className="hover:cursor-pointer"
                                onClick={handleRevenueEdit}
                            >
                                EDIT
                            </Button>
                        )}
                    </div>
                    <div className="flex w-full gap-2 p-4 border-b border-r">
                        <h2>Revenue Cost</h2>
                        {isRevenueEditable ? (
                            <Input
                                type="number"
                                value={revenueForm.revenue}
                                onChange={(e) => setRevenueForm(prev => ({
                                    ...prev,
                                    revenue: Number(e.target.value)
                                }))}
                                className="w-40"
                            />
                        ) : (
                            <h2>{plData.revenue.revenueCost.toLocaleString()} USD</h2>
                        )}
                    </div>
                    <div className="flex w-full gap-2 p-4 border-b border-r">
                        <h2>Other Cost</h2>
                        {isRevenueEditable ? (
                            <Input
                                type="number"
                                value={revenueForm.otherCost}
                                onChange={(e) => setRevenueForm(prev => ({
                                    ...prev,
                                    otherCost: Number(e.target.value)
                                }))}
                                className="w-40"
                            />
                        ) : (
                            <h2>{plData.revenue.otherCost.toLocaleString()} USD</h2>
                        )}
                    </div>
                    <div className="flex items-center justify-between w-full p-4 bg-gray-100 border-b border-r">
                        <h2>Expenditures</h2>
                        {isExpendituresEditable ? (
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    className="hover:cursor-pointer"
                                    onClick={handleExpendituresCancel}
                                >
                                    CANCEL
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="hover:cursor-pointer"
                                    onClick={handleExpendituresSave}
                                >
                                    SAVE
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="link"
                                className="hover:cursor-pointer"
                                onClick={handleExpendituresEdit}
                            >
                                EDIT
                            </Button>
                        )}
                    </div>
                    {Object.entries({
                        'Labour Cost': 'labourCost',
                        'Transport Cost': 'transportCost',
                        'Costume Cost': 'costumeCost',
                        'Manager Fee': 'managerFee',
                        'Other Cost': 'otherCost'
                    }).map(([label, key]) => (
                        <div key={key} className="flex w-full gap-2 p-4 border-b border-r">
                            <h2>{label}</h2>
                            {isExpendituresEditable ? (
                                <Input
                                    type="number"
                                    value={expendituresForm[key as keyof typeof expendituresForm]}
                                    onChange={(e) => setExpendituresForm(prev => ({
                                        ...prev,
                                        [key]: Number(e.target.value)
                                    }))}
                                    className="w-40"
                                />
                            ) : (
                                <h2>{plData.expenditures[key as keyof typeof plData.expenditures].toLocaleString()} USD</h2>
                            )}
                        </div>
                    ))}
                    <div className="flex items-center justify-start w-full p-4 bg-gray-100 border-b border-r">
                        <h2>Profit</h2>
                    </div>
                    <div className="flex w-full gap-2 p-4 border-b border-r">
                        <h2>Sales Profit</h2>
                        <h2>{plData.profit.salesProfit.toLocaleString()} USD</h2>
                    </div>
                </div>
            </div>
        </TabsContent>
    );
};
