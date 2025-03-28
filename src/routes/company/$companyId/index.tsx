import { createFileRoute } from '@tanstack/react-router';
import { Link, useLocation, useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MenuList from '@/components/menuList';
import { useEffect, useState } from 'react';
import { Company, CompanyUpdate } from '@/types/company';
import { useCompanies } from '@/hooks/useCompany';
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
	const { manager, loading: managerLoading, error } = useManagers();
	const [isEditing, setIsEditing] = useState(false);
	const [editedCompany, setEditedCompany] = useState<CompanyUpdate>({});
	const location = useLocation();
	const isCurrentPath = location.pathname === `/company/${companyId}`;
	const [selectedCompany, setSelectedCompany] = useState<Company | undefined>(undefined);
	const { loading, fetchCompany, updateCompany, workspaceid } = useCompanies();
	const { uploadImage, isUploading } = useImageUpload({
		bucketName: 'company_logos',
		folderPath: 'logos',
		maxSizeInMB: 3,
		allowedFileTypes: ['image/jpeg', 'image/png', 'image/svg+xml'],
	});

	useEffect(() => {
		if (companyId && !loading && workspaceid) {
			fetchCompany(Number(companyId))
				.then((result) => {
					if (result) {
						const isDataDifferent = JSON.stringify(result) !== JSON.stringify(selectedCompany);
						if (isDataDifferent) {
							setSelectedCompany(result);
						}
					}
				})
				.catch((error) => {
					console.error('Error:', error);
				});
		}
	}, [companyId, workspaceid, selectedCompany]);

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

			if (!selectedCompany?.companyid) {
				alert('Company ID is missing');
				return;
			}

			const updatePayload: CompanyUpdate = {
				logo: imgUrl,
			};

			await updateCompany(selectedCompany.companyid, updatePayload);

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
				alert('No changes to save');
				return;
			}

			if (!selectedCompany?.companyId) {
				alert('Company ID is missing');
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
				managerId: editedCompany.managerid,
			};

			// Remove undefined properties
			Object.keys(updatePayload).forEach((key) => {
				if (updatePayload[key as keyof CompanyUpdate] === undefined) {
					delete updatePayload[key as keyof CompanyUpdate];
				}
			});

			const result = await updateCompany(selectedCompany.companyId, updatePayload);

			setSelectedCompany((prev) => (prev ? { ...prev, ...result } : undefined));
			toast({
				title: 'Success',
				description: 'Company updated successfully',
			});
		} catch (error) {
			console.error('Error updating company:', error);
			toast({
				title: 'Error',
				description: 'Failed to update company',
				variant: 'destructive',
			});
		} finally {
			setEditedCompany({});
			setIsEditing(false);
		}
	};

	console.log('edited Company => ', editedCompany);
	console.log('selected Company => ', selectedCompany);

	const tabs = [
		{ label: 'Profile', path: `/company/${companyId}` },
		{ label: 'Personnel', path: `/company/${companyId}/companyPersonnel` },
	];

	if (loading && !selectedCompany) return <Loading />;
	if (!selectedCompany && !loading) return <div>Company not found</div>;

	const basicInfo = [
		{
			label: 'Company Name',
			value: editedCompany.name || selectedCompany?.name! || '',
			key: 'name',
		},
		{
			label: 'Status',
			value: editedCompany.status || selectedCompany?.status! || '-',
			key: 'status',
			options: [
				{ value: 'Active', label: 'Active' },
				{ value: 'Inactive', label: 'Inactive' },
				{ value: 'Blocked', label: 'Blocked' },
			],
		},
		{
			label: 'Category',
			value: editedCompany.category_group || selectedCompany?.categoryGroup! || '-',
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
			value: (selectedCompany?.personnel?.length || 0).toString(),
			nonEditable: true,
		},
		{
			label: 'Created Date',
			value: selectedCompany?.createdAt?.split('T')[0] || '',
			nonEditable: true,
		},
		{
			label: 'Contact Email',
			value: editedCompany.email || selectedCompany?.email || '',
			key: 'email',
		},
		{
			label: 'City',
			value: editedCompany.city || selectedCompany?.city || '',
			key: 'city',
		},
		{
			label: 'Product',
			value: editedCompany.product || selectedCompany?.product || '',
			key: 'product',
		},
	];

	const managerInfo = [
		{
			value: editedCompany.managerId || manager.find((m) => m.userid === selectedCompany?.manager?.userId)?.userid || 'No assigned',
			label: editedCompany.managerId || manager.find((m) => m.userid === selectedCompany?.manager?.userId)?.name || '-',
			key: 'managerid',
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
						<h2 className="container py-3">{selectedCompany?.name}</h2>
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
									src={editedCompany.logo || selectedCompany?.logo || '/placeholder.png'}
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
