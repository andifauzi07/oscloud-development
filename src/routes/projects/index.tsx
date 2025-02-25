import { createFileRoute } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { mockCompanies } from '@/config/mockData/companies';
import { DataTable } from '@/components/ui/data-table';
import { projectsColumns } from '@/components/companyPersonnelProjectsDataTable';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Link } from '@tanstack/react-router';
import AdvancedFilterPopover from '@/components/search/advanced-search';
import ScheduleTable from '@/components/EmployeTimeLine';
import { TitleWrapper } from '@/components/wrapperElement';
import { useCallback, useState } from 'react';
import { AddRecordDialog } from '@/components/AddRecordDialog';

export const Route = createFileRoute('/projects/')({
	component: RouteComponent,
});

function RouteComponent() {
	const [editable, setEditable] = useState(false);

	// Fetch all projects from all companies
	const allProjects = mockCompanies.flatMap((company) => company.projects);
	const validProjects = allProjects.filter((project) => project && project.id);

	const handleAddRecord = async (data: any) => {
		try {
			// Add your API call here to save the new record
			console.log('Adding new record:', data);
		} catch (error) {
			console.error('Failed to add record:', error);
		}
	};

	const handleSaveEdits = useCallback(async (updatedData: any[]) => {
		try {
			console.log('Saving updates:', updatedData);
			// Add your API call here
			setEditable(false); // Turn off edit mode after saving
		} catch (error) {
			console.error('Failed to save updates:', error);
		}
	}, []);

	return (
		<div className="">
			{/* Header Section */}
			<TitleWrapper>
				<h2 className="text-base">Project List</h2>
				<Link to="/projects/setting">Settings</Link>
			</TitleWrapper>

			{/* Tabs Section */}
			<Tabs defaultValue="list">
				<TabsList className="justify-start w-full gap-8 bg-white border-b border-r [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 px-8">
					<TabsTrigger
						value="list"
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2">
						List View
					</TabsTrigger>
					<TabsTrigger
						value="timeline"
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2">
						Timeline
					</TabsTrigger>
				</TabsList>

				<div className="flex justify-end flex-none w-full bg-white">
					<AddRecordDialog
						columns={projectsColumns}
						onSave={handleAddRecord}
						nonEditableColumns={['id*']}
					/>
					<Button
						onClick={() => setEditable((prev) => !prev)}
						className="text-black bg-transparent border-r md:w-20 link border-l-none min-h-10">
						EDIT+
					</Button>
				</div>

				{/* List View Tab */}
				<TabsContent
					className="m-0"
					value="list">
					<div className="flex flex-row flex-wrap items-center justify-between w-full p-8 pt-4 bg-white border-t border-b border-r md:flex-row">
						<div className="flex flex-col space-y-2 bg-white md:w-auto">
							<Label htmlFor="keyword">Keyword</Label>
							<Input
								type="keyword"
								id="keyword"
								placeholder=""
								className="border rounded-none w-[400px]"
							/>
						</div>

						<div className="flex flex-col space-y-2">
							<Label>Duration</Label>
							<div className="flex items-center gap-2">
								<Input
									type="date"
									className="w-[150px] border rounded-none"
									enableEmoji={false}
								/>
								<span className="text-gray-500">-</span>
								<Input
									type="date"
									className="w-[150px] border rounded-none"
									enableEmoji={false}
								/>
							</div>
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

						<div className="flex flex-col space-y-2">
							<Label>‎ </Label>
							<AdvancedFilterPopover />
						</div>
					</div>
					<div className="border-r border-b">
						<DataTable
							columns={projectsColumns}
							data={validProjects}
							loading={false}
							isEditable={editable}
							onSave={handleSaveEdits}
							nonEditableColumns={['id*']}
						/>
					</div>
				</TabsContent>

				{/* Timeline View Tab */}
				<TabsContent
					className="m-0"
					value="timeline">
					<ScheduleTable />
				</TabsContent>
			</Tabs>
		</div>
	);
}
