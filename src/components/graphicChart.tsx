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
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

interface ChartDataItem {
    name: string;
    label: string;
    value: number;
    fill: string;
}

interface GraphicChartProps {
    data?: ChartDataItem[];
    title?: string;
    description?: string;
}

const DEFAULT_COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, payload }: any) => {
    // Add debugging logs
    console.log('Label Data:', {
        percent,
        value,
        payload,
        fullPayload: payload ? { ...payload } : 'No payload'
    });

    if (percent <= 0) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Calculate positions for both lines of text
    const percentY = y - 8;
    const labelY = y + 8;

    return (
        <>
            <text
                x={x}
                y={percentY}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize="12"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
            <text
                x={x}
                y={labelY}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize="12"
            >
                {payload.label}
            </text>
        </>
    );
};

export function GraphicChart({ 
    data = [], 
    title = "Cost Breakdown", 
    description 
}: GraphicChartProps) {
    // Add debugging logs for input data
    console.log('Input Data:', data);

    // Filter out negative values and prepare data
    const processedData = data
        .filter(item => item.value > 0)
        .map((item, index) => ({
            ...item,
            fill: item.fill || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
        }));

    // Add debugging logs for processed data
    console.log('Processed Data:', processedData);

    // Calculate total for percentage reference
    const total = processedData.reduce((sum, item) => sum + item.value, 0);

    // Create dynamic chart config based on data
    const chartConfig = processedData.reduce((config, item) => ({
        ...config,
        [item.name]: {
            label: item.label,
            color: item.fill,
        },
        value: { label: 'Value' }
    }), {}) as ChartConfig;

    if (processedData.length === 0) {
        return (
            <Card className="flex flex-col border-none shadow-none">
                <CardContent className="flex items-center justify-center h-[400px]">
                    No valid data to display
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col border-none shadow-none">
            {(title || description) && (
                <CardHeader className="items-center pb-2">
                    {title && <CardTitle>{title}</CardTitle>}
                    {description && (
                        <CardDescription>
                            {description}
                            {total > 0 && ` (Total: ${total})`}
                        </CardDescription>
                    )}
                </CardHeader>
            )}
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
                                data={processedData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={150}
                                labelLine={false}
                                label={renderCustomizedLabel}
                            >
                                {processedData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                        <div className="flex flex-col gap-4 mr-4">
                            {processedData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4"
                                        style={{ backgroundColor: entry.fill }}
                                    />
                                    <span>{entry.label}: {entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
