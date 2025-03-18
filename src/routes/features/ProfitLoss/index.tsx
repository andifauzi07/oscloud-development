import { createFileRoute, Link } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { ColumnDef, useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { useProjects } from '@/hooks/useProject';
import { usePayments } from '@/hooks/usePayroll';
import { formatCurrency } from '@/lib/utils';
import { useColumnSettings } from '@/hooks/useColumnSettings';
import { defaultProfitLossColumnSettings } from '@/config/columnSettings';
import type { ProjectPLData } from '@/types/profitLoss';

export const Route = createFileRoute('/features/ProfitLoss/')({
	component: RouteComponent,
});

function RouteComponent() {
	const [searchKeyword, setSearchKeyword] = useState('');
	const { projects, loading: projectsLoading } = useProjects();
	const { payments } = usePayments();
	const [plData, setPLData] = useState<ProjectPLData[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const { settings } = useColumnSettings<ProjectPLData>({
		storageKey: 'ProfitLossColumnSettings',
		defaultSettings: defaultProfitLossColumnSettings,
	});

	useEffect(() => {
		if (!projects) return;

		const processedData: ProjectPLData[] = projects.map((project) => {
			// Calculate total costs
			const costs = project.costs || {};
			const totalCosts = (
				(costs.labour_cost || 0) +
				(costs.transport_cost || 0) +
				(costs.costume_cost || 0) +
				(costs.manager_fee || 0) +
				(costs.other_cost || 0)
			);

			// Calculate revenue and profit
			const revenue = costs.revenue || 0;
			const profit = revenue - totalCosts;

			// Calculate profitability
			const profitability = totalCosts > 0 ? (profit / totalCosts) * 100 : 0;

			return {
				id: project.projectId,
				projectName: project.name || 'N/A',
				manager: project.manager?.name || 'N/A',
				startDate: project.startDate || 'N/A',
				endDate: project.endDate || 'N/A',
				clientName: project.company?.name || 'N/A',
				category: project.category?.name || 'N/A',
				requiredStaffNumber: project.requiredStaffNumber || 0,
				revenue: revenue,
				costs: totalCosts,
				profit: profit,
				profitability: profitability
			};
		});

		setPLData(processedData);
		setIsLoading(false);
	}, [projects]);

	const columns = React.useMemo<ColumnDef<ProjectPLData, any>[]>(() => {
		return settings
			.filter((setting) => setting.status === 'Active')
			.sort((a, b) => a.order - b.order)
			.map((setting) => {
				const defaultSetting = defaultProfitLossColumnSettings.find(
					(def) => def.accessorKey === setting.accessorKey
				);

				return {
					id: String(setting.accessorKey),
					accessorKey: setting.accessorKey as string,
					header: defaultSetting?.header || setting.header,
					cell: defaultSetting?.cell || setting.cell,
				};
			});
	}, [settings]);

	const filteredData = React.useMemo(() => {
		return plData.filter((item) => {
			const searchLower = searchKeyword.toLowerCase();
			if (!searchKeyword) return true;

			return (
				item.projectName.toLowerCase().includes(searchLower) ||
				item.manager.toLowerCase().includes(searchLower) ||
				item.clientName.toLowerCase().includes(searchLower) ||
				item.category.toLowerCase().includes(searchLower)
			);
		});
	}, [plData, searchKeyword]);

	const table = useReactTable({
		data: filteredData,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	if (isLoading || projectsLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex flex-col flex-1 h-full">
			<div className="px-8 py-4">
				<h1 className="text-gray-500">Project List</h1>
			</div>
			<Tabs defaultValue="list">
				<TabsList className="justify-start w-full gap-8 bg-white border-t border-r border-b [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 pl-5">
					<TabsTrigger
						value="list"
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none">
						List View
					</TabsTrigger>
			
				</TabsList>

				<div className="flex justify-end flex-none w-full bg-white">
					<Button className="h-10 text-black bg-transparent border-l md:w-20 link">ADD+</Button>
					<Button className="h-10 text-black bg-transparent border-l border-r md:w-20 link">EDIT</Button>
				</div>

				<TabsContent value="list" className="m-0">
					<div className="border">
						<DataTable columns={columns} data={filteredData} />
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
