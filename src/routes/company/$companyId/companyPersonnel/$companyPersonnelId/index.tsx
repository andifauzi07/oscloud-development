import { createFileRoute } from '@tanstack/react-router';
import { Link, useParams } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import MenuList from '@/components/menuList';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { leadsColumns } from '@/components/companyPersonnelLeadsListDataTable';
import AdvancedFilterPopover from '@/components/search/advanced-search';
import { KanbanColumnTypes, Lead } from '@/components/kanban/types';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { EditedPersonnel, PersonnelLead, PersonnelProject, UpdatePersonnelRequest } from '@/types/personnel';
import { usePersonnel } from '@/hooks/usePersonnel';
import { useCompanies, useLeads } from '@/hooks/useCompany';
import { useProject } from '@/hooks/useProject';
import { toast } from 'sonner';
import { useUserData } from '@/hooks/useUserData';
import { projectColumns } from '@/config/columnSettings';
import ScheduleTable from '@/components/EmployeTimeLine';
import { InfoSection, TitleWrapper } from '@/components/wrapperElement';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface ProjectTableData {
	id: number;
	name: string;
	status: string;
	startDate: string;
	endDate: string;
	leadName: string;
	contractValue: number;
}

const projectTableColumns: ColumnDef<ProjectTableData>[] = [
	{
		accessorKey: 'id',
		header: () => <h1 className="pl-8">ID</h1>,
		cell: ({ row }) => <h1 className="pl-8">{row.original.id}</h1>,
	},
	{
		accessorKey: 'name',
		header: 'Project Name',
		cell: ({ row }) => <div className="font-medium">{row.original.name || `Project ${row.original.id}`}</div>,
	},
	{
		accessorKey: 'leadName',
		header: 'Lead',
		cell: ({ row }) => <div>{row.original.leadName || 'N/A'}</div>,
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
	{
		accessorKey: 'contractValue',
		header: 'Contract Value',
		cell: ({ row }) => (
			<div className="font-medium">
				{row.original.contractValue?.toLocaleString('en-US', {
					style: 'currency',
					currency: 'USD',
				})}
			</div>
		),
	},
	{
		accessorKey: 'startDate',
		header: 'Start Date',
		cell: ({ row }) => <div>{row.original.startDate ? format(new Date(row.original.startDate), 'MMM dd, yyyy') : 'N/A'}</div>,
	},
	{
		accessorKey: 'endDate',
		header: 'End Date',
		cell: ({ row }) => <div>{row.original.endDate ? format(new Date(row.original.endDate), 'MMM dd, yyyy') : 'N/A'}</div>,
	},
	{
		id: 'actions',
		cell: ({ row }) => (
			<Link
				to={`/projects/$projectId`}
				params={{
					projectId: row.original.id.toString(),
				}}>
				<Button
					variant="outline"
					className="w-20 h-full border">
					DETAIL
				</Button>
			</Link>
		),
	},
];

const field = [
	{
		key: 'status',
		label: 'Status',
		type: 'toogle',

		options: ['All', 'Active', 'Inactive'],
	},
	{
		key: 'employeeid',
		label: 'Employee Id',
		type: 'number',
	},
	{
		key: 'email',
		label: 'Email',
		type: 'email',
	},
	{
		key: 'name',
		label: 'Name',
		type: 'text',
	},
	{
		key: 'depertment',
		label: 'Department',
		type: 'text',
	},
];

export const Route = createFileRoute('/company/$companyId/companyPersonnel/$companyPersonnelId/')({
	component: CompanyPersonnelDetailsPage,
});

function CompanyPersonnelDetailsPage() {
	const { companyId, companyPersonnelId } = useParams({ strict: false });
	const { currentUser } = useUserData();
	const workspaceid = currentUser?.workspaceid;

	const { personnel, loading, error, updatePersonnel, fetchPersonnel } = usePersonnel(Number(companyPersonnelId));

	const { company } = useCompanies(Number(companyId));
	const [isEditing, setIsEditing] = useState(false);
	const [editedPersonnel, setEditedPersonnel] = useState<EditedPersonnel>({});
	const [personnelLeads, setPersonnelLeads] = useState<Lead[]>([]);
	const { updateLead } = useLeads();
	const [isUpdating, setIsUpdating] = useState(false);

	useEffect(() => {
		if (personnel?.leads) {
			const transformedLeads = personnel.leads.map((lead) => ({
				id: lead.leadId.toString(),
				companyId: lead.companyId, // Add this line to preserve the company ID
				company: lead.company?.name || company?.name || '', // Try to get company name from lead first, then fall back to current company
				personnel: personnel?.name || '',
				title: lead.name || `Lead ${lead.leadId}`,
				addedOn: lead.createdAt || new Date().toISOString(),
				manager: personnel?.manager?.email || 'Unassigned',
				contractValue: `${lead.contractValue?.toLocaleString() || 0} USD`,
				status: lead.status.charAt(0).toUpperCase() + lead.status.slice(1).toLowerCase(),
			}));
			setPersonnelLeads(transformedLeads);
		}
	}, [personnel, company]);

	const kanbanColumns: KanbanColumnTypes[] = [
		{
			id: 'Active',
			title: 'Active',
			color: 'bg-blue-500',
			leads: personnelLeads.filter((lead) => lead.status === 'Active') || [],
		},
		{
			id: 'Pending',
			title: 'Pending',
			color: 'bg-yellow-500',
			leads: personnelLeads.filter((lead) => lead.status === 'Pending') || [],
		},
		{
			id: 'Completed',
			title: 'Completed',
			color: 'bg-green-500',
			leads: personnelLeads.filter((lead) => lead.status === 'Completed') || [],
		},
	];

	const handleColumnUpdate = async (updatedColumns: KanbanColumnTypes[]) => {
		setIsUpdating(true);
		try {
			if (!updatedColumns) return;

			const allLeads = updatedColumns.reduce<Lead[]>((acc, column) => {
				const leadsWithUpdatedStatus = column.leads.map((lead) => ({
					...lead,
					status: column.title,
				}));
				return [...acc, ...leadsWithUpdatedStatus];
			}, []);

			// Update local state
			setPersonnelLeads(allLeads);

			// Create an array of promises for all updates
			const updatePromises = allLeads.map((lead) => {
				const updateData = {
					status: lead.status,
					name: lead.title,
					contract_value: parseFloat(lead.contractValue.replace(/[^0-9.-]+/g, '')),
					company_id: lead.companyId, // Add this line
				};

				console.log('Updating lead:', {
					leadId: lead.id,
					...updateData,
				});

				return updateLead(parseInt(lead.id), updateData);
			});

			// Wait for all updates to complete
			await Promise.all(updatePromises);

			// Refresh the data
			await fetchPersonnel();
			toast.success('Leads updated successfully');
		} catch (error) {
			console.error('Update failed:', error);
			toast.error('Failed to update leads');
		} finally {
			setIsUpdating(false);
		}
	};
	const handleValueChange = (key: string, value: string) => {
		setEditedPersonnel((prev: any) => ({
			...prev,
			[key]: value,
		}));
	};

	const handleProfileSave = async () => {
		try {
			if (!Object.keys(editedPersonnel).length) {
				toast.error('No changes to save');
				return;
			}

			const updateData: UpdatePersonnelRequest = {
				workspaceid: Number(workspaceid),
				personnelid: Number(companyPersonnelId),
			};

			// Only include changed fields
			Object.entries(editedPersonnel).forEach(([key, value]) => {
				if (value !== personnel?.[key as keyof typeof personnel]) {
					updateData[key as keyof UpdatePersonnelRequest] = value;
				}
			});

			if (Object.keys(updateData).length === 2) {
				// Only has workspaceid and personnelid
				toast.error('No changes detected');
				return;
			}

			await updatePersonnel(updateData);
			await fetchPersonnel(); // Refresh the data after update

			setIsEditing(false);
			setEditedPersonnel({});
			toast.success('Personnel updated successfully');
		} catch (error: any) {
			console.error('Error updating personnel:', error);
			toast.error(error?.message || 'Failed to update personnel');
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
		setEditedPersonnel({});
	};

	const basicInfo = [
		{
			label: 'Name',
			value: editedPersonnel.name || personnel?.name || '-',
			key: 'name',
		},
		{
			label: 'Email',
			value: editedPersonnel.email || personnel?.email || '-',
			key: 'email',
		},
		{
			label: 'Status',
			value: editedPersonnel.status || personnel?.status || '-',
			key: 'status',
			type: 'select',
			options: [
				{ label: 'Active', value: 'Active' },
				{ label: 'Inactive', value: 'Inactive' },
			],
		},
		{
			label: 'Description',
			value: editedPersonnel.description || personnel?.description || '-',
			key: 'description',
			type: 'textarea',
		},
	];

	const managerInfo = [
		{
			label: 'Manager',
			value: personnel?.manager?.email || '-',
			key: 'manager',
			nonEditable: true,
		},
		{
			label: 'Company',
			value: personnel?.company?.name || '-',
			key: 'company',
			nonEditable: true,
		},
	];

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!personnel) return <div>No personnel found</div>;

	const getProjectsData = (): ProjectTableData[] => {
		if (!personnel?.leads) return [];

		return personnel.leads.reduce<ProjectTableData[]>((acc, lead) => {
			if (lead.projects && Array.isArray(lead.projects)) {
				const projectsData = lead.projects.map((project) => ({
					id: project.projectId,
					name: project.name,
					status: project.status,
					startDate: project.startDate,
					endDate: project.endDate,
					leadName: lead.name || `Lead ${lead.leadId}`,
					contractValue: lead.contractValue,
				}));
				return [...acc, ...projectsData];
			}
			return acc;
		}, []);
	};

	return (
		<div className="flex-1 h-full">
			{/* Menus */}
			<div className="flex-none">
				<div className="flex items-center justify-between pl-4 border-b border-r">
					<MenuList
						items={[
							{ label: 'Profile', path: `/company/${companyId}` },
							{
								label: 'Personnel',
								path: `/company/${companyId}/companyPersonnel`,
							},
						]}
					/>
					<div className="pr-4">
						<Link
							to="/company/setting"
							className="text-xs">
							Setting
						</Link>
					</div>
				</div>
			</div>

			{/* Personnel Name */}

			{/* Edit Button */}
			<TitleWrapper>
				<h2>{personnel?.name}</h2>
			</TitleWrapper>

			<div className="border-b">
				<div className="flex justify-end flex-none w-full bg-white">
					{isEditing ? (
						<>
							<Button
								onClick={handleProfileSave}
								className="w-20 h-10 text-black bg-transparent border-l border-r link">
								SAVE
							</Button>
							<Button
								onClick={handleCancel}
								className="w-20 h-10 text-black bg-transparent border-r link">
								CANCEL
							</Button>
						</>
					) : (
						<Button
							onClick={() => setIsEditing(true)}
							className="w-20 h-10 text-black bg-transparent border-l border-r link">
							EDIT
						</Button>
					)}
				</div>
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
					value="profile"
					className="m-0 overflow-x-hidden">
					<div className="flex flex-col text-xs border-t">
						<InfoSection
							items={basicInfo}
							title="Basic Information"
							isEditing={isEditing}
							onValueChange={handleValueChange}
						/>
						<InfoSection
							items={managerInfo}
							title="Management Information"
							isEditing={false}
						/>
					</div>
				</TabsContent>

				{/* Leads Tab */}
				<TabsContent
					value="leads"
					className="m-0 overflow-x-hidden">
					<div>
						<div className="flex flex-col gap-4 px-8 pt-4 border-t border-b border-r md:flex-row md:gap-16">
							{/* Search and Filter Controls */}
							<div className="flex flex-col w-full space-y-2 md:w-auto">
								<Label htmlFor="keyword">Keyword</Label>
								<Input
									type="keyword"
									id="keyword"
									placeholder="Search leads..."
									className="border rounded-none w-[400px]"
								/>
							</div>
							<div className="flex flex-col space-y-2">
								<Label>Status</Label>
								<div className="flex">
									<Button className="w-full bg-black rounded-none md:w-20">Active</Button>
									<Button
										variant="outline"
										className="w-full rounded-none md:w-20">
										All
									</Button>
								</div>
							</div>
							<div className="flex flex-col space-y-2 md:p-5 md:m-0">
								<AdvancedFilterPopover fields={field} />
							</div>
						</div>

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

							<TabsContent
								value="kanban"
								className="pl-4 m-0 border-t border-r">
								{isUpdating && (
									<div className="absolute inset-0 z-50 flex items-center justify-center bg-black/10">
										<div className="flex items-center gap-2 p-4 bg-white rounded-md shadow-lg">
											<div className="w-6 h-6 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin" />
											<span>Updating leads...</span>
										</div>
									</div>
								)}
								<KanbanBoard
									columns={kanbanColumns}
									onColumnUpdate={handleColumnUpdate}
									disabled={isUpdating}
								/>
							</TabsContent>

							<TabsContent
								value="list"
								className="m-0">
								<DataTable
									columns={leadsColumns}
									data={personnelLeads.map((lead) => ({
										...lead,
										companyName: company?.name,
										personnelName: personnel?.name,
										manager: personnel?.manager || company?.managers?.[0]?.name,
									}))}
									loading={loading}
								/>
							</TabsContent>
						</Tabs>
					</div>
				</TabsContent>

				{/* Projects Tab */}
				<TabsContent
					value="projects"
					className="m-0 overflow-x-hidden">
					<div>
						<div className="flex flex-col gap-4 px-8 pt-4 border-t border-b border-r md:flex-row md:gap-16">
							{/* Search and Filter Controls */}
							<div className="flex flex-col w-full space-y-2 md:w-auto">
								<Label htmlFor="keyword">Keyword</Label>
								<Input
									type="keyword"
									id="keyword"
									placeholder="Search leads..."
									className="border rounded-none w-[400px]"
								/>
							</div>
							<div className="flex flex-col space-y-2">
								<Label>Status</Label>
								<div className="flex">
									<Button className="w-full bg-black rounded-none md:w-20">Active</Button>
									<Button
										variant="outline"
										className="w-full rounded-none md:w-20">
										All
									</Button>
								</div>
							</div>
							<div className="flex flex-col space-y-2 md:p-5 md:m-0">
								<AdvancedFilterPopover fields={field} />
							</div>
						</div>

						<Tabs defaultValue="list">
							<TabsList className="justify-start w-full gap-8 bg-white border-t border-r [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 pl-5">
								<TabsTrigger
									className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
									value="list">
									List View
								</TabsTrigger>
								<TabsTrigger
									className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
									value="timeline">
									Timeline
								</TabsTrigger>
							</TabsList>
							<TabsContent
								value="list"
								className="m-0">
								<DataTable
									columns={projectTableColumns}
									data={getProjectsData()}
									loading={loading}
								/>
							</TabsContent>

							<TabsContent
								value="timeline"
								className="m-0">
								<ScheduleTable
									projects={getProjectsData()}
									// onCreateProject={handleCreateProject}
								/>
							</TabsContent>
						</Tabs>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
