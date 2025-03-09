import MenuList from "@/components/menuList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InfoSection, TitleWrapper } from "@/components/wrapperElement";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useUserData } from "@/hooks/useUserData";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useDiceBear } from '@/hooks/useDiceBear';
import Loading from "@/components/Loading";
import { cn } from "@/lib/utils";

interface EditedUser {
    name?: string;
    email?: string;
    backup_email?: string;
    phone_number?: string;
    username?: string;
    language?: string;
    image?: string;
}

export const Route = createFileRoute("/workspace/setting/profile/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { currentUser, loading, error, updateUserData } = useUserData();
    const [editedUser, setEditedUser] = useState<EditedUser>({});
    const [isEditing, setIsEditing] = useState(false);
    const { uploadImage, isUploading } = useImageUpload({
        bucketName: "users_avatar",
        folderPath: "avatars",
        maxSizeInMB: 3,
        allowedFileTypes: ["image/jpeg", "image/png", "image/svg+xml"], // Added SVG support
    });
    const { createAvatar } = useDiceBear();

    if (loading) {
        return <div className="flex items-center justify-center h-full bg-white"><Loading /></div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleSave = async () => {
        try {
            if (!Object.keys(editedUser).length) {
                toast.error("No changes to save");
                return;
            }

            if (!currentUser?.userid) {
                toast.error("User ID not found");
                return;
            }

            await updateUserData(
                currentUser.workspaceid,
                currentUser.userid,
                editedUser
            );
            setIsEditing(false);
            setEditedUser({});
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Failed to update profile");
            console.error("Update error:", error);
        }
    };

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!e.target.files?.[0]) return;

        try {
            const file = e.target.files[0];
            const imageUrl = await uploadImage(file);

            if (!currentUser?.userid) {
                alert("User ID not found");
                return;
            }

            await updateUserData(currentUser.workspaceid, currentUser.userid, {
                image: imageUrl,
            });

            alert("Profile image updated successfully");
        } catch (error) {
            alert("Failed to upload image");
            console.error("Upload error:", error);
        }
    };

    const handleCreateAvatar = async () => {
        try {
            const avatarFile = await createAvatar({
                seed: currentUser?.name || 'user',
                size: 256
            });
            
            const imageUrl = await uploadImage(avatarFile);
            
            if (!currentUser?.userid) {
                toast.error('User ID not found');
                return;
            }

            await updateUserData(currentUser.workspaceid, currentUser.userid, {
                image: imageUrl
            });
            
            toast.success('Avatar created and uploaded successfully');
        } catch (error) {
            toast.error('Failed to create avatar');
            console.error('Avatar creation error:', error);
        }
    };

    const basicInfo = [
        {
            label: "User Name",
            value: "@" + currentUser?.name.split(" ")[0] || "@username",
            key: "username",
        },
        {
            label: "Name",
            value: currentUser?.name || "User",
            key: "name",
        },
        {
            label: "Email Address",
            value: currentUser?.email || "email@example.com",
            key: "email",
        },
        {
            label: "Backup Email",
            value: currentUser?.backup_email || "",
            key: "backup_email",
        },
        {
            label: "Phone Number",
            value: currentUser?.phone_number || "N/A",
            key: "phone_number",
        },
        {
            label: "Languages",
            value: "English",
            key: "language",
        },
    ];

    const handleValueChange = (key: string, value: string | number) => {
        setEditedUser((prev) => ({
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
                            label: "Profile",
                            path: `/workspace/setting/profile`,
                        },
                        {
                            label: "Security",
                            path: `/workspace/setting/security`,
                        },
                    ]}
                />
            </div>
            <TitleWrapper className="">
                <h1>Profile</h1>
            </TitleWrapper>
            <div className="flex justify-end w-full border-b border-r">
                {isEditing ?
                    <>
                        <Button
                            className="w-20 border border-t-0 border-b-0 border-r-0"
                            variant="outline"
                            onClick={handleSave}
                        >
                            SAVE
                        </Button>
                        <Button
                            className="w-20 border border-t-0 border-b-0 border-r-0"
                            variant="outline"
                            onClick={() => {
                                setIsEditing(false);
                                setEditedUser({});
                            }}
                        >
                            CANCEL
                        </Button>
                    </>
                :   <Button
                        className="w-20 border border-t-0 border-b-0 border-r-0"
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                    >
                        EDIT
                    </Button>
                }
            </div>
            <div className="flex h-[80vh]">
                <div className="w-[30%] border-b border-r flex flex-col">
                    <figure className="w-full h-[65%] relative overflow-hidden">
                        <img
                            className="w-full absolute top-[50%] left-[50%] right-[50%] transform translate-x-[-50%] translate-y-[-50%]"
                            src={
                                currentUser?.image ||
                                "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
                            }
                            alt="User Profile"
                        />
                    </figure>
                    <div className="flex flex-col items-center text-xs">
                        <h4 className="py-3">Edit profile image</h4>
                        <p className="pb-3 text-gray-500">PNG, JPEG, SVG (3MB)</p>
                        <div className="flex justify-center w-full gap-4 px-4">
                            <div className="flex-1 max-w-[200px]">
                                <label
                                    htmlFor="profile_upload"
                                    className={cn(
                                        "cursor-pointer bg-[#f2f2f2] h-12 w-full flex justify-center items-center hover:bg-muted transition",
                                        isUploading && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    {isUploading ? "UPLOADING..." : "UPLOAD IMAGE"}
                                </label>
                                <Input
                                    id="profile_upload"
                                    type="file"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    accept="image/jpeg,image/png"
                                    disabled={isUploading}
                                    enableEmoji={false}
                                />
                            </div>
                            <div className="flex items-center text-gray-400">or</div>
                            <div className="flex-1 max-w-[200px]">
                                <button
                                    onClick={handleCreateAvatar}
                                    disabled={isUploading}
                                    className={cn(
                                        "cursor-pointer bg-[#f2f2f2] h-12 w-full flex justify-center items-center hover:bg-muted transition",
                                        isUploading && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    {isUploading ? "CREATING..." : "CREATE AVATAR"}
                                </button>
                            </div>
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
