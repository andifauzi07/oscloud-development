import { createFileRoute } from '@tanstack/react-router';
import { Link, Outlet, useLocation, useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MenuList from '@/components/menuList';
import { useEmployee } from '@/hooks/useEmployee';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

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

const InfoSection = ({ 
    title, 
    items, 
    isEditing, 
    onValueChange 
}: { 
    title: React.ReactNode; 
    items: { 
        label: string; 
        value: string;
        key?: string;
        options?: { value: string; label: string }[];
    }[]; 
    isEditing?: boolean;
    onValueChange?: (key: string, value: string) => void;
}) => (
    <div className="flex flex-col border-l">
        <h2 className="px-4 py-4 text-sm font-medium bg-gray-100 border-b border-r">{title}</h2>
        <div className="">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="flex gap-8 border-b border-r"
                >
                    <div className="w-32 px-4 py-3 text-sm font-medium text-gray-600">
                        <span>{item.label}</span>
                    </div>
                    <div className="flex-1 px-4 py-3 text-sm">
                        {isEditing && item.key && onValueChange ? (
                            item.options ? (
                                <Select 
                                    value={item.value} 
                                    onValueChange={(value) => onValueChange(item.key!, value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={`Select ${item.label}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {item.options.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Input
                                    value={item.value}
                                    onChange={(e) => onValueChange(item.key!, e.target.value)}
                                    className="h-8"
                                />
                            )
                        ) : (
                            <span>{item.value}</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

function RouteComponent() {
    const { userId } = useParams({ strict: false });
    const location = useLocation();
    const isCurrentPath = location.pathname === `/employee/${userId}`;
    const [isEditing, setIsEditing] = useState(false);
    const [editedEmployee, setEditedEmployee] = useState<EditedEmployee>({});
    const { employee, loading, error, updateEmployee } = useEmployee(Number(userId));
    // const { categories } = useEmployeeCategories();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {typeof error === 'object' ? 'Failed to load employee' : error}</div>;
    }

    const handleValueChange = (key: string, value: string | number) => {
        setEditedEmployee(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = async () => {
        try {
            if (!Object.keys(editedEmployee).length) {
                toast.error('No changes to save');
                return;
            }
            await updateEmployee(editedEmployee);
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
            value: employee?.employeeId?.toString() || '-',
            key: 'employeeId',
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
        // { 
        //     label: 'Category', 
        //     value: editedEmployee.employeeCategoryId?.toString() || 
        //            employee?.employeeCategory?.id?.toString() || '-',
        //     key: 'employeeCategoryId',
        //     options: categories?.map((c: any) => ({ 
        //         value: c.categoryId.toString(), 
        //         label: c.name 
        //     }))
        // }
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
				</div>
			</div>

			{isCurrentPath && (
				<>
					<div className="flex flex-col">
						<div className="border-r">
							<h2 className="container px-4 py-3 ">John Brown {userId}</h2>
						</div>
						<div className="border-b">
							<div className="flex justify-end flex-none w-full bg-white border-t">
								{isEditing ? (
                                    <>
                                        <Button 
                                            className="w-20 text-black bg-transparent border-l border-r link h-14"
                                            onClick={handleSave}
                                        >
                                            SAVE
                                        </Button>
                                        <Button 
                                            className="w-20 text-black bg-transparent border-r link h-14"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditedEmployee({});
                                            }}
                                        >
                                            CANCEL
                                        </Button>
                                    </>
                                ) : (
                                    <Button 
                                        className="w-20 text-black bg-transparent border-l border-r link h-14"
                                        onClick={() => setIsEditing(true)}
                                    >
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
										src="https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
