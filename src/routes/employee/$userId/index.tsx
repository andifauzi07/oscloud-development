import { createFileRoute } from '@tanstack/react-router';
import { Link, Outlet, useLocation, useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MenuList from '@/components/menuList';
import { useEmployee } from '@/hooks/useEmployee';
import { useCallback, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Loading from '@/components/Loading';
import { TitleWrapper, InfoSection } from '@/components/wrapperElement';

interface EditedEmployee {
	name?: string;
	email?: string;
	employeeCategoryId?: number;
	profileImage?: string;
}

export const Route = createFileRoute('/employee/$userId/')({
	component: RouteComponent,
});

const menuItems = [
	{ label: 'Profile', path: '/employee/$userId' },
	{ label: 'Shift schedule', path: '/employee/$userId/shift-schedule' },
	{ label: 'Performance', path: '/employee/$userId/performance' },
	{ label: 'Projects', path: '/employee/$userId/project' },
	{ label: 'Payroll', path: '/employee/$userId/payroll' },
];

function RouteComponent() {
	const { userId } = useParams({ strict: false });
	const location = useLocation();
	const isCurrentPath = location.pathname === `/employee/${userId}`;
	const [isEditing, setIsEditing] = useState(false);
	const [editedEmployee, setEditedEmployee] = useState<EditedEmployee>({});
	const { employee, loading, error, updateEmployeeData } = useEmployee(Number(userId));
	// const { categories } = useEmployeeCategories();

	if (loading || !employee) {
		return <Loading />;
	}

	if (error) {
		return <div>Error: {typeof error === 'object' ? 'Failed to load employee' : error}</div>;
	}

	const handleValueChange = (key: string, value: string | number) => {
		setEditedEmployee((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const handleSave = async () => {
		try {
			if (!Object.keys(editedEmployee).length) {
				toast.error('No changes to save');
				return;
			}
			await updateEmployeeData(employee.employeeid, editedEmployee);
			setIsEditing(false);
			setEditedEmployee({});
			toast.success('Employee updated successfully');
		} catch (error) {
			toast.error('Failed to update employee');
		}
	};

	const basicInfo = [
		{
			label: 'Employee ID',
			value: employee?.employeeid?.toString() || '-',
			key: 'employeeId',
			nonEditable: true,  // Make ID non-editable
		},
		{
			label: 'Name',
			value: editedEmployee.name || employee?.name || '-',
			key: 'name',
		},
		{
			label: 'Email',
			value: editedEmployee.email || employee?.email || '-',
			key: 'email',
		},
		{
			label: 'Category',
			value: editedEmployee.employeeCategoryId?.toString() || employee?.employeeCategory?.categoryid?.toString() || '-',
			key: 'employeeCategoryId',
			options: Array.isArray(employee?.employeeCategory)
				? employee.employeeCategory.map((c: any) => ({
						value: c.categoryid.toString(),
						label: c.categoryname,
					}))
				: [],
		},
	];

	const contractInfo = [
		{ label: 'UserID', value: '終日' },
		{ label: '名前', value: '9:00 ~ 17:00' },
		{ label: 'なまえ', value: '終日' },
		{ label: '誕生日', value: '終日' },
		{ label: '2024.11.25', value: '9:00 ~ 17:00' },
		{ label: '2024.11.28', value: '終日' },
	];

	return (
		<div className="flex-1 h-full">
			<div className="items-center flex-none min-h-0 border-b border-r">
				<div className="container flex items-center justify-between px-4 bg-white">
					<MenuList items={menuItems} />
					<div>
						<Link
							className="text-xs"
							to="/employee/setting">
							Setting
						</Link>
					</div>
				</div>
			</div>

			{isCurrentPath && (
				<>
					<div className="flex flex-col">
						<TitleWrapper>
							<h2>{employee?.name}</h2>
						</TitleWrapper>

						<div className="border-b">
							<div className="flex justify-end flex-none w-full bg-white">
								{isEditing ? (
									<>
										<Button
											className="w-20 h-10 text-black bg-transparent border-l border-r link"
											onClick={handleSave}>
											SAVE
										</Button>
										<Button
											className="w-20 h-10 text-black bg-transparent border-r link"
											onClick={() => {
												setIsEditing(false);
												setEditedEmployee({});
											}}>
											CANCEL
										</Button>
									</>
								) : (
									<Button
										className="w-20 h-10 text-black bg-transparent border-l border-r link"
										onClick={() => setIsEditing(true)}>
										EDIT
									</Button>
								)}
							</div>
						</div>
					</div>

					{/* Scrollable content section */}
					<div className="flex-1 min-h-0">
						{/* Image and list container */}
						<div className="flex">
							{/* Left side - Image section */}
							<div className="w-[30%] flex flex-col border-b">
								<figure className="w-full h-[65%] relative overflow-hidden">
									<img
										className="w-full absolute top-[50%] left-[50%] right-[50%] transform translate-x-[-50%] translate-y-[-50%]"
										src={employee.profileimage}
										alt="Profile"
									/>
								</figure>
								<div className="flex flex-col items-center">
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
											enableEmoji={false}
										/>
									</div>
								</div>
							</div>

							{/* Right side - Info sections */}
							<div className="w-[70%] overflow-y-auto">
								<InfoSection
									items={basicInfo}
									title="Basic Information"
									isEditing={isEditing}
									onValueChange={handleValueChange}
									nonEditableFields={['employeeId']}  // Add nonEditableFields prop
								/>
								<InfoSection
									items={contractInfo}
									title="Contact"
								/>
							</div>
						</div>
					</div>
				</>
			)}

			{/* Outlet section */}
			<div className="flex-none">
				<Outlet />
			</div>
		</div>
	);
}
