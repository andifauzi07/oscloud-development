import { createFileRoute } from '@tanstack/react-router';
import { Link, useLocation, useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MenuList from '@/components/menuList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Company } from '@/types/company';
import { useCompanies } from '@/hooks/useCompany';
import { supabase } from '@/backend/supabase/supabaseClient';
import { InfoSection } from '@/components/wrapperElement';

export const Route = createFileRoute('/company/$companyId/')({
    component: CompanyDetail,
});

function CompanyDetail() {
    const { companyId } = useParams({ strict: false });
    const [isEditing, setIsEditing] = useState(false);
    const [editedCompany, setEditedCompany] = useState<Partial<Company>>({});
    const location = useLocation();
    const isCurrentPath = location.pathname === `/company/${companyId}`;

    const { selectedCompany, loading, error, fetchCompany, updateCompany } = useCompanies();

    useEffect(() => {
        if (companyId) {
            fetchCompany(Number(companyId));
        }
    }, [companyId, fetchCompany]);

    const handleValueChange = (key: string, value: string) => {
        setEditedCompany((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];
            if (!file) return;

            // Check file size (3MB limit)
            if (file.size > 3 * 1024 * 1024) {
                toast.error('File size must be less than 3MB');
                return;
            }

            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                toast.error('Only JPEG and PNG files are allowed');
                return;
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `company-images/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('companies')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('companies')
                .getPublicUrl(filePath);

            setEditedCompany(prev => ({
                ...prev,
                logo: publicUrl
            }));

            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
        }
    };

    const handleSave = async () => {
        try {
            if (!Object.keys(editedCompany).length) {
                toast.error('No changes to save');
                return;
            }

            if (!selectedCompany?.companyid) {
                toast.error('Company ID is missing');
                return;
            }

            await updateCompany(
                selectedCompany.companyid,
                editedCompany
            );
            
            setIsEditing(false);
            setEditedCompany({});
            toast.success('Company updated successfully');
        } catch (error) {
            console.error('Error updating company:', error);
            toast.error('Failed to update company');
        }
    };

    const tabs = [
        { label: 'Profile', path: `/company/${companyId}` },
        { label: 'Personnel', path: `/company/${companyId}/companyPersonnel` },
    ];

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading company</div>;
    if (!selectedCompany) return <div>Company not found</div>;

    const basicInfo = [
        { 
            label: 'Company Name', 
            value: editedCompany.name || selectedCompany.name || '',
            key: 'name' 
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
            ]
        },
        { 
            label: 'Personnel Count', 
            value: (selectedCompany.personnel?.length || 0).toString(),
            nonEditable: true 
        },
        { 
            label: 'Created Date', 
            value: selectedCompany.created_at || '',
            nonEditable: true 
        },
        { 
            label: 'Contact Email', 
            value: editedCompany.email || selectedCompany.email || '',
            key: 'email' 
        },
        { 
            label: 'City', 
            value: editedCompany.city || selectedCompany.city || '',
            key: 'city' 
        },
        {
            label: 'Product',
            value: editedCompany.product || selectedCompany.product || '',
            key: 'product'
        }
    ];

    const managerInfo = [
        {
            label: 'Manager ID',
            value: selectedCompany.managerid?.toString() || '',
            nonEditable: true
        }
    ];

    return (
        <div className="flex-1 h-full">
            <div className="flex items-center justify-between pl-4 border-r">
                <MenuList
                    items={tabs.map((tab) => ({
                        label: tab.label,
                        path: tab.path,
                    }))}
                />
                <div className="px-4">
                    <Link
                        to="/company/setting"
                        // params={{ companyId: selectedCompany.companyid?.toString() }}
                        >
                        Settings
                    </Link>
                </div>
            </div>

            {isCurrentPath && (
                <>
                    <div className="px-8 bg-white border-t border-r">
                        <h2 className="container py-3">{selectedCompany.name}</h2>
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

                    <div className="flex-1 min-h-0">
                        <div className="flex">
                            <div className="w-[30%] border-b flex flex-col">
                                <figure className="w-full h-[65%] relative overflow-hidden">
                                    <img
                                        className="w-full absolute top-[50%] left-[50%] right-[50%] transform translate-x-[-50%] translate-y-[-50%]"
                                        src={editedCompany.logo || selectedCompany.logo}
                                        alt="Company Profile"
                                    />
                                </figure>
                                <div className="flex flex-col items-center">
                                    <h4 className="py-3">Edit profile image</h4>
                                    <p className="pb-3 text-gray-500">PNG, JPEG, (3MB)</p>
                                    <div>
                                        <label
                                            htmlFor="profile_upload"
                                            className="cursor-pointer bg-[#f2f2f2] w-48 h-12 flex justify-center items-center hover:bg-muted transition"
                                        >
                                            UPLOAD
                                        </label>
                                        <Input
                                            id="profile_upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/jpeg,image/png"
                                            onChange={handleImageUpload}
                                            disabled={!isEditing}
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
                                    items={managerInfo}
                                    title="Management Information"
                                    isEditing={false}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
