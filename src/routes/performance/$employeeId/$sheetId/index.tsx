import { createFileRoute } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { mockEmployees } from "@/config/mockData/employees";
import {
    mockTemplates,
    mockPerformanceSheets,
} from "@/config/mockData/templates";
import { Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export const Route = createFileRoute("/performance/$employeeId/$sheetId/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { employeeId, sheetId } = useParams({ strict: false });
    const employee = mockEmployees.find((emp) => emp.id === Number(employeeId));
    const performanceSheet = mockPerformanceSheets.find(
        (sheet) => sheet.id === Number(sheetId)
    );
    const template = mockTemplates.find(
        (t) => t.id === performanceSheet?.templateId
    );

    const initialScores =
        performanceSheet?.scores ?
            Object.fromEntries(
                Object.entries(performanceSheet.scores).map(([key, value]) => [
                    key,
                    typeof value === "number" ? value : 0,
                ])
            )
            : {};

    const [scores, setScores] = useState<Record<string, number>>(initialScores);

    if (!employee || !performanceSheet || !template) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-xl font-semibold text-red-600">
                    Data not found
                </h2>
                <p className="text-gray-600">
                    {!employee && "Employee not found. "}
                    {!performanceSheet && "Performance sheet not found. "}
                    {!template && "Template not found. "}
                </p>
                <pre className="mt-4 text-sm text-gray-500">
                    Debug info: Employee ID: {employeeId}
                    Sheet ID: {sheetId}
                </pre>
            </div>
        );
    }

    const handleScoreChange = (categoryId: string, value: string) => {
        const numValue = Math.min(100, Math.max(0, Number(value) || 0));
        setScores((prev) => ({
            ...prev,
            [categoryId]: numValue,
        }));
    };

    const handleSave = () => {
        // Here you would implement saving to mockPerformanceSheets
        console.log("Saving scores:", {
            employeeId: employee.id,
            sheetId: performanceSheet.id,
            scores,
        });
    };

    const chartData = template.categories.map((category, index) => ({
        name: category.name,
        value: scores[category.id] || 0,
        fill: `hsl(var(--chart-${index + 1}))`,
    }));

    const chartConfig = Object.fromEntries(
        template.categories.map(({ name }, index) => [
            name,
            {
                label: name,
                color: `hsl(var(--chart-${index + 1}))`
            },
        ])
    );

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
    }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-none min-h-0 border-b">
                <div className="container flex flex-row items-center justify-between">
                    <div className="flex gap-8">
                        <h1 className="py-4 text-xl font-semibold">
                            {performanceSheet.name}
                        </h1>
                        <h1 className="py-4 text-xl font-semibold">
                            {template.name}
                        </h1>
                    </div>
                    <Button
                        onClick={handleSave}
                        className="h-10 px-8 border rounded-none"
                        variant="outline"
                    >
                        Save
                    </Button>
                </div>
            </div>

            <div className="grid h-full grid-cols-2">
                {/* Left side - Chart */}
                <Card className="flex flex-col h-full border rounded-none">
                    <CardContent className="flex-1">
                        <ChartContainer
                            config={chartConfig}
                            className="w-full h-full min-h-[500px]"
                        >
                            <div className="">
                                <CardTitle className="pt-4">
                                    Total Score
                                </CardTitle>
                                <div className="flex items-center justify-center"  >

                                <PieChart width={500} height={500}>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent />}
                                    />
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={100}
                                        outerRadius={200}
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={entry.fill}
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                                </div>
                            </div>
                        </ChartContainer>

                    </CardContent>
                </Card>

                {/* Right side - Score inputs */}
                <div className="flex flex-col h-full p-6 bg-white border border-l-none">
                    <h2 className="mb-6 text-lg font-medium">
                        Performance Details
                    </h2>
                    <div className="grid gap-4">
                        {template.categories.map((category, index) => {
                            const isDark = index === 5 || index === 6;
                            const fill = `hsl(var(--chart-${index + 1}))`;
                            const textColor =
                                isDark ? "#FFFFFF" : "#000000";

                            return (
                                <div
                                    key={category.id}
                                    className="flex items-center justify-between p-4 border"
                                    style={{
                                        backgroundColor: fill,
                                        borderColor: fill,
                                    }}
                                >
                                    <span
                                        className="font-medium"
                                        style={{ color: textColor }}
                                    >
                                        {category.name}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={scores[category.id] || 0}
                                            onChange={(e) =>
                                                handleScoreChange(
                                                    category.id,
                                                    e.target.value
                                                )
                                            }
                                            className="w-20 text-right rounded-none"
                                            style={{
                                                backgroundColor: fill,
                                                borderColor: textColor,
                                                color: textColor,
                                            }}
                                        />
                                        <span
                                            className="text-lg font-semibold"
                                            style={{ color: textColor }}
                                        >
                                            %
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
