import React from 'react';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { TitleWrapper } from '@/components/wrapperElement';
import { GraphicChart } from '../graphicChart';

interface PLData {
    revenue: {
        revenueCost: number;
        otherCost: number;
    };
    expenditures: {
        labourCost: number;
        transportCost: number;
        costumeCost: number;
        managerFee: number;
        otherCost: number;
    };
    profit: {
        total: number;
        profitability: number;
        salesProfit: number;
    };
}

interface ProjectPLTabProps {
    plData?: PLData;
    onEditRevenue?: () => void;
    onEditExpenditures?: () => void;
}

export const ProjectPLTab: React.FC<ProjectPLTabProps> = ({
    plData = {
        revenue: { revenueCost: 1000000, otherCost: 0 },
        expenditures: {
            labourCost: 10000,
            transportCost: 10000,
            costumeCost: 10000,
            managerFee: 10000,
            otherCost: 10000
        },
        profit: {
            total: 280000,
            profitability: 15,
            salesProfit: 10000
        }
    },
    onEditRevenue = () => {},
    onEditExpenditures = () => {}
}) => {
    return (
        <TabsContent className="m-0" value="P/L">
            <TitleWrapper>
                <h1>Member adjustment</h1>
            </TitleWrapper>
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
                        <GraphicChart />
                    </div>
                </div>

                {/* Right Side */}
                <div className="w-2/3">
                    <div className="flex items-center justify-between w-full p-4 bg-gray-100 border-b border-r">
                        <h2>Sales Revenue</h2>
                        <Button
                            variant="link"
                            className="hover:cursor-pointer"
                            onClick={onEditRevenue}
                        >
                            EDIT
                        </Button>
                    </div>
                    <div className="flex w-full gap-2 p-4 border-b border-r">
                        <h2>Revenue Cost</h2>
                        <h2>{plData.revenue.revenueCost.toLocaleString()} USD</h2>
                    </div>
                    <div className="flex w-full gap-2 p-4 border-b border-r">
                        <h2>Other Cost</h2>
                        <h2>{plData.revenue.otherCost.toLocaleString()} USD</h2>
                    </div>
                    <div className="flex items-center justify-between w-full p-4 bg-gray-100 border-b border-r">
                        <h2>Expenditures</h2>
                        <Button
                            variant="link"
                            className="hover:cursor-pointer"
                            onClick={onEditExpenditures}
                        >
                            EDIT
                        </Button>
                    </div>
                    <div className="flex w-full gap-2 p-4 border-b border-r">
                        <h2>Labour Cost</h2>
                        <h2>{plData.expenditures.labourCost.toLocaleString()} USD</h2>
                    </div>
                    <div className="flex w-full gap-2 p-4 border-b border-r">
                        <h2>Transport Cost</h2>
                        <h2>{plData.expenditures.transportCost.toLocaleString()} USD</h2>
                    </div>
                    <div className="flex w-full gap-2 p-4 border-b border-r">
                        <h2>Costume Cost</h2>
                        <h2>{plData.expenditures.costumeCost.toLocaleString()} USD</h2>
                    </div>
                    <div className="flex w-full gap-2 p-4 border-b border-r">
                        <h2>Manager Fee</h2>
                        <h2>{plData.expenditures.managerFee.toLocaleString()} USD</h2>
                    </div>
                    <div className="flex w-full gap-2 p-4 border-b border-r">
                        <h2>Other Cost</h2>
                        <h2>{plData.expenditures.otherCost.toLocaleString()} USD</h2>
                    </div>
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