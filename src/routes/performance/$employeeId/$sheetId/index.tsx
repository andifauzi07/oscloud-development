import { createFileRoute, Link } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { mockEmployees } from "@/config/mockData/employees";
import {
    mockTemplates,
    mockPerformanceSheets,
} from "@/config/mockData/templates";
import { Pie, PieChart, Cell } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
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

    const initialScores: Record<string, Record<string, number>> =
        (
            performanceSheet?.scores &&
            typeof performanceSheet.scores === "object"
        ) ?
            Object.fromEntries(
                Object.entries(performanceSheet.scores).map(
                    ([categoryId, items]) => [
                        categoryId,
                        Object.fromEntries(
                            Object.entries(
                                (items as Record<string, number>) || {}
                            ).map(([itemId, value]) => [
                                itemId,
                                typeof value === "number" ? value : 0,
                            ])
                        ),
                    ]
                )
            )
            : {}; // Fallback to an empty object if scores are missing

    const [scores, setScores] = useState(initialScores);
    const [isEditing, setIsEditing] = useState(false);

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
                    Debug info: Employee ID: {employeeId} | Sheet ID: {sheetId}
                </pre>
            </div>
        );
    }

    const handleScoreChange = (
        categoryId: string,
        itemId: string,
        value: string
    ) => {
        const numValue = Math.min(100, Math.max(0, Number(value) || 0));
        setScores((prev) => ({
            ...prev,
            [categoryId]: {
                ...prev[categoryId],
                [itemId]: numValue,
            },
        }));
    };

    const handleEditSave = () => {
        if (isEditing) {
            console.log("Saving scores:", {
                employeeId: employee.id,
                sheetId: performanceSheet.id,
                scores,
            });
        }
        setIsEditing(!isEditing);
    };

    const chartConfig =
        template?.categories ?
            Object.fromEntries(
                template.categories.map(({ name, color }, index) => [
                    name,
                    {
                        label: name,
                        color: color || `hsl(var(--chart-${index + 1}))`,
                    },
                ])
            )
            : {}; // Fallback to an empty object if template.categories is missing

    return (
        <div className="flex flex-col h-full">
            
            <div className="flex-none min-h-0 px-2 py-4 bg-white border-b">
                <div className="container flex justify-between gap-8 md:px-6">
                    {performanceSheet.name}
                    <Link to="/performance/setting/$templateId" params={{templateId: performanceSheet.id.toString()}}>Setting</Link>
                </div>
            </div>

            <div className="flex-none min-h-0 px-2 py-4 bg-gray-100 border-b">
                <div className="container flex gap-8 md:px-6">
                    <h1>Sheet name</h1>
                    {performanceSheet.name}
                </div>
            </div>

            <div className="flex-none min-h-0 px-8 py-4 border-b">
                <h1 className="py-4 text-base">
                    {template.name}
                </h1>
            </div>



            {/* Edit/Save Button Section */}
            <div className="flex justify-end flex-none bg-white">
                <Button
                    onClick={handleEditSave}
                    className="w-20 text-black bg-transparent border cursor-pointer h-15"
                    variant="outline"
                >
                    {isEditing ? "SAVE" : "EDIT"}
                </Button>
            </div>

            <div className="grid h-full grid-cols-2">
                {/* Score Chart Section */}
                <Card className="flex flex-col h-full border rounded-none">
                    <CardContent className="flex-1">
                        <p className="pt-4">Total Score</p>
                        <ChartContainer
                            config={chartConfig}
                            className="w-full h-full min-h-[500px] flex items-center justify-center"
                        >
                            <PieChart width={500} height={500}>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent />}
                                />
                                <Pie
                                    data={template.categories.map(
                                        (category) => ({
                                            name: category.name,
                                            value: Object.values(
                                                scores[category.id] || {}
                                            ).reduce(
                                                (sum, val) => sum + val,
                                                0
                                            ),
                                        })
                                    )}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={100}
                                    outerRadius={200}
                                    labelLine={false}
                                >
                                    {template.categories.map(
                                        (category, index) => (
                                            <Cell
                                                key={index}
                                                fill={category.color}
                                            />
                                        )
                                    )}
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Performance Details Section */}
                {/* Performance Details Section */}
                <div className="flex flex-col h-full bg-white border">
                    {template.categories.map((category) => (
                        <div key={category.id} className="mb-4 border">
                            {/* Category Header */}
                            <div
                                className="flex items-center gap-4"
                                style={{ backgroundColor: category.color }}
                            >
                                {/* Column 1: Category Name */}
                                <div className="flex-1 p-4">
                                    <span className="font-medium text-white">
                                        {category.name}
                                    </span>
                                </div>
                                {/* Column 2 & 3: Headers */}
                                <div className="flex">
                                    <div className="w-20 p-4 text-center text-white">Score</div>
                                    <div className="w-20 p-4 text-center text-black bg-white"></div>
                                </div>
                            </div>

                            {/* Category Items */}
                            {category.items.map((item) => (
                                <div key={item.id} className="flex items-center border-t">
                                    {/* Column 1: Item Name */}
                                    <div className="flex-1 p-4">
                                        <span>{item.name}</span>
                                    </div>
                                    {/* Column 2 & 3: Input Fields */}
                                    <div className="flex items-center">
                                        <div className="w-20 border-l">
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={scores[category.id]?.[item.id] || 0}
                                                onChange={(e) =>
                                                    handleScoreChange(
                                                        category.id,
                                                        item.id,
                                                        e.target.value
                                                    )
                                                }
                                                className="h-full text-center border-none"
                                                disabled={!isEditing}
                                                enableEmoji={false}
                                            />
                                        </div>
                                        <div className="w-20 border border-b-0 p-7">
                                            {/* Weight column - empty for now */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
