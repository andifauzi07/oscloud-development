import MenuList from '@/components/menuList';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TitleWrapper } from '@/components/wrapperElement';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/employee/setting/category/$categoryName/')({
	component: RouteComponent,
});

// Define the type for a Manager
interface Manager {
	id: string;
	name: string;
	email: string;
	role: string;
}

const handleRemove = (id: string) => {
	console.log('Removing user with ID:', id);
};

// Define columns for the new DataTable
const columns = [
	{
		header: () => <h1 className="pl-8">Name</h1>,
		accessorKey: 'name',
		cell: ({ row }: any) => <h1 className="pl-8">{row.original.name}</h1>,
	},
	{
		header: 'ID',
		accessorKey: 'id',
	},
	{
		header: 'Email',
		accessorKey: 'email',
	},
	{
		header: 'Role',
		accessorKey: 'role',
	},
	{
		header: '',
		accessorKey: 'id', // Use 'id' as the accessorKey for actions
		cell: ({ row }: { row: any }) => (
			<div className="w-full flex justify-end">
				<Button
					variant={'outline'}
					className="border-b-0 border-t-0 border-r-0"
					onClick={() => handleRemove(row.original.id)}>
					Remove
				</Button>
			</div>
		),
	},
];

// Sample data
const managers: Manager[] = [
	{ id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
	{ id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Manager' },
];

function RouteComponent() {
	const [open, setOpen] = useState(false);

	return (
		<div className="flex flex-col h-full text-xs">
			{/* Top Navigation */}
			<div className="flex-none min-h-0 pl-4 border-b">
				<div className="container">
					<MenuList
						items={[
							{
								label: 'Data Field',
								path: '/employee/setting',
							},
							{
								label: 'Data Category',
								path: '/employee/setting/',
							},
							{
								label: 'Employee Category',
								path: '/employee/setting',
							},
							{
								label: 'Department',
								path: '/employee/setting/',
							},
						]}
					/>
				</div>
			</div>

			{/* Category Header */}
			<TitleWrapper>
				<h1>CATEGORY NAME</h1>
			</TitleWrapper>

			{/* Description Section */}
			<div className="flex items-center w-full pl-8 py-2 bg-gray-100 border-b">
				<h1>Description</h1>
				<div className="flex justify-end w-full px-2">
					<Button className="w-20 text-black bg-transparent border link">EDIT</Button>
				</div>
			</div>

			{/* Category Name Section */}
			<div className="flex w-full gap-40 px-4 py-4 bg-white border-b border-r item-center">
				<h1 className="pl-4">Category name</h1>
				<h1>Category A</h1>
			</div>

			{/* Manager Section */}
			<div className="flex items-center w-full pl-4 py-2 bg-gray-100">
				<h1 className="pl-4">Manager</h1>
				<div className="flex justify-end w-full px-2">
					<DropdownMenu
						open={open}
						onOpenChange={setOpen}>
						<DropdownMenuTrigger asChild>
							<Button className="w-20 text-black bg-transparent border link">ADD +</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="p-4 w-72">
							<p className="mb-2 text-lg font-semibold">Add People</p>
							<RadioGroup className="space-y-2">
								<div className="flex items-center space-x-2">
									<RadioGroupItem
										value="all"
										id="all-members"
									/>
									<label htmlFor="all-members">Add all members of X</label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem
										value="specific"
										id="specific-people"
									/>
									<label htmlFor="specific-people">Add specific people</label>
								</div>
							</RadioGroup>
							<Input
								placeholder="Yian, @steve, @usergroup, name@example.com"
								className="mt-3 border"
							/>
							<Button className="w-full mt-4">Done</Button>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Managers Table */}
			<div>
				<DataTable
					columns={columns}
					data={managers}
				/>
			</div>
		</div>
	);
}
