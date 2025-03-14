import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TabsContent } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { TitleWrapper } from '@/components/wrapperElement';
import AdvancedFilterPopover from '@/components/search/advanced-search';
import { type ColumnDef } from '@tanstack/react-table';

interface FilterField {
    key: string;
    label: string;
    type: string;
    options?: string[];
}

interface PaymentStaff {
    id: string;
    image: string;
    name: string;
    break: number;
    duration: number;
    hour_rate: number;
    transport_fee: number;
    cost_a: number;
    cost_b: number;
    costum_fee: number;
    total_fee: number;
}

interface ProjectPaymentTabProps {
    mockPaymentStaff: PaymentStaff[];
    advancedSearchFields: FilterField[];
    loading?: boolean;
}

export const ProjectPaymentTab: React.FC<ProjectPaymentTabProps> = ({
    mockPaymentStaff,
    advancedSearchFields,
    loading = false,
}) => {
    const paymentStaffColumns: ColumnDef<PaymentStaff>[] = [
        {
            accessorKey: 'image',
            header: '',
            cell: ({ row }) => (
                <img
                    src={row.original.image}
                    alt="Profile"
                    className="object-cover w-10 h-10"
                />
            ),
        },
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'break',
            header: 'Break',
        },
        {
            accessorKey: 'duration',
            header: 'Duration',
        },
        {
            accessorKey: 'hour_rate',
            header: 'Hour Rate',
        },
        {
            accessorKey: 'transport_fee',
            header: 'Transport Fee',
        },
        {
            accessorKey: 'cost_a',
            header: 'Cost A',
        },
        {
            accessorKey: 'cost_b',
            header: 'Cost B',
        },
        {
            accessorKey: 'costum_fee',
            header: 'Costume Fee',
        },
        {
            accessorKey: 'total_fee',
            header: 'Total Fee',
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex justify-end w-full">
                    <Button
                        className="w-20 border-t-0 border-b-0 border-r-0"
                        variant="outline">
                        EDIT
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <TabsContent className="m-0" value="payment">
            <TitleWrapper>
                <h1>Member adjustment</h1>
            </TitleWrapper>
            <div className="flex flex-row bg-white">
                <div className="w-full">
                    <div className="flex flex-row items-center gap-4 px-8 py-4 border-r">
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="keyword">Keyword</Label>
                            <Input
                                type="text"
                                id="keyword"
                                placeholder="Search by name, email, etc."
                                className="border rounded-none w-[400px]"
                            />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Label>Status</Label>
                            <div className="flex">
                                <Button
                                    size="default"
                                    className="bg-black rounded-none">
                                    Active
                                </Button>
                                <Button
                                    size="default"
                                    variant="outline"
                                    className="rounded-none">
                                    All
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col mt-5">
                            <AdvancedFilterPopover fields={advancedSearchFields} />
                        </div>
                    </div>
                    <DataTable
                        columns={paymentStaffColumns}
                        data={mockPaymentStaff}
                        loading={loading}
                    />
                </div>
            </div>
        </TabsContent>
    );
};