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

export const Route = createFileRoute('/company/$companyId/')({
	component: CompanyDetail,
});

function CompanyDetail() {
	const { companyId } = useParams({ strict: false });
	const [isEditing, setIsEditing] = useState(false);
	const [editedCompany, setEditedCompany] = useState<CompanyUpdate>({});
	const location = useLocation();
	const isCurrentPath = location.pathname === `/company/${companyId}`;
	const [selectedCompany, setSelectedCompany] = useState<Company | undefined>(undefined);

	const { loading, fetchCompany, updateCompany } = useCompanies();
	// console.log('INI LOADING: ', loading);
	// console.log('INI ERROR: ', error);

	const { uploadImage, isUploading } = useImageUpload({
		bucketName: 'company_logos',
		folderPath: 'logos',
		maxSizeInMB: 3,
		allowedFileTypes: ['image/jpeg', 'image/png', 'image/svg+xml'],
	});

	console.log('INI SELECTED COMPANY: ', selectedCompany);

	useEffect(() => {
		if (companyId && !loading) {
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
	}, [companyId]);

	console.log('INI SELECTED COMPANY: ', selectedCompany);

	// useEffect(() => {}, [selectedCompany?.logo, editedCompany.logo]);

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
				alert('Company ID not found');
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

			if (!selectedCompany?.companyid) {
				alert('Company ID is missing');
				return;
			}

			const updatePayload: CompanyUpdate = {
				name: editedCompany.name,
				logo: editedCompany.logo,
				city: editedCompany.city,
				product: editedCompany.product,
				email: editedCompany.email,
				categoryGroup: editedCompany.category_group, // Keep as category_group
				managerId: editedCompany.managerid, // Keep as string for now
			};

			// Remove undefined properties
			Object.keys(updatePayload).forEach((key) => {
				if (updatePayload[key as keyof CompanyUpdate] === undefined) {
					delete updatePayload[key as keyof CompanyUpdate];
				}
			});

			await updateCompany(selectedCompany.companyid, updatePayload);

			setIsEditing(false);
			setEditedCompany({});
			alert('Company updated successfully');
		} catch (error) {
			console.error('Error updating company:', error);
			alert('Failed to update company');
		}
	};

	const tabs = [
		{ label: 'Profile', path: `/company/${companyId}` },
		{ label: 'Personnel', path: `/company/${companyId}/companyPersonnel` },
	];

	if (loading) return <Loading />;
	// if (error) return <div>Error loading company</div>;
	if (!selectedCompany) return <div>Company not found</div>;

	const basicInfo = [
		{
			label: 'Company Name',
			value: editedCompany.name || selectedCompany.name || '',
			key: 'name',
		},
		{
			label: 'Category',
			value: editedCompany.category_group || selectedCompany.category_group || '',
			key: 'category_group',
			options: [
				{ value: 'tech', label: 'Technology' },
				{ value: 'finance', label: 'Finance' },
				{ value: 'healthcare', label: 'Healthcare' },
				{ value: 'retail', label: 'Retail' },
			],
		},
		{
			label: 'Personnel Count',
			value: (selectedCompany.personnel?.length || 0).toString(),
			nonEditable: true,
		},
		{
			label: 'Created Date',
			value: selectedCompany.createdAt?.split('T')[0] || '',
			nonEditable: true,
		},
		{
			label: 'Contact Email',
			value: editedCompany.email || selectedCompany.email || '',
			key: 'email',
		},
		{
			label: 'City',
			value: editedCompany.city || selectedCompany.city || '',
			key: 'city',
		},
		{
			label: 'Product',
			value: editedCompany.product || selectedCompany.product || '',
			key: 'product',
		},
	];

	const managerInfo = [
		{
			label: 'Manager',
			value: selectedCompany.managerid || selectedCompany.manager?.userId || 'Unassigned', // Keep as string for now
			nonEditable: true,
		},
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
						<h2 className="container py-3">{selectedCompany.name}</h2>
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
								title="Management Information"
								isEditing={false}
								className="border-l-0"
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
