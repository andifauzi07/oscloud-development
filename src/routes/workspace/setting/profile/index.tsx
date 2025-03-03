import MenuList from '@/components/menuList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InfoSection, TitleWrapper } from '@/components/wrapperElement';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/workspace/setting/profile/')({
	component: RouteComponent,
});

function RouteComponent() {
	const [editedEmployee, setEditedEmployee] = useState({});
	const [isEditing, setIsEditing] = useState(false);
	// const { selectedWorkspace, loading, error, updateWorkspace } = useWorkspace(workspaceId);

	const handleSave = async () => {
		try {
			if (!Object.keys(editedEmployee).length) {
				toast.error('No changes to save');
				return;
			}
			setIsEditing(false);
			setEditedEmployee({});
			toast.success('Employee updated successfully');
		} catch (error) {
			toast.error('Failed to update employee');
		}
	};

	const basicInfo = [
		{ label: 'User Name', value: '@kevinheart' },
		{ label: 'Name', value: 'Kevin Heart' },
		{ label: 'Email Address', value: 'kevin@example.com' },
		{ label: 'Backup Email', value: 'kevinsuzuki@gmail.com' },
		{ label: 'Phone Number', value: '090-1234-0987' },
		{ label: 'Languages', value: 'English' },
	];

	const handleValueChange = (key: string, value: string | number) => {
		setEditedEmployee((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	return (
		<>
			<div className="pl-4 bg-white border border-t-0 border-l-0">
				<MenuList
					items={[
						{
							label: 'Profile',
							path: `/workspace/setting/profile`,
						},
						{
							label: 'Security',
							path: `/workspace/setting/security`,
						},
					]}
				/>
			</div>
			<TitleWrapper className="">
				<h1>Profile</h1>
			</TitleWrapper>
			<div className="border-r border-b w-full flex justify-end">
				<Button
					className="w-20 border-t-0 border border-r-0 border-b-0"
					variant="outline"
					onClick={() => setIsEditing(true)}>
					EDIT
				</Button>
			</div>
			<div className="flex h-[80vh]">
				<div className="w-[30%] border-b border-r flex flex-col">
					<figure className="w-full h-[65%] relative overflow-hidden">
						<img
							className="w-full absolute top-[50%] left-[50%] right-[50%] transform translate-x-[-50%] translate-y-[-50%]"
							src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
							alt="User Profile"
						/>
					</figure>
					<div className="flex flex-col items-center text-xs">
						<h4 className="py-3">Edit profile image</h4>
						<p className="pb-3 text-gray-500">PNG, JPEG, (3MG)</p>
						<div>
							<label
								htmlFor="profile_upload"
								className="cursor-pointer bg-[#f2f2f2] w-48 h-12 flex justify-center items-center hover:bg-muted transition">
								UPLOAD
							</label>
							<Input
								id="profile_upload"
								type="file"
								className="hidden"
							/>
						</div>
					</div>
				</div>
				<div className="w-[70%] overflow-y-auto">
					<InfoSection
						items={basicInfo}
						title="Basic Information"
						isEditing={isEditing}
						onValueChange={handleValueChange}
					/>
				</div>
			</div>
		</>
	);
}
