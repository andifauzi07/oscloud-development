import { createFileRoute } from '@tanstack/react-router';
import { Link, Outlet, useLocation, useParams } from '@tanstack/react-router';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { mockCompanies } from '../../../config/mockData/companies';
import { getCompanyPersonnelCount } from '../../../config/mockData/employees';
import MenuList from '../../../components/menuList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/company/$companyId/')({
	component: RouteComponent,
});

const InfoSection = ({
	title,
	items,
	isEditing,
	onValueChange,
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
		<h2 className="px-4 py-4 text-sm font-medium bg-gray-100 border-b ">{title}</h2>
		<div className=" bg-white">
			{items.map((item, index) => (
				<div
					key={index}
					className="flex gap-12 border-b">
					<div className="w-32 px-4 py-2 text-xs font-medium text-gray-600">
						<span>{item.label}</span>
					</div>
					<div className="flex-1 px-4 py-2 text-xs bg-white">
						{isEditing && item.key && onValueChange ? (
							item.options ? (
								<Select
									value={item.value}
									onValueChange={(value) => onValueChange(item.key!, value)}>
									<SelectTrigger>
										<SelectValue placeholder={`Select ${item.label}`} />
									</SelectTrigger>
									<SelectContent>
										{item.options.map((option) => (
											<SelectItem
												key={option.value}
												value={option.value}>
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
	const { companyId } = useParams({ strict: false });
	const [isEditing, setIsEditing] = useState(false);
	const [editedEmployee, setEditedEmployee] = useState({});
	const location = useLocation();
	const isCurrentPath = location.pathname === `/company/${companyId}`;

	// Find the company data
	const company = mockCompanies.find((c) => c.id === Number(companyId)) || mockCompanies[0];
	const personnelCount = getCompanyPersonnelCount(company.id);

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
			setIsEditing(false);
			setEditedEmployee({});
			toast.success('Employee updated successfully');
		} catch (error) {
			toast.error('Failed to update employee');
		}
	};

	const tabs = [
		{ label: 'Profile', path: `/company/${companyId}` },
		{
			label: 'Personnel',
			path: `/company/${companyId}/companyPersonnel`,
		},
	];

	const basicInfo = [
		{ label: 'Company Name', value: company.name },
		{ label: 'Category', value: company.categoryGroup },
		{ label: 'Personnel Count', value: personnelCount.toString() },
		{ label: 'Created Date', value: company.createdAt },
		{ label: 'Contact Email', value: company.email },
		{ label: 'Cities', value: company.cities.join(', ') },
	];

	const managersInfo = company.managers.map((manager) => ({
		label: manager.role,
		value: manager.name,
	}));

	const productsInfo = company.products.map((product) => ({
		label: product.category,
		value: product.name,
	}));

	return (
		<div className="flex-1 h-full ">
			{/* menus  */}
			<div className="flex-none min-h-0">
				<div className="flex items-center pl-4 border-r justify-between">
					<MenuList
						items={tabs.map((tab) => ({
							label: tab.label,
							path: tab.path,
						}))}
					/>
					<div className="px-4">
						<Link
							to={`/company/setting`}
							className="text-xs"
							params={{ companyId: company.id.toString() }}>
							Settings
						</Link>
					</div>
				</div>
			</div>

			{isCurrentPath && (
				<>
					<div className="px-8 bg-white border-r border-t">
						<h2 className="container py-3">{company.name}</h2>
					</div>

					<div className="border-b">
						<div className="flex justify-end flex-none w-full bg-white border-t">
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

					<div className="flex-1 min-h-0">
						<div className="flex">
							<div className="w-[30%] border-b flex flex-col">
								<figure className="w-full h-[65%] relative overflow-hidden">
									<img
										className="w-full absolute top-[50%] left-[50%] right-[50%] transform translate-x-[-50%] translate-y-[-50%]"
										src={company.image}
										alt="Company Profile"
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
										/>
									</div>
								</div>
							</div>

							<div className="w-[70%] border-l border-r overflow-y-auto">
								<InfoSection
									items={basicInfo}
									title="Basic Information"
									isEditing={isEditing}
									onValueChange={handleValueChange}
								/>
								<InfoSection
									items={managersInfo}
									title="Management Team"
								/>
								<InfoSection
									items={productsInfo}
									title="Products & Services"
								/>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
