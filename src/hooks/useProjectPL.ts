import { useMemo, useCallback } from 'react';
import { useProject } from './useProject';
import { usePayments } from './usePayroll';

export const useProjectPL = (projectId: number) => {
    const { currentProject, getProjectById } = useProject();
    const { payments } = usePayments();

    // Create a refresh function that can be called after updates
    const refreshProjectData = useCallback(() => {
        if (projectId) {
            return getProjectById(projectId);
        }
    }, [getProjectById, projectId]);

    const plData = useMemo(() => {
        if (!currentProject || !payments) {
            return null;
        }

        const costs = currentProject.costs || {
            food: 0,
            break: 0,
            rental: 0,
            revenue: 0,
            other_cost: 0,
            labour_cost: 0,
            manager_fee: 0,
            costume_cost: 0,
            sales_profit: 0,
            transport_cost: 0
        };

        // Calculate total revenue
        const revenueCost = costs.revenue || 0;

        // Use values directly from costs instead of financials
        const labourCost = costs.labour_cost || 0;
        const transportCost = costs.transport_cost || 0;
        const costumeCost = costs.costume_cost || 0;
        const managerFee = costs.manager_fee || 0;
        const otherCosts = costs.other_cost || 0;

        // Calculate total costs
        const totalCosts = labourCost + transportCost + costumeCost + managerFee + otherCosts;

        // Calculate profit (same as sales profit)
        const totalProfit = revenueCost - totalCosts;

        // Calculate profitability (as a percentage)
        const profitability = totalCosts > 0 ? (totalProfit / totalCosts) * 100 : 0;

        // Cost breakdown for the pie chart
        const costBreakdown = [
            { name: '総賃金', label: '総賃金', value: labourCost },
            { name: '総交通費', label: '総交通費', value: transportCost },
            { name: '総衣装費', label: '総衣装費', value: costumeCost },
            { name: '管理費', label: '管理費', value: managerFee },
            { name: '他経費', label: '他経費', value: otherCosts }
        ].filter(item => item.value > 0);

        return {
            revenue: {
                revenueCost,
                otherCost: costs.other_cost || 0
            },
            expenditures: {
                labourCost,
                transportCost,
                costumeCost,
                managerFee,
                otherCost: otherCosts
            },
            profit: {
                total: totalProfit,
                profitability: Math.round(profitability * 100) / 100,
                salesProfit: totalProfit  // Set sales profit to be the same as total profit
            },
            costBreakdown
        };
    }, [currentProject, payments]);

    return {
        ...plData,
        refreshProjectData
    };
};




