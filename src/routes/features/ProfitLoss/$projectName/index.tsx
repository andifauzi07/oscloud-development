import { createFileRoute, useParams } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProject } from "@/hooks/useProject";
import { GraphicChart } from "@/components/graphicChart";
import { InfoSection, TitleWrapper } from "@/components/wrapperElement";
import { useUserData } from "@/hooks/useUserData";

export const Route = createFileRoute("/features/ProfitLoss/$projectName/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { projectName } = useParams({
        from: "/features/ProfitLoss/$projectName/",
    });
    const {
        getProjectById,
        currentProject,
        editProject,
        loading: projectLoading,
    } = useProject();
    const { currentUser } = useUserData();
    const [isLoading, setIsLoading] = useState(true);
    const [isRevenueEditable, setIsRevenueEditable] = useState(false);
    const [isExpendituresEditable, setIsExpendituresEditable] = useState(false);
    const [revenueForm, setRevenueForm] = useState({
        revenue: 0,
        otherCost: 0,
    });
    const [expendituresForm, setExpendituresForm] = useState({
        labourCost: 0,
        transportCost: 0,
        costumeCost: 0,
        managerFee: 0,
        otherCost: 0,
    });
    const [plData, setPlData] = useState<any>({
        profit: {
            total: 0,
            profitability: 0,
            salesProfit: 0,
        },
        revenue: {
            revenueCost: 0,
            otherCost: 0,
        },
        expenditures: {
            labourCost: 0,
            transportCost: 0,
            costumeCost: 0,
            managerFee: 0,
            otherCost: 0,
        },
        costBreakdown: [], // Your chart data structure
    });

    const refreshProjectData = async () => {
        if (!currentUser?.workspaceid) return;
        
        try {
            const project = await getProjectById(Number(projectName));
            const costs = project?.costs || {};
            const totalCosts = Object.values(costs).reduce((sum: number, cost: any) => sum + (Number(cost) || 0), 0);
            
            setPlData({
                profit: {
                    total: (costs.revenue || 0) - totalCosts,
                    // Store as number, not string
                    profitability: totalCosts > 0 ? (((costs.revenue || 0) - totalCosts) / totalCosts) * 100 : 0,
                    salesProfit: (costs.revenue || 0) - totalCosts,
                },
                revenue: {
                    revenueCost: costs.revenue || 0,
                    otherCost: costs.other_cost || 0,
                },
                expenditures: {
                    labourCost: costs.labour_cost || 0,
                    transportCost: costs.transport_cost || 0,
                    costumeCost: costs.costume_cost || 0,
                    managerFee: costs.manager_fee || 0,
                    otherCost: costs.other_cost || 0,
                },
                costBreakdown: [
                    { name: '総賃金', value: costs.labour_cost || 0 },
                    { name: '総交通費', value: costs.transport_cost || 0 },
                    { name: '総衣装費', value: costs.costume_cost || 0 },
                    { name: '管理費', value: costs.manager_fee || 0 },
                    { name: '他経費', value: costs.other_cost || 0 },
                ],
            });
        } catch (error) {
            console.error("Error refreshing project data:", error);
        }
    };

    useEffect(() => {
        const fetchProjectData = async () => {
            if (!currentUser?.workspaceid) {
                console.log('Waiting for workspace ID...');
                return;
            }
            
            try {
                await refreshProjectData();
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching project:", error);
                setIsLoading(false);
            }
        };

        fetchProjectData();
    }, [projectName, currentUser?.workspaceid]);

    const handleRevenueEdit = () => {
        setRevenueForm({
            revenue: plData.revenue.revenueCost,
            otherCost: plData.revenue.otherCost
        });
        setIsRevenueEditable(true);
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
                projectId: Number(projectName),
                data: updateData
            });

            await refreshProjectData();
            setIsRevenueEditable(false);
        } catch (error) {
            console.error('Failed to update revenue:', error);
            alert('Failed to update revenue');
        }
    };

    const handleRevenueCancel = () => {
        setIsRevenueEditable(false);
        setRevenueForm({
            revenue: plData.revenue.revenueCost,
            otherCost: plData.revenue.otherCost
        });
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

    const handleExpendituresSave = async () => {
        try {
            const updatedCosts = {
                ...currentProject.costs,
                labour_cost: Number(expendituresForm.labourCost),
                transport_cost: Number(expendituresForm.transportCost),
                costume_cost: Number(expendituresForm.costumeCost),
                manager_fee: expendituresForm.managerFee,
                other_cost: expendituresForm.otherCost
            };

            const updateData = {
                ...currentProject,
                costs: updatedCosts
            };

            await editProject({
                projectId: Number(projectName),
                data: updateData
            });

            await refreshProjectData();
            setIsExpendituresEditable(false);
        } catch (error) {
            console.error('Failed to update expenditures:', error);
            alert('Failed to update expenditures');
        }
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

    if (isLoading || projectLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Tabs defaultValue="P/L">
            <TabsContent className="m-0" value="P/L">
                <TitleWrapper>
                    <h1>収益情報</h1>
                </TitleWrapper>

                <div className="flex w-full h-full">
                    {/* Left Side */}
                    <div className="w-1/3 h-full border-r">
                        <div className="flex items-center justify-center w-full px-4 py-2 bg-gray-100">
                            <h2>総利益</h2>
                        </div>
                        <div className="flex w-full h-[250px] justify-center items-center border-t border-b p-4">
                            <h2 className="text-2xl">
                                {plData.profit.total.toLocaleString()} ¥
                            </h2>
                        </div>
                        <div className="flex items-center justify-center w-full p-4 bg-gray-100">
                            <h2>利益率</h2>
                        </div>
                        <div className="flex w-full justify-center h-[250px] items-center border-t p-4">
                            <h2 className="text-2xl">
                                {Number(plData.profit.profitability).toFixed(2)} %
                            </h2>
                        </div>
                        <div className="min-h-[600px]">
                            <div className="flex items-center justify-center w-full p-4 bg-gray-100 border-t border-b">
                                <h2>費用内訳</h2>
                            </div>
                            <GraphicChart
                                title="費用内訳"
                                description="費用内訳"
                                data={[
                                    { 
                                        name: '総賃金', 
                                        label: '総賃金',
                                        value: plData.expenditures.labourCost,
                                        fill: 'hsl(var(--chart-1))'
                                    },
                                    { 
                                        name: '総交通費', 
                                        label: '総交通費',
                                        value: plData.expenditures.transportCost,
                                        fill: 'hsl(var(--chart-2))'
                                    },
                                    { 
                                        name: '総衣装費', 
                                        label: '総衣装費',
                                        value: plData.expenditures.costumeCost,
                                        fill: 'hsl(var(--chart-3))'
                                    },
                                    { 
                                        name: '管理費', 
                                        label: '管理費',
                                        value: plData.expenditures.managerFee,
                                        fill: 'hsl(var(--chart-4))'
                                    },
                                    { 
                                        name: '他経費', 
                                        label: '他経費',
                                        value: plData.expenditures.otherCost,
                                        fill: 'hsl(var(--chart-5))'
                                    },
                                ]}
                            />
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="w-2/3">
                        <div className="flex items-center justify-between w-full p-4 bg-gray-100 border-b border-r">
                            <h2>売り上げ</h2>
                            {isRevenueEditable ?
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        onClick={handleRevenueCancel}
                                    >
                                        CANCEL
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={handleRevenueSave}
                                    >
                                        SAVE
                                    </Button>
                                </div>
                            :   <Button
                                    variant="link"
                                    onClick={handleRevenueEdit}
                                >
                                    EDIT
                                </Button>
                            }
                        </div>
                        <div className="flex w-full gap-2 p-4 border-b border-r">
                            <h2>他収益</h2>
                            {isRevenueEditable ?
                                <Input
                                    type="number"
                                    value={revenueForm.revenue}
                                    onChange={(e) =>
                                        setRevenueForm((prev) => ({
                                            ...prev,
                                            revenue: Number(e.target.value),
                                        }))
                                    }
                                    className="w-40"
                                />
                            :   <h2>
                                    {plData.revenue.revenueCost.toLocaleString()}{" "}
                                    ¥
                                </h2>
                            }
                        </div>
                        <div className="flex w-full gap-2 p-4 border-b border-r">
                            <h2>その他収益</h2>
                            {isRevenueEditable ?
                                <Input
                                    type="number"
                                    value={revenueForm.otherCost}
                                    onChange={(e) =>
                                        setRevenueForm((prev) => ({
                                            ...prev,
                                            otherCost: Number(e.target.value),
                                        }))
                                    }
                                    className="w-40"
                                />
                            :   <h2>
                                    {plData.revenue.otherCost.toLocaleString()}{" "}
                                    ¥
                                </h2>
                            }
                        </div>
                        <div className="flex items-center justify-between w-full p-4 bg-gray-100 border-b border-r">
                            <h2>費用</h2>
                            {isExpendituresEditable ?
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        onClick={handleExpendituresCancel}
                                    >
                                        CANCEL
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={handleExpendituresSave}
                                    >
                                        SAVE
                                    </Button>
                                </div>
                            :   <Button
                                    variant="link"
                                    onClick={handleExpendituresEdit}
                                >
                                    EDIT
                                </Button>
                            }
                        </div>
                        {Object.entries({
                            総賃金: "labourCost",
                            総交通費: "transportCost",
                            総衣装費: "costumeCost",
                            管理費: "managerFee",
                            他経費: "otherCost",
                        }).map(([label, key]) => (
                            <div
                                key={key}
                                className="flex w-full gap-2 p-4 border-b border-r"
                            >
                                <h2>{label}</h2>
                                {isExpendituresEditable ?
                                    <Input
                                        type="number"
                                        value={
                                            expendituresForm[
                                                key as keyof typeof expendituresForm
                                            ]
                                        }
                                        onChange={(e) =>
                                            setExpendituresForm((prev) => ({
                                                ...prev,
                                                [key]: Number(e.target.value),
                                            }))
                                        }
                                        className="w-40"
                                    />
                                :   <h2>
                                        {plData.expenditures[
                                            key as keyof typeof plData.expenditures
                                        ].toLocaleString()}{" "}
                                        ¥
                                    </h2>
                                }
                            </div>
                        ))}
                        <div className="flex items-center justify-start w-full p-4 bg-gray-100 border-b border-r">
                            <h2>利益</h2>
                        </div>
                        <div className="flex w-full gap-2 p-4 border-b border-r">
                            <h2>売上益</h2>
                            <h2>
                                {plData.profit.salesProfit.toLocaleString()} ¥
                            </h2>
                        </div>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    );
}
