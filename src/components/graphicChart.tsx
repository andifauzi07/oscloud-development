"use client"

import React from 'react';
import { Pie, PieChart, Cell } from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
    { name: 'chrome', browser: 'Chrome', visitors: 275, fill: 'hsl(var(--chart-1))' },
    { name: 'safari', browser: 'Safari', visitors: 200, fill: 'hsl(var(--chart-2))' },
    { name: 'firefox', browser: 'Firefox', visitors: 187, fill: 'hsl(var(--chart-3))' },
    { name: 'edge', browser: 'Edge', visitors: 173, fill: 'hsl(var(--chart-4))' },
    { name: 'other', browser: 'Other', visitors: 90, fill: 'hsl(var(--chart-5))' },
];

const chartConfig = {
    visitors: {
        label: 'Visitors',
    },
    chrome: {
        label: 'Chrome',
        color: 'hsl(var(--chart-1))',
    },
    safari: {
        label: 'Safari',
        color: 'hsl(var(--chart-2))',
    },
    firefox: {
        label: 'Firefox',
        color: 'hsl(var(--chart-3))',
    },
    edge: {
        label: 'Edge',
        color: 'hsl(var(--chart-4))',
    },
    other: {
        label: 'Other',
        color: 'hsl(var(--chart-5))',
    },
} satisfies ChartConfig;

// Custom label renderer for pie slices
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export function GraphicChart() {
    return (
        <Card className="flex flex-col border-none shadow-none">
            <CardHeader className="items-center pb-2">
                <CardTitle>Pie Chart - Label List</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto flex items-center justify-between gap-8 max-h-[500px]"
                >
                    <div className="flex items-center justify-between w-full">
                        <PieChart width={400} height={400}>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent />}
                            />
                            <Pie
                                data={chartData}
                                dataKey="visitors"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={150}
                                labelLine={false}
                                label={renderCustomizedLabel}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                        <div className="flex flex-col gap-4 mr-4">
                            {chartData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4"
                                        style={{ backgroundColor: entry.fill }}
                                    />
                                    <span>{entry.browser}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}