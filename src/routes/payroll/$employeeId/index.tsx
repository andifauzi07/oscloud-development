import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/payroll/$employeeId/')({
    component: RouteComponent,
})

function RouteComponent() {


    const InfoSection = ({
        title,
        items,
    }: {
        title: React.ReactNode;
        items: { label: string; value: string }[];
    }) => (
        <div className="flex flex-col">
            <h2 className="px-4 py-4 text-sm font-medium bg-gray-100">{title}</h2>
            <div className="divide-y">
                {items.map((item, index) => (
                    <div key={index} className="flex gap-8 border-gray-200">
                        <div className="w-32 px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50">
                            <span>{item?.label}</span>
                        </div>
                        <div className="flex-1 px-4 py-3 text-sm">
                            <span>{item?.value}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
    const basicInfo = [
        { label: "UserID", value: "終日" },
        { label: "名前", value: "John Brown" },
        { label: "なまえ", value: "終日" },
        { label: "誕生日", value: "終日" },
        { label: "2024.11.25", value: "9:00 ~ 17:00" },
        { label: "2024.11.28", value: "終日" },
    ];

    const contractInfo = [
        { label: "UserID", value: "終日" },
        { label: "名前", value: "9:00 ~ 17:00" },
        { label: "なまえ", value: "終日" },
        { label: "誕生日", value: "終日" },
        { label: "2024.11.25", value: "9:00 ~ 17:00" },
        { label: "2024.11.28", value: "終日" },
    ];

    return (

        <div className="flex flex-col flex-1 h-full">
            {/* Tabs Section */}
            <Tabs defaultValue="profile">
                <div className="flex items-center justify-between px-4 bg-white border-b">
                    <TabsList className="justify-start gap-8 bg-white [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12">
                        <TabsTrigger
                            value="profile"
                            className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2"
                        >
                            Profile
                        </TabsTrigger>
                        <TabsTrigger
                            value="joinedprojects"
                            className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2"
                        >
                            Joined Projects
                        </TabsTrigger>
                        <TabsTrigger
                            value="payment"
                            className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2"
                        >
                            Payment
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Employee List Tab */}
                <TabsContent value="profile">
                    <>
                        <div className="flex flex-col">
                            <div className="bg-white border-b">
                                <h2 className="container px-4 py-3 ">
                                    John Brown
                                </h2>
                            </div>
                            <div className="border-b">
                                <div className="flex justify-end flex-none w-full bg-white border-t">
                                    <Button className="w-20 text-black bg-transparent border link h-14">
                                        EDIT
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Scrollable content section */}
                        <div className="flex-1 min-h-0">
                            {/* Image and list container */}
                            <div className="flex">
                                {/* Left side - Image section */}
                                <div className="w-[30%] flex flex-col">
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
                                                className="cursor-pointer bg-[#f2f2f2] w-48 h-12 flex justify-center items-center hover:bg-muted transition"
                                            >
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
                                    <InfoSection items={basicInfo} title="Basic Information" />
                                    <InfoSection items={contractInfo} title="Contact" />
                                </div>
                            </div>
                        </div>
                    </>
                </TabsContent>

                {/* Payment List Tab */}
                <TabsContent value="joinedprojects">
                </TabsContent>

                <TabsContent value="payment">
                </TabsContent>
            </Tabs>
        </div>
    )
}
