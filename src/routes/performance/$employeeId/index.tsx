import { createFileRoute } from '@tanstack/react-router';
import { Link, useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import MenuList from '@/components/menuList';
import { DataTable } from '@/components/ui/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { usePerformanceTemplate, usePerformanceTemplates } from '@/hooks/usePerformance';
import { useEmployee } from '@/hooks/useEmployee';
import Loading from '@/components/Loading';

interface Point {
    pointid: number;
    categoryid: number;
    pointname: string;
    weight: number;
}

interface Category {
    categoryid: number;
    templateid: number;
    categoryname: string;
    points: Point[];
}

interface Template {
    templateid: number;
    templatename: string;
    workspaceid: number;
    categories: Category[];
}

interface PerformanceSheet {
    id: number;
    name: string;
    template: Template;
    date: string;
    scores: {
        categoryid: number;
        pointid: number;
        score: number;
    }[];
}

function RouteComponent() {
    // REASSES THIS BECAUSE THIS SHOULD

    const { employeeId } = useParams({ strict: false });
    const { template, loading: templatesLoading } = usePerformanceTemplate(Number(employeeId));
    const { employee, loading: employeeLoading } = useEmployee(Number(employeeId));

    if (!employeeId) return null;
    if (templatesLoading || employeeLoading) return <Loading />;

    const columns = [
        { 
            header: 'Name', 
            accessorKey: 'name' 
        },
        { 
            header: 'Template', 
            accessorKey: 'template',
            cell: ({ row }: any) => row.original.template.templatename
        },
        { 
            header: 'Date', 
            accessorKey: 'date' 
        },
        {
            id: 'actions',
            cell: ({ row }: any) => (
                <Link
                    to={`/performance/$employeeId/$sheetId`}
                    params={{
                        sheetId: row.original.id,
                        employeeId: employeeId.toString(),
                    }}>
                    <Button variant="outline" className="w-20">
                        DETAIL
                    </Button>
                </Link>
            ),
        },
    ];

    const handleCreateSheet = () => {
        console.log("CREATE")

    }

    return (
        <div className="flex-1 h-full">
            {/* Header Section */}
            <div className="flex-none min-h-0 border-b">
                <div className="container flex flex-row items-center justify-between pt-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-semibold">
                            {employee?.name}'s Performance Reviews
                        </h1>
                    </div>
                    <MenuList
                        items={[
                            {
                                label: 'Sheet List',
                                path: `/performance/${employeeId}`,
                            },
                            {
                                label: 'Access Control',
                                path: `/performance/${employeeId}/accesscontrol`,
                            },
                        ]}
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end flex-none w-full">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="w-full text-black bg-transparent border-none">
                            Latest <ChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Latest</DropdownMenuItem>
                        <DropdownMenuItem>Oldest</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="w-20 text-black bg-transparent border-l border-r link min-h-14">
                            ADD+
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {/* {template?.map((template) => (
                            <DropdownMenuItem 
                                key={template.templateid}
                                onClick={() => handleCreateSheet()}
                            >
                                {template.templatename}
                            </DropdownMenuItem>
                        ))} */}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button className="w-20 text-black bg-transparent border-r link min-h-14">
                    EDIT
                </Button>
            </div>

            {/* Data Table */}
            <div className="border-t">

                {/* TODO: Need Sheets Endpoint */}
                {/* <DataTable
                    columns={columns}
                    data={template}
                /> */}
            </div>
        </div>
    );
}

export const Route = createFileRoute('/performance/$employeeId/')({
    component: RouteComponent,
});
