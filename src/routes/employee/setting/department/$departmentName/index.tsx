import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/ui/data-table';
import { TitleWrapper } from '@/components/wrapperElement';
import { AddRecordDialog } from '@/components/AddRecordDialog';
import { revertUrlString } from '@/lib/utils';
import AdvancedFilterPopover from '@/components/search/advanced-search';
import { ColumnDef } from '@tanstack/react-table';

export const Route = createFileRoute('/employee/setting/department/$departmentName/')({
	component: RouteComponent,
});

// Define types for managers and members
type Manager = {
	id: string;
	name: string;
	email: string;
	role: string;
};

type Member = {
	id: string;
	name: string;
	email: string;
	category: string;
	image: string;
};

type DepartmentData = {
	id: number;
	image: string;
	name: string;
	email: string;
	category: string;
	score: string;
};

function RouteComponent() {
	const { departmentName } = useParams({ strict: false });
	const decodedDepartmentName = revertUrlString(departmentName as string);
	const [advancedSearchFilter, setAdvancedSearchFilter] = useState('');
	const [screenWidth, setScreenWidth] = useState(window.innerWidth);
	const [editable, setEditable] = useState(false);

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
	// Handle window resize
	useEffect(() => {
		const handleResize = () => setScreenWidth(window.innerWidth);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Sample data
	const managers: Manager[] = [
		{ id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
		{
			id: '2',
			name: 'Jane Smith',
			email: 'jane@example.com',
			role: 'Manager',
		},
	];

	const memberData: Member[] = [
		{
			id: '101',
			name: 'Alice Johnson',
			email: 'alice@example.com',
			category: 'Management',
			image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		},
		{
			id: '102',
			name: 'Bob Smith',
			email: 'bob@example.com',
			category: 'Staff',
			image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		},
	];

	// Column definitions for managers
	const managerColumns = [
		{
			header: () => <span className="pl-4">Name</span>,
			accessorKey: 'name',
			cell: (props: any) => <span className="pl-4">{props.row.original.email}</span>,
		},
		{
			header: 'ID',
			accessorKey: 'id',
			cell: (props: any) => (screenWidth > 640 ? props.row.original.id : null),
		},
		{
			header: 'Email',
			accessorKey: 'email',
			cell: (props: any) => <span className="truncate">{props.row.original.email}</span>,
		},
		{
			header: 'Role',
			accessorKey: 'role',
			cell: (props: any) => (screenWidth > 768 ? props.row.original.role : null),
		},
		{
			header: '',
			accessorKey: 'id',
			cell: (props: any) => (
				<Button
					variant="outline"
					onClick={() => handleRemove(props.row.original.id)}>
					Remove
				</Button>
			),
		},
	];

	// Column definitions for members
	const memberColumns = [
		{ header: () => <span className="pl-4">Name</span>, accessorKey: 'name', cell: ({ row }: any) => <span className="pl-4">{row.original.name}</span> },
		{
			header: 'ID',
			accessorKey: 'id',
			cell: (props: any) => (screenWidth > 640 ? props.row.original.id : null),
		},
		{ header: 'Email', accessorKey: 'email' },
		{
			header: 'Category',
			accessorKey: 'category',
			cell: (props: any) => (screenWidth > 768 ? props.row.original.category : null),
		},
		{
			header: '',
			accessorKey: 'id',
			cell: (props: any) => (
				<Button
					variant="outline"
					onClick={() => handleRemove(props.row.original.id)}>
					Remove
				</Button>
			),
		},
	];

	const departmentData: DepartmentData[] = [
		{
			id: 123,
			image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			name: 'John Brown',
			email: 'test@gmail.com',
			category: 'Category A',
			score: 's (98%)',
		},
		{
			id: 4323,
			image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			name: '田中里佳子',
			email: 'test@gmail.com',
			category: 'Category A',
			score: 'B (69%)',
		},
		{
			id: 23243,
			image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			name: '浅川一郎',
			email: 'test@gmail.com',
			category: 'Category A',
			score: 'A (80%)',
		},
		{
			id: 433,
			image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			name: '岡田泰一',
			email: 'test@gmail.com',
			category: 'Category A',
			score: 'C (59%)',
		},
		{
			id: 4323,
			image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			name: '田中里佳子',
			email: 'test@gmail.com',
			category: 'Category A',
			score: 'B (69%)',
		},
	];

	const departmenColumn: ColumnDef<DepartmentData>[] = [
		{
			header: '',
			accessorKey: 'image',
			cell: (props: any) => (
				<img
					src={props.row.original.image}
					alt={props.row.original.name}
					className="w-10 h-10 "
				/>
			),
		},
		{
			header: 'Name',
			accessorKey: 'name',
		},
		{
			header: 'ID',
			accessorKey: 'id',
		},
		{
			header: 'EMAIL',
			accessorKey: 'email',
		},
		{
			header: 'Category',
			accessorKey: 'category',
		},
		{
			header: 'Score',
			accessorKey: 'score',
		},
		{
			header: '',
			accessorKey: 'id',
			cell: (props: any) => (
				<Button
					variant="outline"
					onClick={() => handleRemove(props.row.original.id)}>
					Remove
				</Button>
			),
		},
	];

	// Handle remove action
	const handleRemove = (id: string) => {
		console.log('Removing user with ID:', id);
	};

	return (
		<div className="flex-1 h-full">
			{/* Header Section */}
			<TitleWrapper>{decodedDepartmentName}</TitleWrapper>

			{/* Managers Table */}
			<div className="w-full flex justify-between border-b items-center bg-white">
				<h2 className="px-8">Description</h2>
				<Button
					onClick={() => setEditable((prev) => !prev)}
					className="text-black bg-transparent border-r md:w-20 link border-l min-h-10">
					EDIT+
				</Button>
			</div>
			<div className="border-r border-b">
				<DataTable
					columns={managerColumns}
					data={managers}
					loading={false}
					isEditable={editable}
					onSave={handleSaveEdits}
					nonEditableColumns={['id*']}
				/>
			</div>

			{/* Members Table */}
			<div className=" border-r border-b">
				<TitleWrapper>
					<h2>Manager</h2>
				</TitleWrapper>
				<DataTable
					columns={memberColumns}
					data={memberData}
					loading={false}
				/>
			</div>

			{/* Search Section */}
			<div className="">
				<TitleWrapper>
					<h1>Member adjustment</h1>
				</TitleWrapper>
				<div className="flex flex-row bg-white">
					<div className="w-1/3 py-2 px-8">
						<div className="flex items-center justify-between">
							<h3>Added</h3>
							<div className="flex items-center gap-2">
								<span>2 / 13</span>
								<Button className="w-20 py-2 border rounded-none">EDIT</Button>
							</div>
						</div>
						{/* Added Members List */}
						<div className="flex flex-col gap-2 my-4">
							{['John Brown', 'Sarah White'].map((name, index) => (
								<div
									key={index}
									className="flex items-center justify-between">
									<span>{name}</span>
									<Button
										variant="outline"
										className="w-20 py-2 border rounded-none"
										size="sm"
										onClick={() => console.log('Removing', name)}>
										ASSIGN
									</Button>
								</div>
							))}
						</div>
					</div>
					<div className="w-full">
						<div className="flex items-center p-4 border-r border-l">
							<h1>Members</h1>
						</div>

						<div className="flex flex-row flex-wrap items-center justify-between w-full p-4 bg-white border md:flex-row">
							<div className="flex flex-col space-y-2 bg-white md:w-auto">
								<Label htmlFor="keyword">Keyword</Label>
								<Input
									type="text"
									id="keyword"
									placeholder="Search by name, email, etc."
									className="border rounded-none w-[400px]"
								/>
							</div>

							{/* Status Toggle */}
							<div className="flex flex-row gap-2 ">
								<div className="flex flex-col space-y-2">
									<Label>Status</Label>
									<div className="flex">
										<Button
											size="default"
											className="w-20 bg-black rounded-none">
											Active
										</Button>
										<Button
											size="default"
											variant="outline"
											className="w-20 rounded-none">
											All
										</Button>
									</div>
								</div>
								{/* Advanced Search */}
								<div className="flex flex-col space-y-2">
									<Label>‎</Label>
									<AdvancedFilterPopover />
								</div>
							</div>
						</div>
						<div className="border-l border-r">
							<DataTable
								columns={departmenColumn}
								data={departmentData}
								loading={false}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
