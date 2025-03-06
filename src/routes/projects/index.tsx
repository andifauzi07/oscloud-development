import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useCallback, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { TitleWrapper } from '@/components/wrapperElement';
import { AddRecordDialog } from '@/components/AddRecordDialog';
import { DataTable } from '@/components/ui/data-table';
import AdvancedFilterPopover from '@/components/search/advanced-search';
import { useProject, useProjects } from '@/hooks/useProject';
import useDebounce from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { useColumnSettings } from '@/hooks/useColumnSettings';
import { Project, ProjectDisplay } from '@/types/company';
import { defaultProjectColumnSettings } from '@/config/columnSettings';
import { CreateProjectRequest, UpdateProjectRequest } from '@/types/project';

export const Route = createFileRoute('/projects/')({
	component: RouteComponent,
});

const defaultCellRenderer = ({ getValue }: any) => {
	const value = getValue();
	if (value === null || value === undefined) {
		return <span className="text-xs whitespace-nowrap">-</span>;
	}
	return <span className="text-xs whitespace-nowrap">{String(value)}</span>;
};

function RouteComponent() {
	const [searchKeyword, setSearchKeyword] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("");
	const debouncedKeyword = useDebounce(searchKeyword, 500);
	const [isEditable, setIsEditable] = useState(false);

	const filters = useMemo(() => ({
		status: statusFilter || undefined,
		search: debouncedKeyword || undefined,
	}), [statusFilter, debouncedKeyword]);

	const { projects, loading } = useProjects(filters);
    const { addProject, editProject } = useProject();
	
	const { settings, saveSettings, reorderColumns } = useColumnSettings({
		storageKey: "projectColumnSettings",
		defaultSettings: defaultProjectColumnSettings,
	});

	const columns = useMemo(() => {
		return settings
			.filter((setting) => setting.status === "shown")
			.sort((a, b) => a.order - b.order)
			.map((setting) => ({
				id: String(setting.accessorKey),
				accessorKey: setting.accessorKey as string,
				header: setting.label,
				cell: setting.cell || defaultCellRenderer,
			}));
	}, [settings]);

	const handleAddRecord = useCallback(async (data: Partial<Project>) => {
		try {
			if (!data.name) {
				throw new Error("Project name is required");
			}

			const newProjectRequest: CreateProjectRequest = {
				name: data.name,
				startdate: data.startdate || '',
				enddate: data.enddate || '',
				status: 'Active',
				managerid: Number(data.managerid) || 1,
				companyid: Number(data.companyid) || 1,
				workspaceid: Number(data.workspaceid),
				costs: {
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
				}
			};

			await addProject(newProjectRequest);
			alert('Project created successfully');
		} catch (error) {
			console.error('Failed to add project:', error);
			alert('Failed to create project');
			throw error;
		}
	}, [addProject]);

	const handleStatusChange = useCallback((newStatus: string) => {
		setStatusFilter(newStatus);
	}, []);

	const handleSave = useCallback(async (updatedData: ProjectDisplay[]) => {
		try {
			await Promise.all(
				updatedData.map(async (project) => {
					if (!project.projectid) return;
					
					const updatePayload: UpdateProjectRequest = {
						name: project.name,
						startdate: project.startdate,
						enddate: project.enddate,
						status: project.status
					};

					await editProject({ projectId: project.projectid, data: updatePayload });
				})
			);
			
			setIsEditable(false);
			alert('Projects updated successfully');
		} catch (error) {
			console.error('Error updating projects:', error);
			alert('Failed to update projects');
		}
	}, [editProject]);

	const editButton = useCallback(() => {
		return (
			<Button
				onClick={() => setIsEditable((prev) => !prev)}
				className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10"
			>
				{isEditable ? 'CANCEL' : 'EDIT+'}
			</Button>
		);
	}, [isEditable]);

	return (
		<div className="flex flex-col flex-1 h-full">
			<TitleWrapper>
				<h1 className="text-base">Projects</h1>
				<Link className="text-xs" to="/projects/setting">
					Settings
				</Link>
			</TitleWrapper>
			<div className="flex flex-row flex-wrap items-center justify-between w-full px-8 py-4 bg-white border-b border-r md:flex-row">
				<div className="flex gap-8">
					<div className="flex flex-col space-y-2 bg-white md:w-auto">
						<Label htmlFor="keyword">Keyword</Label>
						<Input
							type="keyword"
							id="keyword"
							placeholder=""
							className="border rounded-none w-[400px]"
							value={searchKeyword}
							onChange={(e) => setSearchKeyword(e.target.value)}
						/>
					</div>
					<div className="flex flex-col space-y-2">
						<Label>Status</Label>
						<div className="flex">
							<Button
								size="default"
								variant="outline"
								className={cn(
									"w-20 rounded-none",
									statusFilter === "Active" && "bg-black text-white"
								)}
								onClick={() => handleStatusChange("Active")}
							>
								Active
							</Button>
							<Button
								size="default"
								variant="outline"
								className={cn(
									"w-20 rounded-none",
									statusFilter === "" && "bg-black text-white"
								)}
								onClick={() => handleStatusChange("")}
							>
								All
							</Button>
						</div>
					</div>
				</div>

				<div className="flex flex-col items-end space-y-2">
					<Label>‎</Label>
					<div className="flex items-center gap-4">
						<AdvancedFilterPopover />
					</div>
				</div>
			</div>

			<div className="flex justify-end flex-none bg-white">
				<AddRecordDialog
					columns={columns}
					onSave={handleAddRecord}
					nonEditableColumns={[
						"projectid",
						"created_at",
						"updated_at",
						"assignedStaff",
						"connectedPersonnel",
						"costs"
					]}
				/>
				{editButton()}
			</div>
			<div className="flex-1">
				<DataTable
					columns={columns}
					data={projects}
					loading={loading}
					isEditable={isEditable}
					onSave={handleSave}
					nonEditableColumns={[
						"projectid",
						"created_at",
						"updated_at",
						"assignedStaff",
						"connectedPersonnel",
						"costs"
					]}
				/>
			</div>
		</div>
	);
}
