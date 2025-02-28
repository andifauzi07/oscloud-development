import { createFileRoute } from '@tanstack/react-router';
import { Link, useParams } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { mockEmployees } from '@/config/mockData/employees';
import { mockCompanies } from '@/config/mockData/companies';
import MenuList from '@/components/menuList';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { DndContext, DragEndEvent, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanBoard, KanbanCard, KanbanColumn } from '@/components/Kanban';
import { DataTable } from '@/components/ui/data-table';
import { leadsColumns } from '@/components/companyPersonnelLeadsListDataTable';
import { projectsColumns } from '@/components/companyPersonnelProjectsDataTable';
import { ProjectsTimeline } from '@/components/ProjectsTimeline';
import ScheduleTable from '@/components/EmployeTimeLine';
import AdvancedFilterPopover from '@/components/search/advanced-search';

export const Route = createFileRoute('/company/$companyId/companyPersonnel/$companyPersonnelId/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { companyId, companyPersonnelId } = useParams({ strict: false });

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

	// Kanban Board State
	const [boards, setBoards] = useState([
		{
			id: 'active',
			title: 'Active',
			color: 'bg-blue-500',
			leads: personnel?.leads.filter((lead) => lead.status === 'active') || [],
		},
		{
			id: 'completed',
			title: 'Completed',
			color: 'bg-green-500',
			leads: personnel?.leads.filter((lead) => lead.status === 'completed') || [],
		},
		{
			id: 'pending',
			title: 'Pending',
			color: 'bg-yellow-500',
			leads: personnel?.leads.filter((lead) => lead.status === 'pending') || [],
		},
	]);

	const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over) return; // Exit if no target

		if (active.id !== over.id) {
			setBoards((currentBoards) => {
				// Find the source and target boards
				const activeBoard = currentBoards.find((board) => board.leads?.some((lead) => lead.id === active.id));
				const overBoard = currentBoards.find((board) => board.leads?.some((lead) => lead.id === over.id));

				// If either board is not found, return current state
				if (!activeBoard || !overBoard) return currentBoards;

				// Create new array of boards
				return currentBoards.map((board) => {
					// Remove from source board
					if (board.id === activeBoard.id) {
						return {
							...board,
							leads: board.leads.filter((lead) => lead.id !== active.id),
						};
					}
					// Add to target board
					if (board.id === overBoard.id) {
						const draggedLead = activeBoard.leads.find((lead) => lead.id === active.id);
						if (!draggedLead) return board;

						return {
							...board,
							leads: [...board.leads, draggedLead],
						};
					}
					return board;
				});
			});
		}
	};

	return (
		<div className="flex-1 h-full">
			{/* Menus */}
			<div className="flex-none">
				<div className="flex items-center justify-between border-r">
					<MenuList
						items={tabs.map((tab) => ({
							label: tab.label,
							path: tab.path,
						}))}
					/>
					<div className="pr-4">
						<Link
							to={`/company/setting`}
							className="">
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
				<Button className="w-1/2 text-black border-r border-l bg-transparent md:w-20 h-10">EDIT</Button>
			</div>

			{/* Tabs Section */}
			<Tabs
				defaultValue="profile"
				className="w-full bg-white border-t [&>*]:p-0 [&>*]:m-0 rounded-none [&>*]:rounded-none">
				<div className="px-8">
					<TabsList className=" justify-start w-full gap-8 bg-gray-100 [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 px-8">
						<TabsTrigger
							className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2"
							value="profile">
							Profile
						</TabsTrigger>
						<TabsTrigger
							className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2"
							value="leads">
							Leads
						</TabsTrigger>
						<TabsTrigger
							className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2"
							value="projects">
							Projects
						</TabsTrigger>
					</TabsList>
				</div>

				{/* Profile Tab */}
				<TabsContent
					className="overflow-x-hidden m-0"
					value="profile">
					<div className="flex text-xs flex-col">
						<div className="w-full justify-start border-t px-6 flex">
							<div className="flex justify-start w-1/8 gap-14 p-4">
								<h1>Name</h1>
							</div>
							<div className="flex justify-start w-1/8 gap-14 p-4">
								<h1>COMPANY A</h1>
							</div>
						</div>
						<div className="w-full justify-start border-t px-6 flex">
							<div className="flex justify-start w-1/8 gap-14 p-4">
								<h1>Email</h1>
							</div>
							<div className="flex justify-start w-1/8 gap-14 p-4">
								<h1>Johnson.white@companya.com</h1>
							</div>
						</div>
						<div className="w-full justify-start border-t px-6 flex">
							<div className="flex justify-start w-1/8 gap-14 p-4">
								<h1>Manager</h1>
							</div>
							<div className="flex justify-start w-1/8 gap-14 p-4">
								<h1>John Brown</h1>
							</div>
						</div>
						<div className="w-full justify-start border-t border-b h-24 px-6 flex">
							<p className="px-4 py-4">Description</p>
						</div>
					</div>
				</TabsContent>

				{/* Leads Tab */}
				<TabsContent
					className="m-0 overflow-x-hidden"
					value="leads">
					<div>
						<div className="flex flex-col gap-4 border-t pt-4 border-b md:flex-row px-8 md:gap-16">
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
								<TabsList className="justify-start w-full gap-8 bg-white [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 px-8">
									<TabsTrigger
										className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2"
										value="kanban">
										Kanban
									</TabsTrigger>
									<TabsTrigger
										className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2"
										value="list">
										List
									</TabsTrigger>
								</TabsList>
								<TabsContent value="kanban">
									<DndContext
										sensors={sensors}
										collisionDetection={closestCenter}
										onDragEnd={handleDragEnd}>
										<KanbanBoard>
											{boards.map((board) => (
												<KanbanColumn
													key={board.id}
													id={board.id}
													title={board.title}
													color={board.color}>
													<SortableContext
														items={board.leads}
														strategy={verticalListSortingStrategy}>
														{board.leads.map((lead) => (
															<KanbanCard
																key={lead.id}
																id={lead.id}
																companyName={company?.name || 'Unknown'}
																personnelName={personnel?.name || 'Unknown'}
																projectName={lead.projectName}
																startDate={lead.startDate}
																manager={personnel?.companyRole || 'Unknown'}
																contractValue={lead.value}
															/>
														))}
													</SortableContext>
												</KanbanColumn>
											))}
										</KanbanBoard>
									</DndContext>
								</TabsContent>
								<TabsContent value="list">
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
						<div className="flex flex-col gap-4 px-4 border-t border-r pt-4 md:flex-row md:px-8 md:gap-16">
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
									<DataTable
										columns={projectsColumns}
										data={company?.projects || []}
										loading={false}
									/>
								</TabsContent>
								<TabsContent
									value="timeline"
									className="m-0">
									<ScheduleTable />
								</TabsContent>
							</Tabs>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
