import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createFileRoute } from '@tanstack/react-router'
import { Link } from "@tanstack/react-router";


export const Route = createFileRoute('/guest/dashboard/')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="">
            {/* Header Section */}

            {/* Tabs Section */}
            <Tabs defaultValue="list">
                <TabsList className="justify-start w-full gap-8 bg-white border [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 px-4">
                    <TabsTrigger
                        value="list"
                        className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2"
                    >
                        Shift
                    </TabsTrigger>
                    <TabsTrigger
                        value="timeline"
                        className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2"
                    >
                        Available Dates
                    </TabsTrigger>
                </TabsList>
                <TabsContent value='shift'>

                    <div className="flex flex-row items-center justify-between px-8 py-4 bg-gray-100 border" />
                    <div className="flex flex-row items-center justify-between px-8 py-4 bg-gray-100 border">
                        <h1>Shifts</h1>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2'>
                        <div className='flex flex-col '>
                            <div className='px-8 py-4 border'>
                                <h1>Upcoming</h1>
                            </div>
                            {["Project 1", "Project 2", "Project 3", "Project 4"].map((item) => (
                                <div className='flex justify-between py-4 pl-8 border'>
                                    <h1>{item}</h1>
                                    <div className='flex flex-row gap-4 flex-nowrap'>
                                        <h1>2024.11.01</h1>
                                        <h1>9:00 ~ 18:00</h1>
                                        <Link
                                            to={'/guest/dashboard'}
                                            // params={{ userId: row.original.id.toString() }}
                                            className="w-full h-full">
                                            <Button
                                                variant="outline"
                                                className="w-20">
                                                VIEW
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}

                        </div>

                        <div className='flex flex-col bg-gray-100 '>
                            <div className='px-8 py-4 border'>
                                <h1>Joined</h1>
                            </div>
                            {["Project 1", "Project 2", "Project 3", "Project 4"].map((item) => (
                                <div className='flex justify-between py-4 pl-8 border'>
                                    <h1>{item}</h1>
                                    <div className='flex flex-row gap-4 flex-nowrap'>
                                        <h1>2024.11.01</h1>
                                        <h1>9:00 ~ 18:00</h1>
                                        <Link
                                            to={'/guest/dashboard'}
                                            // params={{ userId: row.original.id.toString() }}
                                            className="w-full h-full">
                                            <Button
                                                variant="outline"
                                                className="w-20">
                                                VIEW
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
