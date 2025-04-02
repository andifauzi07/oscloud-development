import { createFileRoute } from '@tanstack/react-router';
import { Link, useLocation, useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MenuList from '@/components/menuList';
import { useState } from 'react';
import { CompanyUpdate } from '@/types/company';
import { useCompany } from '@/hooks/useCompany';
import Loading from '@/components/Loading';
import { cn } from '@/lib/utils';
import { useImageUpload } from '@/hooks/useImageUpload';
import { InfoSection } from '@/components/wrapperElement';
import { toast } from '@/hooks/use-toast';
import { useManagers } from '@/hooks/useManager';
export const Route = createFileRoute('/company/$companyId/')({
	component: CompanyDetail,
});

function CompanyDetail() {
	const { companyId } = useParams({ strict: false });
	const { manager, loading: managerLoading, error: managerError } = useManagers();
	const [isEditing, setIsEditing] = useState(false);
	const [editedCompany, setEditedCompany] = useState<CompanyUpdate>({});
	const location = useLocation();
	const isCurrentPath = location.pathname === `/company/${companyId}`;
	const { company, error, updateCompanyDetails, loading } = useCompany(Number(companyId));

	const { uploadImage, isUploading } = useImageUpload({
		bucketName: 'company_logos',
		folderPath: 'logos',
		maxSizeInMB: 3,
		allowedFileTypes: ['image/jpeg', 'image/png', 'image/svg+xml'],
	});

	if (loading || !company) return <Loading />;
	if (error) return <h1>Error: {typeof error === 'object' ? 'Failed to load employee' : error}</h1>;

	const handleValueChange = (key: string, value: string) => {
		setEditedCompany((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.[0]) return;

		try {
			const file = e.target.files[0];
			const imgUrl = await uploadImage(file);

			if (!company?.companyid) {
				alert('Company ID is missing');
				return;
			}

			const updatePayload: CompanyUpdate = {
				logo: imgUrl,
			};

			await updateCompanyDetails(company.companyid, updatePayload);

			alert('Logo updated successfully');
			setEditedCompany((prev) => ({ ...prev, logo: imgUrl }));
		} catch (error) {
			alert('Failed to upload image');
			console.error('Upload error:', error);
		}
	};

	const handleSave = async () => {
		try {
			if (!Object.keys(editedCompany).length) {
				toast({
					title: 'Error',
					description: 'No changes to save',
					variant: 'destructive',
				});
				return;
			}

			const updatePayload: CompanyUpdate = {
				name: editedCompany.name,
				logo: editedCompany.logo,
				city: editedCompany.city,
				product: editedCompany.product,
				email: editedCompany.email,
				status: editedCompany.status,
				categoryGroup: editedCompany.category_group,
				managerId: editedCompany.managerId,
			};

			await updateCompanyDetails(company.companyId, updatePayload);
			setIsEditing(false);
			setEditedCompany({});
			toast({
				title: 'Success',
				description: 'Company updated successfully',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update company',
				variant: 'destructive',
			});
		}
	};

	const tabs = [
		{ label: 'Profile', path: `/company/${companyId}` },
		{ label: 'Personnel', path: `/company/${companyId}/companyPersonnel` },
	];

	const basicInfo = [
		{
			label: 'Company Name',
			value: isEditing ? (editedCompany.name ?? company?.name) : company?.name || '-',
			key: 'name',
		},
		{
			label: 'Status',
			value: isEditing ? (editedCompany.status ?? company?.status) : company?.status || '-',
			key: 'status',
			options: [
				{ value: 'Active', label: 'Active' },
				{ value: 'Inactive', label: 'Inactive' },
				{ value: 'Blocked', label: 'Blocked' },
			],
		},
		{
			label: 'Category',
			value: editedCompany.category_group || company?.categoryGroup! || '-',
			key: 'category_group',
			options: [
				{ value: 'Tech', label: 'Technology' },
				{ value: 'Finance', label: 'Finance' },
				{ value: 'Healthcare', label: 'Healthcare' },
				{ value: 'Retail', label: 'Retail' },
			],
		},
		{
			label: 'Personnel Count',
			value: (company?.personnel?.length || 0).toString(),
			nonEditable: true,
		},
		{
			label: 'Created Date',
			value: company?.createdAt?.split('T')[0] || '',
			nonEditable: true,
		},
		{
			label: 'Contact Email',
			value: isEditing ? (editedCompany.email ?? company?.email) : company?.email,
			key: 'email',
		},
		{
			label: 'City',
			value: isEditing ? (editedCompany.city ?? company?.city) : company?.city,
			key: 'city',
		},
		{
			label: 'Product',
			value: isEditing ? (editedCompany.product ?? company?.product) : company?.product,
			key: 'product',
		},
	];

	const managerInfo = [
		{
			value: editedCompany.managerid || company.manager?.userId || 'No assigned',
			label: editedCompany.managerid || manager?.find((m) => m.userid! === company?.manager?.userId)?.name! || '-',
			key: 'managerId',
			options: manager?.map((m) => ({ value: m.userid, label: m.name })),
		},
		// {
		// 	label: 'Role',
		// 	value: selectedCompany.manager?.role || '-',
		// 	nonEditable: true,
		// },
		// {
		// 	label: 'Name',
		// 	value: selectedCompany.manager?.firstName! + selectedCompany.manager?.lastName || 'Unassigned', // Keep as string for now
		// 	options: [
		// 		{ value: '1', label: 'Rian' },
		// 		{ value: '2', label: 'John' },
		// 	],
		// 	key: 'name',
		// },
		// {
		// 	label: 'Email',
		// 	value: selectedCompany.manager?.email || '-',
		// 	nonEditable: true,
		// },
		// {
		// 	label: 'Phone Number',
		// 	value: selectedCompany.manager?.phoneNumber || '-',
		// 	nonEditable: true,
		// },
	];

	return (
		<div className="flex flex-col h-full">
			<div className="flex items-center justify-between pl-4 border-r">
				<MenuList
					items={tabs.map((tab) => ({
						label: tab.label,
						path: tab.path,
					}))}
				/>
				<div className="px-4 text-xs">
					<Link to="/company/setting">Settings</Link>
				</div>
			</div>

			{isCurrentPath && (
				<div className="flex flex-col h-full">
					<div className="flex-none px-8 bg-white border-t border-r">
						<h2 className="container py-3">{company?.name}</h2>
					</div>

					<div className="flex-none border-b">
						<div className="flex justify-end w-full bg-white border-t">
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
											setEditedCompany({});
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

					<div className="flex flex-1 bg-white">
						<div className="w-[30%] border-r">
							<figure className="w-full h-[400px] relative">
								<img
									className="object-cover w-full h-full"
									src={editedCompany.logo || company?.logo || '/placeholder.png'}
									alt="Company Profile"
									onError={(e) => {
										const target = e.target as HTMLImageElement;
										target.src = '/placeholder.png';
										target.onerror = null; // Prevent infinite loop if placeholder also fails
									}}
								/>
								{isUploading && (
									<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
										<Loading />
									</div>
								)}
							</figure>
							<div className="flex flex-col items-center p-4 bg-white">
								<h4 className="py-3">Edit profile image</h4>
								<p className="pb-3 text-gray-500">PNG, JPEG, (3MB)</p>
								<div>
									<label
										htmlFor="profile_upload"
										className={cn('cursor-pointer bg-[#f2f2f2] w-48 h-12 flex justify-center items-center hover:bg-muted transition', (isUploading || !isEditing) && 'opacity-50 cursor-not-allowed')}>
										{isUploading ? 'UPLOADING...' : isEditing ? 'UPLOAD' : 'EDIT TO UPLOAD'}
									</label>
									<Input
										id="profile_upload"
										type="file"
										className="hidden"
										enableEmoji={false}
										accept="image/jpeg,image/png"
										onChange={handleImageUpload}
										disabled={isUploading || !isEditing}
										onClick={(e) => {
											if (!isEditing) {
												e.preventDefault();
												alert('Please enable editing first');
											}
										}}
									/>
								</div>
							</div>
						</div>

						<div className="w-[70%] border-r overflow-y-auto">
							<InfoSection
								className="border-l-0"
								items={basicInfo}
								title="Basic Information"
								isEditing={isEditing}
								onValueChange={handleValueChange}
							/>
							<InfoSection
								items={managerInfo}
								title="Manager"
								isEditing={isEditing}
								className="border-l-0"
								onValueChange={handleValueChange}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
