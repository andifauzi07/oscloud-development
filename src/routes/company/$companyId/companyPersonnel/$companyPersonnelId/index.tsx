import { createFileRoute } from '@tanstack/react-router';
import { Link, useParams } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { mockEmployees } from '@/config/mockData/employees';
import { mockCompanies } from '@/config/mockData/companies';
import MenuList from '@/components/menuList';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { leadsColumns } from '@/components/companyPersonnelLeadsListDataTable';
import ScheduleTable from '@/components/EmployeTimeLine';
import AdvancedFilterPopover from '@/components/search/advanced-search';
import { KanbanColumnTypes, Lead } from '@/components/kanban/types';
import { KanbanBoard } from '@/components/kanban/kanban-board';

export const Route = createFileRoute('/company/$companyId/companyPersonnel/$companyPersonnelId/')({
	component: RouteComponent,
});

const sampleData: Lead[] = [
	{
		id: '1',
		company: 'COMPANY A',
		personnel: 'Personnel A',
		title: 'Web dev for their corp site',
		addedOn: '2024.12.11',
		manager: 'John Brown',
		contractValue: '300,000 USD',
		status: 'active',
	},
	{
		id: '2',
		company: 'COMPANY B',
		personnel: 'Personnel B',
		title: 'Mobile app development',
		addedOn: '2024.11.15',
		manager: 'Jane Smith',
		contractValue: '450,000 USD',
		status: 'completed',
	},
	{
		id: '3',
		company: 'COMPANY C',
		personnel: 'Personnel C',
		title: 'E-commerce platform',
		addedOn: '2024.12.01',
		manager: 'Robert Johnson',
		contractValue: '275,000 USD',
		status: 'pending',
	},
	{
		id: '4',
		company: 'COMPANY D',
		personnel: 'Personnel D',
		title: 'CRM integration',
		addedOn: '2024.12.10',
		manager: 'Sarah Williams',
		contractValue: '180,000 USD',
		status: 'active',
	},
];

function RouteComponent() {
	const { companyId, companyPersonnelId } = useParams({ strict: false });

	//mockData, you can replace it the value of leads to be function that calls the data
	const [personnels, setPersonnel] = useState({
		leads: sampleData, //you can drop here the variable that return the data that you want to show in this pages,
	});

	// Create columns based on the data structure provided
	const kanbanColumns: KanbanColumnTypes[] = [
		{
			id: 'active',
			title: 'Active',
			color: 'bg-blue-500',
			leads: personnels?.leads.filter((lead) => lead.status === 'active') || [],
		},
		{
			id: 'pending',
			title: 'Pending',
			color: 'bg-green-500',
			leads: personnels?.leads.filter((lead) => lead.status === 'completed') || [],
		},
		{
			id: 'completed',
			title: 'Completed',
			color: 'bg-yellow-500',
			leads: personnels?.leads.filter((lead) => lead.status === 'pending') || [],
		},
	];

	// Handle column updates
	const handleColumnUpdate = (updatedColumns: KanbanColumnTypes[]) => {
		// Extract all leads from all columns
		const allLeads = updatedColumns.flatMap((column) => column.leads);

		// Compare if leads have actually changed to prevent unnecessary updates
		const currentLeadIds = personnels.leads
			.map((lead) => lead.id)
			.sort()
			.join(',');
		const newLeadIds = allLeads
			.map((lead) => lead.id)
			.sort()
			.join(',');

		// Only update if the leads have actually changed
		if (currentLeadIds !== newLeadIds || JSON.stringify(personnels.leads) !== JSON.stringify(allLeads)) {
			setPersonnel({
				...personnel,
				leads: allLeads,
			});
		}
	};

	if (!companyPersonnelId) {
		console.error('Company Personnel ID is missing');
		return <div>Error: Company Personnel ID is required</div>;
	}

	const personnel = mockEmployees.find((emp) => emp.id === parseInt(companyPersonnelId));
	const company = personnel ? mockCompanies.find((comp) => comp.id === personnel.companyId) : null;

	const tabs = [
		{ label: 'Profile', path: `/company/${companyId}` },
		{
			label: 'Personnel',
			path: `/company/${companyId}/companyPersonnel`,
		},
	];

	const [advancedSearchFilter, setAdvancedSearchFilter] = useState('');
	const handleAdvSearchSelect = (filter: string) => {
		setAdvancedSearchFilter(filter);
	};

	return (
		<div className="flex-1 h-full">
			{/* Menus */}
			<div className="flex-none">
				<div className="flex items-center justify-between pl-4 border-r">
					<MenuList
						items={tabs.map((tab) => ({
							label: tab.label,
							path: tab.path,
						}))}
					/>
					<div className="pr-4">
						<Link
							to={`/company/setting`}
							className="text-xs">
							Setting
						</Link>
					</div>
				</div>
			</div>

			{/* Personnel Name */}
			<div className="flex items-center justify-start bg-white border border-l-0 px-9 min-h-14">
				<h2 className="text-base font-semibold">{personnel?.name || 'Unknown'}</h2>
			</div>

			{/* Edit Button */}
			<div className="flex justify-end flex-none w-full bg-white">
				<Button className="w-1/2 h-10 text-black bg-transparent border-l border-r md:w-20">EDIT</Button>
			</div>

			{/* Tabs Section */}
			<Tabs
				defaultValue="profile"
				className="w-full bg-white border-t [&>*]:p-0 [&>*]:m-0 rounded-none [&>*]:rounded-none">
				<div className="px-8">
					<TabsList className=" justify-start border-r w-full gap-8 bg-gray-100 [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 pl-5">
						<TabsTrigger
							className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
							value="profile">
							Profile
						</TabsTrigger>
						<TabsTrigger
							className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
							value="leads">
							Leads
						</TabsTrigger>
						<TabsTrigger
							className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
							value="projects">
							Projects
						</TabsTrigger>
					</TabsList>
				</div>

				{/* Profile Tab */}
				<TabsContent
					className="m-0 overflow-x-hidden"
					value="profile">
					<div className="flex flex-col text-xs">
						<div className="flex justify-start w-full pl-4 border-t">
							<div className="flex justify-start p-4 w-1/8 gap-14">
								<h1>Name</h1>
							</div>
							<div className="flex justify-start p-4 w-1/8 gap-14">
								<h1>COMPANY A</h1>
							</div>
						</div>
						<div className="flex justify-start w-full pl-4 border-t">
							<div className="flex justify-start p-4 w-1/8 gap-14">
								<h1>Email</h1>
							</div>
							<div className="flex justify-start p-4 w-1/8 gap-14">
								<h1>Johnson.white@companya.com</h1>
							</div>
						</div>
						<div className="flex justify-start w-full pl-4 border-t">
							<div className="flex justify-start p-4 w-1/8 gap-14">
								<h1>Manager</h1>
							</div>
							<div className="flex justify-start p-4 w-1/8 gap-14">
								<h1>John Brown</h1>
							</div>
						</div>
						<div className="flex justify-start w-full h-24 pl-4 border-t border-b">
							<p className="px-4 py-4">Description</p>
						</div>
					</div>
				</TabsContent>

				{/* Leads Tab */}
				<TabsContent
					className="m-0 overflow-x-hidden"
					value="leads">
					<div>
						<div className="flex flex-col gap-4 px-8 pt-4 border-t border-r border-b md:flex-row md:gap-16">
							<div className="flex flex-col w-full space-y-2 md:w-auto">
								<Label htmlFor="keyword">Keyword</Label>
								<Input
									type="keyword"
									id="keyword"
									placeholder=""
									className=" border rounded-none w-[400px]"
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

							<div className="flex flex-col space-y-2 md:p-5 md:m-0">
								<AdvancedFilterPopover />
							</div>
						</div>
						<div>
							<Tabs defaultValue="kanban">
								<TabsList className="justify-start w-full border-r gap-8 bg-white [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 pl-5">
									<TabsTrigger
										className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
										value="kanban">
										Kanban
									</TabsTrigger>
									<TabsTrigger
										className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
										value="list">
										List
									</TabsTrigger>
								</TabsList>

								{/* Tab Kanban */}
								<TabsContent
									value="kanban"
									className="border-r border-t m-0 pl-4">
									<KanbanBoard
										columns={kanbanColumns}
										onColumnUpdate={handleColumnUpdate}
									/>
								</TabsContent>

								{/* Tab list */}
								<TabsContent
									value="list"
									className="m-0">
									<DataTable
										columns={leadsColumns}
										data={
											personnel?.leads.map((lead) => ({
												...lead,
												companyName: company?.name || 'Unknown',
												personnelName: personnel?.name || 'Unknown',
												manager: company?.managers.map((m) => m.name).join(', ') || 'Unknown',
											})) || []
										}
										loading={false}
										isEditable={false}
										nonEditableColumns={['']}
									/>
								</TabsContent>
							</Tabs>
						</div>
					</div>
				</TabsContent>

				{/* Projects Tab */}
				<TabsContent
					className="m-0 overflow-x-hidden"
					value="projects">
					<div>
						<div className="flex flex-col gap-4 px-4 pt-4 border-t border-r md:flex-row md:px-8 md:gap-16">
							<div className="flex flex-col w-full space-y-2 md:w-auto">
								<Label htmlFor="keyword">Keyword</Label>
								<Input
									type="keyword"
									id="keyword"
									placeholder=""
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

							<div className="flex flex-col space-y-2 md:p-5 md:m-0">
								<AdvancedFilterPopover />
							</div>
						</div>
						<div>
							<Tabs defaultValue="list">
								<TabsList className="justify-start w-full gap-8 bg-white border-t border-r [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 px-8">
									<TabsTrigger
										className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2"
										value="list">
										List View
									</TabsTrigger>
									<TabsTrigger
										className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2"
										value="timeline">
										Timeline
									</TabsTrigger>
								</TabsList>
								<TabsContent
									value="list"
									className="m-0">
									{/* <DataTable
										columns={projectsColumns}
										data={company?.projects || []}
										loading={false}
									/> */}
								</TabsContent>
								<TabsContent
									value="timeline"
									className="m-0">
									{/* <ScheduleTable /> */}
								</TabsContent>
							</Tabs>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
